import got from 'got';
import * as cheerio from 'cheerio';

export interface PreviewData {
  image?: string;
  title?: string;
  description?: string;
  logo?: string;
  url?: string;
}

function resolveUrl(possiblyRelative: string | undefined, base: string): string | undefined {
  if (!possiblyRelative) return undefined;
  try {
    return new URL(possiblyRelative, base).toString();
  } catch {
    return possiblyRelative; // fallback
  }
}

export async function fetchLinkPreview(url: string): Promise<PreviewData> {
  try {
    const html = await got(url, { timeout: { request: 10000 } }).text();
    const $ = cheerio.load(html);

    const getMeta = (name: string) =>
      $(`meta[name="${name}"]`).attr('content') || $(`meta[property="${name}"]`).attr('content');

    const title = getMeta('og:title') || $('title').first().text() || getMeta('twitter:title');

    const description =
      getMeta('og:description') || getMeta('description') || getMeta('twitter:description');

    const image = getMeta('og:image') || getMeta('twitter:image') || $('img').first().attr('src');

    const logo =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      getMeta('og:logo');

    const canonicalUrl = getMeta('og:url') || $('link[rel="canonical"]').attr('href') || url;

    return {
      title,
      description,
      image: resolveUrl(image, canonicalUrl),
      logo: resolveUrl(logo, canonicalUrl),
      url: canonicalUrl,
    };
  } catch {
    throw new Error('Failed to fetch or parse metadata');
  }
}
