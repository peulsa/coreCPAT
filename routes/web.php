<?php
use App\Http\Controllers\AdminProcedimientoController;
use App\Http\Controllers\AdminPeriodoController;
use Illuminate\Support\Facades\Route;

// Portal de Usuario
Route::get('/', function () {
    return view('welcome');
});

// Panel de Administrador
Route::prefix('admin')->group(function () {
    
    // Vista principal que carga la interfaz de React
    Route::get('/', function () {
        return view('admin');
    });

    // Controlador opcional para procedimientos si lo necesitas aparte
    Route::get('/procedimientos-data', [AdminProcedimientoController::class, 'index']);

    // Endpoints específicos y de gestión de períodos
    Route::prefix('api')->group(function () {
        Route::get('/periodo-activo', [AdminPeriodoController::class, 'activo']);
        Route::get('/resumen-ciclos', [AdminPeriodoController::class, 'resumenCiclos']);
        
        // CRUD de períodos
        Route::get('/periodos', [AdminPeriodoController::class, 'index']);
        Route::post('/periodos', [AdminPeriodoController::class, 'store']);
        Route::put('/periodos/{periodo}', [AdminPeriodoController::class, 'update']);
        Route::delete('/periodos/{periodo}', [AdminPeriodoController::class, 'destroy']);
    });
});