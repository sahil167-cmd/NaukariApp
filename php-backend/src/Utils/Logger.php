<?php

namespace App\Utils;

class Logger
{
    public static function info($message, $context = [])
    {
        self::log('INFO', $message, $context);
    }

    public static function error($message, $context = [])
    {
        self::log('ERROR', $message, $context);
    }

    public static function warn($message, $context = [])
    {
        self::log('WARN', $message, $context);
    }

    private static function log($level, $message, $context = [])
    {
        $date = date('Y-m-d H:i:s');
        $contextStr = empty($context) ? '' : ' ' . json_encode($context);
        
        $logMessage = "[$date] $level: $message$contextStr" . PHP_EOL;
        
        // Log to file
        $logDir = __DIR__ . '/../../logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }
        
        $logFile = $logDir . '/app-' . date('Y-m-d') . '.log';
        error_log($logMessage, 3, $logFile);
        
        // Also log to stdout/stderr in development
        if (($_ENV['NODE_ENV'] ?? 'development') !== 'production') {
            if ($level === 'ERROR') {
                file_put_contents('php://stderr', $logMessage);
            } else {
                file_put_contents('php://stdout', $logMessage);
            }
        }
    }
}
