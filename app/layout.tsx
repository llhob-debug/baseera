import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "بصيرة | منصة قراءات تحليلية مبسطة للأداء المالي",
  description:
    "بصيرة منصة عربية تقدم قراءات تحليلية مالية مبسطة تساعد أصحاب الأنشطة التجارية على فهم الأداء المالي بوضوح وبدون تعقيد أو توصيات.",
  keywords: [
    "تحليل مالي",
    "قراءات تحليلية",
    "أداء تجاري",
    "منصة تحليل",
    "تحليل أرباح",
    "بصيرة",
  ],
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
