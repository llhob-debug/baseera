import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "بصيرة | قراءات تحليلية تجريبية للأداء التجاري",
  description:
    "بصيرة منصة تجريبية تقدم قراءات تحليلية مبسطة تساعد على فهم الأداء المالي للنشاط التجاري بلغة واضحة وبدون تعقيد أو توصيات.",
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "تحليل مالي",
    "قراءات تحليلية",
    "أداء تجاري",
    "منصة تحليل",
    "بصيرة",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FHF6KBBFM9"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FHF6KBBFM9');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
