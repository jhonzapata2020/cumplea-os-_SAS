'use client';

import React from 'react';
import { Heart } from 'lucide-react';

export const InvitationMessage: React.FC = () => {
  return (
    <section className="w-full max-w-md mx-auto my-6 px-4">
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/70 to-rose-soft/50 backdrop-blur-md border border-white/90 shadow-glass text-center">
        {/* Adorno superior de corazón */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-sm border border-gold/30 flex items-center justify-center">
          <Heart className="w-4 h-4 text-rose-accent fill-rose-blush" />
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl text-plum font-normal mb-3 italic">
          Con cariño
        </h3>

        <p className="text-sm sm:text-base text-plum/80 font-light leading-relaxed font-body">
          &ldquo;Hay momentos en la vida que son verdaderamente mágicos, y compartirlos con las personas que más quiero los hace inolvidables. Te espero para celebrar juntos mis 15 años, un día lleno de emoción, sueños y alegría.&rdquo;
        </p>

        <div className="mt-4 pt-4 border-t border-gold/20 flex items-center justify-center gap-2">
          <span className="h-1 w-1 rounded-full bg-gold" />
          <span className="text-xs font-serif italic text-lavender-700">María</span>
          <span className="h-1 w-1 rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
};
