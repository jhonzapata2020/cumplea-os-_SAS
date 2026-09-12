'use client';

import React, { useState, useEffect } from 'react';
import { Lock, X, Loader2, AlertCircle, ShieldCheck, Search, Users, CheckCircle, XCircle, MessageSquare, Download, RefreshCw } from 'lucide-react';
import { AdminGuestItem } from '@/app/api/admin/guests-list/route';
import { generateReceptionPDF } from '@/lib/pdfGenerator';

interface AdminGuestListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminGuestListModal: React.FC<AdminGuestListModalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [guests, setGuests] = useState<AdminGuestItem[]>([]);
  const [metrics, setMetrics] = useState({
    totalConfirmed: 0,
    totalDeclined: 0,
    totalAttendees: 0,
    totalMessages: 0,
    totalRegistered: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'declined'>('all');

  // Control de tecla Escape y Scroll Lock en document.body
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Autocargar si existe un PIN autenticado previo en sessionStorage
    const savedPin = sessionStorage.getItem('admin_pin');
    if (savedPin) {
      setPin(savedPin);
      setIsAuthenticated(true);
      fetchGuestsList(savedPin);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const fetchGuestsList = async (currentPin: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/guests-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: currentPin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem('admin_pin');
        }
        setErrorMsg(data.error || 'PIN incorrecto.');
        setLoading(false);
        return;
      }

      setGuests(data.guests || []);
      setMetrics(data.metrics || {
        totalConfirmed: 0,
        totalDeclined: 0,
        totalAttendees: 0,
        totalMessages: 0,
        totalRegistered: 0,
      });
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_pin', currentPin);
    } catch {
      setErrorMsg('Error de conexión al cargar la lista de invitados.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length !== 4) {
      setErrorMsg('Por favor ingresa un PIN de 4 dígitos.');
      return;
    }
    fetchGuestsList(pin);
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch('/api/admin/guests-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'No se pudo descargar el PDF.');
        setPdfLoading(false);
        return;
      }

      const doc = await generateReceptionPDF(data.guests || [], data.metrics);
      doc.save('Reporte_Recepcion_XV_Maria_Jose.pdf');
    } catch {
      alert('Error descargando el PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filtrado de invitados en el cliente
  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.whatsapp.includes(searchQuery);

    if (activeFilter === 'confirmed') return matchesSearch && g.attending === true;
    if (activeFilter === 'declined') return matchesSearch && g.attending === false;
    return matchesSearch;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* 1. Backdrop independiente desenfocado con click para cerrar */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* 2. Tarjeta interactiva del Modal */}
      <div className="relative z-50 w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl border border-purple-100 text-plum flex flex-col max-h-[90vh] overflow-hidden my-auto animate-fade-in">
        
        {/* Encabezado Modal */}
        <div className="p-4 sm:p-5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-lavender-50 via-white to-rose-soft/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-xs">
              <Users className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl text-plum font-semibold leading-tight">
                Gestión de Invitados
              </h3>
              <p className="text-[11px] text-stone-500 font-light">
                Panel Oficial — XV Años María José
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 rounded-full text-stone-400 hover:text-plum hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vista si NO está autenticado */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center max-w-sm mx-auto">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-heading text-lg text-plum font-semibold">
                Ingresa el PIN de Anfitrión
              </h4>
              <p className="text-xs text-stone-500 font-light mt-1">
                Consulta los confirmados y métricas de aforo en pantalla.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 max-w-sm mx-auto">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-4">
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full text-center tracking-[0.6em] text-xl py-3 rounded-2xl bg-stone-50 border border-stone-300 text-plum font-mono outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando PIN...</span>
                  </>
                ) : (
                  <span>Ver Lista en Pantalla</span>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <span className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Acceso seguro de anfitrión
              </span>
            </div>
          </div>
        ) : (
          /* Dashboard autenticado */
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* 1. Tarjetas de Métricas de Aforo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-center">
                <p className="text-[9px] uppercase font-medium text-emerald-800 tracking-wider">Confirmados</p>
                <p className="text-xl font-bold text-emerald-700 font-heading mt-0.5">{metrics.totalConfirmed}</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-purple-50/80 border border-purple-200/60 text-center">
                <p className="text-[9px] uppercase font-medium text-purple-800 tracking-wider">Total Aforo</p>
                <p className="text-xl font-bold text-purple-700 font-heading mt-0.5">{metrics.totalAttendees}</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <p className="text-[9px] uppercase font-medium text-stone-600 tracking-wider">No Asisten</p>
                <p className="text-xl font-bold text-stone-700 font-heading mt-0.5">{metrics.totalDeclined}</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-200/60 text-center">
                <p className="text-[9px] uppercase font-medium text-rose-800 tracking-wider">Mensajes</p>
                <p className="text-xl font-bold text-rose-700 font-heading mt-0.5">{metrics.totalMessages}</p>
              </div>
            </div>

            {/* 2. Barra de búsqueda y Filtros */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-purple-500 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o cel..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-plum outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    activeFilter === 'all' ? 'bg-white text-purple-900 shadow-xs' : 'text-stone-600 hover:text-plum'
                  }`}
                >
                  Todos ({metrics.totalRegistered})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('confirmed')}
                  className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    activeFilter === 'confirmed' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-plum'
                  }`}
                >
                  Sí ({metrics.totalConfirmed})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('declined')}
                  className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    activeFilter === 'declined' ? 'bg-white text-rose-800 shadow-xs' : 'text-stone-600 hover:text-plum'
                  }`}
                >
                  No ({metrics.totalDeclined})
                </button>
              </div>
            </div>

            {/* 3. Lista Responsiva de Invitados */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {loading ? (
                <div className="py-8 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span>Cargando lista de invitados...</span>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-2xl">
                  No se encontraron invitados con los criterios seleccionados.
                </div>
              ) : (
                filteredGuests.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-purple-200 transition text-left space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-heading font-semibold text-sm text-purple-950">
                        {g.full_name}
                      </h5>
                      {g.attending === true ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Sí asiste ({g.guest_count} pases)
                        </span>
                      ) : g.attending === false ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">
                          <XCircle className="w-3 h-3 text-stone-400" />
                          No asistirá
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-medium">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-500 pt-0.5">
                      <span>WhatsApp: <a href={`https://wa.me/${g.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-mono text-purple-700 underline">+{g.whatsapp}</a></span>
                    </div>

                    {g.message && (
                      <div className="mt-1 p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-[11px] text-purple-900 italic flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                        <span>&ldquo;{g.message}&rdquo;</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* 4. Acciones de pie de dashboard: Descargar PDF & Actualizar */}
            <div className="pt-3 border-t border-purple-100 flex flex-col sm:flex-row gap-2 items-center justify-between">
              <button
                type="button"
                onClick={() => fetchGuestsList(pin)}
                className="text-xs text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar lista</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {pdfLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generando PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-gold-accent" />
                    <span>Descargar PDF (A-Z)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
