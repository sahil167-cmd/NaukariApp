<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Job
{
    public static function find(array $filter = [], array $options = [])
    {
        $db = Database::getConnection();
        
        $whereClauses = [];
        $params = [];

        if (isset($filter['category'])) {
            if (is_array($filter['category']) && isset($filter['category']['$in'])) {
                $categories = $filter['category']['$in'];
                if (!empty($categories)) {
                    $inPlaceholders = implode(',', array_fill(0, count($categories), '?'));
                    $whereClauses[] = "category IN ($inPlaceholders)";
                    foreach ($categories as $cat) {
                        $params[] = $cat;
                    }
                }
            } else if (is_string($filter['category'])) {
                $whereClauses[] = "category = ?";
                $params[] = $filter['category'];
            }
        }

        $sql = "SELECT * FROM jobs";
        if (!empty($whereClauses)) {
            $sql .= " WHERE " . implode(' AND ', $whereClauses);
        }

        $sql .= " ORDER BY posted_at DESC";

        if (isset($options['limit'])) {
            $limit = (int)$options['limit'];
            $skip = (int)($options['skip'] ?? 0);
            $sql .= " LIMIT {$limit} OFFSET {$skip}";
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function findById($id)
    {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => (int)$id]);
        $row = $stmt->fetch();
        return $row ? (object)$row : null;
    }

    public static function countDocuments(array $filter = [])
    {
        $db = Database::getConnection();
        $whereClauses = [];
        $params = [];

        if (isset($filter['category'])) {
            if (is_array($filter['category']) && isset($filter['category']['$in'])) {
                $categories = $filter['category']['$in'];
                if (!empty($categories)) {
                    $inPlaceholders = implode(',', array_fill(0, count($categories), '?'));
                    $whereClauses[] = "category IN ($inPlaceholders)";
                    foreach ($categories as $cat) {
                        $params[] = $cat;
                    }
                }
            } else if (is_string($filter['category'])) {
                $whereClauses[] = "category = ?";
                $params[] = $filter['category'];
            }
        }

        $sql = "SELECT COUNT(*) FROM jobs";
        if (!empty($whereClauses)) {
            $sql .= " WHERE " . implode(' AND ', $whereClauses);
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    }
}
