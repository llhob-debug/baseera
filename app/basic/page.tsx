"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BasicAnalysisPage() {
  /* ===== Theme ===== */
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDarkMode(saved === "dark");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode, mounted]);

  /* ===== Inputs ===== */
  const [revenue, setRevenue] = useState<number>(0);
  const [costs, setCosts] = useState<number>(0);

  /* ===== Calculations ===== */
  const profit = revenue - costs;
  const margin =
    revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  /* ===== Guidance ===== */
  let guidance =
    "أدخل الإيرادات والتكاليف لعرض قراءة مبسطة للوضع المالي الحالي.";

  if (revenue > 0) {
    if (profit > 0) {
      guidance =
        "تشير القيم المدخلة إلى وجود فائض تشغيلي وفق الحسابات الأساسية لهذه الفترة.";
    } else if (profit === 0) {
      guidance =
        "تشير القيم المدخلة إلى نقطة تعادل بين الإيرادات والتكاليف.";
    } else {
      guidance =
        "تشير القيم المدخلة إلى أن التكاليف تتجاوز الإيرادات وفق الحسابات الأساسية.";
    }
  }

  if (!mounted) return null;

  const cardClass = `rounded-2xl p-6 shadow ${
    darkMode ? "bg-gray-900" : "bg-white"
  }`;

  const inputClass = `w-full rounded-lg border px-4 py-2 mt-1 outline-none ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  }`;

  return (
    <main
      className={`min-h-screen px-6 py-12 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/logo.png"
              alt="بصيرة"
              width={140}
              height={140}
              priority
            />
            <h1 className="text-2xl font-bold">تحليل أساسي</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              {darkMode ? "🌙 داكن" : "☀️ فاتح"}
            </button>

            <Link
              href="/"
              className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
            >
              العودة
            </Link>
          </div>
        </header>

        {/* Inputs */}
        <section className={cardClass}>
          <h2 className="text-lg font-semibold mb-4">
            البيانات الأساسية
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">الإيرادات</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) =>
                  setRevenue(Number(e.target.value))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium">التكاليف</label>
              <input
                type="number"
                value={costs}
                onChange={(e) =>
                  setCosts(Number(e.target.value))
                }
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="grid grid-cols-3 gap-4">
          <div className={cardClass}>
            <div className="text-sm text-gray-400">الربح</div>
            <div
              className={`text-2xl font-bold ${
                profit > 0
                  ? "text-green-400"
                  : profit < 0
                  ? "text-red-400"
                  : ""
              }`}
            >
              {profit}
            </div>
          </div>

          <div className={cardClass}>
            <div className="text-sm text-gray-400">
              هامش الربح %
            </div>
            <div className="text-2xl font-bold">
              {margin}%
            </div>
          </div>

          <div className={cardClass}>
            <div className="text-sm text-gray-400">
              الحالة
            </div>
            <div className="text-lg font-semibold">
              {profit > 0
                ? "فائض"
                : profit === 0
                ? "تعادل"
                : "عجز"}
            </div>
          </div>
        </section>

        {/* Guidance */}
        <section className={cardClass}>
          <h2 className="text-lg font-semibold mb-2">
            قراءة إرشادية
          </h2>
          <p
            className={
              darkMode ? "text-gray-300" : "text-gray-700"
            }
          >
            {guidance}
          </p>
          <p
            className={`mt-3 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            هذا التحليل ذو طابع معلوماتي مبسط فقط، ولا يمثل
            توصية مباشرة أو غير مباشرة، ولا يُقصد به توجيه
            قرار مالي أو استثماري.
          </p>
        </section>

        {/* CTA – Upgrade */}
        <section
          className={`rounded-2xl p-6 border ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <h3 className="text-lg font-semibold mb-2">
            هل تحتاج إلى قراءة أعمق؟
          </h3>
          <p
            className={`text-sm mb-4 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            التحليل المتوسط يتيح لك فهم الأداء عبر الزمن
            واستعراض سيناريوهات متعددة بصورة أوضح.
          </p>

          <Link
            href="/intermediate"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-white font-semibold hover:bg-blue-800 transition"
          >
            🔍 احصل على تحليل أعمق
          </Link>
        </section>
      </div>
    </main>
  );
}
