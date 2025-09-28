import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAppContext } from '../../contexts/AppContext';

const AboutPage: React.FC = () => {
    const { siteSettings, isLoading } = useAppContext();

    return (
        <>
            <Header />
            <main className="bg-white">
                <div className="container mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                             {isLoading ? (
                                <div className="bg-gray-200 rounded-lg shadow-2xl w-full h-[600px] animate-pulse"></div>
                            ) : (
                                <img 
                                    src={siteSettings?.aboutImageUrl || "https://images.unsplash.com/photo-1581922071262-7105a1098e42?q=80&w=800&auto=format&fit=crop"} 
                                    alt="Nuestra misión en la Riviera Maya" 
                                    className="rounded-lg shadow-2xl object-cover w-full h-[600px] md:h-full"
                                />
                            )}
                        </div>
                        <div className="text-left">
                            <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-6">Tu Socio para Inversiones Inteligentes</h1>
                            <div className="prose lg:prose-xl text-text-main max-w-none">
                                {isLoading ? (
                                    <>
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                    </>
                                ) : (
                                    <p className="whitespace-pre-line">{siteSettings?.aboutText}</p>
                                )}
                            </div>
                            <div className="mt-8 border-t-2 border-secondary pt-6">
                                <h3 className="font-serif text-2xl font-bold text-primary mb-3">Nuestra Misión</h3>
                                <p>Empoderar a los inversionistas con análisis basados en datos y experiencia inigualable, permitiéndoles construir patrimonio a través de adquisiciones estratégicas de bienes raíces en las ubicaciones más deseadas del mundo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default AboutPage;