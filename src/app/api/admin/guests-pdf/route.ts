import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    // 1. OBTENER IP DEL CLIENTE Y VERIFICAR RATE LIMITING
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Demasiados intentos fallidos. Inténtalo de nuevo en ${rateCheck.retryAfterSeconds} segundos.` },
        { status: 429 }
      );
    }

    // 2. VERIFICAR QUE ADMIN_PIN ESTÉ CONFIGURADO EN EL SERVIDOR
    const expectedPin = process.env.ADMIN_PIN;
    if (!expectedPin) {
      console.error('ERROR CRÍTICO: La variable de entorno ADMIN_PIN no está configurada en el servidor.');
      return NextResponse.json(
        { error: 'El servicio de administración no está disponible actualmente.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { pin } = body;

    // 3. VALIDACIÓN ESTRICTA DEL PIN
    if (!pin || String(pin).trim() !== expectedPin) {
      const failed = recordFailedAttempt(clientIp);
      const remainingMsg = failed.blocked
        ? ' Has alcanzado el límite de intentos. Acceso bloqueado por 15 minutos.'
        : ` Intentos restantes: ${failed.remaining}.`;

      return NextResponse.json(
        { error: `PIN incorrecto.${remainingMsg}` },
        { status: 401 }
      );
    }

    // PIN Correcto: reiniciar conteo de tasa de intentos para esta IP
    resetRateLimit(clientIp);

    let guestsList: Array<{ full_name: string; whatsapp: string }> = [];

    if (supabase) {
      // Consultar invitados del evento 'maria-jose' u otros slugs válidos, ordenados alfabéticamente A-Z
      const { data: event } = await supabase
        .from('events')
        .select('id')
        .or('slug.eq.maria-jose,slug.eq.maria')
        .limit(1)
        .maybeSingle();

      if (event) {
        const { data: guests, error: guestsError } = await supabase
          .from('guests')
          .select('full_name, whatsapp')
          .eq('event_id', event.id)
          .order('full_name', { ascending: true });

        if (!guestsError && guests) {
          guestsList = guests;
        }
      }
    }

    return NextResponse.json({
      success: true,
      guests: guestsList,
    });
  } catch (err) {
    console.error('Error en API /api/admin/guests-pdf:', err);
    return NextResponse.json(
      { error: 'Error procesando la solicitud del servidor.' },
      { status: 500 }
    );
  }
}
