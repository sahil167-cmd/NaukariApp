<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Profile
{
    public static function findOne(array $filter)
    {
        $db = Database::getConnection();
        $userId = $filter['userId'] ?? ($filter['user_id'] ?? null);
        
        if (!$userId) return null;

        $stmt = $db->prepare("SELECT * FROM profiles WHERE user_id = :user_id LIMIT 1");
        $stmt->execute([':user_id' => (int)$userId]);
        $row = $stmt->fetch();
        
        return $row ? (object)$row : null;
    }

    public static function findOneAndUpdate(array $filter, array $update, array $options = [])
    {
        $db = Database::getConnection();
        $userId = $filter['userId'] ?? ($filter['user_id'] ?? null);

        if (!$userId) return null;

        $existing = self::findOne(['userId' => $userId]);

        $data = $update['$set'] ?? ($update['$setOnInsert'] ?? $update);

        $firstName = $data['personal']['firstName'] ?? ($existing->first_name ?? null);
        $lastName = $data['personal']['lastName'] ?? ($existing->last_name ?? null);
        $gender = $data['personal']['gender'] ?? ($existing->gender ?? null);
        $dob = $data['personal']['dob'] ?? ($existing->dob ?? null);
        $personalPhone = $data['personal']['phone'] ?? ($existing->personal_phone ?? null);
        $languages = isset($data['personal']['languages']) 
            ? (is_array($data['personal']['languages']) ? json_encode($data['personal']['languages']) : $data['personal']['languages'])
            : ($existing->languages ?? null);

        $state = $data['address']['state'] ?? ($existing->state ?? null);
        $city = $data['address']['city'] ?? ($existing->city ?? null);
        $district = $data['address']['district'] ?? ($existing->district ?? null);
        $pincode = $data['address']['pinCode'] ?? ($existing->pincode ?? null);

        $jobCategories = isset($data['jobPreferences']['categories']) 
            ? json_encode($data['jobPreferences']['categories']) 
            : ($existing->job_categories ?? null);

        $salaryRange = $data['jobPreferences']['salaryRange'] ?? ($existing->salary_range ?? null);
        $shiftPreference = $data['jobPreferences']['shiftPreference'] ?? ($existing->shift_preference ?? null);
        $immediatelyAvailable = isset($data['jobPreferences']['immediatelyAvailable']) 
            ? (int)$data['jobPreferences']['immediatelyAvailable'] 
            : (isset($existing->immediately_available) ? (int)$existing->immediately_available : 1);

        $educationLevel = $data['education']['highestLevel'] ?? ($data['education']['level'] ?? ($existing->education_level ?? null));
        $schoolName = $data['education']['schoolName'] ?? ($existing->education_school_name ?? null);
        $passingYear = $data['education']['passingYear'] ?? ($existing->education_passing_year ?? null);

        $experienceData = isset($data['experience']) 
            ? json_encode($data['experience']) 
            : ($existing->experience_data ?? null);

        $documentsData = isset($data['documents']) 
            ? json_encode($data['documents']) 
            : ($existing->documents_data ?? null);

        $completionPercentage = isset($data['completionPercentage']) 
            ? (int)$data['completionPercentage'] 
            : (isset($existing->completion_percentage) ? (int)$existing->completion_percentage : 0);

        if (!$existing) {
            $stmt = $db->prepare("
                INSERT INTO profiles (
                    user_id, completion_percentage, first_name, last_name, gender, dob, personal_phone,
                    languages, state, city, district, pincode, job_categories, salary_range,
                    shift_preference, immediately_available, education_level, education_school_name,
                    education_passing_year, experience_data, documents_data, created_at, updated_at
                ) VALUES (
                    :user_id, :completion_percentage, :first_name, :last_name, :gender, :dob, :personal_phone,
                    :languages, :state, :city, :district, :pincode, :job_categories, :salary_range,
                    :shift_preference, :immediately_available, :education_level, :education_school_name,
                    :education_passing_year, :experience_data, :documents_data, NOW(), NOW()
                )
            ");
        } else {
            $stmt = $db->prepare("
                UPDATE profiles SET
                    completion_percentage = :completion_percentage,
                    first_name = :first_name,
                    last_name = :last_name,
                    gender = :gender,
                    dob = :dob,
                    personal_phone = :personal_phone,
                    languages = :languages,
                    state = :state,
                    city = :city,
                    district = :district,
                    pincode = :pincode,
                    job_categories = :job_categories,
                    salary_range = :salary_range,
                    shift_preference = :shift_preference,
                    immediately_available = :immediately_available,
                    education_level = :education_level,
                    education_school_name = :education_school_name,
                    education_passing_year = :education_passing_year,
                    experience_data = :experience_data,
                    documents_data = :documents_data,
                    updated_at = NOW()
                WHERE user_id = :user_id
            ");
        }

        $stmt->execute([
            ':user_id' => (int)$userId,
            ':completion_percentage' => $completionPercentage,
            ':first_name' => $firstName,
            ':last_name' => $lastName,
            ':gender' => $gender,
            ':dob' => $dob,
            ':personal_phone' => $personalPhone,
            ':languages' => $languages,
            ':state' => $state,
            ':city' => $city,
            ':district' => $district,
            ':pincode' => $pincode,
            ':job_categories' => $jobCategories,
            ':salary_range' => $salaryRange,
            ':shift_preference' => $shiftPreference,
            ':immediately_available' => $immediatelyAvailable,
            ':education_level' => $educationLevel,
            ':education_school_name' => $schoolName,
            ':education_passing_year' => $passingYear,
            ':experience_data' => $experienceData,
            ':documents_data' => $documentsData,
        ]);

        return self::findOne(['userId' => $userId]);
    }
}
