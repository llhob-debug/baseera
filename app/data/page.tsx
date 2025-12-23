"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Legend,
} from "recharts";

/* ================= TYPES ================= */
type Product = {
  id: number;
  name: string;
  share: number; // % من الإيرادات
};

type PeriodData = {
  id: number;
  period: string; // مثال: يناير
  revenue: number;
  costs: number;
};

/* ================= HELPERS (Stage 1 UX) ================= */
const nf = new Intl.NumberFormat("en-US");
const fmt = (n: number) => nf.format(Number.isFinite(n) ? n : 0);

const STORAGE_KEY = "basira.data.v1";

/* ================= COMPONENT ================= */
export default function DataPage() {
  /* ===== Theme (SSR-safe) ===== */
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  /* ===== PDF Mode (لتحسين الالتقاط) ===== */
  const [pdfMode, setPdfMode] = useState(false);

  /* ===== Core Inputs ===== */
  const [revenue, setRevenue] = useState(0);
  const [costs, setCosts] = useState(0);

  /* ===== Products (مرتبط بالإيرادات) ===== */
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "منتج 1", share: 100 },
  ]);
  const [nextProductId, setNextProductId] = useState(2);

  /* ===== Periods (LineChart زمني حقيقي) ===== */
  const [periods, setPeriods] = useState<PeriodData[]>([
    { id: 1, period: "يناير", revenue: 0, costs: 0 },
    { id: 2, period: "فبراير", revenue: 0, costs: 0 },
    { id: 3, period: "مارس", revenue: 0, costs: 0 },
    { id: 4, period: "أبريل", revenue: 0, costs: 0 },
  ]);
  const [nextPeriodId, setNextPeriodId] = useState(5);

  /* ================= LOAD FROM STORAGE (Stage 1 UX) ================= */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setDarkMode(parsed.darkMode ?? true);
        setRevenue(parsed.revenue ?? 0);
        setCosts(parsed.costs ?? 0);
        setProducts(
          Array.isArray(parsed.products) && parsed.products.length
            ? parsed.products
            : [{ id: 1, name: "منتج 1", share: 100 }]
        );
        setNextProductId(parsed.nextProductId ?? 2);
        setPeriods(
          Array.isArray(parsed.periods) && parsed.periods.length
            ? parsed.periods
            : [
                { id: 1, period: "يناير", revenue: 0, costs: 0 },
                { id: 2, period: "فبراير", revenue: 0, costs: 0 },
                { id: 3, period: "مارس", revenue: 0, costs: 0 },
                { id: 4, period: "أبريل", revenue: 0, costs: 0 },
              ]
        );
        setNextPeriodId(parsed.nextPeriodId ?? 5);
      } else {
        const theme = localStorage.getItem("theme");
        if (theme) setDarkMode(theme === "dark");
      }
    } catch {
      // ignore parse errors
    } finally {
      setMounted(true);
    }
  }, []);

  /* ================= AUTO SAVE (Stage 1 UX) ================= */
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          darkMode,
          revenue,
          costs,
          products,
          nextProductId,
          periods,
          nextPeriodId,
        })
      );
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    } catch {
      // ignore storage errors
    }
  }, [
    darkMode,
    revenue,
    costs,
    products,
    nextProductId,
    periods,
    nextPeriodId,
    mounted,
  ]);

  /* ================= CALCULATIONS ================= */
  const profit = revenue - costs;
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  const profitClass =
    profit > 0 ? "text-green-400" : profit < 0 ? "text-red-400" : "text-gray-400";

  /* ================= DATA LOGIC ================= */
  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      { id: nextProductId, name: `منتج ${prev.length + 1}`, share: 0 },
    ]);
    setNextProductId((x) => x + 1);
  };

  const updateProduct = (id: number, field: "name" | "share", value: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, [field]: field === "share" ? Number(value) : value }
          : p
      )
    );
  };

  const addPeriod = () => {
    setPeriods((prev) => [
      ...prev,
      {
        id: nextPeriodId,
        period: `فترة ${prev.length + 1}`,
        revenue: 0,
        costs: 0,
      },
    ]);
    setNextPeriodId((x) => x + 1);
  };

  const updatePeriod = (
    id: number,
    field: "period" | "revenue" | "costs",
    value: string
  ) => {
    setPeriods((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]:
                field === "revenue" || field === "costs" ? Number(value) : value,
            }
          : p
      )
    );
  };

  /* ================= CHART DATA ================= */
  const productRevenueChart = useMemo(
    () =>
      products.map((p) => ({
        name: p.name,
        value: Math.round((revenue * (Number.isFinite(p.share) ? p.share : 0)) / 100),
        share: p.share,
      })),
    [products, revenue]
  );

  const cashFlowChart = useMemo(
    () => [
      { name: "الإيرادات", value: revenue },
      { name: "التكاليف", value: costs },
      { name: "صافي التدفق", value: profit },
    ],
    [revenue, costs, profit]
  );

  const periodsChart = useMemo(
    () =>
      periods.map((p) => ({
        period: p.period,
        revenue: p.revenue,
        costs: p.costs,
        net: p.revenue - p.costs,
      })),
    [periods]
  );

  const scenarios = useMemo(() => {
    const conservative = {
      name: "متحفظ",
      revenue: revenue,
      costs: Math.round(costs * 1.05),
      net: Math.round(revenue - costs * 1.05),
    };
    const base = {
      name: "معتدل",
      revenue: revenue,
      costs: costs,
      net: revenue - costs,
    };
    const optimistic = {
      name: "متفائل",
      revenue: Math.round(revenue * 1.1),
      costs: Math.round(costs * 0.95),
      net: Math.round(revenue * 1.1 - costs * 0.95),
    };
    return [conservative, base, optimistic];
  }, [revenue, costs]);

  const productColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const cashColors = ["#3b82f6", "#ef4444", "#10b981"];

  /* ================= GUIDANCE (Legal-safe, result-related) ================= */
  let guidance = "البيانات الحالية غير كافية لإظهار قراءة تحليلية ذات دلالة.";
  if (revenue > 0) {
    if (profit > 0 && margin >= 20) {
      guidance =
        "تعكس القيم المدخلة فائضًا تشغيليًا بهامش مرتفع نسبيًا ضمن إطار حسابي مباشر لهذه الفترة.";
    } else if (profit > 0) {
      guidance =
        "تشير القيم المدخلة إلى فائض تشغيلي محدود ضمن الإطار الحسابي الحالي.";
    } else if (profit === 0) {
      guidance =
        "تعكس القيم المدخلة نقطة تعادل حسابية بين الإيرادات والتكاليف لهذه الفترة.";
    } else {
      guidance =
        "تشير القيم المدخلة إلى أن التكاليف تتجاوز الإيرادات ضمن الإطار الحسابي الحالي.";
    }
  }

  /* ================= PDF EXPORT (working, multi-page) ================= */
  const exportPDF = async () => {
    setPdfMode(true);

    // انتظر إطارين لتحديث DOM قبل الالتقاط
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    window.scrollTo({ top: 0 });

    const element = document.getElementById("report");
    if (!element) {
      setPdfMode(false);
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: darkMode ? "#111827" : "#ffffff",
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = margin - (imgHeight - heightLeft);
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("بصيرة_تقرير_تحليلي.pdf");
    setPdfMode(false);
  };

  if (!mounted) return null;

  /* ================= UI CLASSES ================= */
  const inputClass = `w-full rounded-lg border px-4 py-2 mt-1 outline-none ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  }`;

  const card = `rounded-2xl p-6 ${pdfMode ? "shadow-none" : "shadow"} ${
    darkMode ? "bg-gray-900" : "bg-white"
  }`;

  return (
    <main
      className={`min-h-screen px-6 py-12 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div id="report" className="mx-auto max-w-6xl space-y-14">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src="/brand/logo.png"
              alt="بصيرة"
              width={pdfMode ? 120 : 200}
              height={pdfMode ? 120 : 200}
              priority
              unoptimized
            />
            <h1 className="text-3xl font-bold">تحليل الأداء المالي</h1>
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

            <button
              onClick={exportPDF}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              📄 تصدير PDF
            </button>

            <Link
              href="/"
              className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
            >
              العودة
            </Link>
          </div>
        </header>

        {/* Stage 1 UX: رسالة إرشادية عند عدم إدخال بيانات */}
        {revenue === 0 && costs === 0 && (
<div
  className={`rounded-xl px-6 py-5 text-center ${
    darkMode
      ? "bg-gray-800/60 text-gray-300"
      : "bg-gray-100 text-gray-600"
  }`}
>
  <p className="text-sm md:text-base font-medium">
    أدخل الإيرادات والتكاليف لعرض قراءة تحليلية مبسطة لأدائك المالي
  </p>
</div>



        )}

        {/* Summary Cards (Stage 1: تنسيق الأرقام + إبراز الربح) */}
        <section className="grid grid-cols-4 gap-4">
          <div className={card}>
            <div className="text-sm text-gray-400">الإيرادات</div>
            <div className="text-2xl font-bold">{fmt(revenue)}</div>
          </div>

          <div className={card}>
            <div className="text-sm text-gray-400">التكاليف</div>
            <div className="text-2xl font-bold">{fmt(costs)}</div>
          </div>

          <div className={card}>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              صافي التدفق
              <span
                className="cursor-help"
                title="الفرق الحسابي بين الإيرادات والتكاليف خلال الفترة."
              >
                ℹ️
              </span>
            </div>
            <div className={`text-2xl font-bold ${profitClass}`}>{fmt(profit)}</div>
          </div>

          <div className={card}>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              هامش الربح
              <span
                className="cursor-help"
                title="النسبة المتبقية من الإيرادات بعد خصم التكاليف، وفقًا للبيانات المدخلة."
              >
                ℹ️
              </span>
            </div>
            <div className="text-2xl font-bold">{margin}%</div>
          </div>
        </section>

        {/* Inputs */}
        <section className={card}>
          <h2 className="text-xl font-semibold mb-4">البيانات الأساسية</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">الإيرادات</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium">التكاليف</label>
              <input
                type="number"
                value={costs}
                onChange={(e) => setCosts(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Cash Flow (BarChart) */}
        <section className={card}>
          <h2 className="text-xl font-semibold mb-6">مؤشر التدفق المالي</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={0} stroke="#9ca3af" />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {cashFlowChart.map((_, i) => (
                  <Cell key={i} fill={cashColors[i % cashColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Stage 1 Micro-guidance */}
        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          الخطوة التالية: توزيع الإيرادات على المنتجات، ثم مراجعة الفترات الزمنية والسيناريوهات قبل تصدير التقرير.
        </p>

        {/* Periods + LineChart */}
        <section className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">التدفق المالي عبر الزمن</h2>
            <button
              onClick={addPeriod}
              className={`rounded-lg border px-4 py-2 text-sm ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              + إضافة فترة
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {periods.map((p) => (
              <div key={p.id} className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400">الفترة</label>
                  <input
                    value={p.period}
                    onChange={(e) => updatePeriod(p.id, "period", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">إيرادات الفترة</label>
                  <input
                    type="number"
                    value={p.revenue}
                    onChange={(e) => updatePeriod(p.id, "revenue", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">تكاليف الفترة</label>
                  <input
                    type="number"
                    value={p.costs}
                    onChange={(e) => updatePeriod(p.id, "costs", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={periodsChart}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceLine y={0} stroke="#9ca3af" />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="الإيرادات" />
              <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={3} name="التكاليف" />
              <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={3} name="صافي التدفق" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Products + BarChart */}
        <section className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">مساهمة المنتجات في الإيرادات</h2>
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
              <div key={p.id} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400">اسم المنتج</label>
                  <input
                    value={p.name}
                    onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">% من الإيرادات</label>
                  <input
                    type="number"
                    value={p.share}
                    onChange={(e) => updateProduct(p.id, "share", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={productRevenueChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {productRevenueChart.map((_, i) => (
                  <Cell key={i} fill={productColors[i % productColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <p className={`mt-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            * القيم أعلاه تمثل توزيعًا حسابيًا للإيرادات على المنتجات بناءً على النِسب المدخلة، لغرض العرض التحليلي فقط.
          </p>
        </section>

        {/* Scenarios */}
        <section className={card}>
          <h2 className="text-xl font-semibold mb-6">تحليل السيناريوهات</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={scenarios}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceLine y={0} stroke="#9ca3af" />
              <Bar dataKey="revenue" fill="#3b82f6" name="الإيرادات" />
              <Bar dataKey="costs" fill="#ef4444" name="التكاليف" />
              <Bar dataKey="net" fill="#10b981" name="الصافي" />
            </BarChart>
          </ResponsiveContainer>

          <p className={`mt-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            * السيناريوهات أعلاه تعكس افتراضات حسابية للمقارنة فقط، ولا تُعد توصية مباشرة أو غير مباشرة.
          </p>
        </section>

        {/* Guidance (Legal-safe) */}
        <section className={card}>
          <h2 className="text-lg font-semibold mb-3">قراءة تحليلية إرشادية</h2>
          <p className={darkMode ? "text-gray-300" : "text-gray-700"}>{guidance}</p>
          <p className={`mt-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            هذا العرض ذو طابع معلوماتي وتحليلي فقط، ولا يمثل توصية مباشرة أو غير مباشرة، ولا يُقصد به توجيه قرار مالي أو استثماري.
          </p>
        </section>

        {/* Stage 1 Micro-guidance before PDF */}
        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          راجع النتائج والرسوم، ثم استخدم زر “تصدير PDF” لحفظ نسخة من التقرير.
        </p>
      </div>
    </main>
  );
}
