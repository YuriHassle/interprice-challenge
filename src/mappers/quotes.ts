import type { Item, Quote } from '../types/quotes';

export function mapQuotes({
  items,
  years,
  companyName,
  currency,
}: mapQuotesParams): Item[] {
  const mappedItems = [];

  const filterByCompanyName = ({ Company }: Item) =>
    Company.includes(companyName);
  const filterByCurrency = ({ Currency }: Quote) => Currency === currency;
  const filterByYears = ({ Years }: Quote) => years.includes(Years);

  if (companyName) {
    items = items.filter(filterByCompanyName);
  }

  for (const item of items) {
    const filteredQuotes =
      item.Quote?.filter(filterByCurrency).filter(filterByYears) || null;

    mappedItems.push({ ...item, Quote: filteredQuotes });
  }

  return mappedItems;
}

interface mapQuotesParams {
  items: Item[];
  years: number[];
  companyName: string;
  currency: string;
}
