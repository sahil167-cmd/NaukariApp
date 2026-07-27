<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class ContactLog
{
    public static function find(array $filter = [], array $options = [])
    {
        $db = Database::getConnection();
        $userId = $filter['userId'] ?? ($filter['user_id'] ?? null);

        if (!$userId) return [];

        $sql = "SELECT * FROM contact_logs WHERE user_id = :user_id ORDER BY timestamp DESC";

        if (isset($options['limit'])) {
            $limit = (int)$options['limit'];
            $sql .= " LIMIT {$limit}";
        }

        $stmt = $db->prepare($sql);
        $stmt->execute([':user_id' => (int)$userId]);
        return $stmt->fetchAll();
    }

    public static function create(array $data)
    {
        $db = Database::getConnection();
        $userId = $data['userId'] ?? ($data['user_id'] ?? null);

        $stmt = $db->prepare("
            INSERT INTO contact_logs (user_id, action_type, device, platform, status, timestamp, created_at, updated_at)
            VALUES (:user_id, :action_type, :device, :platform, :status, NOW(), NOW(), NOW())
        ");

        $stmt->execute([
            ':user_id' => (int)$userId,
            ':action_type' => $data['actionType'] ?? ($data['action_type'] ?? 'CALL'),
            ':device' => $data['device'] ?? 'Mobile',
            ':platform' => $data['platform'] ?? 'unknown',
            ':status' => $data['status'] ?? 'completed',
        ]);

        $insertId = $db->lastInsertId();
        
        $fetchStmt = $db->prepare("SELECT * FROM contact_logs WHERE id = :id LIMIT 1");
        $fetchStmt->execute([':id' => $insertId]);
        $row = $fetchStmt->fetch();
        return $row ? (object)$row : null;
    }
}
