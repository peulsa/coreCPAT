<?php

namespace App\Http\Controllers;

use App\Models\Procedimiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminProcedimientoController extends Controller
{
    // Obtener la nómina para la tabla
    public function index()
    {
        return response()->json(Procedimiento::orderBy('created_at', 'desc')->get());
    }

    // Guardar el nuevo registro desde el modal
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_registro' => 'required|unique:procedimientos,codigo_registro',
            'nombre_registro' => 'required|string|max:255',
            'tipo_registro' => 'required|string',
            'descripcion_registro' => 'required|string',
            'cargo_responsable' => 'required|string',
            'departamento_id' => 'required|integer',
            'nivel_digitalizacion' => 'nullable|string',
        ]);

        $procedimiento = Procedimiento::create(array_merge($validated, [
            'estado_registro' => 'Pendiente',
            // Si no tienes sesión activa aún, fuerza el ID 1 para no violar la Foreign Key
            'usuario_id' => Auth::id() ?? 1, 
            'detalles_tecnicos' => [] 
        ]));
        
        return response()->json(['success' => true, 'data' => $procedimiento]);
    }
}