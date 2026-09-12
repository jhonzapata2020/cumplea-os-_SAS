'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Heart, ChevronDown, CalendarCheck } from 'lucide-react';

interface HeroProps {
  celebrantName: string;
  title: string;
  formattedDate: string;
  photoUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  celebrantName = 'María José',
  formattedDate = 'Sábado 3 de octubre de 2026 · 7:30 p. m.',
  photoUrl = '/maria.jpg',
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative flex flex-col items-center justify-between text-center min-h-[90vh] sm:min-h-0 pt-6 pb-8 px-4 overflow-hidden">
      {/* Resplandor ambiental suave de fondo sin exceso de degradados */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-72 h-72 bg-lavender-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 -left-10 w-40 h-40 bg-rose-blush/60 rounded-full blur-2xl -z-10 pointer-events-none" />

      {/* 1. ANTETÍTULO EDITORIAL ELEGANTE */}
      <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-[0.3em] text-purple-900/70 uppercase mb-3 animate-fade-in shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 opacity-80" />
        <span>Te invito a celebrar</span>
        <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 opacity-80" />
      </div>

      {/* 2. MARCO FOTOGRÁFICO DE ENCUADRE EDITORIAL VERTICAL */}
      <div className="relative w-full max-w-[320px] xs:max-w-[340px] sm:max-w-xs aspect-[4/5] my-2 group animate-fade-in-up shrink-0">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-amber-300/40 shadow-2xl shadow-purple-950/10 bg-gradient-to-b from-lavender-50 to-rose-soft/40">
          {!imageError ? (
            <Image
              src={photoUrl}
              alt={`Fotografía de ${celebrantName}`}
              fill
              priority
              quality={92}
              sizes="(max-width: 640px) 340px, 384px"
              className="object-cover object-top transition-transform duration-700 hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-lavender-100 to-rose-blush">
              <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center mb-2 shadow-sm border border-gold/40">
                <Heart className="w-7 h-7 text-lavender-500 fill-lavender-200" />
              </div>
              <p className="font-heading text-xl text-plum font-semibold mb-1">{celebrantName}</p>
              <p className="text-xs text-plum/70 font-light">Fotografía de María José</p>
            </div>
          )}

          {/* Sombra de contorno sutil inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/25 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* 3. TÍTULO NARRATIVO Y FECHA FORMAL */}
      <div className="space-y-2 mt-3 max-w-sm shrink-0">
        {/* Título Principal */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-purple-950 tracking-wide font-normal leading-tight">
          <span className="block font-semibold">{celebrantName}</span>
          <span className="block text-lg sm:text-xl font-heading italic text-purple-700/90 font-serif mt-1">
            celebra sus XV Años
          </span>
        </h1>

        {/* Fecha Formal Destacada */}
        <p className="text-xs sm:text-sm font-sans font-medium text-stone-600 tracking-wider uppercase pt-1">
          {formattedDate}
        </p>
      </div>

      {/* 4. DUAL CTAs: Botón Primario "Ver invitación" & Secundario "Confirmar asistencia" */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-xs shrink-0">
        {/* Botón Primario: Ver invitación (Scroll a #mensaje) */}
        <a
          href="#mensaje"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-purple-900 hover:bg-purple-950 text-white text-xs font-medium tracking-wide shadow-md hover:shadow-lg transition duration-300 group cursor-pointer"
        >
          <span>Ver invitación</span>
          <ChevronDown className="w-3.5 h-3.5 text-gold-accent group-hover:translate-y-0.5 transition-transform duration-300" />
        </a>

        {/* Botón Secundario/Outline: Confirmar asistencia (Scroll directo a #rsvp) */}
        <a
          href="#rsvp"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-purple-200 text-purple-900 text-xs font-medium tracking-wide shadow-xs hover:bg-white hover:border-purple-300 transition duration-300 cursor-pointer"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Confirmar asistencia</span>
        </a>
      </div>
    </section>
  );
};
