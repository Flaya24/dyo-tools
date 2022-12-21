import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {DTPlayerStub, KeyTest as KeyPlayerTest, toStringTest as toStringPlayerTest,} from './DTPlayer.double';
import {DTElementMock, IDTest, inheritance, KeyTest} from './DTElement.double';
import {MeldrineMetaData} from './DTComponentWithMeta.double';
import {DTComponentPhysical, DTElement} from "../../src";
import {MockedFunction} from "ts-jest";
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
  let elementMock: DTElementMock;

  beforeEach(() => {
    elementMock = new DTElementMock();
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
      expect(elementMock.getComponentType()).toBe('element');
    });
  });

  describe('copy()', () => {
    test('copy an element - simple case with id and key', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      const elementMockCopy = elementMock.copy();
      jest.spyOn(elementMock, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(elementMockCopy, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(elementMock, 'getKey').mockImplementation(function () {
        return this._key;
      });
      jest.spyOn(elementMockCopy, 'getKey').mockImplementation(function () {
        return this._key;
      });

      expect(elementMock.getId() === elementMockCopy.getId()).toBeFalsy();
      expect(elementMock.getKey() === elementMockCopy.getKey()).toBeTruthy();
    });

    test('copy an element - not copy owner and context', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      jest.spyOn(elementMock, 'setContext').mockImplementation(function (context) {
        this._context = context;
      });
      jest.spyOn(elementMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });

      elementMock.setContext(new DTElementMock());
      elementMock.setOwner(new DTPlayerStub());

      const elementMockCopy = elementMock.copy();
      jest.spyOn(elementMockCopy, 'getContext').mockImplementation(function () {
        return this._context;
      });
      jest.spyOn(elementMockCopy, 'getOwner').mockImplementation(function () {
        return this._owner;
      });

      expect(elementMockCopy.getContext()).toBeUndefined();
      expect(elementMockCopy.getOwner()).toBeUndefined();
    });

    test('copy an element - copy meta-data', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      const mockedSetManyMeta = DTElement.prototype.setManyMeta as MockedFunction<(metaValues : Partial<{}>) => void>;
      jest.spyOn(elementMock, 'getManyMeta').mockImplementation(function () {
        return MeldrineMetaData;
      });

      const elementMockCopy = elementMock.copy();

      // Weird behavior of Jest which doesn't clean the mock Calls, so it's the call index 2 to check
      expect(mockedSetManyMeta.mock.calls[2][0]).toStrictEqual(MeldrineMetaData);
    });
  });

  describe('toObject()', () => {
    test('toObject output standard', () => {
      const toObjectElement = elementMock.toObject();

      expect(Object.keys(toObjectElement)).toStrictEqual(['id', 'key', 'type']);
      expect(toObjectElement.id).toBe(IDTest);
      expect(toObjectElement.key).toBe(KeyTest);
      expect(toObjectElement.type).toBe('element');
    });

    test('toObject output standard with owner', () => {
      jest.spyOn(elementMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });
      elementMock.setOwner(new DTPlayerStub());

      const toObjectElement = elementMock.toObject();
      expect(Object.keys(toObjectElement)).toStrictEqual(['id', 'key', 'type', 'owner']);
      expect(toObjectElement.owner.toString()).toBe(toStringPlayerTest);
    });

    test('toObject output standard with owner and meta', () => {
      jest.spyOn(elementMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = new DTPlayerStub();
      });
      jest.spyOn(elementMock, 'setManyMeta').mockImplementation(function () {
        this._meta = MeldrineMetaData as any;
      });
      jest.spyOn(elementMock, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });

      elementMock.setOwner(new DTPlayerStub());
      elementMock.setManyMeta({});

      const toObjectElement = elementMock.toObject();
      expect(Object.keys(toObjectElement)).toStrictEqual(['id', 'key', 'type', 'owner', 'meta']);
      expect(toObjectElement.meta).toStrictEqual(MeldrineMetaData);
    });
  });

  describe('toString()', () => {
    test('string output standard', () => {
      const toStringElement = elementMock.toString();

      expect(toStringElement).toBe(`Component ${KeyTest} - Type: Element`);
    });

    test('string output standard with owner', () => {
      jest.spyOn(elementMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });
      elementMock.setOwner(new DTPlayerStub());

      const toStringElement = elementMock.toString();
      expect(toStringElement).toBe(`Component ${KeyTest} - Type: Element - Owner: ${KeyPlayerTest}`);
    });
  });
});
