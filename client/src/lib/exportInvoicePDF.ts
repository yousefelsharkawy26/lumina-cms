import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Reusing the Order interface to match ProfilePage types
export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

interface User {
  name: string;
  email: string;
}

export const exportInvoicePDF = (order: Order, user: User) => {
  const doc = new jsPDF();

  // 1. Header Area
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('LUMINA STORE', 14, 22);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Premium Lifestyle Goods', 14, 28);
  doc.text('https://lumina-store.com', 14, 33);

  // 2. Invoice Details (Right Aligned)
  doc.setFontSize(20);
  doc.setTextColor(0);
  doc.text('INVOICE', 196, 22, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Order ID:`, 140, 30);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${order.id.slice(0, 8).toUpperCase()}`, 196, 30, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Date:`, 140, 36);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(order.createdAt).toLocaleDateString(), 196, 36, { align: 'right' });

  // 3. Customer Information
  doc.setDrawColor(200);
  doc.line(14, 45, 196, 45); // horizontal line
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To:', 14, 55);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(user.name || 'Valued Customer', 14, 61);
  doc.text(user.email, 14, 66);

  // 4. Products Table
  const tableData = order.orderItems.map((item) => [
    item.product.name,
    item.quantity.toString(),
    `$${item.price.toFixed(2)}`,
    `$${(item.quantity * item.price).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Product Description', 'QTY', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42], // Primary dark color from our theme
      textColor: 255,
      halign: 'left',
    },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { top: 10 },
  });

  // 5. Totals Area
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount Due:', 140, finalY);
  doc.setTextColor(15, 23, 42); 
  doc.text(`$${order.totalAmount.toFixed(2)}`, 196, finalY, { align: 'right' });

  // 6. Footer message
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120);
  doc.text('Thank you for shopping at Lumina! We appreciate your business.', 105, 280, { align: 'center' });

  // 7. Trigger the download automatically
  doc.save(`Invoice_${order.id.slice(0, 8).toUpperCase()}.pdf`);
};
