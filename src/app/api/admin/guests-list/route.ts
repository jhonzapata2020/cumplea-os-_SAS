import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rateLimit';

export interface AdminGuestItem {
  id: string;
  full_name: string;
  whatsapp: string;
  created_at: string;
  attending: boolean | null;
  guest_count: number;
  message: string | null;
}

export async function POST(req: NextRequest) {
  try {
    // 1. OBTENER IP Y VERIFICAR RATE LIMITING
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Demasiados intentos fallidos. Inténtalo de nuevo en ${rateCheck.retryAfterSeconds} segundos.` },
        { status: 429 }
      );
    }

    // 2. VERIFICAR QUE ADMIN_PIN ESTÉ CONFIGURADO
    const expectedPin = process.env.ADMIN_PIN;
    if (!expectedPin) {
      console.error('ERROR CRÍTICO: ADMIN_PIN no está configurado en las variables de entorno del servidor.');
      return NextResponse.json(
        { error: 'El panel de administración no está configurado en el servidor.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { pin } = body;

    // 3. VALIDAR PIN
    if (!pin || String(pin).trim() !== expectedPin) {
      const failed = recordFailedAttempt(clientIp);
      const remainingMsg = failed.blocked
        ? ' Límite de intentos alcanzado. Bloqueado por 15 minutos.'
        : ` Intentos restantes: ${failed.remaining}.`;

      return NextResponse.json(
        { error: `PIN incorrecto.${remainingMsg}` },
        { status: 401 }
      );
    }

    resetRateLimit(clientIp);

    let guestsList: AdminGuestItem[] = [];

    if (supabase) {
      // Obtener evento 'maria-jose' o 'maria'
      const { data: event } = await supabase
        .from('events')
        .select('id')
        .or('slug.eq.maria-jose,slug.eq.maria')
        .limit(1)
        .maybeSingle();

      if (event) {
        // Consultar invitados con su RSVP correspondiente
        const { data: guestsData, error: guestsError } = await supabase
          .from('guests')
          .select(`
            id,
            full_name,
            whatsapp,
            created_at,
            rsvps (
              attending,
              guest_count,
              message
            )
          `)
          .eq('event_id', event.id)
          .order('full_name', { ascending: true });

        if (!guestsError && guestsData) {
          guestsList = guestsData.map((g: any) => {
            const rsvp = Array.isArray(g.rsvps) ? g.rsvps[0] : g.rsvps;
            return {
              id: g.id,
              full_name: g.full_name,
              whatsapp: g.whatsapp,
              created_at: g.created_at,
              attending: rsvp ? rsvp.attending : null,
              guest_count: rsvp ? (rsvp.guest_count || 1) : 0,
              message: rsvp ? rsvp.message : null,
            };
          });
        }
      }
    }

    // Calcular métricas agregadas
    const totalConfirmed = guestsList.filter((g) => g.attending === true).length;
    const totalDeclined = guestsList.filter((g) => g.attending === false).length;
    const totalAttendees = guestsList
      .filter((g) => g.attending === true)
      .reduce((sum, g) => sum + (g.guest_count || 1), 0);
    const totalMessages = guestsList.filter((g) => g.message && g.message.trim().length > 0).length;

    return NextResponse.json({
      success: true,
      metrics: {
        totalConfirmed,
        totalDeclined,
        totalAttendees,
        totalMessages,
        totalRegistered: guestsList.length,
      },
      guests: guestsList,
    });
  } catch (err) {
    console.error('Error en API /api/admin/guests-list:', err);
    return NextResponse.json(
      { error: 'Error procesando la solicitud del servidor.' },
      { status: 500 }
    );
  }
}
