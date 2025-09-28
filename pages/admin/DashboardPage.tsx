import React, { useEffect, useState } from 'react';
import { getProperties, getLeads } from '../../services/api';
import type { Property, Lead } from '../../types';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({ properties: 0, leads: 0, newLeads: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [propertiesData, leadsData] = await Promise.all([getProperties(), getLeads()]);
                setStats({
                    properties: propertiesData.length,
                    leads: leadsData.length,
                    newLeads: leadsData.filter(l => l.status === 'new').length,
                });
            } catch (error) {
                console.error("No se pudieron cargar los datos del dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Cargando dashboard...</div>;

    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-500">Propiedades Totales</h3>
                    <p className="text-5xl font-bold text-primary mt-2">{stats.properties}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-500">Leads Totales</h3>
                    <p className="text-5xl font-bold text-primary mt-2">{stats.leads}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary">
                    <h3 className="text-lg font-semibold text-gray-500">Nuevos Leads</h3>
                    <p className="text-5xl font-bold text-secondary mt-2">{stats.newLeads}</p>
                </div>
            </div>

             <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-serif text-2xl font-bold text-primary mb-4">¡Bienvenido, Admin!</h2>
                <p>Este es su centro de mando. Desde aquí, puede gestionar sus listados de propiedades, seguir los leads entrantes y personalizar la identidad de su sitio web público. Utilice la navegación de la izquierda para comenzar.</p>
            </div>
        </div>
    );
};

export default DashboardPage;