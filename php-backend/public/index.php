<?php

use Slim\Factory\AppFactory;
use App\Middleware\ErrorMiddleware;
use App\Middleware\ResponseMiddleware;
use App\Middleware\CorsMiddleware;
use Dotenv\Dotenv;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Instantiate App
$app = AppFactory::create();

// Add Cors Middleware FIRST
$app->add(new CorsMiddleware());

// Add routing middleware
$app->addRoutingMiddleware();

// Add Response Middleware to standardize { success, data, message } wrapper
$app->add(new ResponseMiddleware());

// Add Body Parsing Middleware
$app->addBodyParsingMiddleware();

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler(ErrorMiddleware::class);

// Global OPTIONS Preflight catch-all route
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

// Define Routes
require __DIR__ . '/../src/Routes/api.php';

// Run App
$app->run();
