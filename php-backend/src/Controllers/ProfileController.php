<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\User;
use App\Models\Profile;
use App\Models\ContactLog;
use App\Models\Job;
use App\Services\RecruitmentPipelineService;
use App\Utils\Formatter;
use App\Utils\Logger;

class ProfileController
{
    private function calculateCompletion($profileData): int
    {
        $score = 0;
        if (!empty($profileData['personal']['firstName']) && !empty($profileData['personal']['dob'])) $score += 20;
        if (!empty($profileData['address']['city']) && !empty($profileData['address']['pinCode'])) $score += 20;
        if (!empty($profileData['jobPreferences']['categories']) && count($profileData['jobPreferences']['categories']) > 0) $score += 20;
        if (!empty($profileData['education']['highestLevel'])) $score += 20;
        $score += 20;
        return min(100, $score);
    }

    public function getProfile(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            $profile = Profile::findOne(['userId' => $user->id]);

            if (!$profile) {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'Profile not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $formattedProfile = Formatter::formatProfile((array)$profile);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $formattedProfile
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $error) {
            Logger::error('Get profile error: ' . $error->getMessage());
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Internal server error']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function updateProfile(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            $updates = $request->getParsedBody();
            if (!is_array($updates)) {
                $updates = json_decode((string)$request->getBody(), true) ?? [];
            }

            $profile = Profile::findOne(['userId' => $user->id]);
            if (!$profile) {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'Profile not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $formatted = Formatter::formatProfile((array)$profile);

            if (isset($updates['personal'])) $formatted['personal'] = array_merge($formatted['personal'] ?? [], $updates['personal']);
            if (isset($updates['address'])) $formatted['address'] = array_merge($formatted['address'] ?? [], $updates['address']);
            if (isset($updates['jobPreferences'])) $formatted['jobPreferences'] = array_merge($formatted['jobPreferences'] ?? [], $updates['jobPreferences']);
            if (isset($updates['education'])) $formatted['education'] = array_merge($formatted['education'] ?? [], $updates['education']);
            if (isset($updates['experience'])) $formatted['experience'] = $updates['experience'];
            if (isset($updates['documents'])) $formatted['documents'] = array_merge($formatted['documents'] ?? [], $updates['documents']);

            $formatted['completionPercentage'] = $this->calculateCompletion($formatted);

            $updatedProfile = Profile::findOneAndUpdate(
                ['userId' => $user->id],
                ['$set' => $formatted],
                ['new' => true]
            );

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => Formatter::formatProfile((array)$updatedProfile)
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $error) {
            Logger::error('Update profile error: ' . $error->getMessage());
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Internal server error']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function submitRegistration(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            $body = $request->getParsedBody();
            if (!is_array($body)) {
                $body = json_decode((string)$request->getBody(), true) ?? [];
            }

            $profile = Profile::findOne(['userId' => $user->id]);
            $formatted = $profile ? Formatter::formatProfile((array)$profile) : ['userId' => (string)$user->id];

            if (isset($body['personal'])) $formatted['personal'] = $body['personal'];
            if (isset($body['address'])) $formatted['address'] = $body['address'];
            if (isset($body['jobPreferences'])) $formatted['jobPreferences'] = $body['jobPreferences'];
            if (isset($body['education'])) $formatted['education'] = $body['education'];
            if (isset($body['experience'])) $formatted['experience'] = $body['experience'];

            $formatted['completionPercentage'] = $this->calculateCompletion($formatted);

            $updatedProfile = Profile::findOneAndUpdate(
                ['userId' => $user->id],
                ['$set' => $formatted],
                ['upsert' => true, 'new' => true]
            );

            // Update user status
            $registrationNumber = $user->registration_number ?? null;
            if (!$registrationNumber) {
                $year = date('Y');
                $randomPart = mt_rand(10000, 99999);
                $registrationNumber = "NB-$year-$randomPart";
            }

            $name = $user->name;
            if (!empty($body['personal']['firstName'])) {
                $name = trim($body['personal']['firstName'] . ' ' . ($body['personal']['lastName'] ?? ''));
            }

            User::updateOne(
                ['_id' => $user->id],
                ['$set' => [
                    'registrationComplete' => true,
                    'registrationDate' => date('Y-m-d H:i:s'),
                    'registrationNumber' => $registrationNumber,
                    'name' => $name
                ]]
            );

            $responseData = [
                'success' => true,
                'data' => [
                    'profileId' => (string)$updatedProfile->id,
                    'registrationNumber' => $registrationNumber
                ],
                'message' => 'Profile submitted successfully'
            ];

            // Pipeline for Google Sheets & Manager Notifications
            $pipeline = new RecruitmentPipelineService();
            $pipeline->processNewRegistration((object)[
                '_id' => (string)$user->id,
                'name' => $name,
                'phone' => $user->phone,
                'createdAt' => $user->created_at ?? date('Y-m-d H:i:s')
            ], $formatted, $body);

            $response->getBody()->write(json_encode($responseData));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $error) {
            Logger::error('Submit registration error: ' . $error->getMessage());
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Internal server error']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getDashboard(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            $profile = Profile::findOne(['userId' => $user->id]);
            
            $contactLogs = ContactLog::find(['userId' => $user->id], ['limit' => 5]);

            $formattedProfile = $profile ? Formatter::formatProfile((array)$profile) : null;

            $matchedJobs = [];
            $categories = $formattedProfile['jobPreferences']['categories'] ?? [];

            if (!empty($categories)) {
                $matchedJobs = Job::find(['category' => ['$in' => $categories]], ['limit' => 5]);
            } else {
                $matchedJobs = Job::find([], ['limit' => 5]);
            }
            
            $recentActivity = array_map(function($log) {
                $fmt = Formatter::formatContactLog($log);
                return [
                    'id' => $fmt['id'],
                    'actionType' => $fmt['actionType'],
                    'timestamp' => $fmt['timestamp'],
                    'device' => $fmt['device'],
                    'platform' => $fmt['platform']
                ];
            }, $contactLogs);

            $dashboardData = [
                'success' => true,
                'data' => [
                    'summary' => [
                        'userName' => $user->name ?? 'Worker',
                        'profileCompletion' => $formattedProfile['completionPercentage'] ?? 0,
                        'registrationNumber' => $user->registration_number ?? 'Pending',
                        'registrationDate' => $user->registration_date ? Formatter::formatDateISO($user->registration_date) : null,
                        'identityStatus' => !empty($user->registration_complete) ? 'Submitted & Verified' : 'Incomplete',
                        'preferredJob' => $categories[0] ?? 'Not specified',
                        'expectedSalary' => $formattedProfile['jobPreferences']['salaryRange'] ?? 'Not specified',
                        'skills' => $formattedProfile['experience'][0]['skills'] ?? [],
                        'experience' => $formattedProfile['experience'][0]['duration'] ?? 'Fresher'
                    ],
                    'recentActivity' => $recentActivity,
                    'jobs' => Formatter::formatJob($matchedJobs)
                ]
            ];

            $response->getBody()->write(json_encode($dashboardData));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $error) {
            Logger::error('Get dashboard error: ' . $error->getMessage());
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Internal server error']));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
