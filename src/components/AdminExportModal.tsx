'use client';

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Lock, FileText, X, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

interface AdminExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminExportModal: React.FC<AdminExportModalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExportPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!pin || pin.length !== 4) {
      setErrorMsg('Por favor ingresa el PIN completo de 4 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/guests-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'PIN incorrecto.');
        setLoading(false);
        return;
      }

      // Generar PDF usando jsPDF y jspdf-autotable
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setTextColor(81, 43, 119);
      doc.text('Mis XV Años — María José Villegas', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(110, 110, 110);
      doc.text('Lista Oficial de Invitados (Orden Alfabético A-Z) · 3 de Octubre de 2026', 14, 27);

      const guests = data.guests || [];
      const tableRows = guests.map((g: { full_name: string; whatsapp: string }, index: number) => [
        index + 1,
        g.full_name,
        g.whatsapp ? `+${g.whatsapp}` : 'Sin teléfono',
      ]);

      if (tableRows.length === 0) {
        tableRows.push(['-', 'Sin invitados registrados aún', '-']);
      }

      autoTable(doc, {
        startY: 33,
        head: [['#', 'Nombre del Invitado(a)', 'Celular / WhatsApp']],
        body: tableRows,
        headStyles: {
          fillColor: [81, 43, 119],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'left',
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 110 },
          2: { cellWidth: 55 },
        },
        alternateRowStyles: {
          fillColor: [248, 245, 255],
        },
        styles: {
          fontSize: 9.5,
          cellPadding: 3.5,
        },
      });

      doc.save('Invitados_XV_Maria_Jose.pdf');
      setPin('');
      onClose();
    } catch {
      setErrorMsg('Error de conexión al generar el archivo PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* 1. Backdrop independiente desenfocado con click para cerrar */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* 2. Tarjeta interactiva del Modal */}
      <div className="relative z-50 w-full max-w-sm p-6 bg-white rounded-3xl shadow-2xl border border-purple-100 text-plum my-auto animate-fade-in">
        {/* Botón de cierre */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-plum hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado del Modal */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-2xl text-plum font-semibold">
            Lista de Invitados (PDF)
          </h3>
          <p className="text-xs text-stone-500 font-light mt-1">
            Ingresa el PIN de seguridad para descargar la lista oficial en orden A-Z.
          </p>
        </div>

        {/* Error de validación */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleExportPDF} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5 ml-1">
              PIN de 4 dígitos
            </label>
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full text-center tracking-[0.6em] text-lg py-3 rounded-xl bg-stone-50 border border-stone-300 text-plum font-mono focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Descargar PDF</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Acceso seguro protegido por PIN de administrador</span>
        </div>
      </div>
    </div>
  );
};
