import { describe } from '@jest/globals';
import { validFiltersForItem } from '../../src/utils/filters';
import { FilterOperatorType } from '../../src/types';

describe('validFiltersForItem', () => {
  test('valid value for $eq equivalency', () => {
    expect(validFiltersForItem('filter-id', 'filter-id', FilterOperatorType.EQ)).toBe(true);
    expect(validFiltersForItem('12345', 'filter-id', FilterOperatorType.EQ)).toBe(false);
    expect(validFiltersForItem(12345, '12345', FilterOperatorType.EQ)).toBe(false);
    expect(validFiltersForItem(true, true, FilterOperatorType.EQ)).toBe(true);
    expect(validFiltersForItem(false, true, FilterOperatorType.EQ)).toBe(false);
    expect(validFiltersForItem(null, null, FilterOperatorType.EQ)).toBe(true);
    expect(validFiltersForItem(0, null, FilterOperatorType.EQ)).toBe(false);
    expect(validFiltersForItem(undefined, null, FilterOperatorType.EQ)).toBe(false);
    expect(validFiltersForItem(12345, 12345, FilterOperatorType.EQ)).toBe(true);
    expect(validFiltersForItem(45678, 12345, FilterOperatorType.EQ)).toBe(false);
  });

  test('valid value for $in operator', () => {
    expect(validFiltersForItem('filter-id', ['filter-id'], FilterOperatorType.IN)).toBe(true);
    expect(validFiltersForItem('filter-id', ['filter-id', '12345'], FilterOperatorType.IN)).toBe(true);
    expect(validFiltersForItem('filter-id', ['12345', 'filter-key'], FilterOperatorType.IN)).toBe(false);
    expect(validFiltersForItem(true, [true, 12345, 'filter-id'], FilterOperatorType.IN)).toBe(true);
    expect(validFiltersForItem(false, [true, 12345, 'filter-id'], FilterOperatorType.IN)).toBe(false);
    expect(validFiltersForItem(null, [null, 12345, 'filter-id'], FilterOperatorType.IN)).toBe(true);
    expect(validFiltersForItem(undefined, [null, 12345, 'filter-id'], FilterOperatorType.IN)).toBe(false);
    expect(validFiltersForItem(12345, ['filter-id', 12345, 45678, true], FilterOperatorType.IN)).toBe(true);
    expect(validFiltersForItem(17, ['filter-id', 12345, 45678, true], FilterOperatorType.IN)).toBe(false);
    expect(validFiltersForItem('filter-id', null, FilterOperatorType.IN)).toBe(false);
  });

  test('valid value for $nin operator', () => {
    expect(validFiltersForItem('filter-id', ['filter-id'], FilterOperatorType.NIN)).toBe(false);
    expect(validFiltersForItem('filter-id', ['filter-id', '12345'], FilterOperatorType.NIN)).toBe(false);
    expect(validFiltersForItem('filter-id', ['12345', 'filter-key'], FilterOperatorType.NIN)).toBe(true);
    expect(validFiltersForItem(true, [true, 12345, 'filter-id'], FilterOperatorType.NIN)).toBe(false);
    expect(validFiltersForItem(false, [true, 12345, 'filter-id'], FilterOperatorType.NIN)).toBe(true);
    expect(validFiltersForItem(null, [null, 12345, 'filter-id'], FilterOperatorType.NIN)).toBe(false);
    expect(validFiltersForItem(undefined, [null, 12345, 'filter-id'], FilterOperatorType.NIN)).toBe(true);
    expect(validFiltersForItem(12345, ['filter-id', 12345, 45678, true], FilterOperatorType.NIN)).toBe(false);
    expect(validFiltersForItem(17, ['filter-id', 12345, 45678, true], FilterOperatorType.NIN)).toBe(true);
    expect(validFiltersForItem('filter-id', null, FilterOperatorType.NIN)).toBe(false);
  });

  test('valid value for $ne operator', () => {
    expect(validFiltersForItem('filter-id', 'filter-id', FilterOperatorType.NE)).toBe(false);
    expect(validFiltersForItem('12345', 'filter-id', FilterOperatorType.NE)).toBe(true);
    expect(validFiltersForItem(12345, '12345', FilterOperatorType.NE)).toBe(true);
    expect(validFiltersForItem(true, true, FilterOperatorType.NE)).toBe(false);
    expect(validFiltersForItem(false, true, FilterOperatorType.NE)).toBe(true);
    expect(validFiltersForItem(null, null, FilterOperatorType.NE)).toBe(false);
    expect(validFiltersForItem(0, null, FilterOperatorType.NE)).toBe(true);
    expect(validFiltersForItem(undefined, null, FilterOperatorType.NE)).toBe(true);
    expect(validFiltersForItem(12345, 12345, FilterOperatorType.NE)).toBe(false);
    expect(validFiltersForItem(45678, 12345, FilterOperatorType.NE)).toBe(true);
  });

  test('valid value for $lte operator', () => {
    expect(validFiltersForItem(1, 3, FilterOperatorType.LTE)).toBe(true);
    expect(validFiltersForItem(5, 3, FilterOperatorType.LTE)).toBe(false);
    expect(validFiltersForItem(3, 3, FilterOperatorType.LTE)).toBe(true);
    expect(validFiltersForItem(0, 0, FilterOperatorType.LTE)).toBe(true);
    expect(validFiltersForItem(-11, 0, FilterOperatorType.LTE)).toBe(true);
    expect(validFiltersForItem(-7, -11, FilterOperatorType.LTE)).toBe(false);
    expect(validFiltersForItem(null, -11, FilterOperatorType.LTE)).toBe(false);
    expect(validFiltersForItem(undefined, -11, FilterOperatorType.LTE)).toBe(false);
    expect(validFiltersForItem(0, null, FilterOperatorType.LTE)).toBe(false);
    expect(validFiltersForItem(0, undefined, FilterOperatorType.LTE)).toBe(false);
  });

  test('valid value for $gte operator', () => {
    expect(validFiltersForItem(1, 3, FilterOperatorType.GTE)).toBe(false);
    expect(validFiltersForItem(5, 3, FilterOperatorType.GTE)).toBe(true);
    expect(validFiltersForItem(3, 3, FilterOperatorType.GTE)).toBe(true);
    expect(validFiltersForItem(0, 0, FilterOperatorType.GTE)).toBe(true);
    expect(validFiltersForItem(-11, 0, FilterOperatorType.GTE)).toBe(false);
    expect(validFiltersForItem(-7, -11, FilterOperatorType.GTE)).toBe(true);
    expect(validFiltersForItem(null, -7, FilterOperatorType.GTE)).toBe(false);
    expect(validFiltersForItem(undefined, -7, FilterOperatorType.GTE)).toBe(false);
    expect(validFiltersForItem(0, null, FilterOperatorType.GTE)).toBe(false);
    expect(validFiltersForItem(0, undefined, FilterOperatorType.GTE)).toBe(false);
  });

  test('valid value for $contains operator', () => {
    expect(validFiltersForItem(['filter-id'], 'filter-id', FilterOperatorType.CONTAINS)).toBe(true);
    expect(validFiltersForItem(['filter-id', '12345'], 'filter-id', FilterOperatorType.CONTAINS)).toBe(true);
    expect(validFiltersForItem(['12345', 'filter-key'], 'filter-id', FilterOperatorType.CONTAINS)).toBe(false);
    expect(validFiltersForItem([true, 12345, 'filter-id'], true, FilterOperatorType.CONTAINS)).toBe(true);
    expect(validFiltersForItem([true, 12345, 'filter-id'], false, FilterOperatorType.CONTAINS)).toBe(false);
    expect(validFiltersForItem([null, 12345, 'filter-id'], null, FilterOperatorType.CONTAINS)).toBe(true);
    expect(validFiltersForItem([null, 12345, 'filter-id'], undefined, FilterOperatorType.CONTAINS)).toBe(false);
    expect(validFiltersForItem(['filter-id', 12345, 45678, true], 12345, FilterOperatorType.CONTAINS)).toBe(true);
    expect(validFiltersForItem(['filter-id', 12345, 45678, true], 17, FilterOperatorType.CONTAINS)).toBe(false);
    expect(validFiltersForItem(null, 'filter-id', FilterOperatorType.CONTAINS)).toBe(false);
  });

  test('valid value for $ncontains operator', () => {
    expect(validFiltersForItem(['filter-id'], 'filter-id', FilterOperatorType.NCONTAINS)).toBe(false);
    expect(validFiltersForItem(['filter-id', '12345'], 'filter-id', FilterOperatorType.NCONTAINS)).toBe(false);
    expect(validFiltersForItem(['12345', 'filter-key'], 'filter-id', FilterOperatorType.NCONTAINS)).toBe(true);
    expect(validFiltersForItem([true, 12345, 'filter-id'], true, FilterOperatorType.NCONTAINS)).toBe(false);
    expect(validFiltersForItem([true, 12345, 'filter-id'], false, FilterOperatorType.NCONTAINS)).toBe(true);
    expect(validFiltersForItem([null, 12345, 'filter-id'], null, FilterOperatorType.NCONTAINS)).toBe(false);
    expect(validFiltersForItem([null, 12345, 'filter-id'], undefined, FilterOperatorType.NCONTAINS)).toBe(true);
    expect(validFiltersForItem(['filter-id', 12345, 45678, true], 12345, FilterOperatorType.NCONTAINS)).toBe(false);
    expect(validFiltersForItem(['filter-id', 12345, 45678, true], 17, FilterOperatorType.NCONTAINS)).toBe(true);
    expect(validFiltersForItem(null, 'filter-id', FilterOperatorType.NCONTAINS)).toBe(false);
  });
});
