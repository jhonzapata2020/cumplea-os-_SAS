'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Calendar, Clock, MapPin, Sparkles, RefreshCw, QrCode, Ticket, ExternalLink } from 'lucide-react';
import { Event } from '@/types/database';
import { playCelebrationWaltzSound } from '@/lib/sound';

interface SuccessMessageProps {
  event: Event;
  isUpdate?: boolean;
  guestName?: string;
  guestCount?: number;
  onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  event,
  isUpdate,
  guestName = 'Invitado Especial',
  guestCount = 1,
  onReset,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D8B4F8', '#FFF0F5', '#D4AF37', '#8B5CF6'],
      });
    } catch {
      // Ignorar si el navegador restringe animaciones
    }

    // Disparar audio de celebración de vals con desvanecimiento de 5s y resiliencia total
    playCelebrationWaltzSound();
  }, []);

  // Construcción de la URL dinámica para Google Calendar
  const calendarTitle = encodeURIComponent('XV Años de María José');
  const calendarDetails = encodeURIComponent('Celebración de los XV Años de María José Villegas. ¡Nos vemos en la fiesta!');
  const calendarLocation = encodeURIComponent(`${event.location_name}, ${event.location_details || 'Segundo piso'}`);
  // 3 de Octubre de 2026 19:30 - 23:30 (Hora Colombia UTC-5: 20261004T003000Z / 20261004T043000Z)
  const calendarDates = '20261004T003000Z/20261004T043000Z';
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${calendarDates}&details=${calendarDetails}&location=${calendarLocation}`;

  // Código único estilizado de reserva
  const cleanNameCode = guestName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'INV';
  const passCode = `MJ-2026-${cleanNameCode}-${String(guestCount).padStart(2, '0')}`;

  return (
    <section className="w-full max-w-md mx-auto my-8 px-4 animate-fade-in-up">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/95 via-white/90 to-rose-soft/50 backdrop-blur-md border border-white/90 shadow-glass text-center">
        {/* Icono de Corazón Celebrativo */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-lavender-100 to-rose-blush border-2 border-gold/40 flex items-center justify-center shadow-gold-glow">
          <Heart className="w-8 h-8 text-rose-accent fill-rose-blush animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-lavender-100/90 text-lavender-800 text-xs font-medium mb-3 shadow-sm border border-gold/30">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>{isUpdate ? 'Respuesta actualizada' : '¡Confirmación Exitosa!'}</span>
        </div>

        <h3 className="font-heading text-3xl sm:text-4xl text-plum font-normal mb-2">
          ¡Gracias por confirmar!
        </h3>

        <p className="text-sm text-plum/80 font-light leading-relaxed mb-6">
          María José estará feliz de compartir este momento inolvidable contigo.
        </p>

        {/* 1. BOTÓN: GUARDAR EN GOOGLE CALENDAR */}
        <div className="mb-6">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl bg-white border border-lavender-200 text-plum font-medium text-xs sm:text-sm shadow-sm hover:shadow-md hover:bg-lavender-50/50 transition duration-300"
          >
            <Calendar className="w-4 h-4 text-lavender-600" />
            <span>📅 Guardar en Google Calendar</span>
            <ExternalLink className="w-3.5 h-3.5 text-plum/40 ml-auto" />
          </a>
        </div>

        {/* 2. PASE DIGITAL VISUAL TIPO CREDENCIAL / TICKET */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-b from-plum-dark via-plum to-purple-950 text-white text-left shadow-2xl border border-gold/40 mb-6">
          {/* Adorno holográfico de fondo */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-lavender-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gold/20 rounded-full blur-2xl pointer-events-none" />

          {/* Encabezado del Pase */}
          <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-gold-accent" />
              <span className="text-[10px] tracking-widest uppercase font-medium text-gold-accent">
                Pase Digital de Entrada
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/60">{passCode}</span>
          </div>

          {/* Nombre y Pases del Invitado */}
          <div className="space-y-1 mb-4">
            <p className="text-[10px] uppercase tracking-wider text-white/60 font-light">Invitado(a)</p>
            <p className="text-base sm:text-lg font-semibold text-white font-heading tracking-wide">
              {guestName}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 text-gold-accent text-xs font-medium mt-1">
              <span>{guestCount} {guestCount === 1 ? 'Persona / Pase Individual' : `Personas (${guestCount} Pases)`}</span>
            </div>
          </div>

          {/* Detalles Resumidos del Evento en Credencial */}
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-white/10 py-2.5 mb-3 text-white/80">
            <div>
              <p className="text-[10px] text-white/50 uppercase">Fecha & Hora</p>
              <p className="font-medium text-white">Sáb, 3 Oct - 7:30 PM</p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase">Lugar</p>
              <p className="font-medium text-white">Cholas (2do Piso)</p>
            </div>
          </div>

          {/* Código QR Estilizado */}
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="p-1.5 bg-white rounded-lg shrink-0">
              {/* Icono QR Simulado / Estilizado */}
              <QrCode className="w-12 h-12 text-plum" />
            </div>
            <div className="text-[11px] text-white/70 leading-tight">
              <p className="font-medium text-white mb-0.5">Pase de Confirmación</p>
              <p className="text-[10px] text-white/60 font-light">
                Presenta esta pantalla o captura en la recepción del evento.
              </p>
            </div>
          </div>
        </div>

        {/* Botón para actualizar respuesta si lo necesita */}
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 text-xs text-lavender-700 hover:text-lavender-900 underline font-medium transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>¿Deseas modificar tu respuesta?</span>
        </button>
      </div>
    </section>
  );
};
