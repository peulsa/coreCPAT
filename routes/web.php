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

    // Endpoints de la API interna para React
    Route::prefix('api')->group(function () {
        
        // CRUD de Procedimientos (Nómina)
        Route::get('/procedimientos', [AdminProcedimientoController::class, 'index']);
        Route::post('/procedimientos', [AdminProcedimientoController::class, 'store']);

        // Endpoints de gestión de períodos
        Route::get('/periodo-activo', [AdminPeriodoController::class, 'activo']);
        Route::get('/resumen-ciclos', [AdminPeriodoController::class, 'resumenCiclos']);
        
        // CRUD de períodos
        Route::get('/periodos', [AdminPeriodoController::class, 'index']);
        Route::post('/periodos', [AdminPeriodoController::class, 'store']);
        Route::put('/periodos/{periodo}', [AdminPeriodoController::class, 'update']);
        Route::delete('/periodos/{periodo}', [AdminPeriodoController::class, 'destroy']);
    });
});