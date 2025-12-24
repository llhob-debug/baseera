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
  period: string; // مثال: يناير 2025
  revenue: number;
  costs: number;
};

/* ================= HELPERS ================= */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const safeNumber = (n: any) => (Number.isFinite(Number(n)) ? Number(n) : 0);

function median(values: number[]) {
  const arr = [...values].sort((a, b) => a - b);
  if (arr.length === 0) return 0;
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

/* ================= COMPONENT ================= */
export default function DataPage() {
  /* ===== Theme (SSR-safe) ===== */
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDarkMode(saved === "dark");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode, mounted]);

  /* ===== PDF Mode (لمنع قص الشعار + تحسين الالتقاط) ===== */
  const [pdfMode, setPdfMode] = useState(false);

  /* ===== Core Inputs ===== */
  const [revenue, setRevenue] = useState<number>(0);
  const [costs, setCosts] = useState<number>(0);

  /* ===== Products (مرتبط بالإيرادات) ===== */
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
          ? { ...p, [field]: field === "share" ? safeNumber(value) : value }
          : p
      )
    );
  };

  /* ===== Periods (LineChart حقيقي زمني) ===== */
  const [periods, setPeriods] = useState<PeriodData[]>([
    { id: 1, period: "يناير", revenue: 0, costs: 0 },
    { id: 2, period: "فبراير", revenue: 0, costs: 0 },
    { id: 3, period: "مارس", revenue: 0, costs: 0 },
    { id: 4, period: "أبريل", revenue: 0, costs: 0 },
  ]);
  const [nextPeriodId, setNextPeriodId] = useState(5);

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
                field === "revenue" || field === "costs" ? safeNumber(value) : value,
            }
          : p
      )
    );
  };

  /* ===== Calculations ===== */
  const profit = revenue - costs;
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  /* ===== Charts Data ===== */
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
        revenue: safeNumber(p.revenue),
        costs: safeNumber(p.costs),
        net: safeNumber(p.revenue) - safeNumber(p.costs),
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
    const stress = {
      name: "ضغط",
      revenue: Math.round(revenue * 0.85),
      costs: Math.round(costs * 1.2),
      net: Math.round(revenue * 0.85 - costs * 1.2),
    };
    return [stress, conservative, base, optimistic];
  }, [revenue, costs]);

  const productColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const cashColors = ["#3b82f6", "#ef4444", "#10b981"];
  /* ===== Guidance (مرتبط بالنتيجة + صياغة إرشادية) ===== */
  let guidance = "البيانات الحالية غير كافية لإظهار قراءة تحليلية ذات دلالة.";

  if (revenue > 0) {
    if (profit > 0 && margin >= 20) {
      guidance =
        "تعكس القيم المدخلة فائضًا تشغيليًا بهامش مرتفع نسبيًا ضمن إطار حسابي مباشر لهذه الفترة.";
    } else if (profit > 0) {
      guidance = "تشير القيم المدخلة إلى فائض تشغيلي محدود ضمن الإطار الحسابي الحالي.";
    } else if (profit === 0) {
      guidance = "تعكس القيم المدخلة نقطة تعادل حسابية بين الإيرادات والتكاليف لهذه الفترة.";
    } else {
      guidance =
        "تشير القيم المدخلة إلى أن التكاليف تتجاوز الإيرادات ضمن الإطار الحسابي الحالي.";
    }
  }

  /* ================= Sensitivity Toggle (±3%/±5%/±10%) ================= */
  const [sensitivityRate, setSensitivityRate] = useState<number>(0.05);
  const sensitivityOptions = [0.03, 0.05, 0.1];

  const sensitivityData = useMemo(() => {
    const baseNet = revenue - costs;

    const rows = [
      {
        scenario: `الإيرادات -${Math.round(sensitivityRate * 100)}%`,
        net: revenue * (1 - sensitivityRate) - costs,
      },
      {
        scenario: `الإيرادات +${Math.round(sensitivityRate * 100)}%`,
        net: revenue * (1 + sensitivityRate) - costs,
      },
      {
        scenario: `التكاليف -${Math.round(sensitivityRate * 100)}%`,
        net: revenue - costs * (1 - sensitivityRate),
      },
      {
        scenario: `التكاليف +${Math.round(sensitivityRate * 100)}%`,
        net: revenue - costs * (1 + sensitivityRate),
      },
    ];

    return rows.map((r) => ({
      scenario: r.scenario,
      net: Math.round(r.net),
      delta: Math.round(r.net - baseNet),
    }));
  }, [revenue, costs, sensitivityRate]);

  /* ================= ADVANCED (Hybrid) ANALYTICS LAYER ================= */
  const breakEvenRevenue = useMemo(() => costs, [costs]);
  const safetyMarginValue = useMemo(() => Math.max(0, revenue - breakEvenRevenue), [revenue, breakEvenRevenue]);
  const safetyMarginPct = useMemo(() => (revenue > 0 ? Math.round((safetyMarginValue / revenue) * 100) : 0), [revenue, safetyMarginValue]);

  const costPressureRatio = useMemo(() => (revenue > 0 ? costs / revenue : 0), [costs, revenue]); // كلما ارتفع زاد الضغط
  const netCashQuality = useMemo(() => (revenue > 0 ? profit / revenue : 0), [profit, revenue]);

  const productShares = useMemo(() => products.map((p) => clamp(safeNumber(p.share), 0, 100)), [products]);
  const topShare = useMemo(() => (productShares.length ? Math.max(...productShares) : 0), [productShares]);
  const concentrationIndex = useMemo(() => {
    // Herfindahl-Hirschman-ish on percentage shares (0..100)
    const s = productShares.map((x) => (x / 100) ** 2).reduce((a, b) => a + b, 0);
    return s; // 0..1
  }, [productShares]);

  const periodNets = useMemo(() => periodsChart.map((p) => safeNumber(p.net)), [periodsChart]);
  const volatility = useMemo(() => {
    if (periodNets.length < 2) return 0;
    const diffs = periodNets.slice(1).map((v, i) => Math.abs(v - periodNets[i]));
    return Math.round(median(diffs));
  }, [periodNets]);

  const trend = useMemo(() => {
    if (periodNets.length < 2) return "غير كافٍ";
    const first = periodNets[0];
    const last = periodNets[periodNets.length - 1];
    const delta = last - first;
    if (delta > 0) return "تحسن";
    if (delta < 0) return "تراجع";
    return "ثبات";
  }, [periodNets]);

  const riskLevel = useMemo(() => {
    let score = 0;
    if (profit < 0) score += 40;
    if (margin < 10) score += 15;
    if (costPressureRatio > 0.85) score += 15;
    if (topShare >= 70) score += 15;
    if (volatility > Math.abs(profit) && volatility > 0) score += 15;
    if (revenue === 0 && costs > 0) score += 30;
    const s = clamp(score, 0, 100);
    if (s >= 70) return "مرتفع";
    if (s >= 40) return "متوسط";
    return "منخفض";
  }, [profit, margin, costPressureRatio, topShare, volatility, revenue, costs]);

  const healthScore = useMemo(() => {
    // 0..100 (higher better)
    let score = 100;
    if (profit < 0) score -= 40;
    score -= clamp((0.9 - (1 - costPressureRatio)) * 20, 0, 20); // إذا التكاليف مرتفعة
    score -= clamp((70 - margin) * 0.3, 0, 25); // هامش منخفض
    score -= clamp((topShare - 50) * 0.5, 0, 20); // تركّز
    score -= clamp(volatility / 1000, 0, 15); // تذبذب تقريبي
    return Math.round(clamp(score, 0, 100));
  }, [profit, costPressureRatio, margin, topShare, volatility]);

  const statusBadge = useMemo(() => {
    if (healthScore >= 75) return { label: "مستقر", tone: "green" };
    if (healthScore >= 50) return { label: "تحت المراقبة", tone: "yellow" };
    return { label: "خطر", tone: "red" };
  }, [healthScore]);

  const focusAxis = useMemo(() => {
    if (profit < 0) return "استعادة الربحية";
    if (topShare >= 70) return "تقليل الاعتماد على منتج واحد";
    if (costPressureRatio > 0.8) return "تحسين كفاءة التكاليف";
    if (trend === "تراجع") return "إيقاف تدهور الاتجاه";
    return "تعزيز الاستقرار والنمو";
  }, [profit, topShare, costPressureRatio, trend]);

  const narrative = useMemo(() => {
    if (revenue <= 0 && costs <= 0) {
      return "لا توجد بيانات مالية كافية لبناء قراءة استراتيجية. أدخل الإيرادات والتكاليف وأضف بعض الفترات والمنتجات للحصول على تحليل أعمق.";
    }
    const parts: string[] = [];
    parts.push(`الحالة العامة: ${statusBadge.label} (مؤشر صحة ${healthScore}/100).`);
    parts.push(`هامش الأمان: ${safetyMarginPct}% مقابل نقطة تعادل تقريبية عند ${breakEvenRevenue}.`);
    parts.push(`التركيز: ${focusAxis}.`);
    if (topShare >= 70) parts.push("تنبيه: الإيرادات مركزة بشكل كبير على منتج واحد، ما يرفع حساسية الأداء لأي تقلب.");
    if (profit < 0) parts.push("الأولوية: إيقاف العجز عبر مزيج من تحسين الإيرادات أو إعادة ضبط التكاليف.");
    if (trend === "تحسن") parts.push("إشارة إيجابية: الاتجاه عبر الزمن يُظهر تحسنًا عامًا في صافي التدفق.");
    if (trend === "تراجع") parts.push("إشارة حذر: الاتجاه عبر الزمن يُظهر تراجعًا، ويستحسن فحص أسباب التكاليف أو انخفاض الإيرادات.");
    return parts.join(" ");
  }, [revenue, costs, statusBadge.label, healthScore, safetyMarginPct, breakEvenRevenue, focusAxis, topShare, profit, trend]);

  const strengths = useMemo(() => {
    const items: string[] = [];
    if (profit > 0) items.push("تحقيق فائض تشغيلي ضمن الفترة الحالية.");
    if (margin >= 20) items.push("هامش ربح جيد نسبيًا يدعم المرونة.");
    if (trend === "تحسن") items.push("اتجاه زمني إيجابي في صافي التدفق.");
    if (topShare < 50 && products.length > 1) items.push("توزيع الإيرادات أقل تركّزًا (تنويع أفضل).");
    if (items.length === 0) items.push("لا توجد نقاط قوة بارزة وفق البيانات الحالية—يمكن تعزيزها بإضافة فترات وتوزيع منتجات أدق.");
    return items;
  }, [profit, margin, trend, topShare, products.length]);

  const warnings = useMemo(() => {
    const items: string[] = [];
    if (profit < 0) items.push("عجز تشغيلي: التكاليف تتجاوز الإيرادات.");
    if (margin < 10 && revenue > 0) items.push("هامش ربح منخفض قد لا يتحمل أي تقلب بسيط.");
    if (costPressureRatio > 0.85 && revenue > 0) items.push("ضغط تكاليف مرتفع مقارنة بالإيرادات.");
    if (topShare >= 70) items.push("اعتماد مرتفع على منتج واحد (مخاطر تركّز).");
    if (trend === "تراجع") items.push("اتجاه صافي التدفق عبر الزمن في حالة تراجع.");
    if (items.length === 0) items.push("لا توجد إشارات تحذيرية كبيرة وفق البيانات الحالية.");
    return items;
  }, [profit, margin, revenue, costPressureRatio, topShare, trend]);

  /* ===== PDF Export (حل قص الشعار + تعدد الصفحات) ===== */
  const exportPDF = async () => {
    setPdfMode(true);

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
    const marginMm = 10;

    const imgWidth = pageWidth - marginMm * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = marginMm;

    pdf.addImage(imgData, "PNG", marginMm, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = marginMm - (imgHeight - heightLeft);
      pdf.addImage(imgData, "PNG", marginMm, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("بصيرة_تقرير_تحليلي.pdf");
    setPdfMode(false);
  };

  if (!mounted) return null;

  /* ===== Shared input classes for Dark/Light ===== */
  const inputClass = `w-full rounded-lg border px-4 py-2 mt-1 outline-none ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  }`;

  const cardClass = `rounded-2xl p-6 ${pdfMode ? "shadow-none" : "shadow"} ${
    darkMode ? "bg-gray-900" : "bg-white"
  }`;

  const badgeTone =
    statusBadge.tone === "green"
      ? "bg-green-600/90"
      : statusBadge.tone === "yellow"
      ? "bg-yellow-500/90"
      : "bg-red-600/90";

  return (
    <main
      className={`min-h-screen px-6 py-12 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div id="report" className="mx-auto max-w-6xl space-y-14">
        {/* Top Trial Badge */}
        <div className="flex justify-center">
          <span className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-white shadow ${badgeTone}`}>
            نسخة تجريبية — عرض توضيحي
          </span>
        </div>

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
            <div>
              <h1 className="text-3xl font-bold">تحليل الأداء المالي (متقدم)</h1>
              <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                لوحة قرار احترافية — تجمع المؤشرات، المخاطر، الاتجاه، والحساسية بصورة قابلة للعرض والتصدير.
              </p>
            </div>
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

        {/* Executive Snapshot */}
        <section className={cardClass}>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">الملخص التنفيذي</h2>
              <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {narrative}
              </p>
            </div>

            <div className="min-w-[220px]">
              <div className={`rounded-xl p-4 border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>الحالة</div>
                <div className="text-lg font-bold mt-1">{statusBadge.label}</div>

                <div className={`mt-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>مؤشر الصحة</div>
                <div className="text-2xl font-bold">{healthScore}/100</div>

                <div className={`mt-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>المخاطر</div>
                <div className="text-lg font-semibold">{riskLevel}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4 text-sm">
            <div className={`rounded-xl p-4 border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
              <div className="text-gray-400">نقطة التعادل</div>
              <div className="text-xl font-bold mt-1">{breakEvenRevenue}</div>
            </div>
            <div className={`rounded-xl p-4 border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
              <div className="text-gray-400">هامش الأمان</div>
              <div className="text-xl font-bold mt-1">{safetyMarginPct}%</div>
            </div>
            <div className={`rounded-xl p-4 border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
              <div className="text-gray-400">تركيز المنتجات</div>
              <div className="text-xl font-bold mt-1">{Math.round(concentrationIndex * 100)}%</div>
            </div>
            <div className={`rounded-xl p-4 border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
              <div className="text-gray-400">الاتجاه</div>
              <div className="text-xl font-bold mt-1">{trend}</div>
            </div>
          </div>
        </section>

        {/* Summary Cards (كما هي) */}
        <section className="grid grid-cols-4 gap-4">
          {[
            { label: "الإيرادات", value: revenue },
            { label: "التكاليف", value: costs },
            { label: "الربح", value: profit },
            { label: "هامش الربح %", value: margin },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-4 ${pdfMode ? "shadow-none" : "shadow"} ${
                darkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div className="text-sm text-gray-400">{item.label}</div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className={`mt-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {item.label === "الإيرادات" && `تعادل تقريبي عند: ${breakEvenRevenue}`}
                {item.label === "التكاليف" && `ضغط تكاليف: ${revenue > 0 ? Math.round(costPressureRatio * 100) : 0}%`}
                {item.label === "الربح" && `جودة صافي: ${revenue > 0 ? Math.round(netCashQuality * 100) : 0}%`}
                {item.label === "هامش الربح %" && `هامش أمان: ${safetyMarginPct}%`}
              </div>
            </div>
          ))}
        </section>

        {/* Inputs (كما هي) */}
        <section className={cardClass}>
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
        {/* Cash Flow (مقارن واضح) */}
        <section className={cardClass}>
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

          <p className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {profit > 0
              ? "إشارة تنفيذية: النشاط يولد صافي تدفق إيجابي ضمن الفترة الحالية، ما يعزز القدرة على التوسع أو بناء احتياطي."
              : profit < 0
              ? "إشارة تنفيذية: صافي التدفق سلبي. الأولوية هنا لإيقاف الاستنزاف عبر ضبط التكاليف أو تحسين الإيرادات."
              : "إشارة تنفيذية: حالة تعادل تقريبية. أي تغير بسيط قد يحول النتيجة إلى فائض أو عجز."}
          </p>
        </section>

        {/* ================= Sensitivity (Toggle + Chart + Table) ================= */}
        <section className={cardClass}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">تحليل الحساسية</h2>

            <div className="flex gap-2">
              {sensitivityOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSensitivityRate(opt)}
                  className={`rounded-lg px-3 py-2 text-sm border ${
                    sensitivityRate === opt
                      ? "bg-blue-600 text-white border-blue-600"
                      : darkMode
                      ? "hover:bg-gray-800 border-gray-700"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  ±{Math.round(opt * 100)}%
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sensitivityData}>
              <XAxis dataKey="scenario" />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={0} stroke="#9ca3af" />
              <Bar dataKey="net" radius={[8, 8, 0, 0]}>
                {sensitivityData.map((r, i) => (
                  <Cell key={i} fill={r.delta >= 0 ? "#10b981" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  <th className="text-right py-2">السيناريو</th>
                  <th className="text-right py-2">صافي التدفق</th>
                  <th className="text-right py-2">التغير عن الأساس</th>
                </tr>
              </thead>
              <tbody>
                {sensitivityData.map((r, idx) => (
                  <tr
                    key={idx}
                    className={darkMode ? "border-t border-gray-800" : "border-t"}
                  >
                    <td className="py-3">{r.scenario}</td>
                    <td className="py-3">{r.net}</td>
                    <td
                      className={`py-3 font-semibold ${
                        r.delta > 0
                          ? "text-green-400"
                          : r.delta < 0
                          ? "text-red-400"
                          : darkMode
                          ? "text-gray-300"
                          : "text-gray-700"
                      }`}
                    >
                      {r.delta > 0 ? `+${r.delta}` : `${r.delta}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            يعرض هذا القسم أثر تغيّر افتراضي بنسبة ±{Math.round(sensitivityRate * 100)}% على صافي التدفق. 
            {topShare >= 70
              ? " ملاحظة: مع تركّز الإيرادات على منتج واحد، تصبح الحساسية التشغيلية أعلى من المعتاد."
              : " ملاحظة: تنويع الإيرادات يساعد على امتصاص الصدمات."}
          </p>
        </section>

        {/* Periods (Editable) + Time Series LineChart */}
        <section className={cardClass}>
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

          {/* جدول إدخال الفترات */}
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

          <p className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            تشخيص الاتجاه: <span className="font-semibold">{trend}</span> — 
            {trend === "تحسن"
              ? " الأداء يتحسن عبر الزمن (إشارة إيجابية للاستمرارية)."
              : trend === "تراجع"
              ? " الأداء يتراجع عبر الزمن (يستدعي تحديد مصدر التدهور)."
              : trend === "ثبات"
              ? " الأداء شبه ثابت (فرصة لخلق نمو أو تحسين كفاءة)."
              : " أضف فترات أكثر للحصول على تشخيص أدق."}
          </p>
        </section>

        {/* Products (Editable) + BarChart */}
        <section className={cardClass}>
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

          <p className={`mt-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            قراءة محفظة المنتجات: أعلى تركّز حاليًا = <span className="font-semibold">{topShare}%</span>.{" "}
            {topShare >= 70
              ? "يوصى بتوسيع قاعدة الإيرادات لتقليل المخاطر."
              : "مستوى التركّز ضمن نطاق مقبول نسبيًا."}
          </p>

          <p className={`mt-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            * القيم أعلاه تمثل توزيعًا حسابيًا للإيرادات على المنتجات بناءً على النِسب المدخلة، لغرض العرض التحليلي فقط.
          </p>
        </section>

        {/* Scenarios */}
        <section className={cardClass}>
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

          <p className={`mt-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            السيناريوهات تعطي “حدود قرار” واضحة:
            {profit >= 0
              ? " الوضع الأساسي إيجابي، لكن سيناريو الضغط يوضح مدى تحملك للصدمات."
              : " الوضع الأساسي سلبي، وسيناريو الضغط يحدد حجم الخطر إذا ساءت الظروف."}
          </p>

          <p className={`mt-3 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            * السيناريوهات أعلاه تعكس افتراضات حسابية للمقارنة فقط، ولا تُعد توصية مباشرة أو غير مباشرة.
          </p>
        </section>

        {/* Decision Signals */}
        <section className={cardClass}>
          <h2 className="text-xl font-semibold mb-4">إشارات القرار</h2>

          <div className="grid grid-cols-2 gap-6">
            <div className={`rounded-xl p-4 border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
              <div className="text-sm font-semibold mb-3">✅ نقاط قوة</div>
              <ul className={`text-sm space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className={`rounded-xl p-4 border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
              <div className="text-sm font-semibold mb-3">⚠️ إشارات تحتاج متابعة</div>
              <ul className={`text-sm space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {warnings.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            محور التركيز الحالي: <span className="font-semibold">{focusAxis}</span> — 
            يُستحسن استخدام هذا القسم لتحديد 1–3 إجراءات تنفيذية قصيرة المدى.
          </p>
        </section>

        {/* Guidance (مرتبط بالنتيجة + حماية قانونية) */}
        <section className={cardClass}>
          <h2 className="text-lg font-semibold mb-3">قراءة تحليلية إرشادية</h2>
          <p className={darkMode ? "text-gray-300" : "text-gray-700"}>{guidance}</p>
          <p className={`mt-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            هذا العرض ذو طابع معلوماتي وتحليلي فقط، ولا يمثل توصية مباشرة أو غير مباشرة، ولا يُقصد به توجيه قرار مالي أو استثماري.
          </p>
          <p className={`mt-2 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            ملاحظة: النتائج تعتمد على القيم المدخلة ونطاقها، وقد تختلف القراءة الفعلية وفق تفاصيل محاسبية وتشغيلية غير ممثلة هنا.
          </p>
        </section>
      </div>
    </main>
  );
}
