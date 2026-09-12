import { createClient } from '@supabase/supabase-js';
import { Event, RSVPFormData, RSVPResult } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback predeterminado exclusivamente para desarrollo local o demostración sin BD
export const DEFAULT_MARIA_EVENT: Event = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'maria-jose',
  title: 'Mis XV años',
  celebrant_name: 'María José',
  event_date: '2026-10-03T19:30:00-05:00',
  location_name: 'Cholas',
  location_details: 'Segundo piso',
  google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Cholas+Neiva',
  created_at: new Date().toISOString(),
};

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Obtiene los detalles de un evento mediante su slug único estricto.
 * No realiza búsquedas permisivas ni redirecciones silenciosas.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const cleanSlug = slug?.toLowerCase().trim();
  if (!cleanSlug) return null;

  if (!supabase) {
    // Solo permitir fallback local en desarrollo o slugs válidos conocidos
    if (cleanSlug === 'maria' || cleanSlug === 'maria-jose') {
      return { ...DEFAULT_MARIA_EVENT, slug: cleanSlug };
    }
    return null;
  }

  try {
    // Consulta estricta por slug exacto
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', cleanSlug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`Error al consultar el evento por slug "${cleanSlug}":`, error.message);
    }

    if (!data) {
      // Fallback exclusivo para slugs principales en desarrollo local si no retorna datos
      if (process.env.NODE_ENV === 'development' && (cleanSlug === 'maria' || cleanSlug === 'maria-jose')) {
        return { ...DEFAULT_MARIA_EVENT, slug: cleanSlug };
      }
      return null;
    }

    return data as Event;
  } catch (err) {
    console.error(`Excepción obteniendo evento "${cleanSlug}":`, err);
    if (process.env.NODE_ENV === 'development' && (cleanSlug === 'maria' || cleanSlug === 'maria-jose')) {
      return { ...DEFAULT_MARIA_EVENT, slug: cleanSlug };
    }
    return null;
  }
}

/**
 * Envia el registro de RSVP al servidor seguro /api/rsvp
 */
export async function submitRSVP(
  eventId: string,
  formData: RSVPFormData
): Promise<RSVPResult> {
  try {
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        fullName: formData.fullName,
        whatsapp: formData.whatsapp,
        attending: formData.attending,
        guestCount: formData.guestCount,
        message: formData.message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Ocurrió un error procesando tu confirmación.',
      };
    }

    return {
      success: true,
      message: data.message,
      isUpdate: Boolean(data.isUpdate),
    };
  } catch (err) {
    console.error('Error al conectar con la API de RSVP:', err);
    return {
      success: false,
      message: 'No se pudo conectar con el servidor. Por favor verifica tu conexión a internet.',
    };
  }
}
