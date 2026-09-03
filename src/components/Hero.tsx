'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Heart } from 'lucide-react';

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
    <section className="relative flex flex-col items-center justify-center text-center pt-8 pb-10 px-4 overflow-hidden">
      {/* Elementos decorativos de fondo con resplandor romántico */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-rose-blush via-lavender-200 to-gold-accent opacity-60 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute top-40 -left-10 w-48 h-48 bg-lavender-300 opacity-30 rounded-full blur-2xl -z-10" />
      <div className="absolute top-60 -right-10 w-48 h-48 bg-rose-blush opacity-40 rounded-full blur-2xl -z-10" />

      {/* Insignia superior sutil */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-gold/30 text-xs tracking-widest text-plum/80 uppercase font-medium shadow-sm mb-6 animate-fade-in">
        <Sparkles className="w-3.5 h-3.5 text-gold" />
        <span>Te invito a celebrar</span>
        <Sparkles className="w-3.5 h-3.5 text-gold" />
      </div>

      {/* MARCO DE FOTOGRAFÍA PRINCIPAL DE MARÍA */}
      <div className="relative mb-6 group animate-fade-in-up">
        {/* Anillo exterior de brillo dorado/lavanda */}
        <div className="absolute -inset-1.5 rounded-[40px] bg-gradient-to-b from-gold via-lavender-300 to-gold/70 opacity-80 blur-[2px] group-hover:opacity-100 transition duration-500" />
        
        {/* Contenedor de la foto de María */}
        <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-[38px] overflow-hidden border-2 border-white/80 shadow-gold-glow bg-gradient-to-b from-lavender-100 to-rose-soft">
          {!imageError ? (
            <Image
              src={photoUrl}
              alt={`Fotografía de ${celebrantName}`}
              fill
              priority
              sizes="(max-width: 640px) 256px, 288px"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-lavender-100 to-rose-blush">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mb-3 shadow-sm border border-gold/40">
                <Heart className="w-8 h-8 text-lavender-500 fill-lavender-200" />
              </div>
              <p className="font-heading text-2xl text-plum font-semibold mb-1">{celebrantName}</p>
              <p className="text-xs text-plum/70 font-light">Fotografía de María</p>
              <span className="mt-3 text-[10px] text-plum/50 px-3 py-1 bg-white/60 rounded-md border border-gold/30">
                Coloca la foto en /public/maria.jpg
              </span>
            </div>
          )}

          {/* Superposición sutil de degradado inferior para integración suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Detalle decorativo flotante de corona o destello */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full border border-gold/40 shadow-md flex items-center gap-1.5">
          <span className="text-xs font-serif italic text-gold-dark font-medium">Mis 15 Años</span>
        </div>
      </div>

      {/* TEXTOS Y NOMBRES */}
      <div className="space-y-2 mt-4 max-w-sm">
        <h1 className="font-heading text-5xl sm:text-6xl text-plum tracking-wider font-normal uppercase drop-shadow-sm">
          {celebrantName}
        </h1>

        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold" />
          <h2 className="text-lg sm:text-xl font-heading italic text-lavender-700 tracking-wide">
            {title}
          </h2>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold" />
        </div>

        {/* FECHA DESTACADA */}
        <p className="text-base sm:text-lg font-light text-plum/90 tracking-widest pt-2 uppercase">
          {formattedDate}
        </p>
      </div>
    </section>
  );
};
