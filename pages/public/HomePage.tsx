import React, { useState, useEffect } from 'react';
import { getProperties } from '../../services/api';
import type { Property } from '../../types';
import PropertyCard from '../../components/PropertyCard';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const HomePage: React.FC = () => {
    const { siteSettings } = useAppContext();
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const allProperties = await getProperties();
                setFeaturedProperties(allProperties.filter(p => p.isFeatured));
            } catch (error) {
                console.error("No se pudieron cargar las propiedades:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <>
            <Header />
            <main>
                {/* Hero Section */}
                <section 
                    className="relative bg-cover bg-center h-[60vh] bg-primary" 
                    style={{ backgroundImage: siteSettings?.heroImageUrl ? `url('${siteSettings.heroImageUrl}')` : 'none' }}
                >
                    <div className="absolute inset-0 bg-primary bg-opacity-60"></div>
                    <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
                        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-4">Invierta con Confianza en la Riviera Maya</h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl">Su socio estratégico para inversiones inmobiliarias de alto ROI basadas en datos en Tulum y Playa del Carmen.</p>
                        <div className="w-full max-w-2xl">
                            <div className="relative">
                                <input type="text" placeholder="Buscar por ubicación, ej: 'Tulum'" className="w-full p-4 rounded-lg text-text-main focus:outline-none focus:ring-4 focus:ring-secondary"/>
                                <button className="absolute right-0 top-0 mt-2 mr-2 bg-secondary text-primary font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300">
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Properties Section */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-6">
                        <h2 className="font-serif text-4xl font-bold text-center text-primary mb-2">Oportunidades de Inversión Destacadas</h2>
                        <p className="text-center text-lg text-text-main mb-12 max-w-2xl mx-auto">Propiedades seleccionadas con un potencial excepcional de apreciación e ingresos por alquiler.</p>
                        {loading ? (
                            <div className="text-center">Cargando propiedades...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredProperties.map(property => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}
                         <div className="text-center mt-12">
                            <Link to="/properties" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition duration-300 text-lg">
                                Ver Todas las Propiedades
                            </Link>
                        </div>
                    </div>
                </section>
                
                 {/* Why Invest Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="font-serif text-4xl font-bold text-primary mb-12">¿Por Qué Invertir en la Riviera Maya?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="p-6">
                                <div className="text-6xl text-secondary mb-4">📈</div>
                                <h3 className="font-serif text-2xl font-bold text-primary mb-2">Alto ROI y Plusvalía</h3>
                                <p>Uno de los mercados inmobiliarios de más rápido crecimiento en el mundo, que ofrece retornos significativos y un aumento del valor de la propiedad.</p>
                            </div>
                            <div className="p-6">
                                 <div className="text-6xl text-secondary mb-4">🌴</div>
                                <h3 className="font-serif text-2xl font-bold text-primary mb-2">Turismo de Clase Mundial</h3>
                                <p>Millones de turistas cada año crean una demanda robusta de alquileres vacacionales, asegurando altas tasas de ocupación.</p>
                            </div>
                            <div className="p-6">
                                <div className="text-6xl text-secondary mb-4">🏦</div>
                                <h3 className="font-serif text-2xl font-bold text-primary mb-2">Clima de Inversión Favorable</h3>
                                <p>Una economía estable y el apoyo gubernamental a la inversión extranjera proporcionan un entorno seguro para su capital.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
};

export default HomePage;