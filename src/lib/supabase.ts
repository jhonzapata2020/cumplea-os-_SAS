import { createClient } from '@supabase/supabase-js';
import { Event, RSVPFormData, RSVPResult } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback por defecto para los XV años de María cuando Supabase aún no esté vinculado
export const DEFAULT_MARIA_EVENT: Event = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'maria',
  title: 'Mis XV años',
  celebrant_name: 'María José',
  event_date: '2026-10-03T19:30:00-05:00',
  location_name: 'Cholas',
  location_details: 'Segundo piso',
  google_maps_url: 'https://maps.google.com/?q=Cholas',
  created_at: new Date().toISOString(),
};

// Validar si las credenciales de Supabase están correctamente configuradas
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
 * Obtiene los detalles de un evento mediante su slug único
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!supabase) {
    if (slug === 'maria') return DEFAULT_MARIA_EVENT;
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      if (slug === 'maria') return DEFAULT_MARIA_EVENT;
      return null;
    }

    return data as Event;
  } catch (err) {
    console.error('Error obteniendo el evento desde Supabase:', err);
    if (slug === 'maria') return DEFAULT_MARIA_EVENT;
    return null;
  }
}

/**
 * Normaliza un número de WhatsApp para consistente almacenamiento y comparación
 */
function normalizeWhatsApp(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Registra o actualiza la asistencia de un invitado (RSVP)
 * Utiliza event_id + whatsapp como mecanismo de identificación para evitar duplicados
 */
export async function submitRSVP(
  eventId: string,
  formData: RSVPFormData
): Promise<RSVPResult> {
  const cleanPhone = normalizeWhatsApp(formData.whatsapp);

  if (!cleanPhone || cleanPhone.length < 7) {
    return {
      success: false,
      message: 'Por favor ingresa un número de WhatsApp válido (mínimo 7 dígitos).',
    };
  }

  // Si Supabase no está configurado, simulamos el registro correctamente
  if (!supabase) {
    console.warn('Supabase no está configurado. Simulando guardado de RSVP en memoria.');
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      message: '¡Gracias por confirmar tu asistencia! (Modo demostración)',
      isUpdate: false,
    };
  }

  try {
    // 1. Buscar si ya existe un invitado para este evento con este WhatsApp
    const { data: existingGuest, error: findError } = await supabase
      .from('guests')
      .select('id')
      .eq('event_id', eventId)
      .eq('whatsapp', cleanPhone)
      .maybeSingle();

    if (findError) {
      console.error('Error al buscar invitado existente:', findError);
      throw new Error('Error de conexión al verificar invitado.');
    }

    let guestId: string;
    let isUpdate = false;

    if (existingGuest) {
      // Invitado existente: actualizar nombre y timestamp
      guestId = existingGuest.id;
      isUpdate = true;

      const { error: updateGuestError } = await supabase
        .from('guests')
        .update({
          full_name: formData.fullName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', guestId);

      if (updateGuestError) {
        console.error('Error actualizando datos de invitado:', updateGuestError);
        throw new Error('No se pudieron actualizar los datos del invitado.');
      }
    } else {
      // Invitado nuevo: insertar
      const { data: newGuest, error: insertGuestError } = await supabase
        .from('guests')
        .insert({
          event_id: eventId,
          full_name: formData.fullName.trim(),
          whatsapp: cleanPhone,
        })
        .select('id')
        .single();

      if (insertGuestError || !newGuest) {
        console.error('Error registrando nuevo invitado:', insertGuestError);
        throw new Error('No se pudo guardar la información del invitado.');
      }

      guestId = newGuest.id;
    }

    // 2. Registrar o actualizar RSVP
    const { data: existingRSVP } = await supabase
      .from('rsvps')
      .select('id')
      .eq('guest_id', guestId)
      .maybeSingle();

    if (existingRSVP) {
      // Actualizar respuesta de RSVP
      const { error: updateRSVPError } = await supabase
        .from('rsvps')
        .update({
          attending: formData.attending,
          guest_count: formData.attending ? formData.guestCount : 0,
          message: formData.message ? formData.message.trim() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRSVP.id);

      if (updateRSVPError) {
        console.error('Error actualizando RSVP:', updateRSVPError);
        throw new Error('No se pudo actualizar tu confirmación.');
      }
    } else {
      // Insertar nueva RSVP
      const { error: insertRSVPError } = await supabase
        .from('rsvps')
        .insert({
          guest_id: guestId,
          attending: formData.attending,
          guest_count: formData.attending ? formData.guestCount : 0,
          message: formData.message ? formData.message.trim() : null,
        });

      if (insertRSVPError) {
        console.error('Error guardando RSVP:', insertRSVPError);
        throw new Error('No se pudo registrar la confirmación.');
      }
    }

    return {
      success: true,
      message: isUpdate
        ? '¡Tu respuesta ha sido actualizada exitosamente!'
        : '¡Gracias por confirmar tu asistencia!',
      isUpdate,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
    return {
      success: false,
      message: errorMsg,
    };
  }
}
