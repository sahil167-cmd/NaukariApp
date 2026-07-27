<?php

namespace App\Utils;

class Formatter
{
    /**
     * Formats MySQL user row to match expected User document JSON format
     */
    public static function formatUser($user)
    {
        if (!$user) return null;
        $idStr = (string)$user['id'];
        return [
            '_id' => $idStr,
            'id' => $idStr,
            'phone' => (string)$user['phone'],
            'name' => (string)($user['name'] ?? 'Worker'),
            'isVerified' => (bool)($user['is_verified'] ?? true),
            'registrationComplete' => (bool)($user['registration_complete'] ?? false),
            'registrationNumber' => $user['registration_number'] ?? null,
            'registrationDate' => $user['registration_date'] ? self::formatDateISO($user['registration_date']) : null,
            'createdAt' => self::formatDateISO($user['created_at'] ?? 'now'),
            'updatedAt' => self::formatDateISO($user['updated_at'] ?? 'now'),
        ];
    }

    /**
     * Formats MySQL profile row to match expected Profile document JSON format
     */
    public static function formatProfile($profile)
    {
        if (!$profile) return null;
        
        $idStr = (string)$profile['id'];
        $userIdStr = (string)$profile['user_id'];

        $categories = [];
        if (!empty($profile['job_categories'])) {
            $decodedCat = json_decode($profile['job_categories'], true);
            if (is_array($decodedCat)) {
                $categories = $decodedCat;
            } else {
                $categories = array_filter(array_map('trim', explode(',', $profile['job_categories'])));
            }
        }

        $experience = [];
        if (!empty($profile['experience_data'])) {
            $decodedExp = json_decode($profile['experience_data'], true);
            if (is_array($decodedExp)) {
                $experience = $decodedExp;
            }
        }

        $documents = [];
        if (!empty($profile['documents_data'])) {
            $decodedDocs = json_decode($profile['documents_data'], true);
            if (is_array($decodedDocs)) {
                $documents = $decodedDocs;
            }
        }

        return [
            '_id' => $idStr,
            'id' => $idStr,
            'userId' => $userIdStr,
            'user' => $userIdStr,
            'completionPercentage' => (int)($profile['completion_percentage'] ?? 0),
            'personal' => [
                'firstName' => $profile['first_name'] ?? '',
                'lastName' => $profile['last_name'] ?? '',
                'gender' => $profile['gender'] ?? '',
                'dob' => $profile['dob'] ?? '',
                'phone' => $profile['personal_phone'] ?? '',
                'languages' => $profile['languages'] ?? '',
            ],
            'address' => [
                'state' => $profile['state'] ?? '',
                'city' => $profile['city'] ?? '',
                'district' => $profile['district'] ?? '',
                'pinCode' => $profile['pincode'] ?? '',
            ],
            'jobPreferences' => [
                'categories' => $categories,
                'salaryRange' => $profile['salary_range'] ?? '',
                'shiftPreference' => $profile['shift_preference'] ?? '',
                'immediatelyAvailable' => (bool)($profile['immediately_available'] ?? true),
            ],
            'education' => [
                'highestLevel' => $profile['education_level'] ?? '',
                'level' => $profile['education_level'] ?? '',
                'schoolName' => $profile['education_school_name'] ?? '',
                'passingYear' => $profile['education_passing_year'] ?? null,
            ],
            'experience' => $experience,
            'documents' => $documents,
            'createdAt' => self::formatDateISO($profile['created_at'] ?? 'now'),
            'updatedAt' => self::formatDateISO($profile['updated_at'] ?? 'now'),
        ];
    }

    /**
     * Formats MySQL job row to match expected Job document JSON format
     */
    public static function formatJob($job)
    {
        if (!$job) return null;
        if (isset($job[0]) && is_array($job)) {
            return array_map([self::class, 'formatJob'], $job);
        }

        $idStr = (string)$job['id'];
        return [
            '_id' => $idStr,
            'id' => $idStr,
            'title' => (string)$job['title'],
            'company' => (string)$job['company'],
            'location' => (string)$job['location'],
            'salary' => (string)$job['salary'],
            'category' => (string)$job['category'],
            'type' => (string)$job['type'],
            'description' => (string)($job['description'] ?? ''),
            'isVerified' => (bool)($job['is_verified'] ?? true),
            'urgentHiring' => (bool)($job['urgent_hiring'] ?? false),
            'postedAt' => self::formatDateISO($job['posted_at'] ?? 'now'),
            'createdAt' => self::formatDateISO($job['created_at'] ?? 'now'),
            'updatedAt' => self::formatDateISO($job['updated_at'] ?? 'now'),
        ];
    }

    /**
     * Formats MySQL contact log row to match expected ContactLog document JSON format
     */
    public static function formatContactLog($log)
    {
        if (!$log) return null;
        if (isset($log[0]) && is_array($log)) {
            return array_map([self::class, 'formatContactLog'], $log);
        }

        $idStr = (string)$log['id'];
        return [
            '_id' => $idStr,
            'id' => $idStr,
            'userId' => (string)$log['user_id'],
            'actionType' => (string)$log['action_type'],
            'device' => (string)($log['device'] ?? 'Mobile'),
            'platform' => (string)($log['platform'] ?? 'unknown'),
            'status' => (string)($log['status'] ?? 'completed'),
            'timestamp' => self::formatDateISO($log['timestamp'] ?? 'now'),
            'createdAt' => self::formatDateISO($log['created_at'] ?? 'now'),
            'updatedAt' => self::formatDateISO($log['updated_at'] ?? 'now'),
        ];
    }

    /**
     * Converts date string/timestamp to standard ISO 8601 string
     */
    public static function formatDateISO($dateStr)
    {
        if (empty($dateStr)) return null;
        try {
            $dt = new \DateTime($dateStr);
            return $dt->format('Y-m-d\TH:i:s.v\Z');
        } catch (\Exception $e) {
            return date('Y-m-d\TH:i:s.v\Z');
        }
    }
}
