import React, { useState, useEffect, useMemo } from 'react';
import { getProperties } from '../../services/api';
import type { Property } from '../../types';
import PropertyCard from '../../components/PropertyCard';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: 'all',
        type: 'all',
        minPrice: '',
        maxPrice: '',
        bedrooms: 'all',
    });

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const allProperties = await getProperties();
                setProperties(allProperties);
            } catch (error) {
                console.error("No se pudieron cargar las propiedades:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            if (filters.location !== 'all' && p.location.toLowerCase() !== filters.location) return false;
            if (filters.type !== 'all' && p.type !== filters.type) return false;
            if (filters.bedrooms !== 'all' && p.bedrooms < parseInt(filters.bedrooms)) return false;
            if (filters.minPrice && p.price < parseInt(filters.minPrice)) return false;
            if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
            return true;
        });
    }, [properties, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen">
                <div className="container mx-auto px-6 py-12">
                    <h1 className="font-serif text-5xl font-bold text-primary text-center mb-4">Portafolio de Inversión</h1>
                    <p className="text-center text-lg text-text-main mb-10 max-w-3xl mx-auto">Explore nuestra selección curada de propiedades en la Riviera Maya, cada una analizada por su potencial de inversión.</p>
                    
                    {/* Filters */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-10 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                            <select name="location" value={filters.location} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                <option value="all">Todas</option>
                                <option value="tulum">Tulum</option>
                                <option value="playa del carmen">Playa del Carmen</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select name="type" value={filters.type} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                <option value="all">Todos los Tipos</option>
                                <option value="condo">Condo</option>
                                <option value="house">Casa</option>
                                <option value="land">Terreno</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700">Precio Mín.</label>
                            <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Cualquiera" className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700">Precio Máx.</label>
                            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Cualquiera" className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                        </div>
                        <div className="w-full">
                           <button className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300">
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>

                    {/* Property Grid */}
                    {loading ? (
                        <div className="text-center py-20">Cargando...</div>
                    ) : (
                        filteredProperties.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProperties.map(property => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg shadow-md">
                                <h3 className="text-2xl font-semibold text-text-main">No hay propiedades que coincidan con sus criterios.</h3>
                                <p className="text-gray-600 mt-2">Intente ajustar sus filtros o contáctenos para asistencia personalizada.</p>
                            </div>
                        )
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default PropertiesPage;