'use client';

import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Gift, Sparkles, Shirt } from 'lucide-react';
import { Event } from '@/types/database';

interface EventDetailsProps {
  event: Event;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const mapsUrl = event.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_name + ' ' + (event.location_details || ''))}`;

  return (
    <section className="w-full max-w-md mx-auto my-8 px-4">
      <div className="text-center mb-6">
        <h3 className="font-heading text-3xl sm:text-4xl text-plum font-normal tracking-wide">
          El gran día
        </h3>
        <p className="text-xs uppercase tracking-widest text-lavender-700 font-medium mt-1">
          Detalles de la Recepción
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Tarjeta de Fecha */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-glass">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-lavender-200 to-rose-blush flex items-center justify-center border border-gold/30 text-lavender-700 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-plum/60">Fecha</p>
            <p className="text-base font-semibold text-plum font-heading">Sábado, 3 de Octubre</p>
            <p className="text-xs text-plum/70 font-light">2026</p>
          </div>
        </div>

        {/* Tarjeta de Hora */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-glass">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-lavender-200 to-rose-blush flex items-center justify-center border border-gold/30 text-lavender-700 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-plum/60">Hora</p>
            <p className="text-base font-semibold text-plum font-heading">7:30 PM</p>
            <p className="text-xs text-plum/70 font-light">Puntual asistencia</p>
          </div>
        </div>

        {/* Tarjeta de Lugar */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-glass">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-lavender-200 to-rose-blush flex items-center justify-center border border-gold/30 text-lavender-700 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-plum/60">Lugar</p>
            <p className="text-base font-semibold text-plum font-heading">{event.location_name}</p>
            {event.location_details && (
              <p className="text-xs text-plum/70 font-light">{event.location_details}</p>
            )}
          </div>
        </div>

        {/* TARJETA: CÓDIGO DE VESTIMENTA (DRESS CODE) */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-white/80 to-rose-blush/40 backdrop-blur-md border border-white/90 shadow-glass text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-lavender-100 flex items-center justify-center text-lavender-700 border border-gold/20">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-plum font-heading">Código de Vestimenta</h4>
              <p className="text-xs text-lavender-700 font-medium">Formal / Traje de Cóctel</p>
            </div>
          </div>
          <p className="text-xs text-plum/80 font-light leading-relaxed mt-2 pt-2 border-t border-gold/20">
            ✨ <span className="font-medium text-plum">Nota especial:</span> Agradecemos reservar los tonos <span className="font-semibold text-lavender-700">lila y lavanda</span> exclusivamente para la quinceañera.
          </p>
        </div>

        {/* TARJETA: LLUVIA DE SOBRES */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-white/80 to-lavender-50/60 backdrop-blur-md border border-white/90 shadow-glass text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-rose-blush flex items-center justify-center text-rose-accent border border-gold/20">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-plum font-heading">Lluvia de Sobres</h4>
              <p className="text-xs text-rose-accent font-medium">Regalo sugerido</p>
            </div>
          </div>
          <p className="text-xs text-plum/80 font-light leading-relaxed mt-2 pt-2 border-t border-gold/20">
            &ldquo;Tu presencia es mi mayor regalo. Si deseas hacerme un detalle, contaremos con lluvia de sobres en el salón.&rdquo;
          </p>
        </div>
      </div>

      {/* Botón Ver Ubicación */}
      <div className="mt-6 text-center">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-lavender-600 via-purple-600 to-lavender-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          <MapPin className="w-4 h-4 text-gold-accent" />
          <span>Ver ubicación en Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>
    </section>
  );
};
