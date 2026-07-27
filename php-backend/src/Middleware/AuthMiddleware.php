<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Factory\ResponseFactory;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;
use App\Utils\Logger;

class AuthMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        $responseFactory = new ResponseFactory();
        $authHeader = $request->getHeaderLine('Authorization');
        
        $token = null;
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);
        }

        if (empty($token)) {
            $response = $responseFactory->createResponse(401);
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Authentication required. Please login to continue.',
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        }

        try {
            $secret = $_ENV['JWT_SECRET'] ?? '';
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            
            $user = User::findById($decoded->id);
            
            if (!$user) {
                $response = $responseFactory->createResponse(401);
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found. Please login again.',
                ]));
                return $response->withHeader('Content-Type', 'application/json');
            }

            // Attach user object to request attributes
            $request = $request->withAttribute('user', $user);
            
            return $handler->handle($request);
        } catch (\Firebase\JWT\ExpiredException $e) {
            Logger::error('[Auth] JWT Expired: ' . $e->getMessage());
            $response = $responseFactory->createResponse(401);
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Session expired. Please login again.',
                'code' => 'TOKEN_EXPIRED',
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            Logger::error('[Auth] JWT verification failed: ' . $e->getMessage());
            $response = $responseFactory->createResponse(401);
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Invalid authentication token. Please login again.',
                'code' => 'INVALID_TOKEN',
            ]));
            return $response->withHeader('Content-Type', 'application/json');
        }
    }
}
