import React from 'react';
import type { Property } from '../types';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
            <Link to={`/property/${property.id}`} className="block relative">
                <div className="relative">
                    <img src={property.images[0]} alt={property.title} className="w-full h-56 object-cover" />
                    <div className="absolute top-0 right-0 bg-secondary text-primary font-bold px-3 py-1 m-2 rounded-md text-sm">
                        {property.location}
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-primary mb-2 truncate group-hover:text-secondary transition-colors">
                        {property.title}
                    </h3>
                    <p className="text-3xl font-light text-text-main mb-4">
                        {formatPrice(property.price)}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
                        <span>{property.bedrooms} Rec.</span>
                        <span>{property.bathrooms} Baños</span>
                        <span>{property.area} m²</span>
                    </div>
                </div>
                 {/* Call-to-action Icon */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            </Link>
        </div>
    );
};

export default PropertyCard;