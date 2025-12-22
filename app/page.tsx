// frontend/app/page.tsx

'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <section
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/brand/hero.png')",
      }}
    >
      {/* طبقة تغميق خفيفة */}
      <div className="absolute inset-0 bg-black/60" />

      {/* المحتوى */}
      <div className="relative min-h-screen flex items-center">
        <div className="max-w-7xl w-full mx-auto px-6">

          <div className="max-w-2xl text-center md:text-right space-y-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold leading-snug">
              فهم أوضح لأداء نشاطك
            </h1>

            <p className="text-lg leading-relaxed text-white/90">
              بصيرة تساعدك على فهم أرقام نشاطك بلغة بسيطة،
              من خلال تحليل واضح، تفسير ذكي،
              ومؤشرات تعطيك صورة عامة مطمئنة
              بدون تعقيد أو افتراض معرفة مالية.
            </p>

            <Link
              href="/data"
              className="inline-block bg-white text-black px-12 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-200 transition"
            >
              ابدأ التحليل
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
