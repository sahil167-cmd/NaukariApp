<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\ContactLog;
use App\Utils\Formatter;
use App\Utils\Logger;

class ContactController
{
    public function logContact(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            
            $body = $request->getParsedBody();
            $actionType = $body['actionType'] ?? null;
            $device = $body['device'] ?? 'Mobile';
            $platform = $body['platform'] ?? 'unknown';

            if (!$actionType || !in_array($actionType, ['CALL', 'WHATSAPP'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Invalid actionType. Must be CALL or WHATSAPP.'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $log = ContactLog::create([
                'userId' => $user->id,
                'actionType' => $actionType,
                'device' => $device,
                'platform' => $platform,
                'status' => 'completed'
            ]);

            $formattedLog = Formatter::formatContactLog((array)$log);

            $responseData = [
                'success' => true,
                'data' => [
                    'id' => $formattedLog['id'],
                    'actionType' => $formattedLog['actionType'],
                    'timestamp' => $formattedLog['timestamp']
                ],
                'message' => 'Interaction logged successfully'
            ];

            $response->getBody()->write(json_encode($responseData));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $error) {
            Logger::error('Log contact error: ' . $error->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
