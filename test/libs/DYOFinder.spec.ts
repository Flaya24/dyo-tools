import {
  afterEach, beforeEach, describe, jest, test, expect,
} from '@jest/globals';
import { DTBunchStub, IDTest } from '../core/DTBunch.double';
import DYOFinderTest, { DefaultConfiguration, generateComponent } from './DYOFinder.double';

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
      expect(finderExecutionTestValue(finder.execute({ propString: { $eq: 'item_prime' } }))).toStrictEqual([2, [0, 1]]);
      expect(finderExecutionTestValue(finder.execute({ propString: { $eq: 1234567 } }))).toStrictEqual([0, []]);
      expect(finderExecutionTestValue(finder.execute({ propNumber: { $eq: 17 } }))).toStrictEqual([2, [0, 3]]);
      expect(finderExecutionTestValue(finder.execute({ propString: { $eq: '1234567' } }))).toStrictEqual([0, []]);
    });
  });
});
