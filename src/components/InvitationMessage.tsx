'use client';

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const InvitationMessage: React.FC = () => {
  return (
    <section className="w-full max-w-md mx-auto my-8 px-4" id="mensaje">
      <div className="relative p-7 sm:p-9 rounded-3xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-xl shadow-purple-900/5 text-center">
        {/* Adorno superior de corazón */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xs border border-gold/40 flex items-center justify-center">
          <Heart className="w-4 h-4 text-rose-accent fill-rose-blush" />
        </div>

        <div className="inline-flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-purple-700 font-medium mb-3">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Un momento especial</span>
        </div>

        {/* Texto Personal Emotivo */}
        <p className="font-heading text-xl sm:text-2xl text-plum/90 font-normal leading-relaxed italic">
          &ldquo;Después de tantos sueños, ilusiones y momentos compartidos, llegó el día que siempre imaginé. Quiero celebrar este momento tan especial contigo.&rdquo;
        </p>

        {/* Dedicatoria / Firma de la Anfitriona */}
        <div className="mt-5 pt-4 border-t border-purple-100/80 flex flex-col items-center justify-center gap-1">
          <span className="font-heading text-lg font-semibold text-purple-950">
            María José Villegas
          </span>
          <span className="text-xs font-serif italic text-stone-500">
            &amp; Familia Villegas
          </span>
        </div>
      </div>
    </section>
  );
};
