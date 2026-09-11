<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('procedimientos', function (Blueprint $table) {
            // Añadimos la columna json si no existe
            if (!Schema::hasColumn('procedimientos', 'metadatos_tecnicos_y_canales')) {
                $table->json('metadatos_tecnicos_y_canales')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('procedimientos', function (Blueprint $table) {
            $table->dropColumn('metadatos_tecnicos_y_canales');
        });
    }
};