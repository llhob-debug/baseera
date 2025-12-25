import { NextResponse } from "next/server";

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://baseeera-nine.vercel.app/</loc>
  </url>
  <url>
    <loc>https://baseeera-nine.vercel.app/basic</loc>
  </url>
  <url>
    <loc>https://baseeera-nine.vercel.app/intermediate</loc>
  </url>
  <url>
    <loc>https://baseeera-nine.vercel.app/data</loc>
  </url>
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
