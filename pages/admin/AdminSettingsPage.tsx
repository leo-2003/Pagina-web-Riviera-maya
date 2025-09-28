import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { SiteSettings } from '../../types';

const ImageUploadField: React.FC<{
    label: string;
    preview: string | null;
    name: keyof SiteSettings;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, name: keyof SiteSettings) => void;
}> = ({ label, preview, name, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-2 flex items-center space-x-6">
            {preview ? (
                <img src={preview} alt={`Vista previa de ${label}`} className="h-20 w-32 bg-gray-100 rounded-md object-cover" />
            ) : (
                <div className="h-20 w-32 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">Sin imagen</div>
            )}
            <input type="file" id={`${name}-upload`} className="hidden" onChange={(e) => onChange(e, name as keyof SiteSettings)} accept="image/png, image/jpeg, image/webp"/>
            <label htmlFor={`${name}-upload`} className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cambiar Imagen
            </label>
        </div>
    </div>
);


const AdminSettingsPage: React.FC = () => {
    const { siteSettings, updateSiteSettings, isLoading } = useAppContext();
    const [formData, setFormData] = useState<SiteSettings | null>(siteSettings);
    const [statusMessage, setStatusMessage] = useState('');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [aboutPreview, setAboutPreview] = useState<string | null>(null);

    useEffect(() => {
        setFormData(siteSettings);
        if(siteSettings?.logoUrl) setLogoPreview(siteSettings.logoUrl);
        if(siteSettings?.heroImageUrl) setHeroPreview(siteSettings.heroImageUrl);
        if(siteSettings?.aboutImageUrl) setAboutPreview(siteSettings.aboutImageUrl);
    }, [siteSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: keyof SiteSettings) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (imageKey === 'logoUrl') setLogoPreview(base64String);
                if (imageKey === 'heroImageUrl') setHeroPreview(base64String);
                if (imageKey === 'aboutImageUrl') setAboutPreview(base64String);
                setFormData(prev => prev ? { ...prev, [imageKey]: base64String } : null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        setStatusMessage('Guardando...');
        try {
            await updateSiteSettings(formData);
            setStatusMessage('¡Ajustes actualizados con éxito!');
        } catch (error) {
            setStatusMessage('Error al actualizar los ajustes.');
        } finally {
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    if (isLoading || !formData) {
        return <div>Cargando ajustes...</div>;
    }

    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-8">Identidad y Ajustes del Sitio</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Logo de la Empresa</label>
                            <div className="mt-2 flex items-center space-x-6">
                                {logoPreview && <img src={logoPreview} alt="Vista previa del logo" className="h-20 w-20 bg-gray-100 rounded-full object-contain p-1" />}
                                <input type="file" id="logoUrl-upload" className="hidden" onChange={(e) => handleImageChange(e, 'logoUrl')} accept="image/png, image/jpeg, image/svg+xml"/>
                                <label htmlFor="logoUrl-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Cambiar Logo
                                </label>
                            </div>
                        </div>
                        
                        <ImageUploadField label="Imagen de la Página de Inicio (Hero)" name="heroImageUrl" preview={heroPreview} onChange={handleImageChange} />
                        <ImageUploadField label="Imagen de la Página 'Nosotros'" name="aboutImageUrl" preview={aboutPreview} onChange={handleImageChange} />


                        {/* About Us Text */}
                        <div>
                            <label htmlFor="aboutText" className="block text-sm font-medium text-gray-700">Texto de "Nosotros"</label>
                            <textarea
                                id="aboutText"
                                name="aboutText"
                                rows={8}
                                value={formData.aboutText}
                                onChange={handleInputChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            ></textarea>
                        </div>
                        
                        {/* Contact Info */}
                        <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Email de Contacto</label>
                            <input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleInputChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                         <div>
                            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
                            <input
                                type="text"
                                id="contactPhone"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-8 flex items-center space-x-4">
                        <button type="submit" className="bg-secondary text-primary font-bold py-2 px-6 rounded-lg hover:bg-opacity-90">
                            Guardar Cambios
                        </button>
                        {statusMessage && <p className={`text-sm ${statusMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{statusMessage}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettingsPage;