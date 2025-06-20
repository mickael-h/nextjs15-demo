import got from 'got';
import metascraper from 'metascraper';
import metascraperImage from 'metascraper-image';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperLogo from 'metascraper-logo';
import metascraperUrl from 'metascraper-url';

export interface PreviewData {
  image?: string;
  title?: string;
  description?: string;
  logo?: string;
  url?: string;
}

export async function fetchLinkPreview(url: string): Promise<PreviewData> {
  try {
    const { body: html } = await got(url, { timeout: 10000 });
    const scraper = metascraper([
      metascraperImage(),
      metascraperTitle(),
      metascraperDescription(),
      metascraperLogo(),
      metascraperUrl(),
    ]);
    const metadata = await scraper({ html, url });
    return metadata as PreviewData;
  } catch {
    throw new Error('Failed to fetch or parse metadata');
  }
}
