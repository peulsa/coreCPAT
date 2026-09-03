<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProcedimientoImportController;

Route::get('/', function () {
    return view('welcome');
});

// Ruta para la importación masiva de procedimientos mediante Excel
Route::post('/procedimientos/importar', [ProcedimientoImportController::class, 'store']);