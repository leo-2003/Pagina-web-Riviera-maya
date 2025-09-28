import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { CALENDLY_LINK } from '../../config';

const Header: React.FC = () => {
    const { siteSettings } = useAppContext();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-3">
                    {siteSettings?.logoUrl && (
                        <img src={siteSettings.logoUrl} alt="Logo de Riviera Maya Luxe Investors" className="h-12 w-12 object-contain" />
                    )}
                    <span className="font-serif text-2xl font-bold text-primary hidden sm:block">
                        Riviera Maya Luxe Investors
                    </span>
                </Link>
                <nav className="flex items-center space-x-4 md:space-x-6">
                    <Link to="/properties" className="text-text-main hover:text-primary transition duration-300 font-medium">Propiedades</Link>
                    <Link to="/about" className="text-text-main hover:text-primary transition duration-300 font-medium">Nosotros</Link>
                    <Link to="/admin/dashboard" className="text-text-main hover:text-primary transition duration-300 font-medium text-sm">
                        Portal Admin
                    </Link>
                    <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="bg-secondary text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 text-sm">
                        Agendar Reunión
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
