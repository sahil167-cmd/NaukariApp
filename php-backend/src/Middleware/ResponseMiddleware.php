<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Factory\StreamFactory;

class ResponseMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        $requestId = $request->getHeaderLine('x-request-id');
        if (empty($requestId)) {
            $requestId = substr(md5(uniqid(mt_rand(), true)), 0, 9);
        }
        
        $response = $handler->handle($request);
        $response = $response->withHeader('x-request-id', $requestId);

        // Check if the response is JSON
        $contentType = $response->getHeaderLine('Content-Type');
        if (strpos($contentType, 'application/json') === false) {
            // For safety, force JSON content type in this API
            $response = $response->withHeader('Content-Type', 'application/json');
        }

        $body = (string) $response->getBody();
        $data = json_decode($body, true);

        // If it's already properly formatted or not valid JSON, just pass it through 
        // with the standard envelope if possible.
        if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
            $timestamp = date('c'); // ISO 8601
            $statusCode = $response->getStatusCode();
            $isError = $statusCode >= 400 || (isset($data['success']) && $data['success'] === false);

            if (isset($data['success']) && isset($data['timestamp']) && isset($data['requestId'])) {
                return $response; // Already formatted
            }

            if ($isError) {
                $errorMsg = $data['message'] ?? $data['error'] ?? 'An error occurred';
                $errorCode = $data['code'] ?? ($statusCode === 404 ? 'ROUTE_NOT_FOUND' : ($statusCode === 401 ? 'UNAUTHORIZED' : ($statusCode === 403 ? 'FORBIDDEN' : 'BAD_REQUEST')));

                $failureResponse = [
                    'success' => false,
                    'error' => $errorMsg,
                    'code' => $errorCode,
                    'message' => $errorMsg,
                    'timestamp' => $timestamp,
                    'requestId' => $requestId,
                ];

                if (isset($data['errors'])) {
                    $failureResponse['errors'] = $data['errors'];
                }

                $stream = (new StreamFactory())->createStream(json_encode($failureResponse));
                return $response->withBody($stream);
            }

            // Success formatting
            $msg = $data['message'] ?? 'Operation completed successfully';
            
            $dataPayload = $data;
            if (isset($data['success'])) {
                $dataPayload = isset($data['data']) ? $data['data'] : $data;
            }

            $successResponse = [
                'success' => true,
                'message' => $msg,
                'data' => $dataPayload,
                'timestamp' => $timestamp,
                'requestId' => $requestId,
            ];

            $stream = (new StreamFactory())->createStream(json_encode($successResponse));
            return $response->withBody($stream);
        }

        // If not JSON, but the API expects JSON, wrap it anyway if it's not empty
        if (!empty($body)) {
             $stream = (new StreamFactory())->createStream(json_encode([
                 'success' => $response->getStatusCode() < 400,
                 'message' => $response->getStatusCode() >= 400 ? 'An error occurred' : 'Operation completed successfully',
                 'data' => $body,
                 'timestamp' => date('c'),
                 'requestId' => $requestId,
             ]));
             $response = $response->withBody($stream)->withHeader('Content-Type', 'application/json');
        }

        return $response;
    }
}
