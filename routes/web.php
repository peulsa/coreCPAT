<?php

use App\Http\Controllers\AdminProcedimientoController;
use App\Http\Controllers\AdminPeriodoController; // Importar el nuevo controlador
use Illuminate\Support\Facades\Route;

// Portal de Usuario
Route::get('/', function () {
    return view('welcome');
});

// Panel de Administrador
Route::get('/admin', [AdminProcedimientoController::class, 'index']);

// Rutas API para gestionar períodos (Protegidas por middleware de admin en un entorno real)
Route::prefix('admin/api')->group(function () {
    Route::get('/periodos', [AdminPeriodoController::class, 'index']);
    Route::post('/periodos', [AdminPeriodoController::class, 'store']);
    Route::put('/periodos/{periodo}', [AdminPeriodoController::class, 'update']);
    Route::delete('/periodos/{periodo}', [AdminPeriodoController::class, 'destroy']);
});