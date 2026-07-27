<?php

namespace App\Config;

use PDO;
use PDOException;
use App\Utils\Logger;

class Database
{
    private static $pdo = null;

    public static function getConnection(): PDO
    {
        if (self::$pdo === null) {
            try {
                $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
                $port = $_ENV['DB_PORT'] ?? '3306';
                $dbName = $_ENV['DB_NAME'] ?? 'naukari_bazaar';
                $user = $_ENV['DB_USER'] ?? 'root';
                $pass = $_ENV['DB_PASSWORD'] ?? '';

                $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
                
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];

                self::$pdo = new PDO($dsn, $user, $pass, $options);
                Logger::info("MySQL Database Connected Successfully via PDO");
            } catch (PDOException $e) {
                Logger::error("MySQL Connection Failed: " . $e->getMessage());
                throw $e;
            }
        }

        return self::$pdo;
    }
}
