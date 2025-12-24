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

/* ================= TYPES ================= */
type Product = {
  id: number;
  name: string;
  share: number; // % من الإيرادات
};

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

  /* ===== Products ===== */
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "منتج 1", share: 100 },
  ]);
  const [nextProductId, setNextProductId] = useState(2);

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      { id: nextProductId, name: `منتج ${prev.length + 1}`, share: 0 },
    ]);
    setNextProductId((x) => x + 1);
  };

  const updateProduct = (
    id: number,
    field: "name" | "share",
    value: string
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, [field]: field === "share" ? Number(value) : value }
          : p
      )
    );
  };

  /* ===== Calculations ===== */
  const profit = revenue - costs;
  const margin =
    revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  /* ===== Charts ===== */
  const productChart = useMemo(
    () =>
      products.map((p) => ({
        name: p.name,
        value: Math.round((revenue * p.share) / 100),
      })),
    [products, revenue]
  );

  const cashFlowChart = [
    { name: "الإيرادات", value: revenue },
    { name: "التكاليف", value: costs },
    { name: "الصافي", value: profit },
  ];

  const colors = ["#2563eb", "#16a34a", "#dc2626", "#7c3aed"];

  /* ===== Guidance ===== */
  let guidance =
    "أدخل البيانات الأساسية ثم وزّع الإيرادات على المنتجات للحصول على قراءة أوضح.";

  if (revenue > 0) {
    if (profit > 0) {
      guidance =
        "تشير القيم المدخلة إلى فائض تشغيلي، مع إظهار مساهمة كل منتج في الإيرادات.";
    } else if (profit === 0) {
      guidance =
        "تشير القيم المدخلة إلى نقطة تعادل بين الإيرادات والتكاليف.";
    } else {
      guidance =
        "تشير القيم المدخلة إلى عجز تشغيلي وفق الحسابات المتوسطة.";
    }
  }

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
            <h1 className="text-2xl font-bold">تحليل متوسط</h1>
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

        {/* Summary */}
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

        {/* Cash Flow */}
        <section className={cardClass}>
          <h2 className="text-lg font-semibold mb-4">
            مؤشر التدفق المالي
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cashFlowChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={0} stroke="#9ca3af" />
              <Bar dataKey="value">
                {cashFlowChart.map((_, i) => (
                  <Cell
                    key={i}
                    fill={colors[i % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Products */}
        <section className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              توزيع الإيرادات على المنتجات
            </h2>
            <button
              onClick={addProduct}
              className={`rounded-lg border px-4 py-2 text-sm ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              + إضافة منتج
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-2 gap-4"
              >
                <input
                  value={p.name}
                  onChange={(e) =>
                    updateProduct(p.id, "name", e.target.value)
                  }
                  className={inputClass}
                />
                <input
                  type="number"
                  value={p.share}
                  onChange={(e) =>
                    updateProduct(p.id, "share", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={productChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {productChart.map((_, i) => (
                  <Cell
                    key={i}
                    fill={colors[i % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
            هذا التحليل ذو طابع معلوماتي وتحليلي متوسط، ولا
            يمثل توصية مباشرة أو غير مباشرة، ولا يُقصد به
            توجيه قرار مالي أو استثماري.
          </p>
        </section>
      </div>
    </main>
  );
}
