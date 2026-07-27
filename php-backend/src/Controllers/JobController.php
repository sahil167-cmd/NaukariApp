<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Job;
use App\Utils\Formatter;
use App\Utils\Logger;

class JobController
{
    public function getJobs(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $page = isset($queryParams['page']) ? (int)$queryParams['page'] : 1;
            $pageSize = isset($queryParams['pageSize']) ? (int)$queryParams['pageSize'] : 10;
            $category = $queryParams['category'] ?? null;

            $query = [];
            if ($category) {
                $query['category'] = $category;
            }

            $start = ($page - 1) * $pageSize;
            $total = Job::countDocuments($query);
            
            $items = Job::find($query, [
                'sort' => ['posted_at' => -1],
                'skip' => $start,
                'limit' => $pageSize
            ]);

            $formattedItems = Formatter::formatJob($items);

            $responseData = [
                'success' => true,
                'data' => [
                    'items' => $formattedItems,
                    'total' => $total,
                    'page' => $page,
                    'pageSize' => $pageSize,
                    'hasMore' => ($start + $pageSize) < $total,
                ]
            ];

            $response->getBody()->write(json_encode($responseData));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $error) {
            Logger::error('Get jobs error: ' . $error->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getJobById(Request $request, Response $response, array $args): Response
    {
        try {
            $id = $args['id'];
            $job = Job::findById($id);

            if (!$job) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Job not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $formattedJob = Formatter::formatJob((array)$job);

            $responseData = [
                'success' => true,
                'data' => $formattedJob
            ];

            $response->getBody()->write(json_encode($responseData));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $error) {
            Logger::error('Get job by ID error: ' . $error->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function applyForJob(Request $request, Response $response, array $args): Response
    {
        try {
            $id = $args['id'];
            $job = Job::findById($id);

            if (!$job) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Job not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $responseData = [
                'success' => true,
                'data' => ['applicationId' => 'app_' . (time() * 1000)],
                'message' => 'Application submitted successfully'
            ];

            $response->getBody()->write(json_encode($responseData));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $error) {
            Logger::error('Apply job error: ' . $error->getMessage());
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Internal server error'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
