import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { supabase } from '@/lib/supabase';
import { generatePdfHtml } from '@/lib/pdf-html';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const resolved = await context.params;
  const slug = decodeURIComponent((resolved.slug || '').trim());

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const { data: siteByWebsiteName, error: websiteNameError } = await supabase
    .from('sites')
    .select('*')
    .eq('website_name', slug)
    .maybeSingle();

  if (websiteNameError) {
    console.error('Supabase website_name lookup error (PDF):', websiteNameError);
    return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 });
  }

  let site = siteByWebsiteName;
  if (!site) {
    const { data: siteBySlug, error: slugError } = await supabase
      .from('sites')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (slugError) {
      console.error('Supabase slug lookup error (PDF):', slugError);
      return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 });
    }

    site = siteBySlug;
  }

  if (!site) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const html = generatePdfHtml(site, slug);

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '24mm', right: '24mm', bottom: '24mm', left: '24mm' },
    });

    const contentBuffer = Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf);
    const arrayBuffer = contentBuffer.buffer.slice(contentBuffer.byteOffset, contentBuffer.byteOffset + contentBuffer.byteLength);
    const byteArray = new Uint8Array(arrayBuffer as ArrayBuffer);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
