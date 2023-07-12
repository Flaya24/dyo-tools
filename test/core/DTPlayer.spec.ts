import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {DTPlayerTest, IDTest, KeyTest} from './DTPlayer.double';
import {mockOverriddenMethods, PlayerMetaData} from './DTComponentWithMeta.double';
import {DTComponentWithMeta, DTPlayer} from "../../src";

/******************** MOCK DEPENDENCIES
 * All Dependencies used by the component are mocked with Jest
 * *****/
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTComponentWithMeta');
mockOverriddenMethods(DTComponentWithMeta);

/************************* TESTS SUITES *******************************/
describe('class DYOToolsPlayer', () => {
  let playerTest: DTPlayerTest;

  beforeEach(() => {
    playerTest = new DTPlayerTest();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(DTPlayer.prototype instanceof DTComponentWithMeta).toBeTruthy();
    });
  });

  describe('_componentType', () => {
    test('componentType must be "player"', () => {
      expect(playerTest.th_get_componentType()).toBe('player');
    });
  });

  describe('copy()', () => {
    // @see copy.spec.ts for unit tests about copy method
  });

  describe('toObject()', () => {
    beforeEach(() => {
      playerTest.th_set_id(IDTest);
      playerTest.th_set_key(KeyTest);
    })

    test('toObject output standard', () => {
      const toObjectPlayer = playerTest.toObject();

      expect(Object.keys(toObjectPlayer)).toStrictEqual(['id', 'key', 'type']);
      expect(toObjectPlayer.id).toBe(IDTest);
      expect(toObjectPlayer.key).toBe(KeyTest);
      expect(toObjectPlayer.type).toBe('player');
    });

    test('toObject output standard with meta', () => {
      jest.spyOn(playerTest, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });
      playerTest.th_set_meta(PlayerMetaData);

      const toObjectPlayer = playerTest.toObject();

      expect(Object.keys(toObjectPlayer)).toStrictEqual(['id', 'key', 'type', 'meta']);
      expect(toObjectPlayer.meta).toStrictEqual(PlayerMetaData);
    });
  });

  describe('toString()', () => {
    beforeEach(() => {
      playerTest.th_set_key(KeyTest);
    })

    test('string output standard', () => {
      const toStringElement = playerTest.toString();

      expect(toStringElement).toBe(`Component ${KeyTest} - Type: Player`);
    });
  });
});
