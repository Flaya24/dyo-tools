import {
  DTBunchFilterWithBaseOperator,
  DYOFinderConfiguration,
  DYOFinderFilters, FilterOperatorType,
  StandardPrimitiveType,
} from '../types';
import DYOToolsBunch from '../core/DTBunch';
import { validFiltersForItem } from '../utils/filters';

export default class DYOFinder {
  protected _component: DYOToolsBunch<any, any>;

  protected _configuration: DYOFinderConfiguration;

  constructor(component: DYOToolsBunch<any, any>, configuration: DYOFinderConfiguration) {
    this._component = component;
    this._configuration = configuration;
  }

  execute(filters: DYOFinderFilters): any[] {
    const items = this._component.getAll();
    const filteredItems = [];

    for (const item of items) {
      let validItem = !!(Object.keys(filters).length);

      for (const [propKey, configProp] of Object.entries(this._configuration)) {
        if (filters[propKey] && !this.checkAllValidFiltersForProp(configProp.getValue(item), filters[propKey], configProp.operators)) {
          validItem = false;
        }
      }

      if (validItem) {
        filteredItems.push(item);
      }
    }

    return filteredItems;
  }

  private checkAllValidFiltersForProp = (
    itemProp: StandardPrimitiveType,
    operators: Partial<DTBunchFilterWithBaseOperator>,
    validOperators: FilterOperatorType[],
  ) => {
    if (Object.keys(operators).length) {
      for (const operator of Object.keys(operators)) {
        if (!validOperators.includes(operator as FilterOperatorType)
          || !this.validFiltersForItem(itemProp, operators[operator], operator as FilterOperatorType.EQ)) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  private validFiltersForItem(itemProp: StandardPrimitiveType,
    filter: StandardPrimitiveType,
    operator: FilterOperatorType.EQ): boolean;
  private validFiltersForItem(itemProp: StandardPrimitiveType,
    filter: StandardPrimitiveType[],
    operator: FilterOperatorType.IN | FilterOperatorType.NIN): boolean;
  private validFiltersForItem(itemProp: StandardPrimitiveType,
    filter: StandardPrimitiveType,
    operator: FilterOperatorType.NE): boolean;
  private validFiltersForItem(itemProp: number, filter: number,
    operator: FilterOperatorType.LTE |
    FilterOperatorType.GTE): boolean;
  private validFiltersForItem(itemProp: StandardPrimitiveType[],
    filter: StandardPrimitiveType,
    operator: FilterOperatorType.CONTAINS | FilterOperatorType.NCONTAINS): boolean;
  private validFiltersForItem(
    itemProp: StandardPrimitiveType | StandardPrimitiveType[],
    filter: StandardPrimitiveType | StandardPrimitiveType[],
    operator: FilterOperatorType = FilterOperatorType.EQ,
  ): boolean {
    // $eq Filter
    if (operator === FilterOperatorType.EQ) {
      return itemProp === filter;
    }
    // $in Filter
    if (operator === FilterOperatorType.IN) {
      return filter ? (filter as StandardPrimitiveType[]).includes(itemProp as StandardPrimitiveType) : false;
    }
    // $nin Filter
    if (operator === FilterOperatorType.NIN) {
      return filter ? !(filter as StandardPrimitiveType[]).includes(itemProp as StandardPrimitiveType) : false;
    }
    // $ne Filter
    /* c8 ignore next */
    if (operator === FilterOperatorType.NE) {
      return itemProp !== filter;
    }
    // $lte Filter
    if (operator === FilterOperatorType.LTE) {
      if (typeof itemProp === 'number' && typeof filter === 'number') {
        return itemProp <= filter;
      }
      return false;
    }
    // $gte Filter
    if (operator === FilterOperatorType.GTE) {
      if (typeof itemProp === 'number' && typeof filter === 'number') {
        return itemProp >= filter;
      }
      return false;
    }
    // $contains Filter
    if (operator === FilterOperatorType.CONTAINS) {
      return itemProp ? (itemProp as StandardPrimitiveType[]).includes(filter as StandardPrimitiveType) : false;
    }
    // $Ncontains Filter
    if (operator === FilterOperatorType.NCONTAINS) {
      return itemProp ? !(itemProp as StandardPrimitiveType[]).includes(filter as StandardPrimitiveType) : false;
    }

    return false;
  }
}
