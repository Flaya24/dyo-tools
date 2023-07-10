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
  /**
   * Current DTComponent associated to the Finder.
   */
  protected _component: DYOFinderComponentType;

  /**
   * Current DYOFinder configuration applied.
   */
  protected _configuration: DYOFinderConfiguration;

  /**
   * Set _component and _configuration properties.
   *
   * @param component
   * @param configuration
   */
  constructor(component: DYOFinderComponentType, configuration: DYOFinderConfiguration) {
    this._component = component;
    this._configuration = configuration;
  }

  /**
   * Getter for _component property.
   */
  getComponent(): DYOFinderComponentType {
    return this._component;
  }

  /**
   * Return an array of DTComponent from *_component* **_items** property filtered with a **filters** argument.
   *
   * Search filters can be applied on properties depending on the current _configuration provided.
   *
   * For each search filter provided, an object of specific operators is applied :
   * * **BASIC OPERATORS**
   * * **$eq** : The property must be strict equal to the filter value.
   * * **$in** : The property must be included into the filter array.
   * * **$nin** : The property must not be included into the filter array.
   * * **$ne** : The property must be different to the filter value.
   * * **EXTENDED OPERATORS** (meta only)
   * * **$lte** : Number property only. The property must be lower or equal than the filter value.
   * * **$gte** : Number property only. The property must be higher or equal than the filter array.
   * * **$contains** : Array property only. The property must contain the filter value.
   * * **$ncontains** : Array property only. The property must not contain the filter value.
   *
   * If many operators and / or many properties are passed into the **filters** argument, the logic operator applied is
   * **AND**.
   *
   * @param filters Filters Object. The format is :
   * { [property_1] : { [operator_1] : filter_value, [operator_2] : filter_value_2, ... }, [property_2] : { ... }, ... }
   *
   * For **objectSearch** properties, you have to pass the object key before the operator :
   * { [property_1]: { [object_key1] : { [operator_1] : filter_value_1, ... }, [object_key2] : { ... }, ...  }, ... }
   * @returns Array of DTComponent instance corresponding to the filters. Empty if no filter or invalid ones are passed.
   */
  execute<ITEM>(filters: DYOFinderFilters): ITEM[] {
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
