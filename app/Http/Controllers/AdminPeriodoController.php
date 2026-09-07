<?php

namespace App\Http\Controllers;

use App\Models\Periodo;
use App\Models\PeriodoHistorico;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminPeriodoController extends Controller
{
    public function index()
    {
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

        // Guardar la versión inicial de creación
        PeriodoHistorico::create([
            'periodo_id' => $periodo->id,
            'rango_texto' => $periodo->rango_texto,
            'fecha_inicio' => $periodo->fecha_inicio,
            'fecha_fin' => $periodo->fecha_fin,
            'titulo' => $periodo->titulo,
            'descripcion' => $periodo->descripcion,
            'estado' => $periodo->estado,
            'accion' => 'creado'
        ]);

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

        // 1. Guardar los datos anteriores en el histórico antes de modificarlos
        PeriodoHistorico::create([
            'periodo_id' => $periodo->id,
            'rango_texto' => $periodo->rango_texto,
            'fecha_inicio' => $periodo->fecha_inicio,
            'fecha_fin' => $periodo->fecha_fin,
            'titulo' => $periodo->titulo,
            'descripcion' => $periodo->descripcion,
            'estado' => $periodo->estado,
            'accion' => 'actualizado'
        ]);

        // 2. Aplicar los nuevos cambios en la tabla principal
        $periodo->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Período actualizado con éxito',
            'data' => $periodo
        ]);
    }

    public function destroy(Periodo $periodo)
    {
        // 1. Registrar la última versión vigente en el histórico antes de eliminarlo
        PeriodoHistorico::create([
            'periodo_id' => $periodo->id,
            'rango_texto' => $periodo->rango_texto,
            'fecha_inicio' => $periodo->fecha_inicio,
            'fecha_fin' => $periodo->fecha_fin,
            'titulo' => $periodo->titulo,
            'descripcion' => $periodo->descripcion,
            'estado' => $periodo->estado,
            'accion' => 'eliminado'
        ]);

        // 2. Ejecutar la eliminación (Soft Delete)
        $periodo->delete();

        return response()->json([
            'success' => true, 
            'message' => 'Período eliminado y registrado en el historial con éxito'
        ]);
    }
}