<?php

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\AuthController;
use App\Middleware\AuthMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Global prefix /api/v1
$app->group('/api/v1', function (RouteCollectorProxy $group) {

    // Health Check
    $group->get('/health', function (Request $request, Response $response) {
        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Server is healthy'
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Support Contact Info (Public)
    $group->get('/support/info', function (Request $request, Response $response) {
        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => [
                'supportPhone' => $_ENV['SUPPORT_PHONE'] ?? '',
                'supportWhatsapp' => $_ENV['SUPPORT_WHATSAPP'] ?? '',
            ]
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // ── Authentication Routes (Public) ──────────────────────────────────────────
    $group->post('/auth/login', [AuthController::class, 'loginWithPhone']);
    $group->post('/auth/logout', [AuthController::class, 'logout']);
    $group->post('/auth/refresh-token', [AuthController::class, 'refreshToken']);

    // ── Protected Routes ────────────────────────────────────────────────────────
    $group->group('', function (RouteCollectorProxy $protectedGroup) {
        
        // Profile & Dashboard
        $protectedGroup->get('/profile', [App\Controllers\ProfileController::class, 'getProfile']);
        $protectedGroup->patch('/profile', [App\Controllers\ProfileController::class, 'updateProfile']);
        $protectedGroup->post('/register', [App\Controllers\ProfileController::class, 'submitRegistration']);
        $protectedGroup->get('/dashboard', [App\Controllers\ProfileController::class, 'getDashboard']);

        // Job Application
        $protectedGroup->post('/jobs/{id}/apply', [App\Controllers\JobController::class, 'applyForJob']);

        // Contact Logs
        $protectedGroup->post('/contact-logs', [App\Controllers\ContactController::class, 'logContact']);
    })->add(new AuthMiddleware());

    // ── Public Job Listings ──────────────────────────────────────────────────────
    $group->get('/jobs', [App\Controllers\JobController::class, 'getJobs']);
    $group->get('/jobs/{id}', [App\Controllers\JobController::class, 'getJobById']);

});
