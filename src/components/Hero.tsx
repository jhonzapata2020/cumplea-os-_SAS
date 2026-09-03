'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Heart, ChevronDown } from 'lucide-react';

interface HeroProps {
  celebrantName: string;
  title: string;
  formattedDate: string;
  photoUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  celebrantName,
  title,
  formattedDate,
  photoUrl = '/maria.jpg',
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative flex flex-col items-center justify-between text-center min-h-[85vh] sm:min-h-0 pt-4 pb-6 px-3 overflow-hidden">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-rose-blush via-lavender-200 to-gold-accent opacity-50 rounded-full blur-3xl -z-10 animate-pulse-slow pointer-events-none" />
      <div className="absolute top-32 -left-12 w-44 h-44 bg-lavender-300 opacity-25 rounded-full blur-2xl -z-10 pointer-events-none" />
      <div className="absolute top-48 -right-12 w-44 h-44 bg-rose-blush opacity-30 rounded-full blur-2xl -z-10 pointer-events-none" />

      {/* 1. ANTETÍTULO EDITORIAL ELEGANTE (Sin pastilla o recuadro rígido) */}
      <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-[0.3em] text-purple-900/70 uppercase mb-3 animate-fade-in shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 opacity-80" />
        <span>Te invito a celebrar</span>
        <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 opacity-80" />
      </div>

      {/* 2. MARCO FOTOGRÁFICO DE ALTO PROTAGONISMO (Ratio 4:5, max-w-[340px]) */}
      <div className="relative w-full max-w-[330px] xs:max-w-[340px] sm:max-w-xs aspect-[4/5] my-1 group animate-fade-in-up shrink-0">
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-amber-300/40 shadow-2xl shadow-purple-950/15 bg-gradient-to-b from-lavender-100 to-rose-soft">
          {!imageError ? (
            <Image
              src={photoUrl}
              alt={`Fotografía de ${celebrantName}`}
              fill
              priority
              quality={90}
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
              <span className="mt-2 text-[10px] text-plum/50 px-2.5 py-0.5 bg-white/60 rounded border border-gold/30">
                Coloca la foto en /public/maria.jpg
              </span>
            </div>
          )}

          {/* Superposición sutil de degradado inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/35 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* 3. JERARQUÍA TIPOGRÁFICA ESCALADA Y ARMONIOSA */}
      <div className="space-y-1.5 mt-3 max-w-sm shrink-0">
        {/* Nombre Principal en Serif Escala Ampliada */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-purple-950 tracking-wider font-normal uppercase leading-tight drop-shadow-xs">
          {celebrantName}
        </h1>

        {/* Subtítulo "Mis XV años" con líneas decorativas estilizadas */}
        <div className="flex items-center justify-center gap-3 pt-0.5">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-purple-300 to-gold" />
          <h2 className="text-lg sm:text-xl font-heading italic text-purple-700/90 tracking-wide font-serif">
            {title}
          </h2>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent via-purple-300 to-gold" />
        </div>

        {/* Fecha nítida y espaciada */}
        <p className="text-xs sm:text-sm font-sans font-medium text-stone-500 tracking-[0.25em] uppercase pt-1">
          {formattedDate}
        </p>
      </div>

      {/* 4. BOTÓN ANCLAJE FLUIDO AL SCROLL */}
      <div className="mt-3.5 shrink-0">
        <a
          href="#rsvp"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-lavender-200 text-purple-900/80 text-xs font-medium tracking-wide shadow-xs hover:shadow-md hover:bg-white transition duration-300 group"
        >
          <span>Confirmar Asistencia</span>
          <ChevronDown className="w-3.5 h-3.5 text-purple-600 group-hover:translate-y-0.5 transition-transform duration-300" />
        </a>
      </div>
    </section>
  );
};
