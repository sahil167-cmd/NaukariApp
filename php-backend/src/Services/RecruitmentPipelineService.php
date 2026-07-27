<?php

namespace App\Services;

use App\Utils\Logger;
use App\Services\GoogleSheetsService;

class RecruitmentPipelineService
{
    private $sheetsService;

    public function __construct()
    {
        $this->sheetsService = new GoogleSheetsService();
    }

    private function calculateAge($dobString)
    {
        if (empty($dobString)) return '';
        $dob = strtotime($dobString);
        if (!$dob) return $dobString;
        $age = date('Y') - date('Y', $dob);
        if (date('md', date('U', mktime(0, 0, 0, date('m', $dob), date('d', $dob), date('Y')))) > date('md')) {
            $age--;
        }
        return (string)$age;
    }

    private function formatLanguages($langData)
    {
        if (empty($langData)) return '';
        if (is_string($langData)) return $langData;
        if (is_array($langData)) {
            if (array_is_list($langData)) return implode(', ', $langData);
            
            $activeLangs = [];
            foreach ($langData as $lang => $skills) {
                if (is_array($skills)) {
                    $parts = [];
                    if (!empty($skills['read'])) $parts[] = 'Read';
                    if (!empty($skills['write'])) $parts[] = 'Write';
                    if (!empty($skills['speak'])) $parts[] = 'Speak';
                    if (!empty($parts)) {
                        $activeLangs[] = $lang . ' (' . implode(', ', $parts) . ')';
                    }
                } else if ($skills === true) {
                    $activeLangs[] = $lang;
                }
            }
            return implode(', ', $activeLangs);
        }
        return '';
    }

    public function processNewRegistration($user, $profile, $rawRequestBody = [])
    {
        $userIdStr = (string)($user->_id ?? ($user->id ?? ''));
        Logger::info("Starting recruitment pipeline process for user $userIdStr");

        $timestamp = date('c');
        
        $firstName = $profile['personal']['firstName'] ?? '';
        $lastName = $profile['personal']['lastName'] ?? '';
        $nameFromProfile = trim("$firstName $lastName");
        $fullName = $user->name ?? ($nameFromProfile ?: 'Worker');
        
        $phone = $profile['personal']['phone'] ?? ($user->phone ?? '');
        $gender = $profile['personal']['gender'] ?? '';
        $age = $this->calculateAge($profile['personal']['dob'] ?? null);
        
        $state = $profile['address']['state'] ?? '';
        $district = $profile['address']['district'] ?? '';
        $education = $profile['education']['highestLevel'] ?? ($profile['education']['level'] ?? '');

        $experience = 'Fresher';
        if (!empty($profile['experience']) && is_array($profile['experience'])) {
            $first = $profile['experience'][0];
            if (!empty($first['duration'])) {
                $experience = $first['duration'];
                if (!empty($first['jobRole'])) {
                    $experience .= " ({$first['jobRole']})";
                }
            }
        }

        $jobCategory = '';
        if (!empty($profile['jobPreferences']['categories']) && is_array($profile['jobPreferences']['categories'])) {
            $jobCategory = implode(', ', $profile['jobPreferences']['categories']);
        }
        
        $expectedSalary = $profile['jobPreferences']['salaryRange'] ?? '';
        
        $langRaw = $profile['personal']['languages'] ?? ($rawRequestBody['personal']['languages'] ?? '');
        $languages = $this->formatLanguages($langRaw);
        
        $shift = $profile['jobPreferences']['shiftPreference'] ?? '';
        
        $createdAt = isset($user->createdAt) ? (is_string($user->createdAt) ? $user->createdAt : date('c')) : date('c');

        $rowData = [
            $timestamp,
            $userIdStr,
            $fullName,
            $phone,
            $gender,
            $age,
            $state,
            $district,
            $education,
            $experience,
            $jobCategory,
            $expectedSalary,
            $languages,
            $shift,
            $createdAt
        ];

        Logger::info("Google Sheets Row Data for user $userIdStr", ['rowData' => $rowData]);
        
        $this->sheetsService->appendRegistrationRow($rowData);
        
        Logger::info("Finished recruitment pipeline process for user $userIdStr");
    }
}
