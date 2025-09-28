import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, siteSettings } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { success, error: loginError } = await login(email, password);
        if (success) {
            navigate('/admin/dashboard');
        } else {
            setError(loginError || 'Ocurrió un error inesperado.');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
                <div className="text-center">
                    {siteSettings?.logoUrl && <img src={siteSettings.logoUrl} alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />}
                    <h2 className="font-serif text-4xl font-bold text-primary">Acceso al Portal Admin</h2>
                    <p className="mt-2 text-gray-600">Riviera Maya Luxe Investors</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                placeholder="Contraseña"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-opacity-50"
                        >
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Volver al sitio principal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;