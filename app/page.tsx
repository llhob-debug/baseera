// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center">
        {/* العنوان الرئيسي */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          افهم أداء نشاطك التجاري بوضوح
        </h1>

        {/* الوصف */}
        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          بصيرة تساعدك على قراءة أرقامك التجارية وفهم وضعك المالي
          بلغة بسيطة، بدون تعقيد، وبدون مصطلحات محاسبية.
        </p>

        {/* زر بدء التحليل */}
        <div className="mt-10">
          <Link href="/analyze">
            <button className="px-8 py-4 bg-black text-white rounded-xl text-lg font-medium hover:bg-gray-800 transition">
              ابدأ التحليل الآن
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
