<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    use HasFactory;

    protected $table = 'departamentos';

    // Mapeo explícito de las columnas de fecha en español
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = 'actualizado_en';

    protected $fillable = [
        'nombre',
        'codigo_unidad',
        'descripcion',
    ];

    // Relación: Un departamento tiene muchos procedimientos
    public function procedimientos()
    {
        return $this->hasMany(Procedimiento::class);
    }

    // Relación: Un departamento tiene muchos usuarios/funcionarios
    public function usuarios()
    {
        return $this->hasMany(User::class);
    }
}