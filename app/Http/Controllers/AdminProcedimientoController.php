<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Procedimiento;

class AdminProcedimientoController extends Controller
{
    // Listar todos los procedimientos para la tabla principal
    public function index()
    {
        return response()->json(Procedimiento::with(['departamento', 'usuario'])->orderBy('creado_en', 'desc')->get());
    }

    // Guardar un nuevo procedimiento desde el asistente de React (Permite guardar parcial sin validar estricto)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_registro' => 'required|string|unique:procedimientos',
            'tipo_registro' => 'required|string',
            'nombre_registro' => 'required|string|max:255',
        ]);

        // 1. Campos físicos que corresponden a columnas directas de tu tabla
        $data = $request->only([
            'codigo_registro',
            'tipo_registro',
            'nombre_registro',
            'descripcion_registro',
            'cargo_responsable',
            'departamento_id',
            'usuario_id',
            'numero_ley',
            'url_ley',
            'nivel_digitalizacion',
            'tipo_expediente',
        ]);

        $data['estado_registro'] = $request->input('estado_registro', 'Pendiente');

        // 2. Todo el resto de respuestas de las pestañas del asistente se empaquetan en el campo JSON
        $data['metadatos_tecnicos_y_canales'] = $request->except(array_keys($data));

        $procedimiento = Procedimiento::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Procedimiento guardado exitosamente',
            'data' => $procedimiento
        ], 201);
    }

    // Actualizar un procedimiento existente conforme se avanza de step o se modifica información
    public function update(Request $request, $id)
    {
        $procedimiento = Procedimiento::findOrFail($id);

        $data = $request->only([
            'codigo_registro',
            'tipo_registro',
            'nombre_registro',
            'descripcion_registro',
            'cargo_responsable',
            'departamento_id',
            'usuario_id',
            'numero_ley',
            'url_ley',
            'nivel_digitalizacion',
            'tipo_expediente',
            'estado_registro'
        ]);

        $data['metadatos_tecnicos_y_canales'] = $request->except(array_keys($data));

        $procedimiento->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Procedimiento actualizado exitosamente',
            'data' => $procedimiento
        ]);
    }

    // Exportar el Registro Oficial en formato Excel (CSV compatible con UTF-8)
    public function exportarExcel()
    {
        $procedimientos = Procedimiento::with(['departamento', 'usuario'])->get();
        $nombreArchivo = 'Registro_Oficial_CPAT_' . date('Y-m-d') . '.csv';

        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$nombreArchivo",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($procedimientos) {
            $file = fopen('php://output', 'w');
            
            // Añadir BOM (Byte Order Mark) para que Excel reconozca tildes y caracteres especiales en español
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            $isFirst = true;

            foreach ($procedimientos as $p) {
                // Extraemos el array del campo JSON de metadatos
                $meta = $p->metadatos_tecnicos_y_canales ?? [];

                // Mapeo exacto de los datos del modelo hacia las columnas oficiales del formato
                $row = [
                    'Código del registro' => $p->codigo_registro,
                    'Tipo de registro' => $p->tipo_registro,
                    'Nombre del registro' => $p->nombre_registro,
                    'Estado registro' => $p->estado_registro ?? 'Pendiente',
                    'Descripción del registro' => $p->descripcion_registro,
                    'Área responsable' => $meta['area_responsable'] ?? '',
                    'Cargo del o la responsable' => $p->cargo_responsable,
                    'Tipo de inicio' => $meta['tipo_inicio'] ?? '',
                    'Acto de inicio' => $meta['acto_inicio'] ?? '',
                    'Acto de término' => $meta['acto_termino'] ?? '',
                    'Producto institucional relacionado' => $meta['producto_institucional'] ?? '',
                    'Número Ley' => $p->numero_ley,
                    'URL de la Ley en LeyChile' => $p->url_ley,
                    'Pago asociado' => $meta['pago_asociado'] ?? '',
                    'Tipo de usuario(a)' => $meta['tipo_usuario'] ?? '',
                    'Segmento de usuarios(as)' => $meta['segmento_usuario'] ?? '',
                    'Disponibilidad para su realización' => $meta['disponibilidad_realizacion'] ?? '',
                    'Nivel de digitalización' => $p->nivel_digitalizacion,
                    'Tipo de expediente' => $p->tipo_expediente,
                    'Ficha ChileAtiende relacionada' => $meta['ficha_chileatiende'] ?? '',
                    'Firma electrónica Avanzada' => $meta['firma_electronica'] ?? '',
                    'Notificación(es) practicada(s)' => $meta['notificacion_practicada'] ?? '',
                    'Dato, documentos y/o expedientes en poder de otros órganos' => $meta['datos_otros_organos'] ?? '',
                    'Documento(s) notarial(es)' => $meta['documentos_notariales'] ?? '',
                    'Medio utilizado para enviar comunicaciones oficiales' => $meta['medio_comunicaciones'] ?? '',
                    'Información adicional' => $meta['info_adicional'] ?? '',
                    'Fecha de creación' => $p->creado_en ?? $p->created_at,
                    'Fecha de actualización' => $p->actualizado_en ?? $p->updated_at,
                ];

                if ($isFirst) {
                    // Escribe las cabeceras en la primera línea usando punto y coma (;)
                    fputcsv($file, array_keys($row), ';');
                    $isFirst = false;
                }

                // Escribe los valores de cada procedimiento
                fputcsv($file, array_values($row), ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}