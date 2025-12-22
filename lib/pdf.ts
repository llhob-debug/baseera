import jsPDF from 'jspdf'

export async function generatePDF(data: {
  profit: number
  margin: number
  revenueChange: number | null
  costsChange: number | null
  topItem: string | null
  lowItem: string | null
}) {
  console.log('PDF CLICKED')

  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })

  // تحميل الخط من public
  const fontUrl = '/fonts/Cairo-Regular.ttf'
  const fontResponse = await fetch(fontUrl)
  const fontBuffer = await fontResponse.arrayBuffer()
  const fontBase64 = btoa(
    String.fromCharCode(...new Uint8Array(fontBuffer))
  )

  // تسجيل الخط
  doc.addFileToVFS('Cairo-Regular.ttf', fontBase64)
  doc.addFont('Cairo-Regular.ttf', 'Cairo', 'normal')
  doc.setFont('Cairo')

  doc.setFontSize(16)
  doc.text('التقرير المالي', 105, 20, { align: 'center' })

  let y = 40
  doc.setFontSize(12)

  const line = (label: string, value: string | number) => {
    doc.text(`${label}: ${value}`, 105, y, { align: 'center' })
    y += 10
  }

  line('صافي الربح', `${data.profit} ريال`)
  line('هامش الربح', `${data.margin.toFixed(1)}%`)

  if (data.revenueChange !== null) {
    line('التغير في الإيرادات', `${data.revenueChange.toFixed(1)}%`)
  }

  if (data.costsChange !== null) {
    line('التغير في التكاليف', `${data.costsChange.toFixed(1)}%`)
  }

  if (data.topItem) {
    line('أعلى منتج مبيعًا', data.topItem)
  }

  if (data.lowItem) {
    line('أقل منتج مبيعًا', data.lowItem)
  }

  doc.save('basira-report.pdf')
}
