


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../../services/api';
import type { Property } from '../../types';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import RoiCalculator from '../../components/RoiCalculator';
import MortgageCalculator from '../../components/MortgageCalculator';
import { CALENDLY_LINK, WHATSAPP_LINK } from '../../config';

const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string>('');

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const prop = await getPropertyById(id);
                if (prop) {
                    setProperty(prop);
                    setMainImage(prop.images[0]);
                } else {
                    setProperty(null);
                }
            } catch (error) {
                console.error("No se pudo cargar la propiedad:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

    if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    if (!property) return <div className="flex justify-center items-center h-screen">Propiedad no encontrada.</div>;

    return (
        <>
            <Header />
            <main className="bg-background">
                <div className="container mx-auto px-6 py-12">
                    {/* Title and Price */}
                    <div className="mb-8">
                        <h1 className="font-serif text-5xl font-bold text-primary">{property.title}</h1>
                        <p className="text-3xl text-text-main mt-2">{formatPrice(property.price)}</p>
                        <p className="text-lg text-gray-600">{property.location}</p>
                    </div>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        <div className="md:col-span-2">
                            <img src={mainImage} alt={property.title} className="w-full h-[500px] object-cover rounded-lg shadow-lg" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            {property.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${property.title} miniatura ${index + 1}`}
                                    className={`w-full h-auto object-cover rounded-lg cursor-pointer transition-opacity duration-300 ${mainImage === img ? 'opacity-100 ring-4 ring-secondary' : 'opacity-70 hover:opacity-100'}`}
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
                            <h2 className="font-serif text-3xl font-bold text-primary border-b border-secondary pb-3 mb-6">Descripción de la Propiedad</h2>
                            <p className="text-gray-700 leading-relaxed mb-8">{property.description}</p>
                            
                            <h3 className="font-serif text-2xl font-bold text-primary mb-4">Características Principales</h3>
                             <ul className="grid grid-cols-2 gap-4 list-disc list-inside text-gray-700">
                                {property.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:col-span-1">
                             <div className="sticky top-24 space-y-8">
                                 <div className="bg-white p-6 rounded-lg shadow-lg">
                                     <h3 className="font-serif text-2xl font-bold text-primary mb-4">Datos Rápidos</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between border-b pb-2"><span>Recámaras:</span><span className="font-semibold">{property.bedrooms}</span></div>
                                        <div className="flex justify-between border-b pb-2"><span>Baños:</span><span className="font-semibold">{property.bathrooms}</span></div>
                                        <div className="flex justify-between border-b pb-2"><span>Área:</span><span className="font-semibold">{property.area} m²</span></div>
                                        <div className="flex justify-between border-b pb-2"><span>Tipo:</span><span className="font-semibold capitalize">{property.type}</span></div>
                                        <div className="flex justify-between"><span>Estatus:</span><span className="font-semibold capitalize">{property.status === 'for-sale' ? 'En Venta' : 'Vendida'}</span></div>
                                    </div>
                                    <div className="mt-6 space-y-3">
                                        <a 
                                            href={WHATSAPP_LINK} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="w-full block text-center bg-secondary text-primary font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
                                        >
                                            Solicitar Más Información
                                        </a>
                                        <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Agendar Visita
                                        </a>
                                    </div>
                                 </div>
                                 <MortgageCalculator propertyPrice={property.price} />
                             </div>
                        </div>
                    </div>

                    {/* ROI Calculator */}
                    <RoiCalculator propertyPrice={property.price} />

                </div>
            </main>
            <Footer />
        </>
    );
};

export default PropertyDetailPage;
