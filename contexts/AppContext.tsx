import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { SiteSettings } from '../types';
import { getSiteSettings as fetchSiteSettings, updateSiteSettings as apiUpdateSettings } from '../services/api';
import { supabase } from '../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface AppContextType {
  siteSettings: SiteSettings | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  newLeadCount: number;
  login: (email: string, pass: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  clearNewLeadNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newLeadCount, setNewLeadCount] = useState(0);

  const loadInitialData = useCallback(async () => {
    try {
      const settings = await fetchSiteSettings();
      setSiteSettings(settings);
    } catch (error) {
      console.error("Falló la carga de la configuración del sitio", error);
    }
  }, []);
  
  const fetchInitialNewLeadCount = async () => {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');
    
    if (error) {
      console.error('Error fetching new lead count:', error);
    } else if (count !== null) {
      setNewLeadCount(count);
    }
  };

  useEffect(() => {
    const fetchSessionAndData = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await fetchInitialNewLeadCount();
      }
      await loadInitialData();
      setIsLoading(false);
    };

    fetchSessionAndData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN') {
        fetchInitialNewLeadCount();
      }
      if (_event === 'SIGNED_OUT') {
        setNewLeadCount(0);
      }
    });

    const leadChannel = supabase
      .channel('public:leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          if (payload.new.status === 'new') {
            setNewLeadCount(prevCount => prevCount + 1);
          }
        }
      )
      .subscribe();


    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(leadChannel);
    };
  }, [loadInitialData]);
  
  const login = async (email: string, password: string): Promise<{ success: boolean; error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error de inicio de sesión:', error.message);
      return { success: false, error: 'Credenciales inválidas. Por favor, inténtelo de nuevo.' };
    }
    return { success: true, error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateSiteSettings = async (settings: SiteSettings) => {
    try {
        const updatedSettings = await apiUpdateSettings(settings);
        setSiteSettings(updatedSettings);
    } catch (error) {
        console.error("Falló la actualización de la configuración del sitio", error);
        throw error;
    }
  };

  const clearNewLeadNotifications = () => {
    setNewLeadCount(0);
  };

  const value = {
    siteSettings,
    session,
    isAuthenticated: !!session, // True si hay una sesión, false si no
    isLoading,
    newLeadCount,
    login,
    logout,
    updateSiteSettings,
    clearNewLeadNotifications
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  return context;
};
