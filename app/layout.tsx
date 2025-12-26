import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

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
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FHF6KBBFM9"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
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
