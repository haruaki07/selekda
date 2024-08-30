<?php

use App\Http\Middleware\CheckCaptcha;
use App\Http\Middleware\CheckUserRole;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Auth\Events\Validated;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            "role" => CheckUserRole::class,
            "captcha" => CheckCaptcha::class,
            "json-response" => ForceJsonResponse::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (ValidationException $e, Request $request) {
            $error = [
                "code" => 400,
                "reason" => "ValidationError",
                "message" => $e->getMessage(),
                "errors" => $e->errors()
            ];

            return response()->json(compact('error'));
        });
    })->create();
