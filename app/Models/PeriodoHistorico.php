<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodoHistorico extends Model
{
    use HasFactory;

    protected $table = 'periodo_historicos';

    protected $fillable = [
        'periodo_id',
        'rango_texto',
        'fecha_inicio',
        'fecha_fin',
        'titulo',
        'descripcion',
        'estado',
        'accion'
    ];

    public function periodo()
    {
        return $this->belongsTo(Periodo::class);
    }
}