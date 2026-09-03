<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\ProcedimientosImport;
use Maatwebsite\Excel\Facades\Excel;

class ProcedimientoImportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'archivo_excel' => 'required|mimes:xlsx,xls,csv',
        ]);

        try {
            Excel::import(new ProcedimientosImport, $request->file('archivo_excel'));

            return response()->json([
                'success' => true,
                'message' => '¡Procedimientos importados masivamente con éxito!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al importar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }
}