import type { ProductScraper, ScrapedProduct } from './types';

// TODO(scraping): implement once a content script is registered for
// https://*.cjdropshipping.com/*.
export const cjDropshippingScraper: ProductScraper = {
  marketplace: 'cjdropshipping',
  matches(url) {
    return /(^|\.)cjdropshipping\.com$/.test(new URL(url).hostname);
  },
  scrape(_document: Document): ScrapedProduct | null {
    return null;
  },
};
