import {
  afterEach, beforeEach, describe, expect, jest, test,
} from '@jest/globals';
import { DTBunchStub, IDTest } from '../core/DTBunch.double';
import DYOFinderTest, { DefaultConfiguration, generateComponent } from './DYOFinder.double';
import { FilterOperatorType } from '../../src/types';

/** *********************** TESTS SUITES ****************************** */
describe('class DYOFinder', () => {
  let bunchStubToFind: DTBunchStub;
  let finder: DYOFinderTest;

  beforeEach(() => {
    bunchStubToFind = generateComponent();
    finder = new DYOFinderTest(bunchStubToFind, DefaultConfiguration);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor()', () => {
    test('simple initialisation', () => {
      const newFinder = new DYOFinderTest(bunchStubToFind, DefaultConfiguration);

      expect(newFinder.th_get_component().getId()).toBe(IDTest);
      expect(newFinder.th_get_configuration()).toStrictEqual(DefaultConfiguration);
    });
  });

  describe('execute()', () => {
    const finderExecutionTestValue = (results: any): [number, []] => [
      results.length,
      results.map((result) => result.parentIndex),
    ];

    test('find items - $eq operator case', () => {
      // String prop
      expect(finderExecutionTestValue(finder.execute({ propString: { $eq: 'item_prime' } }))).toStrictEqual([2, [0, 1]]);
      expect(finderExecutionTestValue(finder.execute({ propString: { $eq: 'invalid' } }))).toStrictEqual([0, []]);
      // Number prop
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $eq: 17 } }))).toStrictEqual([2, [0, 3]]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $eq: 24 } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $eq: '17' } }))).toStrictEqual([0, []]);
      // Array prop
      expect(finderExecutionTestValue(finder.execute({ propArray: { $eq: 'tag1' } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propArray: { $eq: undefined } }))).toStrictEqual([1, [3]]);
      // Boolean prop
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $eq: true } }))).toStrictEqual([3, [0, 2, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $eq: false } }))).toStrictEqual([2, [1, 3]]);
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $eq: 'false' } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $eq: null } }))).toStrictEqual([0, []]);
      // Object prop
      expect(finderExecutionTestValue(finder.execute({ propObject: { $eq: 'value' } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propObject: { $eq: "{ data: 'value' }" } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propObject: { $eq: null } }))).toStrictEqual([2, [3, 4]]);
    });

    test('find items - $ne operator case', () => {
      // String prop
      expect(finderExecutionTestValue(finder.execute({ propString: { $ne: 'item_prime' } }))).toStrictEqual([3, [2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propString: { $ne: 'invalid' } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      // Number prop
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $ne: 17 } }))).toStrictEqual([3, [1, 2, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $ne: 24 } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $ne: '17' } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      // Array prop
      expect(finderExecutionTestValue(finder.execute({ propArray: { $ne: 'tag1' } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propArray: { $ne: undefined } }))).toStrictEqual([4, [0, 1, 2, 4]]);
      // Boolean prop
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $ne: true } }))).toStrictEqual([2, [1, 3]]);
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $ne: false } }))).toStrictEqual([3, [0, 2, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $ne: 'false' } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $ne: null } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      // Object prop
      expect(finderExecutionTestValue(finder.execute({ propObject: { $ne: 'value' } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propObject: { $ne: "{ data: 'value' }" } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propObject: { $ne: null } }))).toStrictEqual([3, [0, 1, 2]]);
    });

    test('find items - $in operator case', () => {
      // String prop
      expect(finderExecutionTestValue(finder.execute({ propString: { $in: ['item_prime', 'item_second'] } }))).toStrictEqual([4, [0, 1, 2, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propString: { $in: ['item_third', 'invalid', false] } }))).toStrictEqual([1, [3]]);
      // Number prop
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $in: [17, 19] } }))).toStrictEqual([3, [0, 1, 3]]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $in: ['17', 24, false] } }))).toStrictEqual([0, []]);
      // Array prop
      expect(finderExecutionTestValue(finder.execute({ propArray: { $in: ['tag1'] } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propArray: { $in: ['tag1', 'tag2', undefined] } }))).toStrictEqual([1, [3]]);
      // Boolean prop
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $in: [true, false] } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $in: ['true', 'false', null] } }))).toStrictEqual([0, []]);
      // Object prop
      expect(finderExecutionTestValue(finder.execute({ propObject: { $in: ['value'] } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propObject: { $in: null } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propObject: { $in: [null] } }))).toStrictEqual([2, [3, 4]]);
    });

    test('find items - $nin operator case', () => {
      // String prop
      expect(finderExecutionTestValue(finder.execute({ propString: { $nin: ['item_prime', 'item_second'] } }))).toStrictEqual([1, [3]]);
      expect(finderExecutionTestValue(finder.execute({ propString: { $nin: ['item_third', 'invalid', false] } }))).toStrictEqual([4, [0, 1, 2, 4]]);
      // Number prop
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $nin: [17, 19] } }))).toStrictEqual([2, [2, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $nin: ['17', 24, false] } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      // Array prop
      expect(finderExecutionTestValue(finder.execute({ propArray: { $nin: ['tag1'] } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propArray: { $nin: ['tag1', 'tag2', undefined] } }))).toStrictEqual([4, [0, 1, 2, 4]]);
      // Boolean prop
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $nin: [true, false] } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propBoolean: { $nin: ['true', 'false', null] } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      // Object prop
      expect(finderExecutionTestValue(finder.execute({ propObject: { $nin: ['value'] } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propObject: { $nin: null } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propObject: { $nin: [null] } }))).toStrictEqual([3, [0, 1, 2]]);
    });

    test('find items - $lte operator case', () => {
      // Number prop
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $lte: 23 } }))).toStrictEqual([4, [0, 1, 2, 3]]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $lte: 1000 } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $lte: null } }))).toStrictEqual([0, []]);
    });

    test('find items - $gte operator case', () => {
      // Number prop
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $gte: 23 } }))).toStrictEqual([2, [2, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $gte: -1000 } }))).toStrictEqual([5, [0, 1, 2, 3, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $gte: null } }))).toStrictEqual([0, []]);
    });

    test('find items - $contains operator case', () => {
      // Array prop
      expect(finderExecutionTestValue(finder.execute({ propArray: { $contains: 'tag1' } }))).toStrictEqual([3, [0, 1, 2]]);
      expect(finderExecutionTestValue(finder.execute({ propArray: { $contains: undefined } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propArray: { $contains: 'invalid_tag' } }))).toStrictEqual([0, []]);
    });

    test('find items - $ncontains operator case', () => {
      // Array prop
      expect(finderExecutionTestValue(finder.execute({ propArray: { $ncontains: 'tag1' } }))).toStrictEqual([1, [4]]);
      expect(finderExecutionTestValue(finder.execute({ propArray: { $ncontains: undefined } }))).toStrictEqual([4, [0, 1, 2, 4]]);
      expect(finderExecutionTestValue(finder.execute({ propArray: { $ncontains: 'invalid_tag' } }))).toStrictEqual([4, [0, 1, 2, 4]]);
    });

    test('disable filters by configuration', () => {
      finder.th_set_configuration({
        propString: {
          operators: [FilterOperatorType.NE],
          getValue: (item: any) => item.getPropString(),
          objectSearch: false,
        },
      });

      expect(finderExecutionTestValue(finder.execute({ propString: { $eq: 'item_prime' } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propString: { $in: ['item_prime', 'item_second'] } }))).toStrictEqual([0, []]);
    });

    test('returns no items when no filter passed', () => {
      expect(finderExecutionTestValue(finder.execute({}))).toStrictEqual([0, []]);
    });

    test('find items with object search property', () => {
      expect(finderExecutionTestValue(finder.execute(
        { propMeta: { meta1: { $eq: 'value1' } } },
      ))).toStrictEqual([2, [0, 1]]);
      expect(finderExecutionTestValue(finder.execute(
        { propMeta: { meta2: { $in: ['value2', 'value1'] } } },
      ))).toStrictEqual([2, [1, 2]]);
      expect(finderExecutionTestValue(finder.execute(
        { propMeta: { meta1: { $ne: 'value1' } } },
      ))).toStrictEqual([2, [2, 4]]);
      expect(finderExecutionTestValue(finder.execute(
        { propMeta: { meta1: { } } },
      ))).toStrictEqual([0, []]);
    });

    test('find items with complex and multiple filters', () => {
      // Multiple filters
      expect(finderExecutionTestValue(finder.execute(
        { propString: { $eq: 'item_prime' }, propNumber: { $lte: 18 } },
      ))).toStrictEqual([1, [0]]);
      // Multiple operators
      expect(finderExecutionTestValue(finder.execute(
        { propNumber: { $lte: 25, $gte: 15, $ne: 19 } },
      ))).toStrictEqual([3, [0, 2, 3]]);
      // Multiple filters and Object search
      expect(finderExecutionTestValue(finder.execute(
        { propString: { $in: ['item_prime', 'item_third'] }, propArray: { $ne: undefined }, propMeta: { meta2: { $ne: undefined } } },
      ))).toStrictEqual([1, [1]]);
    });
  });
});
