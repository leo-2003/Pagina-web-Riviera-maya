import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const Footer: React.FC = () => {
    const { siteSettings } = useAppContext();

    return (
        <footer className="bg-primary text-white">
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-serif text-2xl font-bold mb-2">Riviera Maya Luxe Investors</h3>
                        <p className="text-sm opacity-80">Tu socio estratégico para inversiones inmobiliarias inteligentes en el Caribe Mexicano.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Contáctanos</h4>
                        <p className="text-sm">{siteSettings?.contactEmail}</p>
                        <p className="text-sm">{siteSettings?.contactPhone}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Enlaces Rápidos</h4>
                        <ul>
                            <li><a href="#/properties" className="hover:underline text-sm">Propiedades</a></li>
                            <li><a href="#/about" className="hover:underline text-sm">Nosotros</a></li>
                            <li><a href="#/admin" className="hover:underline text-sm">Acceso Admin</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-500 pt-4 text-center text-xs opacity-70">
                    <p>&copy; {new Date().getFullYear()} Riviera Maya Luxe Investors. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;