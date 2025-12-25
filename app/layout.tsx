import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "بصيرة | تحليل الأداء التجاري والمالي بذكاء",
  description:
    "منصة عربية لتحليل الأداء التجاري والمالي تساعد أصحاب الأعمال على فهم أرقامهم واتخاذ قرارات أفضل بدون تعقيد محاسبي.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FHF6KBBFM9"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-FHF6KBBFM9');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
