'use client';

import React, { useState } from 'react';
import { Heart, FileText } from 'lucide-react';
import { AdminExportModal } from './AdminExportModal';

export const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="w-full py-8 px-4 text-center border-t border-lavender-100/60 mt-12">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="font-heading text-lg text-plum">María José</span>
        <Heart className="w-3.5 h-3.5 text-rose-accent fill-rose-blush" />
        <span className="font-heading text-lg text-plum italic">Mis XV años</span>
      </div>
      <p className="text-[11px] text-plum/50 font-light mb-4">
        3 de Octubre de 2026 · Celebración Especial
      </p>

      {/* Acceso discreto para descargar lista de invitados en PDF */}
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[11px] text-purple-900 font-medium transition cursor-pointer opacity-80 hover:opacity-100"
        >
          <FileText className="w-3 h-3 text-purple-600" />
          <span>👑 Lista de Invitados (PDF)</span>
        </button>
      </div>

      {/* Modal de descarga protegido por PIN */}
      <AdminExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </footer>
  );
};
