import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const AdminLayout: React.FC = () => {
    const { logout, siteSettings, newLeadCount } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center justify-between w-full text-left px-4 py-3 rounded-md transition-colors duration-200 ${
            isActive ? 'bg-secondary text-primary font-bold' : 'text-white hover:bg-primary-dark'
        }`;

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex flex-col p-4 shadow-lg">
                <div className="flex items-center space-x-3 p-4 border-b border-gray-500">
                    {siteSettings?.logoUrl && <img src={siteSettings.logoUrl} alt="Logo" className="h-10 w-10 bg-white rounded-full p-1" />}
                    <span className="font-serif text-xl font-bold">Portal Admin</span>
                </div>
                <nav className="flex-grow mt-6 space-y-2">
                    <NavLink to="dashboard" className={navLinkClasses}><span>Dashboard</span></NavLink>
                    <NavLink to="properties" className={navLinkClasses}><span>Propiedades</span></NavLink>
                    <NavLink to="leads" className={navLinkClasses}>
                        <span>Leads</span>
                        {newLeadCount > 0 && (
                            <span className="bg-secondary text-primary font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {newLeadCount}
                            </span>
                        )}
                    </NavLink>
                    <NavLink to="settings" className={navLinkClasses}><span>Ajustes del Sitio</span></NavLink>
                </nav>
                <div className="mt-auto">
                    <a href="/#/" target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 rounded-md text-white hover:bg-gray-700 mb-2">
                        Ver Sitio Público
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-secondary text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
