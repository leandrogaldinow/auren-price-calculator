import type { ProductScraper, ScrapedProduct } from './types';

/**
 * TODO(scraping): implement real DOM extraction once a content script is
 * registered for https://*.aliexpress.com/*. AliExpress renders price data
 * inside a window.__INIT_DATA__ / runParams JSON blob on product pages —
 * prefer parsing that over CSS selectors, which change often.
 */
export const aliexpressScraper: ProductScraper = {
  marketplace: 'aliexpress',
  matches(url) {
    return /(^|\.)aliexpress\.com$/.test(new URL(url).hostname);
  },
  scrape(_document: Document): ScrapedProduct | null {
    return null;
  },
};
