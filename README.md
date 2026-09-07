# 🏛️ CoreCPAT - Catálogo de Procedimientos Administrativos y Tramitaciones

> Sistema integral de gestión y control institucional desarrollado para optimizar los procesos administrativos, la trazabilidad de trámites y la administración de periodos operativos.

---

## 🚧 Estado del Proyecto
<p align="left">
<img src="https://img.shields.io/badge/STATUS-EN%20DESAROLLO-green">
</p>

Se encuentra implementado el módulo central de administración, el control de períodos con estados dinámicos y la persistencia histórica mediante *Soft Deletes*.

---

## 📋 Tabla de Contenidos
* [Descripción del Proyecto](#-descripción-del-proyecto)
* [Estado del Proyecto](#-estado-del-proyecto)
* [Características Principales](#-características-principales)
* [Tecnologías Utilizadas](#-tecnologías-utilizadas)
* [Estructura del Proyecto](#-estructura-del-proyecto)
* [Instalación y Configuración](#-instalación-y-configuración)
* [Ejecución del Entorno](#-execution-del-entorno)
* [Licencia](#-licencia)

---

## 📝 Descripción del Proyecto
**CoreCPAT** es una plataforma orientada a la digitalización y el ordenamiento de flujos de trabajo públicos. Permite centralizar la administración de periodos operativos, la gestión de nóminas y el control de procedimientos bajo los lineamientos de transformación digital, ofreciendo una interfaz rápida, intuitiva y robusta.

---


## :hammer: Funcionalidades del proyecto

- `Gestión de Períodos`: Creación, edición y control de períodos operativos con autocompletado inteligente de rangos y títulos estandarizados.
- `Cálculo de Estados Automático`: Determinación en tiempo real del estado del período (`Próximo`, `En proceso`, `Finalizado`) basado en la fecha y hora del sistema mediante *Carbon*.
- `Historial y Soft Deletes`: Preservación de registros históricos y de auditoría institucional en la base de datos sin eliminarlos de forma permanente.
- `Panel Administrativo Institucional`: Interfaz moderna y responsiva desarrollada con React y Tailwind CSS, adaptada a los lineamientos de la administración pública.
- `Sincronización Temporal Local`: Configuración estricta de la zona horaria del servidor ajustada a `America/Santiago` para la precisión de las marcas de tiempo.

---

## 🛠️ Tecnologías Utilizadas
Este proyecto combina un backend sólido con un frontend ágil:
* **Backend:** PHP, [Laravel 13](https://laravel.com/), Eloquent ORM, SQLite.
* **Frontend:** React, Vite, Tailwind CSS.

---

## ⚙️ Configuración y Puesta en Marcha (Entorno Local)

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/peulsa/coreCPAT.git
   cd coreCPAT

2. **Instalar dependencias:**
   ```bash
   composer install
   npm install

3. **Configurar el entorno:**
   ```bash
   cp .env.example .env
   php artisan key:generate

4. **Ejecutar migraciones:**
   ```bash
   php artisan migrate

5. **Levantar servidor:**
   ```bash
   php artisan serve


---

## 📂 Estructura del Proyecto
```text
coreCPAT/
├── app/
│   ├── Http\Controllers/
│   │   ├── AdminPeriodoController.php
│   │   ├── AdminProcedimientoController.php
│   │   └── Controller.php
│   └── Models/
│       ├── Departamento.php
│       ├── Periodo.php
│       ├── Procedimiento.php
│       └── User.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── database.sqlite
├── resources/
│   ├── js/
│   │   ├── admin.jsx
│   │   └── app.jsx
│   └── views/
│       ├── admin.blade.php
│       └── welcome.blade.php
├── routes/
│   └── web.php
│   └── console.php
└── vite.config.js
```

![License](https://img.shields.io/badge/license-MIT-green)
![Laravel](https://img.shields.io/badge/laravel-v13.30.1-red)
![Release Date](https://img.shields.io/badge/release%20date-september-yellow)
