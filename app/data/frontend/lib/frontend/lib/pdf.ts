import jsPDF from 'jspdf'

export function generatePDF(data: {
  revenue: number
  costs: number
  profit: number
}) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  })

  doc.setFont('helvetica')
  doc.setFontSize(14)

  doc.text('Basira - Financial Report', 20, 30)

  doc.setFontSize(12)
  doc.text(`Revenue: ${data.revenue}`, 20, 50)
  doc.text(`Costs: ${data.costs}`, 20, 60)
  doc.text(`Profit: ${data.profit}`, 20, 70)

  doc.save('basira-report.pdf')
}
