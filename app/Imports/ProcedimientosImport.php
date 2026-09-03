<?php

namespace App\Imports;

use App\Models\Procedimiento;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ProcedimientosImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Procedimiento([
            'codigo_registro'              => $row['codigo_registro'] ?? null,
            'tipo_registro'                => $row['tipo_registro'] ?? null,
            'nombre_registro'              => $row['nombre_registro'] ?? null,
            'estado_registro'              => $row['estado_registro'] ?? 'Activo',
            'descripcion_registro'         => $row['descripcion_registro'] ?? null,
            'cargo_responsable'            => $row['cargo_responsable'] ?? null,
            'departamento_id'              => $row['departamento_id'] ?? 1,
            'usuario_id'                   => $row['usuario_id'] ?? 1,
            'numero_ley'                   => $row['numero_ley'] ?? null,
            'url_ley'                      => $row['url_ley'] ?? null,
            'nivel_digitalizacion'         => $row['nivel_digitalizacion'] ?? null,
            'tipo_expediente'              => $row['tipo_expediente'] ?? null,
            'metadatos_tecnicos_y_canales' => [
                'canal_ingreso' => $row['canal_ingreso'] ?? 'Presencial',
                'observaciones' => $row['observaciones'] ?? '',
            ],
        ]);
    }
}