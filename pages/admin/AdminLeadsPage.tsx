import React, { useEffect, useState } from 'react';
import { getLeads } from '../../services/api';
import type { Lead } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

const AdminLeadsPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const { clearNewLeadNotifications } = useAppContext();

    useEffect(() => {
        const fetchLeadsAndClearNotifications = async () => {
            clearNewLeadNotifications();
            setLoading(true);
            try {
                const data = await getLeads();
                setLeads(data);
            } catch (error) {
                console.error("No se pudieron cargar los leads:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeadsAndClearNotifications();
    }, [clearNewLeadNotifications]);

    const getStatusInfo = (status: Lead['status']) => {
        switch (status) {
            case 'new': return { color: 'bg-blue-200 text-blue-900', text: 'Nuevo' };
            case 'contacted': return { color: 'bg-yellow-200 text-yellow-900', text: 'Contactado' };
            case 'qualified': return { color: 'bg-green-200 text-green-900', text: 'Cualificado' };
            case 'closed': return { color: 'bg-gray-400 text-gray-900', text: 'Cerrado' };
            default: return { color: 'bg-gray-200 text-gray-900', text: status };
        }
    };
    
    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-8">Gestionar Leads</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                                <th className="px-5 py-3 border-b-2 border-gray-200">Nombre</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Email</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Teléfono</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Estatus</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-10">Cargando leads...</td></tr>
                            ) : (
                                leads.map(lead => {
                                    const statusInfo = getStatusInfo(lead.status);
                                    return (
                                        <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-5 py-5 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap font-semibold">{lead.name}</p>
                                            </td>
                                            <td className="px-5 py-5 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{lead.email}</p>
                                            </td>
                                            <td className="px-5 py-5 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{lead.phone}</p>
                                            </td>
                                            <td className="px-5 py-5 bg-white text-sm">
                                                <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${statusInfo.color}`}>
                                                    <span className="relative capitalize">{statusInfo.text}</span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-5 bg-white text-sm">
                                                <button className="text-indigo-600 hover:text-indigo-900">Ver Detalles</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLeadsPage;
