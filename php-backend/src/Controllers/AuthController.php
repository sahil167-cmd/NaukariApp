<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;
use App\Models\Profile;
use App\Utils\Logger;
use App\Utils\Formatter;

class AuthController
{
    public function loginWithPhone(Request $request, Response $response): Response
    {
        try {
            $body = $request->getParsedBody();
            if (!is_array($body)) {
                $body = json_decode((string)$request->getBody(), true) ?? [];
            }

            $phone = $body['phone'] ?? null;

            if (!$phone || !preg_match('/^[6-9]\d{9}$/', $phone)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Enter a valid 10-digit Indian mobile number (starts with 6-9)',
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $user = User::findOne(['phone' => $phone]);
            $isNew = false;

            if (!$user) {
                $user = User::create([
                    'phone' => $phone,
                    'name' => 'Worker',
                    'isVerified' => true,
                    'registrationComplete' => false,
                ]);
                $isNew = true;
            } else {
                $isNew = !((bool)($user->registration_complete ?? false));
            }

            $userId = $user->id;

            // Ensure Profile exists for this user
            Profile::findOneAndUpdate(
                ['userId' => $userId],
                [
                    '$setOnInsert' => [
                        'userId' => $userId,
                        'personal' => ['phone' => $phone],
                        'completionPercentage' => 0,
                    ]
                ],
                ['upsert' => true, 'new' => true]
            );

            // Generate JWT
            $jwtSecret = $_ENV['JWT_SECRET'] ?? '';
            $jwtRefreshSecret = $_ENV['JWT_REFRESH_SECRET'] ?? '';
            
            $accessTokenExp = time() + (7 * 24 * 60 * 60);
            $refreshTokenExp = time() + (30 * 24 * 60 * 60);

            $accessToken = JWT::encode([
                'id' => (string)$userId,
                'phone' => $user->phone ?? $phone,
                'exp' => $accessTokenExp
            ], $jwtSecret, 'HS256');

            $refreshToken = JWT::encode([
                'id' => (string)$userId,
                'exp' => $refreshTokenExp
            ], $jwtRefreshSecret, 'HS256');

            $formattedUser = Formatter::formatUser((array)$user);

            $responseData = [
                'success' => true,
                'data' => [
                    'tokens' => [
                        'accessToken' => $accessToken,
                        'refreshToken' => $refreshToken,
                        'expiresAt' => $accessTokenExp * 1000,
                    ],
                    'user' => [
                        'id' => $formattedUser['id'],
                        'phone' => $formattedUser['phone'],
                        'name' => $formattedUser['name'],
                        'isVerified' => $formattedUser['isVerified'],
                        'registrationComplete' => $formattedUser['registrationComplete'],
                        'createdAt' => $formattedUser['createdAt'],
                    ],
                    'isNew' => $isNew,
                    'supportPhone' => $_ENV['SUPPORT_PHONE'] ?? '',
                    'supportWhatsapp' => $_ENV['SUPPORT_WHATSAPP'] ?? '',
                ]
            ];

            $response->getBody()->write(json_encode($responseData));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $error) {
            Logger::error('[Auth] loginWithPhone error: ' . $error->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Internal server error. Please try again.',
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function logout(Request $request, Response $response): Response
    {
        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Logged out successfully'
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function refreshToken(Request $request, Response $response): Response
    {
        try {
            $body = $request->getParsedBody();
            if (!is_array($body)) {
                $body = json_decode((string)$request->getBody(), true) ?? [];
            }
            $token = $body['refreshToken'] ?? null;

            if (!$token) {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'Refresh token required']));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $jwtRefreshSecret = $_ENV['JWT_REFRESH_SECRET'] ?? '';
            $decoded = JWT::decode($token, new Key($jwtRefreshSecret, 'HS256'));

            $user = User::findById($decoded->id);
            if (!$user) {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'User not found']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            $jwtSecret = $_ENV['JWT_SECRET'] ?? '';
            $accessTokenExp = time() + (7 * 24 * 60 * 60);

            $accessToken = JWT::encode([
                'id' => (string)$user->id,
                'phone' => $user->phone,
                'exp' => $accessTokenExp
            ], $jwtSecret, 'HS256');

            $responseData = [
                'success' => true,
                'data' => [
                    'accessToken' => $accessToken,
                    'expiresAt' => $accessTokenExp * 1000,
                ]
            ];

            $response->getBody()->write(json_encode($responseData));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $error) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Invalid or expired refresh token']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }
    }
}
