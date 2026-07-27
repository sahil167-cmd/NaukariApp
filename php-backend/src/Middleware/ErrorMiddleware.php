<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;
use Slim\Psr7\Factory\ResponseFactory;
use App\Utils\Logger;

class ErrorMiddleware
{
    public function __invoke(
        Request $request,
        Throwable $exception,
        bool $displayErrorDetails,
        bool $logErrors,
        bool $logErrorDetails
    ): Response {
        Logger::error($exception->getMessage(), ['trace' => $exception->getTraceAsString()]);

        $response = (new ResponseFactory())->createResponse();
        
        $statusCode = 500;
        $message = 'Internal server error. Please try again.';
        $code = 'INTERNAL_ERROR';

        if ($exception instanceof \Slim\Exception\HttpNotFoundException) {
            $statusCode = 404;
            $message = 'Route not found';
            $code = 'ROUTE_NOT_FOUND';
        } elseif ($exception instanceof \Slim\Exception\HttpMethodNotAllowedException) {
            $statusCode = 405;
            $message = 'Method not allowed';
            $code = 'METHOD_NOT_ALLOWED';
        } elseif ($exception instanceof \InvalidArgumentException) {
            $statusCode = 400;
            $message = $exception->getMessage();
            $code = 'BAD_REQUEST';
        }

        $payload = [
            'success' => false,
            'message' => $message,
            'code' => $code,
        ];

        // Slim will pass this to ResponseMiddleware, which will wrap it with timestamp/requestId
        $response->getBody()->write(json_encode($payload));

        return $response
            ->withStatus($statusCode)
            ->withHeader('Content-Type', 'application/json');
    }
}
