'use client';

import React, { useState } from 'react';
import { User, Phone, CheckCircle2, XCircle, Users, MessageSquare, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { RSVPFormData, RSVPResult } from '@/types/database';
import { submitRSVP } from '@/lib/supabase';

interface RSVPFormProps {
  eventId: string;
  onSuccess: (result: RSVPResult, guestName: string, guestCount: number) => void;
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
        onSuccess(result, fullName.trim(), attending ? guestCount : 1);
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
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-xl shadow-purple-900/5">
        {/* Encabezado del Formulario */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-800 text-xs font-medium mb-2 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Confirmación de Asistencia</span>
          </div>
          <h3 className="font-heading text-3xl sm:text-4xl text-plum font-semibold">
            Confirma tu asistencia
          </h3>
          <p className="text-xs text-stone-500 font-light mt-1">
            Por favor completa tus datos para organizar tu lugar especial.
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
            <label className="block text-xs font-medium text-stone-700 mb-1.5 ml-1">
              Nombre completo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Camila Morales"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-300 text-plum text-sm placeholder:text-stone-400 placeholder:font-light focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>
          </div>

          {/* Campo: WhatsApp */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5 ml-1">
              Número de WhatsApp <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej. +57 300 123 4567"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-300 text-plum text-sm placeholder:text-stone-400 placeholder:font-light focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-1 ml-1">
              Servirá para identificar tu registro y permitirte modificarlo si lo necesitas.
            </p>
          </div>

          {/* Pregunta: ¿Nos acompañas? */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-stone-700 mb-2 ml-1">
              ¿Nos acompañas? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Opción SÍ - Estado activo púrpura sólido / inactivo sutil */}
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  attending === true
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md font-medium'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-purple-50/50 hover:border-purple-300'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 ${
                    attending === true ? 'text-white fill-purple-500' : 'text-stone-400'
                  }`}
                />
                <span className="text-xs">Sí, estaré ahí</span>
              </button>

              {/* Opción NO - Estado activo oscuro neutro / inactivo sutil */}
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  attending === false
                    ? 'bg-stone-700 text-white border-stone-700 shadow-md font-medium'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-rose-50/50 hover:border-stone-300'
                }`}
              >
                <XCircle
                  className={`w-5 h-5 ${
                    attending === false ? 'text-white fill-stone-600' : 'text-stone-400'
                  }`}
                />
                <span className="text-xs">No podré asistir</span>
              </button>
            </div>
          </div>

          {/* Campo condicional: Cantidad de personas (Aparece al marcar SÍ) */}
          {attending === true && (
            <div className="pt-2 animate-fade-in">
              <label className="block text-xs font-medium text-stone-700 mb-1.5 ml-1">
                ¿Cuántas personas asistirán contigo? <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                  <Users className="w-4 h-4" />
                </div>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-300 text-plum text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition appearance-none cursor-pointer"
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

          {/* Campo Opcional: Mensaje para María José */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-stone-700 mb-1.5 ml-1">
              Déjale un mensaje a María José <span className="text-stone-400 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 text-purple-500">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tus felicitaciones o buenos deseos..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-300 text-plum text-sm placeholder:text-stone-400 placeholder:font-light focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition resize-none"
              />
            </div>
          </div>

          {/* Botón Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium text-base shadow-lg shadow-purple-600/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
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
