<?php

namespace App\Http\Controllers;

use App\Models\Periodo;
use Illuminate\Http\Request;

class AdminPeriodoController extends Controller
{
    public function index()
    {
        return Periodo::orderBy('fecha_inicio', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rango_texto' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'titulo' => 'required|string',
            'descripcion' => 'required|string',
            'estado' => 'required|string',
        ]);

        $periodo = Periodo::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Período guardado con éxito',
            'data' => $periodo
        ], 201);
    }

    public function update(Request $request, Periodo $periodo)
    {
        $validated = $request->validate([
            'rango_texto' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'titulo' => 'required|string',
            'descripcion' => 'required|string',
            'estado' => 'required|string',
        ]);

        $periodo->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Período actualizado con éxito',
            'data' => $periodo
        ]);
    }

    public function destroy(Periodo $periodo)
    {
        $periodo->delete();
        return response()->json([
            'success' => true, 
            'message' => 'Período eliminado con éxito'
        ]);
    }
}