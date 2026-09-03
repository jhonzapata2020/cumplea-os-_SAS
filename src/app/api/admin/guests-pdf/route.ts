import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body;

    // PIN del administrador configurado en variables de entorno o '2026' por defecto
    const expectedPin = process.env.ADMIN_PIN || '2026';

    if (!pin || String(pin).trim() !== expectedPin) {
      return NextResponse.json(
        { error: 'PIN incorrecto. Acceso denegado.' },
        { status: 401 }
      );
    }

    let guestsList: Array<{ full_name: string; whatsapp: string }> = [];

    if (supabase) {
      // 1. Obtener ID del evento de María José
      const { data: event } = await supabase
        .from('events')
        .select('id')
        .or('slug.eq.maria,slug.eq.maria-jose')
        .limit(1)
        .maybeSingle();

      if (event) {
        // 2. Consultar invitados ordenados alfabéticamente A-Z
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
