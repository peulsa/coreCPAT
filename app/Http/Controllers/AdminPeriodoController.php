<?php

namespace App\Http\Controllers;

use App\Models\Periodo;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminPeriodoController extends Controller
{
    public function index()
    {
        // Opcional: puedes actualizar los estados dinámicamente al listar si ya expiraron
        $periodos = Periodo::orderBy('fecha_inicio', 'asc')->get();
        
        foreach ($periodos as $p) {
            $now = Carbon::now();
            $inicio = Carbon::parse($p->fecha_inicio);
            $fin = Carbon::parse($p->fecha_fin);

            $nuevoEstado = $p->estado;
            if ($now->lt($inicio)) {
                $nuevoEstado = 'Próximo';
            } elseif ($now->between($inicio, $fin)) {
                $nuevoEstado = 'En proceso';
            } else {
                $nuevoEstado = 'Finalizado';
            }

            if ($p->estado !== $nuevoEstado) {
                $p->update(['estado' => $nuevoEstado]);
            }
        }

        return Periodo::orderBy('fecha_inicio', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rango_texto' => 'required|string',
            'fecha_inicio' => 'required',
            'fecha_fin' => 'required',
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
            'fecha_inicio' => 'required',
            'fecha_fin' => 'required',
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
        // Al tener SoftDeletes, esto llenará el campo 'deleted_at' 
        // sin borrar el registro de la BD, manteniendo el historial a salvo.
        $periodo->delete();

        return response()->json([
            'success' => true, 
            'message' => 'Período enviado al historial con éxito'
        ]);
    }
}