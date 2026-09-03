'use client';

import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-4 text-center border-t border-lavender-100/60 mt-12">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="font-heading text-lg text-plum">María</span>
        <Heart className="w-3.5 h-3.5 text-rose-accent fill-rose-blush" />
        <span className="font-heading text-lg text-plum italic">Mis XV años</span>
      </div>
      <p className="text-[11px] text-plum/50 font-light">
        3 de Octubre de 2026 · Celebración Especial
      </p>
    </footer>
  );
};
