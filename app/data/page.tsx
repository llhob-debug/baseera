"use client";

import { useState } from "react";
import Link from "next/link";

export default function DataPage() {
  const [revenue, setRevenue] = useState<number>(0);
  const [costs, setCosts] = useState<number>(0);

  const profit = revenue - costs;
  const margin =
    revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  /* ===== المؤشرات ===== */
  const profitability =
    profit > 0 ? "good" : profit === 0 ? "medium" : "weak";

  const stability =
    revenue > 0 && costs > 0 ? "stable" : "unstable";

  /* ===== التفسير الذكي ===== */
  let interpretation = "لم يتم إدخال بيانات كافية بعد.";

  if (revenue > 0) {
    if (profit > 0) {
      interpretation =
        "البيانات تشير إلى أن الأداء العام إيجابي، حيث تتجاوز الإيرادات التكاليف. يُلاحظ أن مستوى الربحية الحالي يعكس توازنًا مقبولًا في النشاط، وقد يكون من المفيد متابعة هذا النمط عبر الفترات القادمة لفهم الاستقرار بشكل أوضح.";
    } else if (profit === 0) {
      interpretation =
        "البيانات تشير إلى تعادل بين الإيرادات والتكاليف. يُلاحظ أن النشاط يعمل عند نقطة توازن، وهو وضع قد يكون طبيعيًا في بعض المراحل التشغيلية.";
    } else {
      interpretation =
        "البيانات تشير إلى أن التكاليف تتجاوز الإيرادات خلال هذه الفترة. يُلاحظ أن هذا النمط قد يؤثر على الاستدامة إذا استمر، وقد يكون من المفيد مراقبته مع مرور الوقت.";
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-3xl space-y-12">

        {/* الرأس */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">تحليل الأداء</h1>
            <p className="text-gray-600">
              أدخل أرقامك الأساسية وشاهد القراءة العامة للأداء
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 transition"
          >
            ← العودة للرئيسية
          </Link>
        </header>

        {/* إدخال البيانات */}
        <section className="rounded-2xl bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">البيانات الأساسية</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">الإيرادات</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">التكاليف</label>
              <input
                type="number"
                value={costs}
                onChange={(e) => setCosts(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </section>

        {/* ملخص الأرقام */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">ملخص الأرقام</h2>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-gray-100 p-4">
              <p className="text-sm text-gray-600">صافي النتيجة</p>
              <p className="text-2xl font-bold">{profit}</p>
            </div>

            <div className="rounded-lg bg-gray-100 p-4">
              <p className="text-sm text-gray-600">الهامش التقريبي</p>
              <p className="text-2xl font-bold">{margin}%</p>
            </div>
          </div>
        </section>

        {/* أعلى / أقل */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">أعلى / أقل بند</h2>

          <div className="space-y-3">
            <div className="flex justify-between rounded-lg bg-green-50 px-4 py-3">
              <span>أعلى قيمة</span>
              <span className="font-medium">الإيرادات</span>
            </div>

            <div className="flex justify-between rounded-lg bg-red-50 px-4 py-3">
              <span>أقل قيمة</span>
              <span className="font-medium">التكاليف</span>
            </div>
          </div>
        </section>

        {/* التفسير */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">التفسير</h2>
          <p className="text-gray-700 leading-relaxed">
            {interpretation}
          </p>
        </section>

        {/* المؤشرات */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">المؤشرات</h2>

          <div className="space-y-3">
            <div
              className={`flex justify-between rounded-lg px-4 py-3 ${
                profitability === "good"
                  ? "bg-green-100"
                  : profitability === "medium"
                  ? "bg-yellow-100"
                  : "bg-red-100"
              }`}
            >
              <span>مؤشر الربحية</span>
              <span className="font-medium">
                {profitability === "good"
                  ? "🟢 جيدة"
                  : profitability === "medium"
                  ? "🟡 متوسطة"
                  : "🔴 ضعيفة"}
              </span>
            </div>

            <div
              className={`flex justify-between rounded-lg px-4 py-3 ${
                stability === "stable" ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <span>مؤشر الاستقرار</span>
              <span className="font-medium">
                {stability === "stable" ? "🟢 مستقر" : "🟡 متذبذب"}
              </span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
