<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('procedimientos', function (Blueprint $table) {
            $table->id();

            // Núcleo principal
            $table->string('codigo_registro')->unique();
            $table->string('tipo_registro');
            $table->string('nombre_registro');
            $table->string('estado_registro');
            $table->text('descripcion_registro');
            $table->string('cargo_responsable');

            // Relaciones
            $table->foreignId('departamento_id')->constrained('departamentos')->cascadeOnDelete();
            $table->foreignId('usuario_id')->nullable()->constrained('users')->nullOnDelete();

            // Campos legales frecuentes
            $table->string('numero_ley')->nullable();
            $table->string('url_ley')->nullable();
            $table->string('nivel_digitalizacion')->nullable();
            $table->string('tipo_expediente')->nullable();

            // Bloque JSON flexible para canales, firmas y estándares masivos del Excel
            $table->json('detalles_tecnicos')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procedimientos');
    }
};