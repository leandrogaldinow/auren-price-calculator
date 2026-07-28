/** Result of scraping a marketplace product page. */
export interface ScrapedProduct {
  price: number;
  shipping: number | null;
  currency: 'USD' | 'CNY' | 'BRL' | 'MXN' | 'EUR';
  title: string | null;
  sourceUrl: string;
}

export type MarketplaceId = 'aliexpress' | 'cjdropshipping' | '1688' | 'amazon';

/**
 * Contract every marketplace scraper implements. Real implementations will
 * run inside a content script (see manifest `content_scripts`, not yet
 * registered) and read the DOM of the marketplace's product page.
 */
export interface ProductScraper {
  readonly marketplace: MarketplaceId;
  matches(url: string): boolean;
  scrape(document: Document): ScrapedProduct | null;
}
