<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta principal
Route::get('/', function () {
    return Inertia::render('Dashboard'); // Busca el archivo en resources/js/Pages/Dashboard.tsx
});

// Rutas de autenticación (Solo renderizan la vista por ahora)
Route::get('/login', function () { return Inertia::render('Login'); })->name('login');
Route::get('/register', function () { return Inertia::render('Register'); });
Route::get('/forgot-password', function () { return Inertia::render('ForgotPassword'); });

// Rutas protegidas (Deberías envolverlas en middleware 'auth' más adelante)
Route::get('/escritorio', function () { return Inertia::render('Escritorio'); });
Route::get('/productos', function () { return Inertia::render('Productos'); });
Route::get('/vender', function () { return Inertia::render('Vender'); });
Route::get('/caja', function () { return Inertia::render('Caja'); });
Route::get('/graficas', function () { return Inertia::render('Escritorio'); }); // Reusaste el componente
Route::get('/usuarios', function () { return Inertia::render('Usuarios'); });
Route::get('/ajustes', function () { return Inertia::render('Ajustes'); });
Route::get('/perfil', function () { return Inertia::render('Perfil'); });

// Rutas de Reportes
Route::prefix('reportes')->group(function () {
    Route::get('/', function () { return Inertia::render('Reportes'); });
    Route::get('/ventas-contado', function () { return Inertia::render('VentasContado'); });
    Route::get('/caja', function () { return Inertia::render('ReporteCaja'); });
    Route::get('/baja-existencia', function () { return Inertia::render('Productos'); });
    Route::get('/inventario', function () { return Inertia::render('Inventario'); });
});

// Manejo de 404
Route::fallback(function () {
    return Inertia::render('NotFound');
});