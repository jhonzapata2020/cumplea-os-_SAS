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

      {/* 1. PASTILLA SUPERIOR COMPACTA */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-amber-300/40 text-[11px] tracking-widest text-plum/80 uppercase font-medium shadow-xs mb-3 animate-fade-in shrink-0">
        <Sparkles className="w-3 h-3 text-gold" />
        <span>Te invito a celebrar</span>
        <Sparkles className="w-3 h-3 text-gold" />
      </div>

      {/* 2. MARCO FOTOGRÁFICO DE ALTO PROTAGONISMO (Ratio 3:4 o 4:5, max-w-[340px] en móvil) */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/35 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* 3. NOMBRES Y SUBTÍTULOS COMPACTOS */}
      <div className="space-y-1 mt-2.5 max-w-sm shrink-0">
        <h1 className="font-heading text-3xl sm:text-5xl text-plum tracking-wider font-normal uppercase leading-tight drop-shadow-xs">
          {celebrantName}
        </h1>

        <div className="flex items-center justify-center gap-2.5 pt-0.5">
          <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-gold" />
          <h2 className="text-base sm:text-lg font-heading italic text-lavender-700 tracking-wide">
            {title}
          </h2>
          <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <p className="text-xs sm:text-sm font-light text-plum/80 tracking-widest uppercase pt-0.5">
          {formattedDate}
        </p>
      </div>

      {/* 4. BOTÓN ANCLAJE FLUIDO AL SCROLL */}
      <div className="mt-3.5 shrink-0">
        <a
          href="#rsvp"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-lavender-200 text-plum/80 text-xs font-medium tracking-wide shadow-xs hover:shadow-md hover:bg-white transition duration-300 group"
        >
          <span>Confirmar Asistencia</span>
          <ChevronDown className="w-3.5 h-3.5 text-purple-600 group-hover:translate-y-0.5 transition-transform duration-300" />
        </a>
      </div>
    </section>
  );
};
