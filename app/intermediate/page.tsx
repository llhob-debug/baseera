"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

export default function IntermediateAnalysisPage() {
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
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  /* ===== Cash Flow Chart ===== */
  const cashFlowChart = [
    { name: "الإيرادات", value: revenue },
    { name: "التكاليف", value: costs },
    { name: "الصافي", value: profit },
  ];

  /* ===== Revenue Distribution (تقريبي) ===== */
  const revenueDistribution = useMemo(() => {
    if (revenue <= 0) return [];
    return [
      { name: "مصدر رئيسي", value: Math.round(revenue * 0.6) },
      { name: "مصادر ثانوية", value: Math.round(revenue * 0.25) },
      { name: "مصادر أخرى", value: Math.round(revenue * 0.15) },
    ];
  }, [revenue]);

  /* ===== 🔒 Performance Fragility Indicator (Paid) ===== */
  const fragility = useMemo(() => {
    if (revenue <= 0) return "غير قابل للتقييم";
    if (profit <= 0) return "هش";
    if (margin < 15) return "حساس";
    return "متماسك";
  }, [revenue, profit, margin]);

  const fragilityText = {
    متماسك:
      "الأداء الحالي يحقق فائضًا مع هامش مقبول نسبيًا، ما يشير إلى قدرة أفضل على امتصاص التقلبات البسيطة.",
    حساس:
      "رغم وجود فائض، إلا أن هامش الربح محدود، ما يجعل الأداء حساسًا لأي تغير بسيط في التكاليف.",
    هش:
      "الأداء الحالي لا يتحمل الصدمات التشغيلية، وقد يؤدي أي تغير محدود إلى عجز.",
    "غير قابل للتقييم":
      "البيانات غير كافية لتقييم هشاشة الأداء.",
  } as const;

  const colors = ["#2563eb", "#16a34a", "#f59e0b"];

  if (!mounted) return null;

  const cardClass = `rounded-2xl p-6 shadow ${
    darkMode ? "bg-gray-900" : "bg-white"
  }`;

  const inputClass = `w-full rounded-lg border px-4 py-2 mt-1 outline-none ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-white"
      : "bg-white border-gray-300 text-gray-900"
  }`;

  return (
    <main
      className={`min-h-screen px-6 py-12 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="mx-auto max-w-5xl space-y-12">
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
            <div>
              <h1 className="text-2xl font-bold">القراءة الموسعة</h1>
              <p className="text-sm text-gray-400 mt-1">
                قراءة تشخيصية مبسطة تتجاوز الأرقام المباشرة
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
          >
            العودة
          </Link>
        </header>

        {/* Inputs */}
        <section className={cardClass}>
          <h2 className="text-lg font-semibold mb-4">البيانات الأساسية</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">الإيرادات</label>
              <input
                type="number"
                min={0}
                value={revenue}
                onChange={(e) =>
                  setRevenue(Math.max(0, Number(e.target.value)))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium">التكاليف</label>
              <input
                type="number"
                min={0}
                value={costs}
                onChange={(e) =>
                  setCosts(Math.max(0, Number(e.target.value)))
                }
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Cash Flow */}
        <section className={cardClass}>
          <h2 className="text-lg font-semibold mb-4">مؤشر التدفق المالي</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cashFlowChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={0} stroke="#9ca3af" />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {cashFlowChart.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Revenue Distribution */}
        <section className={cardClass}>
          <h2 className="text-lg font-semibold mb-4">
            توزيع مصادر الإيرادات
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueDistribution}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {revenueDistribution.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* 🔒 Performance Fragility */}
        <section
          className={`rounded-2xl p-6 border ${
            darkMode
              ? "bg-gray-900 border-yellow-700"
              : "bg-white border-yellow-500"
          }`}
        >
          <h2 className="text-lg font-semibold mb-2">
            🔒 مؤشر هشاشة الأداء (نسخة موسعة)
          </h2>

          <div className="text-2xl font-bold mb-3">
            {fragility === "متماسك" && "🟢 أداء متماسك"}
            {fragility === "حساس" && "🟡 أداء حساس"}
            {fragility === "هش" && "🔴 أداء هش"}
            {fragility === "غير قابل للتقييم" && "—"}
          </div>

          <p className="text-sm text-gray-400">
            {fragilityText[fragility]}
          </p>

          <p className="mt-3 text-xs text-gray-500">
            * في التحليل المتقدم يتم تحليل هشاشة الأداء بدقة أعلى وربطها بجودة
            الربح والاتجاه الزمني والمخاطر التشغيلية.
          </p>
        </section>
      </div>
    </main>
  );
}
