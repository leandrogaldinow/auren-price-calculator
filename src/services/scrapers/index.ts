import type { ProductScraper } from './types';
import { aliexpressScraper } from './aliexpressScraper';
import { cjDropshippingScraper } from './cjDropshippingScraper';
import { scraper1688 } from './scraper1688';
import { amazonScraper } from './amazonScraper';

export * from './types';

export const scrapers: ProductScraper[] = [
  aliexpressScraper,
  cjDropshippingScraper,
  scraper1688,
  amazonScraper,
];

/** Finds the scraper registered for the given page URL, if any. */
export function findScraperForUrl(url: string): ProductScraper | undefined {
  return scrapers.find((scraper) => scraper.matches(url));
}
