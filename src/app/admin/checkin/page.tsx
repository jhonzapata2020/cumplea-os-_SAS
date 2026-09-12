'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, QrCode, CheckCircle, XCircle, Users, Sparkles, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function CheckinContent() {
  const searchParams = useSearchParams();
  const passIdFromUrl = searchParams.get('id') || '';

  const [pin, setPin] = useState('');
  const [passCodeInput, setPassCodeInput] = useState(passIdFromUrl);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [guestData, setGuestData] = useState<any | null>(null);
  const [verifiedPassCode, setVerifiedPassCode] = useState<string>('');

  // Cargar PIN guardado en sessionStorage de la visita actual
  useEffect(() => {
    const savedPin = sessionStorage.getItem('admin_pin');
    if (savedPin) {
      setPin(savedPin);
      setIsAuthenticated(true);
      if (passIdFromUrl) {
        verifyPass(savedPin, passIdFromUrl);
      }
    }
  }, [passIdFromUrl]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!pin || pin.length !== 4) {
      setErrorMsg('Ingresa un PIN de 4 dígitos.');
      return;
    }
    sessionStorage.setItem('admin_pin', pin);
    setIsAuthenticated(true);
    if (passCodeInput) {
      verifyPass(pin, passCodeInput);
    }
  };

  const verifyPass = async (currentPin: string, codeToVerify: string) => {
    if (!codeToVerify.trim()) {
      setErrorMsg('Ingresa un código de pase válido.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setGuestData(null);

    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: currentPin, passCode: codeToVerify.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem('admin_pin');
        }
        setErrorMsg(data.error || 'No se pudo verificar el pase.');
        return;
      }

      setGuestData(data.guest);
      setVerifiedPassCode(data.passCode);
    } catch {
      setErrorMsg('Error de conexión al verificar el pase.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPass(pin, passCodeInput);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-plum-dark via-plum to-purple-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Encabezado */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-tr from-lavender-400 to-rose-400 p-0.5 shadow-gold-glow flex items-center justify-center">
            <div className="w-full h-full bg-plum-dark rounded-full flex items-center justify-center">
              <QrCode className="w-7 h-7 text-gold-accent" />
            </div>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl text-white font-semibold">
            Recepción & Check-in
          </h1>
          <p className="text-xs text-white/70 font-light mt-1">
            Mis XV Años — María José Villegas
          </p>
        </div>

        {/* Formulario de Login PIN si no está autenticado */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Lock className="w-6 h-6 text-gold-accent mx-auto mb-2" />
              <label className="block text-xs text-white/80 font-medium mb-2">
                Ingresa el PIN de recepción (4 dígitos)
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full text-center tracking-[0.6em] text-xl py-3 rounded-xl bg-white/10 border border-white/20 text-white font-mono outline-none focus:border-gold-accent transition"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold to-amber-500 text-plum font-semibold text-sm shadow-md hover:brightness-110 transition cursor-pointer"
            >
              Acceder al Escáner
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Buscador manual de pase */}
            <form onSubmit={handleManualCheckin} className="flex gap-2">
              <input
                type="text"
                value={passCodeInput}
                onChange={(e) => setPassCodeInput(e.target.value)}
                placeholder="Ej. MJ-2026-CAMI-02"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono outline-none focus:border-gold-accent"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Buscando...' : 'Verificar'}
              </button>
            </form>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Resultado de Verificación */}
            {guestData ? (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-gold/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/40">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>PASE VÁLIDO</span>
                  </div>
                  <span className="text-xs font-mono text-white/60">{verifiedPassCode}</span>
                </div>

                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Invitado(a)</p>
                  <h3 className="text-xl font-heading font-semibold text-white mt-0.5">
                    {guestData.full_name}
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    WhatsApp: <span className="font-mono text-gold-accent">+{guestData.whatsapp}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-white/50 uppercase">Asistencia</p>
                    <p className="text-xs font-medium text-emerald-300 flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Confirma asistencia
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-white/50 uppercase">Pases Autorizados</p>
                    <p className="text-xs font-semibold text-gold-accent flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5" />
                      {guestData.guest_count} {guestData.guest_count === 1 ? 'Persona' : 'Personas'}
                    </p>
                  </div>
                </div>

                {guestData.message && (
                  <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/30 text-xs text-white/80 italic">
                    &ldquo;{guestData.message}&rdquo;
                  </div>
                )}
              </div>
            ) : verifiedPassCode && !loading ? (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-amber-200">Invitado no encontrado en BD</h4>
                <p className="text-xs text-white/70 font-light mt-1">
                  El código <span className="font-mono text-gold-accent">{verifiedPassCode}</span> pertenece a una confirmación válida en cliente pero no registra fila previa en Supabase.
                </p>
              </div>
            ) : null}

            {/* Acciones */}
            <div className="pt-2 flex items-center justify-between text-xs text-white/60">
              <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white transition">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a la invitación</span>
              </Link>
              <button
                onClick={() => {
                  setGuestData(null);
                  setVerifiedPassCode('');
                  setPassCodeInput('');
                }}
                className="inline-flex items-center gap-1 hover:text-gold-accent transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminCheckinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-plum-dark flex items-center justify-center text-white text-sm">
        Cargando escáner de recepción...
      </div>
    }>
      <CheckinContent />
    </Suspense>
  );
}
