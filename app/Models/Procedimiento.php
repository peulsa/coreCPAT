<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Procedimiento extends Model
{
    use HasFactory;

    protected $table = 'procedimientos';

    // Mapeo de las columnas de fecha en español según el DER
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = 'actualizado_en';

    protected $fillable = [
        'codigo_registro',
        'tipo_registro',
        'nombre_registro',
        'estado_registro',
        'descripcion_registro',
        'cargo_responsable',
        'departamento_id',
        'usuario_id',
        'numero_ley',
        'url_ley',
        'nivel_digitalizacion',
        'tipo_expediente',
        'metadatos_tecnicos_y_canales',
    ];

    protected $casts = [
        'metadatos_tecnicos_y_canales' => 'array',
    ];

    // Relación: Un procedimiento pertenece a un departamento
    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }

    // Relación: Un procedimiento fue creado/gestionado por un usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}