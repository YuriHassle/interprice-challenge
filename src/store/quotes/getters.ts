import type { QuoteItem, Quote } from '../../models/Quote';
import type { State } from './state';
import type { GetterTree } from 'vuex';

export interface Getters extends GetterTree<State, State> {
  filteredQuoteItems(state: State): QuoteItem[];
  currencyList(state: State): Array<string>;
  yearList(state: State): Array<string>;
  displayList(): Array<string>;
}

const generateFilterListByProperty = (
  array: QuoteItem[],
  property: keyof Quote
) => {
  const list = [] as Array<string | number | null>;

  array.forEach(({ Quote }) => {
    Quote?.forEach((quoteObject) => {
      if (quoteObject[property] && !list.includes(quoteObject[property])) {
        list.push(quoteObject[property]);
      }
    });
  });

  return list;
};

export default {
  filteredQuoteItems(state): QuoteItem[] {
    const { companyNameFilter, quoteItems, currencyFilter, yearsFilter } =
      state;

    const filterByCompanyName = ({ Company }: QuoteItem) =>
      Company.includes(companyNameFilter);
    const filterByCurrency = ({ Currency }: Quote) =>
      Currency === currencyFilter;
    const filterByYears = ({ Years }: Quote) => yearsFilter.includes(Years);

    const filteredQuoteItems = companyNameFilter
      ? [...quoteItems.filter(filterByCompanyName)]
      : quoteItems;

    console.log('test', filteredQuoteItems);

    for (const item of filteredQuoteItems) {
      const filteredQuotes =
        item.Quote?.filter(filterByCurrency).filter(filterByYears) || null;

      filteredQuoteItems.push({ ...item, Quote: filteredQuotes });
    }

    return filteredQuoteItems;
  },
  currencyList({ quoteItems }): Array<string> {
    return generateFilterListByProperty(
      quoteItems,
      'Currency'
    ) as Array<string>;
  },
  yearList({ quoteItems }): Array<string> {
    const list = generateFilterListByProperty(quoteItems, 'Years');

    return list.map((year) => `${year} YRS`);
  },
  displayList(): Array<string> {
    return ['Spread', 'Yield', '3MLSpread'];
  },
} as Getters;
