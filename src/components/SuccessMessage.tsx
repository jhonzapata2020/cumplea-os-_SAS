'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Calendar, Clock, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { Event } from '@/types/database';

interface SuccessMessageProps {
  event: Event;
  isUpdate?: boolean;
  onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ event, isUpdate, onReset }) => {
  useEffect(() => {
    // Lanzar efecto de confeti suave
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D8B4F8', '#FFF0F5', '#D4AF37', '#8B5CF6'],
      });
    } catch {
      // Si falla confetti no afecta la experiencia
    }
  }, []);

  return (
    <section className="w-full max-w-md mx-auto my-8 px-4 animate-fade-in-up">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/90 via-white/80 to-rose-soft/40 backdrop-blur-md border border-white/90 shadow-glass text-center">
        {/* Icono de Corazón Celebrativo */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-lavender-100 to-rose-blush border-2 border-gold/40 flex items-center justify-center shadow-gold-glow">
          <Heart className="w-8 h-8 text-rose-accent fill-rose-blush animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-100/80 text-lavender-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>{isUpdate ? 'Respuesta actualizada' : '¡Confirmación exitosa!'}</span>
        </div>

        <h3 className="font-heading text-3xl sm:text-4xl text-plum font-normal mb-2">
          ¡Gracias por confirmar!
        </h3>

        <p className="text-sm text-plum/80 font-light leading-relaxed mb-6">
          María estará feliz de compartir este momento contigo.
        </p>

        {/* RESUMEN DE LOS DATOS DEL EVENTO */}
        <div className="p-4 rounded-2xl bg-white/70 border border-lavender-100 text-left space-y-3 shadow-sm mb-6">
          <p className="text-xs uppercase tracking-wider text-lavender-700 font-semibold border-b border-lavender-100 pb-2 text-center">
            Recordatorio del Evento
          </p>

          <div className="flex items-center gap-3 text-xs text-plum">
            <Calendar className="w-4 h-4 text-lavender-600 shrink-0" />
            <span>Sábado, 3 de Octubre de 2026</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-plum">
            <Clock className="w-4 h-4 text-lavender-600 shrink-0" />
            <span>7:30 PM</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-plum">
            <MapPin className="w-4 h-4 text-lavender-600 shrink-0" />
            <span>{event.location_name} - {event.location_details || 'Segundo piso'}</span>
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
