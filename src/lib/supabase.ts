import { createClient } from '@supabase/supabase-js';
import { Event, RSVPFormData, RSVPResult } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback por defecto para los XV años de María José
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
    if (slug === 'maria' || slug === 'maria-jose') return DEFAULT_MARIA_EVENT;
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or(`slug.eq.${slug},slug.eq.maria,slug.eq.maria-jose`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error al consultar el evento en Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }

    if (!data) {
      if (slug === 'maria' || slug === 'maria-jose') return DEFAULT_MARIA_EVENT;
      return null;
    }

    return data as Event;
  } catch (err) {
    console.error('Error de conexión obteniendo el evento:', err);
    if (slug === 'maria' || slug === 'maria-jose') return DEFAULT_MARIA_EVENT;
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

  // Si Supabase no está configurado, simulamos el registro en modo demostración
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
    // 1. VERIFICACIÓN DEL EVENTO REAL EN SUPABASE
    let realEventId = eventId;

    const { data: eventRow, error: eventError } = await supabase
      .from('events')
      .select('id')
      .or(`id.eq.${eventId},slug.eq.maria,slug.eq.maria-jose`)
      .limit(1)
      .maybeSingle();

    if (eventError) {
      console.error('Error al verificar el evento en Supabase:', eventError);
    }

    if (eventRow) {
      realEventId = eventRow.id;
    }

    // 2. BUSCAR SI YA EXISTE UN INVITADO PARA ESTE EVENTO Y TELÉFONO
    const { data: existingGuest, error: findError } = await supabase
      .from('guests')
      .select('id')
      .eq('event_id', realEventId)
      .eq('whatsapp', cleanPhone)
      .maybeSingle();

    if (findError) {
      console.error('Error de Supabase al buscar invitado:', findError);
      return {
        success: false,
        message: `Error al buscar invitado: ${findError.message || 'Verifica la consola.'}`,
      };
    }

    let guestId: string;
    let isUpdate = false;

    if (existingGuest) {
      // INVITADO EXISTENTE: Actualizar nombre (sin pasar updated_at para compatibilidad total de esquema)
      guestId = existingGuest.id;
      isUpdate = true;

      const { error: updateGuestError } = await supabase
        .from('guests')
        .update({
          full_name: formData.fullName.trim(),
        })
        .eq('id', guestId);

      if (updateGuestError) {
        console.error('Error de Supabase al actualizar invitado:', updateGuestError);
        return {
          success: false,
          message: `Error actualizando datos: ${updateGuestError.message}`,
        };
      }
    } else {
      // INVITADO NUEVO: Inserción limpia con tipos exactos
      const newGuestPayload = {
        event_id: realEventId,
        full_name: formData.fullName.trim(),
        whatsapp: cleanPhone,
      };

      const { data: newGuest, error: insertGuestError } = await supabase
        .from('guests')
        .insert(newGuestPayload)
        .select('id')
        .single();

      if (insertGuestError || !newGuest) {
        console.error('Error de Supabase al insertar invitado:', insertGuestError);
        return {
          success: false,
          message: `No se pudo guardar la información del invitado: ${insertGuestError?.message || 'Error desconocido en Supabase.'}`,
        };
      }

      guestId = newGuest.id;
    }

    // 3. REGISTRAR O ACTUALIZAR RSVP (sin pasar updated_at para compatibilidad de esquema)
    const { data: existingRSVP } = await supabase
      .from('rsvps')
      .select('id')
      .eq('guest_id', guestId)
      .maybeSingle();

    if (existingRSVP) {
      // Actualizar RSVP existente
      const { error: updateRSVPError } = await supabase
        .from('rsvps')
        .update({
          attending: formData.attending,
          guest_count: formData.attending ? formData.guestCount : 0,
          message: formData.message ? formData.message.trim() : null,
        })
        .eq('id', existingRSVP.id);

      if (updateRSVPError) {
        console.error('Error de Supabase al actualizar RSVP:', updateRSVPError);
        return {
          success: false,
          message: `Error actualizando confirmación: ${updateRSVPError.message}`,
        };
      }
    } else {
      // Insertar nuevo RSVP
      const { error: insertRSVPError } = await supabase
        .from('rsvps')
        .insert({
          guest_id: guestId,
          attending: formData.attending,
          guest_count: formData.attending ? formData.guestCount : 0,
          message: formData.message ? formData.message.trim() : null,
        });

      if (insertRSVPError) {
        console.error('Error de Supabase al insertar RSVP:', insertRSVPError);
        return {
          success: false,
          message: `Error guardando confirmación: ${insertRSVPError.message}`,
        };
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
    const errorMsg = err instanceof Error ? err.message : 'Ocurrió un error inesperado al procesar tu solicitud.';
    console.error('Excepción capturada en submitRSVP:', err);
    return {
      success: false,
      message: errorMsg,
    };
  }
}
