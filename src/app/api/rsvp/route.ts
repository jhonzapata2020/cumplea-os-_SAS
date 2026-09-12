import { NextRequest, NextResponse } from 'next/server';
import { supabase, DEFAULT_MARIA_EVENT } from '@/lib/supabase';

function normalizeWhatsApp(phone: string): string {
  return phone.replace(/\D/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, fullName, whatsapp, attending, guestCount, message } = body;

    // 1. SANITIZACIÓN Y VALIDACIÓN EN EL SERVIDOR
    const cleanName = typeof fullName === 'string' ? fullName.trim().slice(0, 120) : '';
    const cleanPhone = typeof whatsapp === 'string' ? normalizeWhatsApp(whatsapp) : '';
    const isAttending = Boolean(attending);
    const validCount = isAttending ? Math.max(1, Math.min(10, Number(guestCount) || 1)) : 0;
    const cleanMessage = typeof message === 'string' ? message.trim().slice(0, 500) : null;

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Por favor ingresa un nombre completo válido.' },
        { status: 400 }
      );
    }

    if (!cleanPhone || cleanPhone.length < 7 || cleanPhone.length > 15) {
      return NextResponse.json(
        { success: false, message: 'Por favor ingresa un número de WhatsApp válido (7 a 15 dígitos).' },
        { status: 400 }
      );
    }

    // Si Supabase no está configurado (entorno de pruebas/demo local)
    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: '¡Gracias por confirmar tu asistencia! (Modo demostración local)',
        isUpdate: false,
      });
    }

    // 2. VERIFICACIÓN DEL EVENTO REAL
    let realEventId = eventId;
    const { data: eventRow } = await supabase
      .from('events')
      .select('id')
      .or(`id.eq.${eventId || DEFAULT_MARIA_EVENT.id},slug.eq.maria,slug.eq.maria-jose`)
      .limit(1)
      .maybeSingle();

    if (eventRow) {
      realEventId = eventRow.id;
    }

    // 3. REGISTRO / ACTUALIZACIÓN DE INVITADO EN SUPABASE
    const { data: existingGuest, error: findError } = await supabase
      .from('guests')
      .select('id')
      .eq('event_id', realEventId)
      .eq('whatsapp', cleanPhone)
      .maybeSingle();

    if (findError) {
      console.error('Error al consultar invitado en servidor:', findError);
      return NextResponse.json(
        { success: false, message: 'Ocurrió un error al procesar tu registro.' },
        { status: 500 }
      );
    }

    let guestId: string;
    let isUpdate = false;

    if (existingGuest) {
      guestId = existingGuest.id;
      isUpdate = true;

      const { error: updateGuestError } = await supabase
        .from('guests')
        .update({
          full_name: cleanName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', guestId);

      if (updateGuestError) {
        console.error('Error al actualizar invitado en servidor:', updateGuestError);
      }
    } else {
      const { data: newGuest, error: insertGuestError } = await supabase
        .from('guests')
        .insert({
          event_id: realEventId,
          full_name: cleanName,
          whatsapp: cleanPhone,
        })
        .select('id')
        .single();

      if (insertGuestError || !newGuest) {
        console.error('Error al insertar invitado en servidor:', insertGuestError);
        return NextResponse.json(
          { success: false, message: 'No se pudo guardar la información del invitado.' },
          { status: 500 }
        );
      }

      guestId = newGuest.id;
    }

    // 4. REGISTRO / ACTUALIZACIÓN DE RSVP
    const { data: existingRSVP } = await supabase
      .from('rsvps')
      .select('id')
      .eq('guest_id', guestId)
      .maybeSingle();

    if (existingRSVP) {
      const { error: updateRSVPError } = await supabase
        .from('rsvps')
        .update({
          attending: isAttending,
          guest_count: validCount,
          message: cleanMessage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRSVP.id);

      if (updateRSVPError) {
        console.error('Error al actualizar RSVP en servidor:', updateRSVPError);
        return NextResponse.json(
          { success: false, message: 'Error actualizando confirmación de asistencia.' },
          { status: 500 }
        );
      }
    } else {
      const { error: insertRSVPError } = await supabase
        .from('rsvps')
        .insert({
          guest_id: guestId,
          attending: isAttending,
          guest_count: validCount,
          message: cleanMessage,
        });

      if (insertRSVPError) {
        console.error('Error al insertar RSVP en servidor:', insertRSVPError);
        return NextResponse.json(
          { success: false, message: 'Error guardando confirmación de asistencia.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: isUpdate
        ? '¡Tu respuesta ha sido actualizada exitosamente!'
        : '¡Gracias por confirmar tu asistencia!',
      isUpdate,
    });
  } catch (err) {
    console.error('Excepción en API /api/rsvp:', err);
    return NextResponse.json(
      { success: false, message: 'Ocurrió un error inesperado al procesar tu solicitud.' },
      { status: 500 }
    );
  }
}
