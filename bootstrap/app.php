<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Excluimos la ruta de importación de la validación CSRF para permitir pruebas desde Postman o API externa
        $middleware->validateCsrfTokens(except: [
            'procedimientos/importar',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();