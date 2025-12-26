"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/brand/hero.png"
          alt="منصة بصيرة للقراءات التحليلية المالية التجريبية"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Trial Badge */}
        <div className="absolute top-6 left-6 z-20">
          <span className="inline-flex items-center rounded-full bg-green-600/90 px-4 py-1 text-sm font-semibold text-white shadow-lg">
            تجربة استكشافية
          </span>
        </div>

        {/* Logo */}
        <div className="absolute top-6 right-6 z-20">
          <Image
            src="/brand/logo.png"
            alt="شعار منصة بصيرة"
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
              قراءة أوضح للأداء المالي لنشاطك التجاري
            </h1>

            <p className="mt-6 text-base md:text-lg text-gray-200">
              بصيرة منصة عربية تجريبية تقدم قراءات تحليلية مالية مبسطة،
              تهدف إلى مساعدة أصحاب الأنشطة التجارية على فهم الصورة العامة
              للأداء المالي بلغة واضحة وبدون تعقيد أو مصطلحات محاسبية.
            </p>

            <p className="mt-3 text-sm text-gray-300">
              مناسبة لأصحاب المشاريع الصغيرة والمتوسطة والمهتمين بفهم
              الإيرادات والتكاليف بشكل مبسط لأغراض استكشافية فقط.
            </p>

            {/* PRIMARY CTA */}
            <div className="mt-14 flex flex-col items-center gap-3">
              <button
                onClick={() =>
                  document
                    .getElementById("comparison")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="
                  px-24 py-3.5
                  bg-orange-500
                  hover:bg-orange-600
                  text-white text-lg font-medium
                  rounded-md
                  transition
                  shadow-sm
                "
              >
                🔍 استكشاف القراءات التحليلية
              </button>

              <span className="text-sm text-gray-300">
                المحتوى المعروض لأغراض تجريبية وتوضيحية فقط
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <button
          onClick={() =>
            document
              .getElementById("comparison")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-base md:text-lg font-medium text-gray-300 animate-pulse hover:text-white transition z-20"
        >
          <span className="text-center">
            تعرّف على مستويات التحليل المتاحة
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

      {/* TOOLS SECTION */}
      <section
        id="comparison"
        className="bg-gray-100 px-6 py-20 text-gray-900"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            مستويات التحليل المتاحة
          </h2>

          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            توفر بصيرة مستويات مختلفة من القراءات التحليلية، تبدأ من
            قراءة أساسية مبسطة وتنتهي بعرض توضيحي لتحليلات أعمق،
            وذلك بهدف توضيح المفاهيم دون تقديم توصيات أو قرارات.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic */}
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                القراءة الأساسية
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                قراءة مبسطة لحالة مالية واحدة.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li>• إدخال الإيرادات والتكاليف</li>
                <li>• صافي الربح والهامش</li>
                <li>• قراءة إرشادية عامة</li>
              </ul>
              <Link
                href="/basic"
                className="inline-block rounded-lg bg-green-700 px-5 py-2 text-white text-sm font-semibold hover:bg-green-800 transition"
              >
                استكشاف القراءة
              </Link>
            </div>

            {/* Intermediate */}
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                القراءة الموسعة
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                عرض مؤشرات إضافية وتوزيع الإيرادات.
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
                استكشاف القراءة
              </Link>
            </div>

            {/* Advanced */}
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-semibold text-red-700 mb-3">
                التحليل المتقدم
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                عرض توضيحي لتحليلات زمنية وسيناريوهات.
              </p>
              <ul className="text-sm space-y-2 mb-6">
                <li>• تحليل الفترات الزمنية</li>
                <li>• سيناريوهات متعددة</li>
                <li>• أمثلة تقارير تحليلية</li>
              </ul>
              <Link
                href="/data"
                className="inline-block rounded-lg bg-red-700 px-5 py-2 text-white text-sm font-semibold hover:bg-red-800 transition"
              >
                عرض توضيحي
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-16 text-center text-sm text-gray-500 max-w-4xl mx-auto">
            المحتوى المعروض ضمن هذه المنصة مقدم لأغراض تجريبية وتوضيحية فقط،
            ولا يمثل توصية مالية أو استثمارية أو تشغيلية، ولا يُقصد به
            توجيه أي قرار.
          </p>
        </div>
      </section>
    </main>
  );
}
