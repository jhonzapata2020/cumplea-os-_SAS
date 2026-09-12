'use client';

import React, { useState } from 'react';
import { Event, RSVPResult } from '@/types/database';
import { DEFAULT_MARIA_EVENT } from '@/lib/supabase';
import { formatEventFullDate } from '@/lib/formatEventDate';
import { Hero } from './Hero';
import { Countdown } from './Countdown';
import { InvitationMessage } from './InvitationMessage';
import { EventDetails } from './EventDetails';
import { RSVPForm } from './RSVPForm';
import { SuccessMessage } from './SuccessMessage';
import { Footer } from './Footer';

interface InvitationPageProps {
  event?: Event | null;
}

export const InvitationPage: React.FC<InvitationPageProps> = ({ event }) => {
  const [submitted, setSubmitted] = useState(false);
  const [rsvpResult, setRsvpResult] = useState<RSVPResult | null>(null);
  const [confirmedGuestName, setConfirmedGuestName] = useState<string>('Invitado Especial');
  const [confirmedGuestCount, setConfirmedGuestCount] = useState<number>(1);

  // Garantizar objeto event seguro con valores por defecto indestructibles
  const safeEvent: Event = {
    ...DEFAULT_MARIA_EVENT,
    ...(event || {}),
  };

  const handleRSVPSuccess = (result: RSVPResult, guestName: string, guestCount: number) => {
    setRsvpResult(result);
    setConfirmedGuestName(guestName || 'Invitado Especial');
    setConfirmedGuestCount(guestCount || 1);
    setSubmitted(true);
    
    // Desplazar suavemente hacia la vista de éxito utilizando el ID del elemento
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const passElement = document.getElementById('success-pass');
        if (passElement) {
          passElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setRsvpResult(null);
  };

  const formattedDate = formatEventFullDate(safeEvent.event_date || '2026-10-03T19:30:00-05:00');

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-soft via-white to-lavender-50 text-plum font-body relative selection:bg-lavender-200 selection:text-plum">
      {/* Marco contenedor centrado para desktop (mobile-first a 390px, max-w-lg en escritorio) */}
      <div className="max-w-lg mx-auto min-h-screen flex flex-col shadow-2xl bg-white/40 backdrop-blur-sm border-x border-white/60">
        
        {/* 1. Hero: Fotografía de María José + MARÍA JOSÉ + Mis XV Años + Fecha + Dual CTAs */}
        <Hero
          celebrantName={safeEvent.celebrant_name || 'María José'}
          title={safeEvent.title || 'Mis XV años'}
          formattedDate={formattedDate}
          photoUrl="/maria.jpg"
        />

        {/* 2. Mensaje Personal & Sentimiento ("Con cariño") */}
        <InvitationMessage />

        {/* 3. Cuenta Regresiva */}
        <Countdown targetDate={safeEvent.event_date || '2026-10-03T19:30:00-05:00'} />

        {/* 4. Información del Evento ("El gran día", Dress Code, Google Maps, WhatsApp) */}
        <EventDetails event={safeEvent} />

        {/* 5. Formulario de Confirmación O Mensaje de Éxito con Credencial de Pase Digital */}
        {!submitted ? (
          <RSVPForm eventId={safeEvent.id || DEFAULT_MARIA_EVENT.id} onSuccess={handleRSVPSuccess} />
        ) : (
          <SuccessMessage
            event={safeEvent}
            isUpdate={rsvpResult?.isUpdate}
            guestName={confirmedGuestName}
            guestCount={confirmedGuestCount}
            onReset={handleReset}
          />
        )}

        {/* Footer */}
        <Footer showAdminExport={!submitted} />
      </div>
    </main>
  );
};
