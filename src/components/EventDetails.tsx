'use client';

import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Gift, Shirt, PhoneCall } from 'lucide-react';
import { Event } from '@/types/database';
import { generateGoogleCalendarUrl } from '@/lib/formatEventDate';

interface EventDetailsProps {
  event: Event;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Bar+y+Restaurante+Las+Cholas+Dg+100+152+Turbo+Antioquia';
  const googleCalUrl = generateGoogleCalendarUrl(event);
  const whatsappContactUrl = 'https://wa.me/573135734507?text=%C2%A1Hola!%20Tengo%20una%20consulta%20sobre%20la%20invitaci%C3%B3n%20de%20XV%20a%C3%B1os';

  return (
    <section className="w-full max-w-md mx-auto my-8 px-4" id="detalles">
      <div className="text-center mb-6">
        <h3 className="font-heading text-3xl sm:text-4xl text-plum font-normal tracking-wide">
          Detalles del Evento
        </h3>
        <p className="text-xs uppercase tracking-widest text-purple-700 font-medium mt-1">
          Recepción & Celebración
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {/* Tarjeta: Fecha & Hora */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-glass">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-900/60">Fecha & Hora</p>
            <p className="text-base font-semibold text-purple-950 font-heading">Sábado 3 de octubre de 2026</p>
            <p className="text-xs text-stone-600 font-light flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-purple-600" />
              <span>Te esperamos puntualmente a las <strong className="font-medium text-plum">7:30 p. m.</strong></span>
            </p>
          </div>
        </div>

        {/* Tarjeta: Lugar & Dirección Exacta */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-glass">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-900/60">Lugar & Dirección</p>
            <p className="text-base font-semibold text-purple-950 font-heading">
              Bar y Restaurante Las Cholas
            </p>
            <p className="text-xs text-stone-600 font-light mt-0.5">
              Dg. 100 #152, Turbo, Antioquia
            </p>
          </div>
        </div>

        {/* Tarjeta: Código de Vestimenta */}
        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-glass text-left">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-lavender-100 flex items-center justify-center text-purple-700 border border-purple-200">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-purple-950 uppercase tracking-wider">Código de Vestimenta</h4>
              <p className="text-xs text-purple-700 font-medium">Formal / Traje de Cóctel</p>
            </div>
          </div>
          <p className="text-xs text-stone-600 font-light leading-relaxed mt-2 pt-2 border-t border-purple-100/80">
            ✨ <span className="font-medium text-plum">Nota especial:</span> Agradecemos reservar los tonos <span className="font-semibold text-purple-700">lila y lavanda</span> exclusivamente para la quinceañera.
          </p>
        </div>

        {/* Tarjeta: Lluvia de Sobres */}
        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-glass text-left">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-rose-blush flex items-center justify-center text-rose-accent border border-gold/20">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-purple-950 uppercase tracking-wider">Lluvia de Sobres</h4>
              <p className="text-xs text-rose-accent font-medium">Regalo sugerido</p>
            </div>
          </div>
          <p className="text-xs text-stone-600 font-light leading-relaxed mt-2 pt-2 border-t border-purple-100/80">
            &ldquo;Tu presencia es mi mayor regalo. Si deseas hacerme un detalle, contaremos con lluvia de sobres en el salón.&rdquo;
          </p>
        </div>
      </div>

      {/* Botones de Acción Prácticos */}
      <div className="mt-6 space-y-2.5 text-center">
        {/* Ubicación Google Maps */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-900 text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>Cómo llegar en Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>

        {/* Botón Agendar en Google Calendar */}
        <div>
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-white border border-purple-200 text-plum font-medium text-xs shadow-xs hover:bg-purple-50 transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>📅 Agendar en Google Calendar</span>
          </a>
        </div>

        {/* Consultas por WhatsApp */}
        <div className="pt-1">
          <a
            href={whatsappContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs text-purple-700 hover:text-purple-900 font-medium transition py-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>¿Tienes dudas? Consultas por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
