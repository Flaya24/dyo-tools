import { FilterOperatorType, StandardPrimitiveType } from '../types';

export function validFiltersForItem(itemProp: StandardPrimitiveType,
  filter: StandardPrimitiveType,
  operator: FilterOperatorType.EQ): boolean;
export function validFiltersForItem(itemProp: StandardPrimitiveType,
  filter: StandardPrimitiveType[],
  operator: FilterOperatorType.IN | FilterOperatorType.NIN): boolean;
export function validFiltersForItem(itemProp: StandardPrimitiveType,
  filter: StandardPrimitiveType,
  operator: FilterOperatorType.NE): boolean;
export function validFiltersForItem(itemProp: number, filter: number,
  operator: FilterOperatorType.LTE |
  FilterOperatorType.GTE): boolean;
export function validFiltersForItem(itemProp: StandardPrimitiveType[],
  filter: StandardPrimitiveType,
  operator: FilterOperatorType.CONTAINS | FilterOperatorType.NCONTAINS): boolean;
export function validFiltersForItem(
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
