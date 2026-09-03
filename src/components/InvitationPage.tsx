'use client';

import React, { useState } from 'react';
import { Event, RSVPResult } from '@/types/database';
import { Hero } from './Hero';
import { Countdown } from './Countdown';
import { InvitationMessage } from './InvitationMessage';
import { EventDetails } from './EventDetails';
import { RSVPForm } from './RSVPForm';
import { SuccessMessage } from './SuccessMessage';
import { Footer } from './Footer';

interface InvitationPageProps {
  event: Event;
}

export const InvitationPage: React.FC<InvitationPageProps> = ({ event }) => {
  const [submitted, setSubmitted] = useState(false);
  const [rsvpResult, setRsvpResult] = useState<RSVPResult | null>(null);
  const [confirmedGuestName, setConfirmedGuestName] = useState<string>('Invitado Especial');
  const [confirmedGuestCount, setConfirmedGuestCount] = useState<number>(1);

  const handleRSVPSuccess = (result: RSVPResult, guestName: string, guestCount: number) => {
    setRsvpResult(result);
    setConfirmedGuestName(guestName);
    setConfirmedGuestCount(guestCount);
    setSubmitted(true);
    // Desplazar suavemente hacia la vista de éxito
    window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSubmitted(false);
    setRsvpResult(null);
  };

  // Formatear la fecha para la cabecera
  const eventDateObj = new Date(event.event_date);
  const formattedDate = !isNaN(eventDateObj.getTime())
    ? eventDateObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '3 de Octubre de 2026';

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-soft via-white to-lavender-50 text-plum font-body relative selection:bg-lavender-200 selection:text-plum">
      {/* Marco contenedor centrado para desktop (mobile-first a 390px, max-w-lg en escritorio) */}
      <div className="max-w-lg mx-auto min-h-screen flex flex-col shadow-2xl bg-white/40 backdrop-blur-sm border-x border-white/60">
        
        {/* 1. Hero: Fotografía de María José + MARÍA JOSÉ + Mis XV Años + Fecha + Botón scroll */}
        <Hero
          celebrantName={event.celebrant_name}
          title={event.title}
          formattedDate={formattedDate}
          photoUrl={event.slug === 'maria' ? '/maria.jpg' : '/placeholder-celebrant.jpg'}
        />

        {/* 2. Cuenta Regresiva */}
        <Countdown targetDate={event.event_date} />

        {/* 3. Mensaje Breve de Invitación ("Con cariño") */}
        <InvitationMessage />

        {/* 4. Información del Evento ("El gran día", Lluvia de sobres, Dress Code, Google Maps) */}
        <EventDetails event={event} />

        {/* 5. Formulario de Confirmación O Mensaje de Éxito con Credencial de Pase Digital */}
        {!submitted ? (
          <RSVPForm eventId={event.id} onSuccess={handleRSVPSuccess} />
        ) : (
          <SuccessMessage
            event={event}
            isUpdate={rsvpResult?.isUpdate}
            guestName={confirmedGuestName}
            guestCount={confirmedGuestCount}
            onReset={handleReset}
          />
        )}

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
};
