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
    fechaEntrega?: string; // Fecha de entrega estimada del item
  }>;
  total: number;
  anotaciones?: string;
}

/**
 * Genera y descarga un ticket PDF de venta en formato Ticket (80mm)
 */
export const generateTicketPDF = (data: TicketData): void => {
  // 1. Configuración de dimensiones para ticket (80mm ancho estándar)
  const ticketWidth = 80; 
  const margin = 5; 
  
  // Calculamos una altura estimada para que el PDF no corte contenido
  // Base para cabecera/pie + espacio por item + espacio por anotaciones
  const estimatedHeight = 180 + (data.items.length * 10) + (data.anotaciones ? 30 : 0);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [ticketWidth, estimatedHeight], // Formato Ticket dinámico
  });

  // Configuración de colores (IGUAL AL ORIGINAL)
  const primaryColor: [number, number, number] = [0, 0, 0]; // Negro
  const secondaryColor: [number, number, number] = [100, 100, 100]; // Gris

  const pageWidth = ticketWidth;
  const contentWidth = pageWidth - (margin * 2);
  const centerX = pageWidth / 2;

  // ===== CABECERA =====
  let yPos = 10; // Empezamos más arriba para no desperdiciar papel

  doc.setFontSize(16); // Escalado de 24 a 16
  doc.setFont("helvetica", "bold");
  doc.text("LAVANDERÍA", centerX, yPos, { align: "center" });

  yPos += 6;
  doc.setFontSize(10); // Escalado de 14 a 10
  doc.setFont("helvetica", "normal");
  // splitTextToSize evita que el nombre de la sucursal se salga del ancho
  const sucursalLines = doc.splitTextToSize(`Sucursal: ${data.sucursalNombre}`, contentWidth);
  doc.text(sucursalLines, centerX, yPos, { align: "center" });
  yPos += (sucursalLines.length * 4);

  const fechaHora = new Date(data.fecha).toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFontSize(9); // Escalado de 11 a 9
  doc.text(`Fecha: ${fechaHora}`, centerX, yPos, { align: "center" });

  // Línea separadora
  yPos += 4;
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // ===== INFO CLIENTE =====
  yPos += 6;
  doc.setFontSize(10); // Escalado de 12 a 10
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE", margin, yPos);
  
  yPos += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9); // Escalado de 11 a 9
  const nombreClienteLines = doc.splitTextToSize(`Nombre: ${data.clienteNombre}`, contentWidth);
  doc.text(nombreClienteLines, margin, yPos);
  yPos += (nombreClienteLines.length * 4);
  
  if (data.clienteTelefono) {
    doc.text(`Tel: ${data.clienteTelefono}`, margin, yPos);
    yPos += 4; // Espacio extra si hubo teléfono
  }

  // Línea separadora
  yPos += 2;
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // ===== CÓDIGO DE RECOGIDA =====
  yPos += 6;
  doc.setFontSize(12); // Escalado de 16 a 12
  doc.setFont("helvetica", "bold");
  doc.text("CÓDIGO DE RECOGIDA", centerX, yPos, { align: "center" });
  
  yPos += 7;
  doc.setFontSize(18); // Escalado de 20 a 18 (Grande)
  doc.setFont("helvetica", "bold");
  doc.text(data.codigo, centerX, yPos, { align: "center" });

  // Línea separadora
  yPos += 5;
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // ===== TABLA DE ITEMS =====
  yPos += 5;
  
  if (!data.items || data.items.length === 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("No hay items en esta orden", margin, yPos);
  } else {
    // Función para formatear fecha de entrega
    const formatFechaEntrega = (fecha?: string): string => {
      if (!fecha) return "N/A";
      try {
        const date = new Date(fecha);
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      } catch {
        return "N/A";
      }
    };

    // Mapeo de datos con fecha de entrega
    const tableData = data.items.map((item) => {
      const peso = Number(item.peso) || 0;
      const subtotal = Number(item.subtotal) || 0;
      const prendas = item.numeroPrendas || 0;
      return [
        item.servicio || "Servicio",
        `${peso}kg${prendas > 0 ? `/${prendas}p` : ""}`, // Abreviado ligeramente para caber
        formatFechaEntrega(item.fechaEntrega),
        `$${subtotal.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [["Servicio", "Peso/Cant", "Entrega", "Subtotal"]],
      body: tableData,
      theme: "striped", // Mismo tema original
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7, // Fuente aún más pequeña para caber 4 columnas
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 7, // Fuente más pequeña
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'left' }, // Servicio
        1: { cellWidth: 15, halign: 'center' }, // Peso/Cant
        2: { cellWidth: 18, halign: 'center' }, // Fecha Entrega
        3: { cellWidth: 12, halign: "right" }, // Subtotal
      },
      margin: { left: margin, right: margin },
      styles: {
        cellPadding: 1.5, // Padding aún más reducido
        overflow: 'linebreak'
      },
    });
  }

  // Obtener la posición Y después de la tabla
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 20;

  // ===== TOTAL =====
  let totalY = finalY + 5;
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, totalY, pageWidth - margin, totalY);
  
  totalY += 6;
  doc.setFontSize(12); // Escalado de 14 a 12
  doc.setFont("helvetica", "bold");
  doc.text(`Total a Pagar: $${Number(data.total).toFixed(2)}`, centerX, totalY, {
    align: "center",
  });

  // ===== ANOTACIONES (si existen) =====
  if (data.anotaciones) {
    totalY += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Anotaciones:", margin, totalY);
    totalY += 4;
    const splitAnotaciones = doc.splitTextToSize(data.anotaciones, contentWidth);
    doc.setFont("helvetica", "normal");
    doc.text(splitAnotaciones, margin, totalY);
    totalY += splitAnotaciones.length * 4;
  }

  // ===== FOOTER =====
  totalY += 6;
  doc.setDrawColor(...secondaryColor);
  doc.line(margin, totalY, pageWidth - margin, totalY);
  
  totalY += 6;
  doc.setFontSize(9); // Escalado de 11 a 9
  doc.setFont("helvetica", "normal");
  const empleadoLines = doc.splitTextToSize(`Atendido por: ${data.empleadoNombre}`, contentWidth);
  doc.text(empleadoLines, centerX, totalY, { align: "center" });
  totalY += (empleadoLines.length * 4);
  
  totalY += 4;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10); // Escalado de 12 a 10
  doc.text("¡Gracias por su preferencia!", centerX, totalY, { align: "center" });

  // Descargar el PDF
  doc.save(`ticket-${data.codigo}-${Date.now()}.pdf`);
};