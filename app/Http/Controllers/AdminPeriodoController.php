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
            'fecha_inicio' => 'required|string',
            'fecha_fin' => 'required|string',
            'titulo' => 'required|string',
            'descripcion' => 'required|string',
            'estado' => 'required|string',
        ]);

        // Parsear las fechas enviadas por la interfaz al formato estándar de base de datos
        $fechaInicio = Carbon::parse($request->fecha_inicio)->format('Y-m-d H:i:s');
        $fechaFin = Carbon::parse($request->fecha_fin)->format('Y-m-d H:i:s');

        // Validación de cruce de fechas: verifica que no choque con ningún período existente
        $hayCruce = Periodo::where(function ($query) use ($fechaInicio, $fechaFin) {
            $query->where('fecha_inicio', '<=', $fechaFin)
                ->where('fecha_fin', '>=', $fechaInicio);
        })->exists();

        if ($hayCruce) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes crear un nuevo período ya que hay uno activo. Si quieres modificarlo, debes editar el período actual.'
            ], 422);
        }

        $periodo = Periodo::create([
            'rango_texto' => $validated['rango_texto'],
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
            'titulo' => $validated['titulo'],
            'descripcion' => $validated['descripcion'],
            'estado' => $validated['estado'],
        ]);

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
            'fecha_inicio' => 'required|string',
            'fecha_fin' => 'required|string',
            'titulo' => 'required|string',
            'descripcion' => 'required|string',
            'estado' => 'required|string',
        ]);

        $fechaInicio = Carbon::parse($request->fecha_inicio)->format('Y-m-d H:i:s');
        $fechaFin = Carbon::parse($request->fecha_fin)->format('Y-m-d H:i:s');

        // Validación de cruce de fechas (excluyendo el período actual que estamos editando)
        $hayCruce = Periodo::where('id', '!=', $periodo->id)
            ->where(function ($query) use ($fechaInicio, $fechaFin) {
                $query->where('fecha_inicio', '<=', $fechaFin)
                    ->where('fecha_fin', '>=', $fechaInicio);
            })->exists();

        if ($hayCruce) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes crear un nuevo período ya que hay uno activo para esa fecha. Si quieres modificarlo, debes editar el período actual.'
            ], 422);
        }

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

        // 2. Aplicar los nuevos cambios en la tabla principal con las fechas formateadas
        $periodo->update([
            'rango_texto' => $validated['rango_texto'],
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
            'titulo' => $validated['titulo'],
            'descripcion' => $validated['descripcion'],
            'estado' => $validated['estado'],
        ]);

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

    public function activo()
    {
        $periodoActivo = Periodo::where('estado', 'En proceso')->first()
            ?? Periodo::orderBy('fecha_inicio', 'desc')->first();

        return response()->json([
            'success' => true,
            'data' => $periodoActivo
        ]);
    }

    public function resumenCiclos()
    {
        $anterior = Periodo::where('estado', 'Finalizado')
            ->orderBy('fecha_fin', 'desc')
            ->first();

        $proximos = Periodo::where('estado', 'Próximo')
            ->orderBy('fecha_inicio', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'anterior' => $anterior,
            'proximos' => $proximos
        ]);
    }
}
