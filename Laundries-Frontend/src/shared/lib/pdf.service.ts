import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface TicketData {
  codigo: string;
  fecha: string; // Fecha de recepción
  clienteNombre: string;
  clienteTelefono?: string;
  sucursalNombre: string;
  empleadoNombre: string;
  items: Array<{
    servicio: string; // Nombre del servicio (ej: Lavado)
    peso: number;
    numeroPrendas?: number;
    precio: number;
    subtotal: number;
    detalles?: string;
  }>;
  total: number;
  anotaciones?: string;
}

/**
 * Genera y descarga un ticket PDF de venta
 */
export const generateTicketPDF = (data: TicketData): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4", // Formato A4
  });

  // Configuración de colores
  const primaryColor = [0, 0, 0]; // Negro
  const secondaryColor = [100, 100, 100]; // Gris

  // Ancho de página A4: 210mm
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // ===== CABECERA =====
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("LAVANDERÍA", pageWidth / 2, 30, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`Sucursal: ${data.sucursalNombre}`, pageWidth / 2, 40, { align: "center" });

  const fechaHora = new Date(data.fecha).toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFontSize(11);
  doc.text(`Fecha: ${fechaHora}`, pageWidth / 2, 48, { align: "center" });

  // Línea separadora
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, 55, pageWidth - margin, 55);

  // ===== INFO CLIENTE =====
  let yPos = 65;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE", margin, yPos);
  
  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Nombre: ${data.clienteNombre}`, margin, yPos);
  
  if (data.clienteTelefono) {
    yPos += 6;
    doc.text(`Tel: ${data.clienteTelefono}`, margin, yPos);
  }

  // Línea separadora
  yPos += 8;
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // ===== CÓDIGO DE RECOGIDA =====
  yPos += 10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("CÓDIGO DE RECOGIDA", pageWidth / 2, yPos, { align: "center" });
  
  yPos += 8;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.codigo, pageWidth / 2, yPos, { align: "center" });

  // Línea separadora
  yPos += 8;
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // ===== TABLA DE ITEMS =====
  yPos += 8;
  
  // Verificar que hay items
  if (!data.items || data.items.length === 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("No hay items en esta orden", margin, yPos);
    console.warn("PDF: No hay items para mostrar en la tabla");
  } else {
    console.log("PDF: Generando tabla con", data.items.length, "items");
    const tableData = data.items.map((item) => {
      const peso = Number(item.peso) || 0;
      const subtotal = Number(item.subtotal) || 0;
      const prendas = item.numeroPrendas || 0;
      return [
        item.servicio || "Servicio no especificado",
        `${peso} kg${prendas > 0 ? ` / ${prendas} prendas` : ""}`,
        `$${subtotal.toFixed(2)}`,
      ];
    });

    console.log("PDF: Datos de la tabla:", tableData);

    autoTable(doc, {
      startY: yPos,
      head: [["Servicio", "Cant/Peso", "Subtotal"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
      },
      bodyStyles: {
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40, halign: "right" },
      },
      margin: { left: margin, right: margin },
      styles: {
        cellPadding: 4,
      },
    });
  }

  // Obtener la posición Y después de la tabla
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 30;

  // ===== TOTAL =====
  let totalY = finalY + 10;
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, totalY, pageWidth - margin, totalY);
  
  totalY += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total a Pagar: $${Number(data.total).toFixed(2)}`, pageWidth / 2, totalY, {
    align: "center",
  });

  // ===== ANOTACIONES (si existen) =====
  if (data.anotaciones) {
    totalY += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Anotaciones:", margin, totalY);
    totalY += 6;
    const splitAnotaciones = doc.splitTextToSize(data.anotaciones, contentWidth);
    doc.setFont("helvetica", "normal");
    doc.text(splitAnotaciones, margin, totalY);
    totalY += splitAnotaciones.length * 6;
  }

  // ===== FOOTER =====
  totalY += 10;
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, totalY, pageWidth - margin, totalY);
  
  totalY += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Atendido por: ${data.empleadoNombre}`, pageWidth / 2, totalY, {
    align: "center",
  });
  
  totalY += 6;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.text("¡Gracias por su preferencia!", pageWidth / 2, totalY, { align: "center" });

  // Descargar el PDF
  doc.save(`ticket-${data.codigo}-${Date.now()}.pdf`);
};

