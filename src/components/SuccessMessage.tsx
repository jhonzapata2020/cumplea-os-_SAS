'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { Heart, Sparkles, RefreshCw, Ticket, Camera, Download } from 'lucide-react';
import { Event } from '@/types/database';
import { playCelebrationWaltzSound } from '@/lib/sound';

interface SuccessMessageProps {
  event: Event;
  isUpdate?: boolean;
  guestName?: string;
  guestCount?: number;
  onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  event,
  isUpdate,
  guestName = 'Invitado Especial',
  guestCount = 1,
  onReset,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D8B4F8', '#FFF0F5', '#D4AF37', '#8B5CF6'],
      });
    } catch {
      // Ignorar si el navegador restringe animaciones
    }

    // Disparar audio de celebración de vals con desvanecimiento de 5s y resiliencia total
    playCelebrationWaltzSound();
  }, []);

  // Código único de reserva y URL de check-in escaneable
  const cleanNameCode = guestName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'INV';
  const passCode = `MJ-2026-${cleanNameCode}-${String(guestCount).padStart(2, '0')}`;
  const checkInUrl = `https://cumplea-os-sas.vercel.app/admin/checkin?id=${passCode}`;

  return (
    <section className="w-full max-w-md mx-auto my-8 px-4 animate-fade-in-up">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/95 via-white/90 to-rose-soft/50 backdrop-blur-md border border-white/90 shadow-glass text-center">
        {/* Icono de Corazón Celebrativo */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-lavender-100 to-rose-blush border-2 border-gold/40 flex items-center justify-center shadow-gold-glow">
          <Heart className="w-8 h-8 text-rose-accent fill-rose-blush animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-lavender-100/90 text-lavender-800 text-xs font-medium mb-3 shadow-sm border border-gold/30">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>{isUpdate ? 'Respuesta actualizada' : '¡Confirmación Exitosa!'}</span>
        </div>

        <h3 className="font-heading text-3xl sm:text-4xl text-plum font-normal mb-2">
          ¡Gracias por confirmar!
        </h3>

        <p className="text-sm text-plum/80 font-light leading-relaxed mb-6">
          María José estará feliz de compartir este momento inolvidable contigo.
        </p>

        {/* 1. PASE DIGITAL VISUAL TIPO CREDENCIAL / TICKET */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-b from-plum-dark via-plum to-purple-950 text-white text-left shadow-2xl border border-gold/40 mb-4">
          {/* Adorno holográfico de fondo */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-lavender-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gold/20 rounded-full blur-2xl pointer-events-none" />

          {/* Encabezado del Pase */}
          <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-gold-accent" />
              <span className="text-[10px] tracking-widest uppercase font-medium text-gold-accent">
                Pase Digital de Entrada
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/60">{passCode}</span>
          </div>

          {/* Nombre y Pases del Invitado */}
          <div className="space-y-1 mb-4">
            <p className="text-[10px] uppercase tracking-wider text-white/60 font-light">Invitado(a)</p>
            <p className="text-base sm:text-lg font-semibold text-white font-heading tracking-wide">
              {guestName}
            </p>

            {/* Pastilla con indicación clara de 1 persona o más personas */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-gold-accent text-xs font-semibold mt-1 border border-gold/30 shadow-xs">
              <span>{guestCount === 1 ? 'Pase válido para 1 persona' : `Pase válido para ${guestCount} personas`}</span>
            </div>
          </div>

          {/* Detalles Resumidos del Evento en Credencial */}
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-white/10 py-2.5 mb-3 text-white/80">
            <div>
              <p className="text-[10px] text-white/50 uppercase">Fecha & Hora</p>
              <p className="font-medium text-white">Sáb, 3 Oct - 7:30 PM</p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase">Lugar</p>
              <p className="font-medium text-white">{event?.location_name || 'Cholas'} (2do Piso)</p>
            </div>
          </div>

          {/* Código QR Real Dinámico y Escaneable */}
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="p-2 bg-white rounded-xl shadow-md shrink-0 flex items-center justify-center">
              <QRCodeSVG
                value={checkInUrl}
                size={74}
                bgColor="#FFFFFF"
                fgColor="#23132F"
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="text-[11px] text-white/70 leading-tight">
              <p className="font-medium text-white mb-0.5">Pase de Confirmación</p>
              <p className="text-[10px] text-white/60 font-light">
                Presenta este pase en tu pantalla al ingresar a la recepción.
              </p>
            </div>
          </div>
        </div>

        {/* 2. BOTÓN DE ACCIÓN Y AVISO DE GUARDADO EN GALERÍA (CAPTURA) */}
        <div className="mb-6 space-y-2">
          <div className="w-full py-3.5 px-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs">
            <Camera className="w-4 h-4 text-purple-600 shrink-0" />
            <Download className="w-4 h-4 text-purple-600 shrink-0" />
            <span>📸 Guardar Pase en Galería / Tomar Captura</span>
          </div>
          <p className="text-[11px] text-stone-500 font-light italic leading-relaxed">
            💡 Te sugerimos tomar una captura de pantalla a este pase para guardarlo en tu galería y tenerlo a mano en la recepción.
          </p>
        </div>

        {/* Botón para actualizar respuesta si lo necesita */}
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 text-xs text-lavender-700 hover:text-lavender-900 underline font-medium transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>¿Deseas modificar tu respuesta?</span>
        </button>
      </div>
    </section>
  );
};
