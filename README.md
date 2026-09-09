# 🏛️ CoreCPAT - Catálogo de Procedimientos Administrativos y Tramitaciones

> Sistema integral de gestión y control institucional desarrollado para optimizar los procesos administrativos, la trazabilidad de trámites, la gestión de nóminas, la carga masiva de transacciones y la administración de periodos operativos.

---

## 🚧 Estado del Proyecto
<p align="left">
<img src="https://img.shields.io/badge/STATUS-EN%20DESARROLLO-green">
</p>

Se encuentra implementado el módulo central de administración, el control de períodos con estados dinámicos, la persistencia histórica, el módulo frontend de Nómina de Procedimientos y módulo de Transacciones con soporte para descarga y carga de planillas institucionales.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Funcionalidades del Proyecto](#-funcionalidades-del-proyecto)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración y Puesta en Marcha (Entorno Local)](#️-configuración-y-puesta-en-marcha-entorno-local)

---

## 📝 Descripción del Proyecto
**CoreCPAT** es una plataforma orientada a la digitalización y el ordenamiento de flujos de trabajo públicos. Permite centralizar la administración de periodos operativos, la gestión de nóminas de procedimientos (con clasificación en función común, específica y otras tramitaciones), el control de transacciones mediante planillas Excel y el cumplimiento de los lineamientos de transformación digital bajo una interfaz rápida, intuitiva y robusta.

---

## 🚀 Funcionalidades del Proyecto

- `Gestión de Períodos`: Creación, edición y control de períodos operativos con autocompletado inteligente de rangos y títulos estandarizados.
- `Cálculo de Estados Automático`: Determinación en tiempo real del estado del período (`Próximo`, `En proceso`, `Finalizado`) basado en la fecha y hora del sistema mediante *Carbon*.
- `Nómina de Procedimientos`: Módulo interactivo conectado a la base de datos para registrar, buscar y clasificar procedimientos administrativos según los criterios del CPAT.
- `Gestión y Carga de Transacciones`: Soporte para descarga de plantillas base de transacciones institucionales y zona interactiva de arrastre (*Drag & Drop*) para la subida de planillas operativas.
- `Historial y Auditoría`: Preservación de registros históricos de la institución y control de estados mediante la persistencia en base de datos.
- `Panel Administrativo Institucional`: Interfaz moderna y responsiva desarrollada con React, Vite y Tailwind CSS, adaptada a los lineamientos de la administración pública.
- `Sincronización Temporal Local`: Configuración estricta de la zona horaria del servidor ajustada a `America/Santiago`.

---

## 🛠️ Tecnologías Utilizadas
Este proyecto combina un backend sólido con un frontend ágil y modular:
* **Backend:** PHP, [Laravel 13](https://laravel.com/), Eloquent ORM, SQLite.
* **Frontend:** React, Vite, Tailwind CSS.

---

## 📂 Estructura del Proyecto
```text
coreCPAT/
├── app/
│   ├── Http/Controllers/
│   │   ├── AdminPeriodoController.php
│   │   ├── AdminProcedimientoController.php
│   │   └── Controller.php
│   └── Models/
│       ├── Departamento.php
│       ├── Periodo.php
│       ├── PeriodoHistorico.php
│       ├── Procedimiento.php
│       └── User.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── database.sqlite
├── public/
│   └── archivos/
│       └── transacciones.xlsx
├── resources/
│   ├── js/
│   │   ├── components/          # Elementos globales (Header, Sidebar)
│   │   ├── Pages/               # Vistas principales del sistema
│   │   │   ├── nomina/          # Módulo de nómina y componentes
│   │   │   ├── periodos/        # Gestión de periodos
│   │   │   ├── transacciones/   # Módulo de transacciones
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── InicioView.jsx
│   │   ├── admin.jsx
│   │   └── app.jsx
│   └── views/
│       ├── admin.blade.php
│       └── welcome.blade.php
├── routes/
│   ├── web.php
│   └── console.php
└── vite.config.js

```
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
   npm run dev
   php artisan serve
