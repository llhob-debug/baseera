import "./globals.css";

export const metadata = {
  title: "بصيرة",
  description: "منصة تحليل الأداء التجاري",

  verification: {
    google: "_DOmBgYH39EQyqkgjvZwBZRx4OFvFfsGTM99b_CmFe4",
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
