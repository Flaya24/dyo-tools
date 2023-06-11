import {
  DYOFinderComponentType,
  DYOFinderConfiguration,
  DYOFinderFilterOperator,
  DYOFinderFilters,
  FilterOperatorType,
  StandardPrimitiveType,
  StandardPrimitiveTypeWithArray,
} from '../types';

export default class DYOFinder {
  protected _component: DYOFinderComponentType;

  protected _configuration: DYOFinderConfiguration;

  constructor(component: DYOFinderComponentType, configuration: DYOFinderConfiguration) {
    this._component = component;
    this._configuration = configuration;
  }

  getComponent(): DYOFinderComponentType {
    return this._component;
  }

  execute(filters: DYOFinderFilters): any[] {
    const items = this._component.getAll();
    const filteredItems = [];

    for (const item of items) {
      let validItem = !!(Object.keys(filters).length);

      for (const [propKey, configProp] of Object.entries(this._configuration)) {
        if (filters[propKey]) {
          if (configProp.objectSearch) {
            const objectValue = configProp.getValue(item, this.getComponent());
            if (objectValue) {
              for (const [filterK, filterV] of Object.entries(filters[propKey])) {
                const metaValue = Object.prototype.hasOwnProperty.call(objectValue, filterK) ? objectValue[filterK] : undefined;
                if (!this.checkAllValidFiltersForProp(metaValue, filterV, configProp.operators)) {
                  validItem = false;
                  break;
                }
              }
            } else {
              validItem = false;
            }
          } else if (!this.checkAllValidFiltersForProp(
            (configProp.getValue(item, this.getComponent()) as StandardPrimitiveType),
            filters[propKey],
            configProp.operators,
          )) {
            validItem = false;
          }
        }
      }

      if (validItem) {
        filteredItems.push(item);
      }
    }

    return filteredItems;
  }

  private checkAllValidFiltersForProp = (
    itemProp: StandardPrimitiveTypeWithArray,
    operators: Partial<DYOFinderFilterOperator>,
    validOperators: FilterOperatorType[],
  ) => {
    if (Object.keys(operators).length) {
      for (const operator of Object.keys(operators)) {
        if (!validOperators.includes(operator as FilterOperatorType)
          || !this.validFiltersForItem(itemProp, operators[operator], operator as FilterOperatorType)) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  private validFiltersForItem(
    itemProp: StandardPrimitiveTypeWithArray,
    filter: StandardPrimitiveTypeWithArray,
    operator: FilterOperatorType,
  ): boolean {
    // $eq Filter
    if (operator === FilterOperatorType.EQ) {
      return itemProp === filter;
    }
    // $in Filter
    if (operator === FilterOperatorType.IN) {
      return filter ? (filter as Array<StandardPrimitiveType>).includes(itemProp as StandardPrimitiveType) : false;
    }
    // $nin Filter
    if (operator === FilterOperatorType.NIN) {
      return filter ? !(filter as Array<StandardPrimitiveType>).includes(itemProp as StandardPrimitiveType) : false;
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
      return (itemProp && Array.isArray(itemProp))
        ? (itemProp as Array<StandardPrimitiveType>).includes(filter as StandardPrimitiveType)
        : false;
    }
    // $ncontains Filter
    if (operator === FilterOperatorType.NCONTAINS) {
      return (itemProp && Array.isArray(itemProp))
        ? !(itemProp as Array<StandardPrimitiveType>).includes(filter as StandardPrimitiveType)
        : false;
    }

    return false;
  }
}
