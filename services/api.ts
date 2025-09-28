import { supabase } from '../lib/supabaseClient';
import type { Property, Lead, SiteSettings } from '../types';

// --- Helper Functions ---

const base64ToBlob = (base64: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
};

const uploadFile = async (file: File | Blob, bucket: string, fileName: string): Promise<string> => {
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
    });
    if (error) {
        console.error(`Error uploading file ${fileName} to bucket ${bucket}:`, error);
        throw new Error(`Error al subir archivo: ${error.message}`);
    }
    
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
};

// Map Frontend (camelCase) to DB (snake_case)
const mapPropertyToDb = (prop: Partial<Property>) => {
    const { isFeatured, ...rest } = prop;
    return {
        ...rest,
        is_featured: isFeatured,
    };
};


// --- Properties API ---

export const getProperties = async (): Promise<Property[]> => {
    // Supabase client automatically maps snake_case from DB to camelCase in JS
    const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching properties:", error);
        throw new Error(`No se pudieron cargar las propiedades: ${error.message}`);
    }
    return data as Property[];
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
    if (error) {
        if (error.code === 'PGRST116') return undefined;
        console.error(`Error fetching property by id ${id}:`, error);
        throw new Error(`No se pudo cargar la propiedad: ${error.message}`);
    }
    return data as Property;
};

export const updateProperty = async (prop: Property, newImages: File[] = []): Promise<Property> => {
    try {
        let uploadedImageUrls = prop.images || [];

        if (newImages.length > 0) {
            const uploadPromises = newImages.map(file => {
                const fileName = `prop_${prop.id}_${Date.now()}_${file.name}`;
                return uploadFile(file, 'property-images', fileName);
            });
            uploadedImageUrls = [...prop.images, ...(await Promise.all(uploadPromises))];
        }
        
        const propertyToUpdate = { ...prop, images: uploadedImageUrls };
        const dbSafeProperty = mapPropertyToDb(propertyToUpdate);
        delete (dbSafeProperty as any).id;


        const { data, error } = await supabase.from('properties').update(dbSafeProperty).eq('id', prop.id).select().single();
        if (error) throw error;
        return data as Property;
    } catch (error) {
        console.error("Error updating property:", error);
        throw new Error(`No se pudo actualizar la propiedad: ${(error as Error).message}`);
    }
};

export const createProperty = async (prop: Omit<Property, 'id'>, newImages: File[] = []): Promise<Property> => {
    try {
        const dbSafeProperty = mapPropertyToDb(prop);

        const { data: newPropData, error: createError } = await supabase.from('properties')
            .insert({ ...dbSafeProperty, images: [] })
            .select()
            .single();
        if (createError) throw createError;

        const uploadPromises = newImages.map(file => {
            const fileName = `prop_${newPropData.id}_${Date.now()}_${file.name}`;
            return uploadFile(file, 'property-images', fileName);
        });
        const uploadedImageUrls = await Promise.all(uploadPromises);

        const { data: finalProp, error: updateError } = await supabase.from('properties')
            .update({ images: uploadedImageUrls })
            .eq('id', newPropData.id)
            .select()
            .single();
        if (updateError) throw updateError;
        
        return finalProp as Property;
    } catch (error) {
        console.error("Error creating property:", error);
        throw new Error(`No se pudo crear la propiedad: ${(error as Error).message}`);
    }
};

export const deleteProperty = async (id: string): Promise<{ success: boolean }> => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
        console.error(`Error deleting property ${id}:`, error);
        throw new Error(`No se pudo eliminar la propiedad: ${error.message}`);
    }
    return { success: true };
};

// --- Leads API ---

export const getLeads = async (): Promise<Lead[]> => {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching leads:", error);
        throw new Error(`No se pudieron cargar los leads: ${error.message}`);
    }
    return data as Lead[];
};

// --- Site Settings API ---

export const getSiteSettings = async (): Promise<SiteSettings> => {
    const { data, error } = await supabase.from('site_settings').select('logo_url, about_text, contact_email, contact_phone, hero_image_url, about_image_url').eq('id', 1).single();
    if (error) {
        console.error("Error fetching site settings:", error);
        throw new Error(`Falló la carga de la configuración del sitio: ${error.message}`);
    }
    return {
        logoUrl: data.logo_url,
        aboutText: data.about_text,
        contactEmail: data.contact_email,
        contactPhone: data.contact_phone,
        heroImageUrl: data.hero_image_url,
        aboutImageUrl: data.about_image_url,
    };
};

export const updateSiteSettings = async (settings: SiteSettings): Promise<SiteSettings> => {
    try {
        let finalSettings = { ...settings };
        
        const handleImageUpload = async (imageUrl: string | undefined, imageKey: string): Promise<string | undefined> => {
            if (imageUrl && imageUrl.startsWith('data:image')) {
                const contentType = imageUrl.match(/data:(.*);/)?.[1] || 'image/jpeg';
                const fileExtension = contentType.split('/')[1].split('+')[0];
                const imageBlob = base64ToBlob(imageUrl, contentType);
                const fileName = `${imageKey}_${Date.now()}.${fileExtension}`;
                return await uploadFile(imageBlob, 'site-assets', fileName);
            }
            return imageUrl;
        };

        finalSettings.logoUrl = (await handleImageUpload(settings.logoUrl, 'logo'))!;
        finalSettings.heroImageUrl = await handleImageUpload(settings.heroImageUrl, 'hero');
        finalSettings.aboutImageUrl = await handleImageUpload(settings.aboutImageUrl, 'about');

        const { data, error } = await supabase
            .from('site_settings')
            .update({
                logo_url: finalSettings.logoUrl,
                about_text: finalSettings.aboutText,
                contact_email: finalSettings.contactEmail,
                contact_phone: finalSettings.contactPhone,
                hero_image_url: finalSettings.heroImageUrl,
                about_image_url: finalSettings.aboutImageUrl,
            })
            .eq('id', 1)
            .select('logo_url, about_text, contact_email, contact_phone, hero_image_url, about_image_url')
            .single();
            
        if (error) throw error;
        
        return {
            logoUrl: data.logo_url,
            aboutText: data.about_text,
            contactEmail: data.contact_email,
            contactPhone: data.contact_phone,
            heroImageUrl: data.hero_image_url,
            aboutImageUrl: data.about_image_url,
        };
    } catch (error) {
        console.error("Error updating site settings:", error);
        throw new Error(`No se pudo actualizar la configuración: ${(error as Error).message}`);
    }
};