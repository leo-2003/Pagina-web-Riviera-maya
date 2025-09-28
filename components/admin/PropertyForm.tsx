import React, { useState, useEffect, FC, FormEvent } from 'react';
import type { Property } from '../../types';

interface PropertyFormProps {
  property?: Property | null;
  onSave: (property: Omit<Property, 'id'>, newImages: File[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const emptyProperty: Omit<Property, 'id'> = {
  title: '',
  price: 0,
  location: 'Tulum',
  bedrooms: 1,
  bathrooms: 1,
  area: 50,
  type: 'condo',
  status: 'for-sale',
  description: '',
  features: [],
  images: [],
  isFeatured: false,
};

const PropertyForm: FC<PropertyFormProps> = ({ property, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<Omit<Property, 'id'>>(emptyProperty);
  const [featureInput, setFeatureInput] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (property) {
      setFormData({ ...property });
      setImagePreviews(property.images || []);
      setImageFiles([]);
    } else {
      setFormData(emptyProperty);
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [property]);

  // FIX: Added a useEffect hook to revoke blob URLs on component unmount 
  // or when previews change, preventing memory leaks.
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === 'number') {
        finalValue = value ? parseFloat(value) : 0;
    }
    if (name === 'isFeatured') {
        finalValue = (e.target as HTMLInputElement).checked;
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleFeatureAdd = () => {
    if (featureInput && !formData.features.includes(featureInput)) {
      setFormData(prev => ({ ...prev, features: [...prev.features, featureInput] }));
      setFeatureInput('');
    }
  };

  const handleFeatureRemove = (featureToRemove: string) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== featureToRemove) }));
  };
  
  // FIX: Replaced original implementation to fix a TypeScript error where `file` was inferred as `unknown`.
  // This version is more robust by manually iterating over the FileList, ensuring type safety.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const newFiles: File[] = [];
          const newPreviews: string[] = [];

          // Manually iterate over FileList to create properly typed arrays.
          for (let i = 0; i < e.target.files.length; i++) {
              const file = e.target.files.item(i);
              if (file) {
                  newFiles.push(file);
                  newPreviews.push(URL.createObjectURL(file));
              }
          }
          
          setImageFiles(newFiles);
          setImagePreviews(newPreviews);
      }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData, imageFiles);
  };

  const inputStyle = "block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary";

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl font-bold text-primary mb-6">{property ? 'Editar Propiedad' : 'Añadir Nueva Propiedad'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna Izquierda */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className={`mt-1 ${inputStyle}`}/>
            
            <label className="block text-sm font-medium text-gray-700 mt-4">Precio (USD)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className={`mt-1 ${inputStyle}`}/>

            <label className="block text-sm font-medium text-gray-700 mt-4">Ubicación</label>
            <select name="location" value={formData.location} onChange={handleChange} className={`mt-1 ${inputStyle}`}>
              <option value="Tulum">Tulum</option>
              <option value="Playa del Carmen">Playa del Carmen</option>
            </select>

             <div className="flex items-center mt-4">
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded" />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">¿Es una propiedad destacada?</label>
            </div>
          </div>
          {/* Columna Derecha */}
          <div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Recámaras</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={`mt-1 ${inputStyle}`}/>
              </div>
              <div>
                <label className="block text-sm font-medium">Baños</label>
                <input type="number" name="bathrooms" step="0.5" value={formData.bathrooms} onChange={handleChange} className={`mt-1 ${inputStyle}`}/>
              </div>
              <div>
                <label className="block text-sm font-medium">Área (m²)</label>
                <input type="number" name="area" value={formData.area} onChange={handleChange} className={`mt-1 ${inputStyle}`}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                 <div>
                    <label className="block text-sm font-medium">Tipo</label>
                    <select name="type" value={formData.type} onChange={handleChange} className={`mt-1 ${inputStyle}`}>
                      <option value="condo">Condo</option>
                      <option value="house">Casa</option>
                      <option value="land">Terreno</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Estatus</label>
                    <select name="status" value={formData.status} onChange={handleChange} className={`mt-1 ${inputStyle}`}>
                      <option value="for-sale">En Venta</option>
                      <option value="sold">Vendida</option>
                    </select>
                  </div>
            </div>
          </div>
        </div>
        
        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className={`mt-1 ${inputStyle}`}></textarea>
        </div>
        
        {/* Características */}
        <div>
            <label className="block text-sm font-medium">Características</label>
            <div className="flex mt-1">
                <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className={`${inputStyle} flex-grow`} placeholder="Ej: Piscina Privada"/>
                <button type="button" onClick={handleFeatureAdd} className="ml-2 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300">+</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map(f => (
                    <span key={f} className="bg-secondary text-primary text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                        {f}
                        <button type="button" onClick={() => handleFeatureRemove(f)} className="ml-2 text-primary hover:text-red-700">&times;</button>
                    </span>
                ))}
            </div>
        </div>

        {/* Imágenes */}
        <div>
            <label className="block text-sm font-medium">Imágenes</label>
            <input type="file" multiple onChange={handleImageChange} accept="image/png, image/jpeg" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-primary hover:file:bg-opacity-90"/>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt="Vista previa" className="w-full h-24 object-cover rounded-md"/>
                ))}
            </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Cancelar</button>
          <button type="submit" disabled={isLoading} className="bg-secondary text-primary font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-opacity-50">
            {isLoading ? 'Guardando...' : 'Guardar Propiedad'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;