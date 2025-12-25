import "./globals.css";

export const metadata = {
  title: "بصيرة",
  description: "منصة تحليل الأداء التجاري",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="_DOmBgYH39EQyqkgjvZwBZRx4OFvFfsGTM99b_CmFe4"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
