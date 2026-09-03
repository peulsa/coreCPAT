<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

// database/migrations/xxxx_create_periodos_table.php
public function up(): void
{
    Schema::create('periodos', function (Blueprint $table) {
    $table->id();
    $table->string('rango_texto');
    $table->dateTime('fecha_inicio');
    $table->dateTime('fecha_fin');
    $table->string('titulo');
    $table->text('descripcion');
    $table->string('estado');
    $table->timestamps();
});
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('periodos');
    }
};
