<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periodo_historicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('periodo_id')->constrained('periodos')->onDelete('cascade');
            
            // Campos exactos del formulario de períodos
            $table->string('rango_texto');
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin');
            $table->string('titulo');
            $table->text('descripcion');
            $table->string('estado');
            
            $table->string('accion'); // 'creado' o 'actualizado'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('periodo_historicos');
    }
};