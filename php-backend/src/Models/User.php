<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class User
{
    public static function findOne(array $filter)
    {
        $db = Database::getConnection();
        
        if (isset($filter['phone'])) {
            $stmt = $db->prepare("SELECT * FROM users WHERE phone = :phone LIMIT 1");
            $stmt->execute([':phone' => $filter['phone']]);
            $row = $stmt->fetch();
            return $row ? (object)$row : null;
        }

        if (isset($filter['_id']) || isset($filter['id'])) {
            $id = $filter['_id'] ?? $filter['id'];
            return self::findById($id);
        }

        return null;
    }

    public static function findById($id)
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => (int)$id]);
        $row = $stmt->fetch();
        return $row ? (object)$row : null;
    }

    public static function create(array $data)
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO users (phone, name, is_verified, registration_complete, created_at, updated_at) 
            VALUES (:phone, :name, :is_verified, :registration_complete, NOW(), NOW())
        ");
        
        $stmt->execute([
            ':phone' => $data['phone'],
            ':name' => $data['name'] ?? 'Worker',
            ':is_verified' => isset($data['isVerified']) ? (int)$data['isVerified'] : 1,
            ':registration_complete' => isset($data['registrationComplete']) ? (int)$data['registrationComplete'] : 0,
        ]);

        $insertId = $db->lastInsertId();
        return self::findById($insertId);
    }
    
    public static function updateOne(array $filter, array $update)
    {
        $db = Database::getConnection();
        $id = $filter['_id'] ?? ($filter['id'] ?? null);
        
        if (!$id) return false;

        $setFields = $update['$set'] ?? $update;

        $queryFields = [];
        $params = [':id' => (int)$id];

        if (isset($setFields['registrationComplete'])) {
            $queryFields[] = "registration_complete = :reg_complete";
            $params[':reg_complete'] = (int)$setFields['registrationComplete'];
        }
        if (isset($setFields['registrationDate'])) {
            $queryFields[] = "registration_date = NOW()";
        }
        if (isset($setFields['registrationNumber'])) {
            $queryFields[] = "registration_number = :reg_number";
            $params[':reg_number'] = $setFields['registrationNumber'];
        }
        if (isset($setFields['name'])) {
            $queryFields[] = "name = :name";
            $params[':name'] = $setFields['name'];
        }

        if (empty($queryFields)) return false;

        $queryFields[] = "updated_at = NOW()";
        $sql = "UPDATE users SET " . implode(', ', $queryFields) . " WHERE id = :id";

        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }
}
