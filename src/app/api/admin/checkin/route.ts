import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Demasiados intentos fallidos. Inténtalo de nuevo en ${rateCheck.retryAfterSeconds} segundos.` },
        { status: 429 }
      );
    }

    const expectedPin = process.env.ADMIN_PIN;
    if (!expectedPin) {
      return NextResponse.json(
        { error: 'Servidor no configurado para recepción.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { pin, passCode } = body;

    if (!pin || String(pin).trim() !== expectedPin) {
      const failed = recordFailedAttempt(clientIp);
      return NextResponse.json(
        { error: `PIN de recepción incorrecto. Intentos restantes: ${failed.remaining}` },
        { status: 401 }
      );
    }

    resetRateLimit(clientIp);

    if (!passCode) {
      return NextResponse.json(
        { error: 'Código de pase no proporcionado.' },
        { status: 400 }
      );
    }

    let foundGuest = null;

    if (supabase) {
      const { data: guestsData } = await supabase
        .from('guests')
        .select(`
          id,
          full_name,
          whatsapp,
          rsvps (
            attending,
            guest_count,
            message
          )
        `);

      if (guestsData) {
        // Buscar coincidencia por código alfanumérico o nombre
        const matched = guestsData.find((g: any) => {
          const cleanNameCode = g.full_name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
          const rsvp = Array.isArray(g.rsvps) ? g.rsvps[0] : g.rsvps;
          const count = rsvp ? (rsvp.guest_count || 1) : 1;
          const generatedCode = `MJ-2026-${cleanNameCode}-${String(count).padStart(2, '0')}`;

          return passCode.toUpperCase().includes(cleanNameCode) || passCode === generatedCode;
        });

        if (matched) {
          const rsvp = Array.isArray(matched.rsvps) ? matched.rsvps[0] : matched.rsvps;
          foundGuest = {
            id: matched.id,
            full_name: matched.full_name,
            whatsapp: matched.whatsapp,
            attending: rsvp ? rsvp.attending : true,
            guest_count: rsvp ? rsvp.guest_count : 1,
            message: rsvp ? rsvp.message : null,
          };
        }
      }
    }

    return NextResponse.json({
      success: true,
      passCode,
      guest: foundGuest,
    });
  } catch (err) {
    console.error('Error en API /api/admin/checkin:', err);
    return NextResponse.json(
      { error: 'Error procesando verificación de pase.' },
      { status: 500 }
    );
  }
}
