<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminProcedimientoController extends Controller
{
    // Muestra la vista principal del panel de administración
    public function index()
    {
        return view('admin');
    }

}