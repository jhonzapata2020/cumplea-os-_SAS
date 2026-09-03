'use client';

import React, { useState } from 'react';
import { User, Phone, CheckCircle2, XCircle, Users, MessageSquare, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { RSVPFormData, RSVPResult } from '@/types/database';
import { submitRSVP } from '@/lib/supabase';

interface RSVPFormProps {
  eventId: string;
  onSuccess: (result: RSVPResult) => void;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ eventId, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validaciones básicas de la interfaz
    if (!fullName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!whatsapp.trim()) {
      setErrorMsg('Por favor ingresa tu número de WhatsApp.');
      return;
    }

    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 7) {
      setErrorMsg('Por favor ingresa un número de WhatsApp válido (mínimo 7 dígitos).');
      return;
    }

    if (attending === null) {
      setErrorMsg('Por favor indica si podrás acompañarnos.');
      return;
    }

    if (attending && (guestCount < 1 || isNaN(guestCount))) {
      setErrorMsg('La cantidad de personas debe ser al menos 1.');
      return;
    }

    setLoading(true);

    const formData: RSVPFormData = {
      fullName: fullName.trim(),
      whatsapp: cleanPhone,
      attending,
      guestCount: attending ? guestCount : 0,
      message: message.trim(),
    };

    try {
      const result = await submitRSVP(eventId, formData);

      if (result.success) {
        onSuccess(result);
      } else {
        setErrorMsg(result.message);
      }
    } catch {
      setErrorMsg('Ocurrió un inconveniente al enviar la confirmación. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto my-8 px-4" id="rsvp">
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-white/90 shadow-glass">
        {/* Encabezado del Formulario */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-100/80 text-lavender-700 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Confirmación</span>
          </div>
          <h3 className="font-heading text-3xl sm:text-4xl text-plum font-normal">
            Confirma tu asistencia
          </h3>
          <p className="text-xs text-plum/70 font-light mt-1">
            Por favor completa tus datos antes del evento.
          </p>
        </div>

        {/* Mensaje de Error Elegante */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Nombre Completo */}
          <div>
            <label className="block text-xs font-medium text-plum/80 mb-1.5 ml-1">
              Nombre completo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-lavender-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Camila Morales"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 border border-lavender-200 text-plum text-sm placeholder:text-plum/40 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Campo: WhatsApp */}
          <div>
            <label className="block text-xs font-medium text-plum/80 mb-1.5 ml-1">
              Número de WhatsApp <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-lavender-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej. +57 300 123 4567"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 border border-lavender-200 text-plum text-sm placeholder:text-plum/40 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition"
              />
            </div>
            <p className="text-[10px] text-plum/50 mt-1 ml-1">
              Servirá para identificar tu respuesta si deseas actualizarla después.
            </p>
          </div>

          {/* Pregunta: ¿Nos acompañas? */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-plum/80 mb-2 ml-1">
              ¿Nos acompañas? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  attending === true
                    ? 'bg-gradient-to-b from-lavender-100 to-white border-lavender-500 text-lavender-900 shadow-sm ring-2 ring-lavender-300'
                    : 'bg-white/80 border-lavender-200 text-plum/70 hover:bg-lavender-50/50'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 ${
                    attending === true ? 'text-lavender-600 fill-lavender-200' : 'text-plum/40'
                  }`}
                />
                <span className="text-xs font-medium">Sí, estaré ahí</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  attending === false
                    ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-sm ring-2 ring-rose-200'
                    : 'bg-white/80 border-lavender-200 text-plum/70 hover:bg-rose-50/30'
                }`}
              >
                <XCircle
                  className={`w-5 h-5 ${
                    attending === false ? 'text-rose-500 fill-rose-100' : 'text-plum/40'
                  }`}
                />
                <span className="text-xs font-medium">No podré asistir</span>
              </button>
            </div>
          </div>

          {/* Campo condicional: Cantidad de personas */}
          {attending === true && (
            <div className="pt-2 animate-fade-in">
              <label className="block text-xs font-medium text-plum/80 mb-1.5 ml-1">
                ¿Cuántas personas asistirán contigo? <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-lavender-500">
                  <Users className="w-4 h-4" />
                </div>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 border border-lavender-200 text-plum text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition appearance-none cursor-pointer"
                >
                  <option value={1}>1 persona (solo yo)</option>
                  <option value={2}>2 personas</option>
                  <option value={3}>3 personas</option>
                  <option value={4}>4 personas</option>
                  <option value={5}>5 personas</option>
                </select>
              </div>
            </div>
          )}

          {/* Campo Opcional: Mensaje para María */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-plum/80 mb-1.5 ml-1">
              Déjale un mensaje a María <span className="text-plum/40 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 text-lavender-500">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tus felicitaciones o buenos deseos..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 border border-lavender-200 text-plum text-sm placeholder:text-plum/40 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          {/* Botón Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-lavender-600 via-purple-600 to-lavender-700 hover:from-lavender-700 hover:to-purple-800 text-white font-medium text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-gold-accent" />
                  <span>Confirmar asistencia</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
