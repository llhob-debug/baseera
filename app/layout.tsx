import "./globals.css";

export const metadata = {
  title: {
    default: "بصيرة | تحليل الأداء التجاري",
    template: "%s | بصيرة",
  },
  description:
    "بصيرة منصة عربية لتحليل الأداء المالي والتجاري، تساعدك على فهم الإيرادات والتكاليف واتخاذ قرارات أفضل.",
  keywords: [
    "تحليل مالي",
    "تحليل الأداء التجاري",
    "إدارة الأعمال",
    "تحليل الإيرادات",
    "منصة عربية",
  ],
  authors: [{ name: "Basira" }],
  creator: "Basira",
  publisher: "Basira",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
