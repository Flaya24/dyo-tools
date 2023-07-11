import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {DTPlayerStub, KeyTest as KeyPlayerTest, toStringTest as toStringPlayerTest,} from './DTPlayer.double';
import {DTElementTest, IDTest, KeyTest} from './DTElement.double';
import {MeldrineMetaData} from './DTComponentWithMeta.double';
import {DTComponentPhysical, DTElement} from "../../src";
import {mockOverriddenMethods} from "./DTComponentPhysical.double";

/******************** MOCK DEPENDENCIES
 * All Dependencies used by the component are mocked with Jest
 * *****/
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTComponentWithMeta');
jest.mock('../../src/core/DTComponentPhysical');
// Add specific mock for inherited methods to have a basic implementation
mockOverriddenMethods(DTComponentPhysical);

/************************* TESTS SUITES *******************************/
describe('class DYOToolsElement', () => {
  let elementTest: DTElementTest;

  beforeEach(() => {
    elementTest = new DTElementTest();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(DTElement.prototype instanceof DTComponentPhysical).toBeTruthy();
    });
  });

  describe('_componentType', () => {
    test('componentType must be "element"', () => {
      expect(elementTest.th_get_componentType()).toBe('element');
    });
  });

  describe('copy()', () => {
    // @see copy.spec.ts for unit tests about copy method
  })

  describe('toObject()', () => {
    beforeEach(() => {
      elementTest.th_set_id(IDTest);
      elementTest.th_set_key(KeyTest);
    })

    test('toObject output standard', () => {
      const toObjectElement = elementTest.toObject();

      expect(Object.keys(toObjectElement)).toStrictEqual(['id', 'key', 'type']);
      expect(toObjectElement.id).toBe(IDTest);
      expect(toObjectElement.key).toBe(KeyTest);
      expect(toObjectElement.type).toBe('element');
    });

    test('toObject output standard with owner', () => {
      elementTest.th_set_owner(new DTPlayerStub());

      const toObjectElement = elementTest.toObject();

      expect(Object.keys(toObjectElement)).toStrictEqual(['id', 'key', 'type', 'owner']);
      expect(toObjectElement.owner.toString()).toBe(toStringPlayerTest);
    });

    test('toObject output standard with owner and meta', () => {
      jest.spyOn(elementTest, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });
      elementTest.th_set_owner(new DTPlayerStub());
      elementTest.th_set_meta(MeldrineMetaData);

      const toObjectElement = elementTest.toObject();

      expect(Object.keys(toObjectElement)).toStrictEqual(['id', 'key', 'type', 'owner', 'meta']);
      expect(toObjectElement.meta).toStrictEqual(MeldrineMetaData);
    });
  });

  describe('toString()', () => {
    beforeEach(() => {
      elementTest.th_set_key(KeyTest);
    })

    test('string output standard', () => {
      const toStringElement = elementTest.toString();

      expect(toStringElement).toBe(`Component ${KeyTest} - Type: Element`);
    });

    test('string output standard with owner', () => {
      elementTest.th_set_owner(new DTPlayerStub());

      const toStringElement = elementTest.toString();

      expect(toStringElement).toBe(`Component ${KeyTest} - Type: Element - Owner: ${KeyPlayerTest}`);
    });
  });
});
