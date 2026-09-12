import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFGuestItem {
  id?: string;
  full_name: string;
  whatsapp: string;
  attending: boolean | null;
  guest_count: number;
}

export interface PDFMetrics {
  confirmedGuests: number;
  confirmedCompanions: number;
  totalConfirmedPeople: number;
  pendingGuests: number;
  declinedGuests: number;
  totalRegistered: number;
}

// Cargador seguro de imagen para marca de agua en cliente
const loadWatermarkImage = (url: string = '/maria.jpg'): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

export const generateReceptionPDF = async (
  guests: PDFGuestItem[],
  customMetrics?: Partial<PDFMetrics>
): Promise<jsPDF> => {
  // 1. Calcular métricas si no se proporcionan
  const confirmedGuests =
    customMetrics?.confirmedGuests ?? guests.filter((g) => g.attending === true).length;

  const confirmedCompanions =
    customMetrics?.confirmedCompanions ??
    guests
      .filter((g) => g.attending === true)
      .reduce((sum, g) => sum + Math.max(0, (g.guest_count || 1) - 1), 0);

  const totalConfirmedPeople =
    customMetrics?.totalConfirmedPeople ??
    guests
      .filter((g) => g.attending === true)
      .reduce((sum, g) => sum + (g.guest_count || 1), 0);

  const pendingGuests =
    customMetrics?.pendingGuests ?? guests.filter((g) => g.attending === null).length;

  const declinedGuests =
    customMetrics?.declinedGuests ?? guests.filter((g) => g.attending === false).length;

  // 2. Inicializar documento en Formato A4 Horizontal (Landscape)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Intentar cargar la marca de agua
  const watermarkImg = await loadWatermarkImage('/maria.jpg');

  // 3. Encabezado Editorial Elegante
  // Barra superior morada de acento
  doc.setFillColor(81, 43, 119); // #512B77
  doc.rect(14, 10, 269, 3, 'F');

  // Título principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(81, 43, 119);
  doc.text('Mis XV Años — María José Villegas', 14, 20);

  // Subtítulo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(109, 40, 217);
  doc.text('Reporte de recepción e invitados', 14, 26);

  // Datos del evento
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(85, 85, 85);
  doc.text('Sábado 3 de octubre de 2026 · 7:30 p. m.', 14, 32);
  doc.text('Bar y Restaurante Las Cholas · Turbo, Antioquia', 14, 37);

  // Marca de agua sutil en la esquina superior derecha tras las métricas/título
  if (watermarkImg) {
    try {
      (doc as any).saveGraphicsState();
      (doc as any).setGState(new (doc as any).GState({ opacity: 0.08 }));
      doc.addImage(watermarkImg, 'JPEG', 230, 10, 48, 48);
      (doc as any).restoreGraphicsState();
    } catch {
      // Ignorar si el motor gráfico no admite opacity en esta instancia
    }
  }

  // 4. Tarjetas de Métricas de Resumen (Y = 42 mm)
  const drawMetricCard = (
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    val: number,
    isHighlight = false
  ) => {
    doc.setFillColor(isHighlight ? 243 : 248, isHighlight ? 232 : 245, isHighlight ? 255 : 255);
    doc.setDrawColor(isHighlight ? 147 : 221, isHighlight ? 51 : 214, isHighlight ? 234 : 254);
    doc.setLineWidth(isHighlight ? 0.6 : 0.3);
    doc.roundedRect(x, y, w, h, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(isHighlight ? 126 : 109, isHighlight ? 34 : 40, isHighlight ? 206 : 217);
    doc.text(label, x + w / 2, y + 5.5, { align: 'center' });

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(81, 43, 119);
    doc.text(String(val), x + w / 2, y + 13.5, { align: 'center' });
  };

  const cardY = 42;
  const cardW = 51;
  const cardH = 17;
  const gap = 3.5;

  drawMetricCard(14, cardY, cardW, cardH, 'INVITADOS CONFIRMADOS', confirmedGuests);
  drawMetricCard(14 + (cardW + gap), cardY, cardW, cardH, 'ACOMPAÑANTES CONF.', confirmedCompanions);
  drawMetricCard(14 + (cardW + gap) * 2, cardY, cardW, cardH, 'TOTAL PERSONAS CONFIRMADAS', totalConfirmedPeople, true);
  drawMetricCard(14 + (cardW + gap) * 3, cardY, cardW, cardH, 'INVITADOS PENDIENTES', pendingGuests);
  drawMetricCard(14 + (cardW + gap) * 4, cardY, cardW, cardH, 'NO ASISTIRÁN', declinedGuests);

  // 5. Tabla Principal de Invitados (autoTable)
  const tableRows = guests.map((g, index) => {
    const isConfirmed = g.attending === true;
    const isDeclined = g.attending === false;

    const companions = isConfirmed ? Math.max(0, (g.guest_count || 1) - 1) : 0;
    const totalPeople = g.guest_count || 1;
    const statusLabel = isConfirmed ? 'Confirmado' : isDeclined ? 'No asistirá' : 'Pendiente';
    const formattedPhone = g.whatsapp ? `+${g.whatsapp.replace(/\D/g, '')}` : 'Sin registro';

    return [
      index + 1,
      g.full_name,
      formattedPhone,
      isConfirmed ? (companions > 0 ? `${companions}` : '0') : '-',
      `${totalPeople}`,
      statusLabel,
    ];
  });

  autoTable(doc, {
    startY: 64,
    head: [['#', 'Invitado principal', 'Celular / WhatsApp', 'Acompañantes', 'Total personas', 'Estado']],
    body: tableRows.length > 0 ? tableRows : [['-', 'Sin invitados registrados aún', '-', '-', '-', '-']],
    headStyles: {
      fillColor: [81, 43, 119],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 3.5,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 92 },
      2: { cellWidth: 48 },
      3: { cellWidth: 32, halign: 'center' },
      4: { cellWidth: 35, halign: 'center' },
      5: { cellWidth: 50, halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [248, 245, 255], // Lavanda muy suave
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      valign: 'middle',
      textColor: [40, 40, 40],
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        const val = String(data.cell.raw);
        if (val === 'Confirmado') {
          data.cell.styles.textColor = [21, 128, 61]; // Esmeralda
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'No asistirá') {
          data.cell.styles.textColor = [190, 18, 60]; // Rosa/Rojo
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Pendiente') {
          data.cell.styles.textColor = [180, 83, 9]; // Ámbar
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  // 6. Sección Destacada Final: TOTAL DE PERSONAS ESPERADAS EN LA FIESTA
  const finalY = (doc as any).lastAutoTable?.finalY || 150;
  let bannerY = finalY + 6;

  // Verificar si cabe en la página actual antes del pie de página (Y=195)
  if (bannerY + 16 > 192) {
    doc.addPage();
    bannerY = 20;
  }

  doc.setFillColor(81, 43, 119); // Morado oscuro
  doc.setDrawColor(212, 175, 55); // Borde Dorado
  doc.setLineWidth(0.6);
  doc.roundedRect(14, bannerY, 269, 14, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL DE PERSONAS ESPERADAS EN LA FIESTA (Confirmados + Acompañantes):', 20, bannerY + 9);

  doc.setFontSize(13);
  doc.setTextColor(253, 224, 71); // Texto amarillo dorado
  doc.text(`${totalConfirmedPeople} PERSONAS`, 277, bannerY + 9, { align: 'right' });

  // 7. Pie de Página y Numeración de Páginas en todo el documento
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Línea separadora de pie de página
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(14, 198, 283, 198);

    // Texto confidencial y página
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Reporte confidencial de recepción · XV Años María José', 14, 204);
    doc.text(`Página ${i} de ${pageCount}`, 283, 204, { align: 'right' });
  }

  return doc;
};
