"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <Image
          src="/brand/hero.png"
          alt="تحليل الأداء التجاري"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* نسخة تجريبية – أعلى يسار */}
        <div className="absolute top-6 left-6 z-20">
          <span className="inline-flex items-center rounded-full bg-green-600/90 px-4 py-1 text-sm font-semibold text-white shadow-lg">
            نسخة تجريبية
          </span>
        </div>

        {/* Logo – Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <Image
            src="/brand/logo.png"
            alt="Basira Logo"
            width={180}
            height={180}
            priority
            className="drop-shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              افهم أداء نشاطك التجاري بوضوح
            </h1>

            <p className="mt-6 text-base md:text-lg text-gray-200">
              بصيرة تساعدك على قراءة أرقامك التجارية وفهم وضعك المالي الحالي
              بلغة بسيطة، بدون تعقيد وبدون مصطلحات محاسبية.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/basic"
                className="rounded-xl bg-green-700 px-8 py-4 text-white text-lg font-semibold hover:bg-green-800 transition"
              >
                تحليل أساسي
              </Link>

              <Link
                href="/intermediate"
                className="rounded-xl bg-blue-700 px-8 py-4 text-white text-lg font-semibold hover:bg-blue-800 transition"
              >
                تحليل متوسط
              </Link>

              <Link
                href="/data"
                className="rounded-xl bg-red-700 px-8 py-4 text-white text-lg font-semibold hover:bg-red-800 transition"
              >
                تحليل متقدم
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Hint – Centered */}
        <button
          onClick={() =>
            document
              .getElementById("comparison")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-base md:text-lg font-medium text-gray-300 animate-pulse hover:text-white transition z-20"
        >
          <span className="text-center">
            انزل اسفل الصفحة وتعرّف على الفرق بين مستويات التحليل
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <path d="M12 5v14" />
            <path d="M19 12l-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* COMPARISON SECTION */}
      <section
        id="comparison"
        className="bg-gray-100 px-6 py-20 text-gray-900"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            اختر مستوى التحليل المناسب لك
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic */}
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                التحليل الأساسي
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                مناسب للحصول على نظرة أولية سريعة على وضعك المالي الحالي.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li>• إدخال الإيرادات والتكاليف</li>
                <li>• صافي الربح وهامش الربح</li>
                <li>• قراءة إرشادية مبسطة</li>
              </ul>
              <Link
                href="/basic"
                className="inline-block rounded-lg bg-green-700 px-5 py-2 text-white text-sm font-semibold hover:bg-green-800 transition"
              >
                ابدأ التحليل الأساسي
              </Link>
            </div>

            {/* Intermediate */}
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                التحليل المتوسط
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                لفهم الأداء بصورة أعمق من خلال توزيع الإيرادات وتحليل التدفق.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li>• توزيع الإيرادات على المنتجات</li>
                <li>• مؤشر التدفق المالي</li>
                <li>• قراءة تحليلية أوسع</li>
              </ul>
              <Link
                href="/intermediate"
                className="inline-block rounded-lg bg-blue-700 px-5 py-2 text-white text-sm font-semibold hover:bg-blue-800 transition"
              >
                انتقل للتحليل المتوسط
              </Link>
            </div>

            {/* Advanced */}
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-semibold text-red-700 mb-3">
                التحليل المتقدم
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                مستوى احترافي لإعداد تقارير شاملة ودعم اتخاذ القرار.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li>• تحليل الفترات الزمنية</li>
                <li>• سيناريوهات متعددة</li>
                <li>• تقارير PDF احترافية</li>
              </ul>
              <Link
                href="/data"
                className="inline-block rounded-lg bg-red-700 px-5 py-2 text-white text-sm font-semibold hover:bg-red-800 transition"
              >
                انتقل للتحليل المتقدم
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
