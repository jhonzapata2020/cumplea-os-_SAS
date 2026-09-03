'use client';

import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
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
      </div>

      {/* Botón Ver Ubicación */}
      <div className="mt-5 text-center">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-lavender-600 via-purple-600 to-lavender-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          <MapPin className="w-4 h-4 text-gold-accent" />
          <span>Ver ubicación en Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>
    </section>
  );
};
