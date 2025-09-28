import React, { useEffect, useState } from 'react';
import { getProperties, deleteProperty, createProperty, updateProperty } from '../../services/api';
import type { Property } from '../../types';
import PropertyForm from '../../components/admin/PropertyForm';

const AdminPropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const data = await getProperties();
            setProperties(data);
        } catch (error) {
            console.error("No se pudieron cargar las propiedades:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta propiedad? Esta acción no se puede deshacer.')) {
            try {
                await deleteProperty(id);
                fetchProperties();
            } catch (error) {
                console.error("No se pudo eliminar la propiedad:", error);
                alert("Error al eliminar la propiedad.");
            }
        }
    };

    const handleOpenModal = (prop: Property | null = null) => {
        setSelectedProperty(prop);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
    };

    const handleSaveProperty = async (propData: Omit<Property, 'id'>, newImages: File[]) => {
        setIsSaving(true);
        try {
            if (selectedProperty) {
                // Actualizando propiedad existente
                await updateProperty({ ...selectedProperty, ...propData }, newImages.length > 0 ? newImages : undefined);
            } else {
                // Creando nueva propiedad
                await createProperty(propData, newImages);
            }
            fetchProperties();
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar la propiedad:", error);
            alert("Hubo un error al guardar la propiedad.");
        } finally {
            setIsSaving(false);
        }
    };

    const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-primary">Gestionar Propiedades</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-secondary text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                    Añadir Nueva Propiedad
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                                <th className="px-5 py-3 border-b-2 border-gray-200">Título</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Ubicación</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Precio</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Estatus</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-10">Cargando...</td></tr>
                            ) : (
                                properties.map(prop => (
                                    <tr key={prop.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-5 py-5 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap font-semibold">{prop.title}</p>
                                        </td>
                                        <td className="px-5 py-5 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{prop.location}</p>
                                        </td>
                                        <td className="px-5 py-5 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{formatPrice(prop.price)}</p>
                                        </td>
                                        <td className="px-5 py-5 bg-white text-sm">
                                            <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${prop.status === 'for-sale' ? 'text-green-900' : 'text-red-900'}`}>
                                                <span aria-hidden className={`absolute inset-0 ${prop.status === 'for-sale' ? 'bg-green-200' : 'bg-red-200'} opacity-50 rounded-full`}></span>
                                                <span className="relative">{prop.status === 'for-sale' ? 'En Venta' : 'Vendida'}</span>
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 bg-white text-sm whitespace-nowrap">
                                            <button onClick={() => handleOpenModal(prop)} className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium">Editar</button>
                                            <button onClick={() => handleDelete(prop.id)} className="text-red-600 hover:text-red-900 font-medium">Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
                    <PropertyForm 
                        property={selectedProperty} 
                        onSave={handleSaveProperty}
                        onCancel={handleCloseModal}
                        isLoading={isSaving}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminPropertiesPage;
