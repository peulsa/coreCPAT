import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminDashboard from './components/AdminDashboard';

const container = document.getElementById('admin-app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <AdminDashboard />
        </React.StrictMode>
    );
}