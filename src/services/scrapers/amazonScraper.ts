import type { ProductScraper, ScrapedProduct } from './types';

// TODO(scraping): implement once a content script is registered for
// https://www.amazon.*/* — watch out for regional TLDs and currency.
export const amazonScraper: ProductScraper = {
  marketplace: 'amazon',
  matches(url) {
    return /(^|\.)amazon\.[a-z.]+$/.test(new URL(url).hostname);
  },
  scrape(_document: Document): ScrapedProduct | null {
    return null;
  },
};
