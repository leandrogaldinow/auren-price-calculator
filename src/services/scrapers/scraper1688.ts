import type { ProductScraper, ScrapedProduct } from './types';

// TODO(scraping): implement once a content script is registered for
// https://detail.1688.com/* (prices are in CNY — pair with currencyService).
export const scraper1688: ProductScraper = {
  marketplace: '1688',
  matches(url) {
    return /(^|\.)1688\.com$/.test(new URL(url).hostname);
  },
  scrape(_document: Document): ScrapedProduct | null {
    return null;
  },
};
