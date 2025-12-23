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

            {/* CTA Button → /data */}
            <Link
              href="/data"
              className="mt-8 inline-block rounded-xl bg-white px-8 py-4 text-black text-lg font-semibold hover:bg-gray-200 transition"
            >
              ابدأ التحليل الآن
            </Link>

          </div>
        </div>

      </section>
    </main>
  );
}
