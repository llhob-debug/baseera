'use client';

import { useState } from 'react';

type Product = {
  name: string;
  value: number;
};

export default function DataPage() {
  const [revenue, setRevenue] = useState('');
  const [costs, setCosts] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState('');
  const [productValue, setProductValue] = useState('');
  const [result, setResult] = useState<any>(null);

  const addProduct = () => {
    if (!productName || !productValue) return;
    setProducts([...products, { name: productName, value: Number(productValue) }]);
    setProductName('');
    setProductValue('');
  };

  const analyze = () => {
    const r = Number(revenue);
    const c = Number(costs);
    const profit = r - c;
    const margin = r > 0 ? Math.round((profit / r) * 100) : 0;

    const sorted = [...products].sort((a, b) => b.value - a.value);
    const top = sorted[0];
    const low = sorted[sorted.length - 1];

    const profitability =
      profit > 0 ? 'جيدة' : profit === 0 ? 'متوسطة' : 'ضعيفة';

    const stability =
      margin >= 30 ? 'مستقر' : margin >= 15 ? 'متذبذب' : 'غير مستقر';

    const explanation =
      profit > 0
        ? 'البيانات تشير إلى أداء إيجابي نسبيًا، حيث تتجاوز الإيرادات التكاليف مع وجود توازن مقبول بين عناصر النشاط.'
        : 'يُلاحظ أن التكاليف تقترب من الإيرادات أو تتجاوزها، وهو نمط قد يظهر في فترات ضغط تشغيلي أو إعادة ترتيب داخل النشاط.';

    setResult({
      r,
      c,
      profit,
      margin,
      top,
      low,
      profitability,
      stability,
      explanation,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

      {/* الإدخال */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">التحليل</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="الإيرادات">
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="border rounded-xl px-4 py-3 w-full"
            />
          </Field>

          <Field label="التكاليف">
            <input
              type="number"
              value={costs}
              onChange={(e) => setCosts(e.target.value)}
              className="border rounded-xl px-4 py-3 w-full"
            />
          </Field>
        </div>

        <div className="border rounded-2xl p-4 space-y-4">
          <h2 className="font-semibold">المنتجات</h2>

          <div className="grid md:grid-cols-3 gap-3 items-end">
            <Field label="اسم المنتج" span={2}>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="border rounded-xl px-4 py-2 w-full"
              />
            </Field>

            <Field label="قيمة المنتج">
              <input
                type="number"
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
                className="border rounded-xl px-4 py-2 w-full"
              />
            </Field>
          </div>

          <button
            onClick={addProduct}
            className="bg-gray-200 px-4 py-2 rounded-xl text-sm"
          >
            إضافة منتج
          </button>

          {products.length > 0 && (
            <ul className="text-sm text-gray-600 space-y-1">
              {products.map((p, i) => (
                <li key={i}>
                  {p.name} — {p.value}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={analyze}
          className="bg-black text-white px-8 py-4 rounded-2xl text-lg"
        >
          تحليل
        </button>
      </div>

      {result && (
        <>
          {/* النتائج الرقمية */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card title="الإيرادات" value={`${result.r} ريال`} />
            <Card title="التكاليف" value={`${result.c} ريال`} />
            <Card title="صافي الربح" value={`${result.profit} ريال`} />
            <Card title="هامش الربح" value={`${result.margin}%`} />
            <Card title="أعلى منتج" value={result.top?.name || '-'} />
            <Card title="أقل منتج" value={result.low?.name || '-'} />
          </div>

          {/* التفسير */}
          <div className="border rounded-2xl p-6">
            <h2 className="font-semibold mb-2">🧠 التفسير الذكي</h2>
            <p className="text-gray-700 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* المؤشرات (ألوان أوضح) */}
          <div className="grid md:grid-cols-2 gap-6">
            <Indicator title="الربحية" value={result.profitability} />
            <Indicator title="الاستقرار" value={result.stability} />
          </div>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  span = 1,
}: {
  label: string;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <div className={`space-y-2 ${span === 2 ? 'md:col-span-2' : ''}`}>
      <label className="text-sm font-medium text-gray-800">{label}</label>
      {children}
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="border rounded-2xl p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function Indicator({ title, value }: { title: string; value: string }) {
  const style =
    value === 'جيدة' || value === 'مستقر'
      ? 'bg-green-100 border-green-400 text-green-800'
      : value === 'متوسطة' || value === 'متذبذب'
      ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
      : 'bg-red-100 border-red-400 text-red-800';

  return (
    <div className={`border-2 rounded-2xl p-6 ${style}`}>
      <div className="text-sm font-medium opacity-90">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
