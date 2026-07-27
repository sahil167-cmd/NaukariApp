<?php

namespace App\Services;

use Google\Client;
use Google\Service\Sheets;
use App\Utils\Logger;
use Exception;

class GoogleSheetsService
{
    private $service;
    private $spreadsheetId;
    private $serviceAccountEmail;

    public function __construct()
    {
        $this->spreadsheetId = $_ENV['GOOGLE_SHEET_ID'] ?? '';
        $this->init();
    }

    private function init()
    {
        try {
            $credentialsJson = $_ENV['GOOGLE_SERVICE_ACCOUNT_JSON'] ?? '';
            if (empty($credentialsJson)) {
                throw new Exception('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set.');
            }
            if (empty($this->spreadsheetId)) {
                throw new Exception('GOOGLE_SHEET_ID environment variable is not set.');
            }

            // Clean up surrounding quotes if they exist
            $credentialsJson = trim($credentialsJson);
            if (str_starts_with($credentialsJson, "'") && str_ends_with($credentialsJson, "'")) {
                $credentialsJson = trim(substr($credentialsJson, 1, -1));
            } else if (str_starts_with($credentialsJson, '"') && str_ends_with($credentialsJson, '"')) {
                $credentialsJson = trim(substr($credentialsJson, 1, -1));
            }

            $credentials = json_decode($credentialsJson, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON as valid JSON.");
            }

            $this->serviceAccountEmail = $credentials['client_email'] ?? '';

            // Fix escaped newlines in private key
            if (isset($credentials['private_key'])) {
                $credentials['private_key'] = str_replace('\n', "\n", $credentials['private_key']);
            }

            $client = new Client();
            $client->setAuthConfig($credentials);
            $client->addScope(Sheets::SPREADSHEETS);

            $this->service = new Sheets($client);
            Logger::info('Google Sheets service initialized.');
        } catch (Exception $error) {
            Logger::error('Google Sheets initialization error: ' . $error->getMessage());
        }
    }

    public function appendRegistrationRow($row)
    {
        if (!$this->service || !$this->spreadsheetId) {
            Logger::error('Google Sheets client is not initialized.');
            return;
        }

        try {
            $body = new \Google_Service_Sheets_ValueRange([
                'values' => [$row]
            ]);
            $params = [
                'valueInputOption' => 'USER_ENTERED'
            ];
            
            $this->service->spreadsheets_values->append(
                $this->spreadsheetId,
                'Sheet1!A:O',
                $body,
                $params
            );
            
            Logger::info('Successfully appended registration row to Google Sheets worksheet "Sheet1".');
        } catch (Exception $error) {
            Logger::error('Failed to append row to Google Sheets: ' . $error->getMessage());
        }
    }
}
