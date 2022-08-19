import { describe, test, beforeEach } from '@jest/globals';
import {
  DTPlayerStub, IDTest as IDPlayerTest, toStringTest as toStringPlayerTest, KeyTest as KeyPlayerTest,
} from './DTPlayer.double';
import {DTElementMock, IDTest, inheritance, KeyTest} from './DTElement.double';
import { MeldrineMetaData } from './DTComponentWithMeta.double';

describe('class DYOToolsElement', () => {
  let elementMock: DTElementMock;

  beforeEach(() => {
    elementMock = new DTElementMock();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(inheritance()).toBeTruthy();
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
      elementMock.setManyMeta({});

      const elementMockCopy = elementMock.copy();
      jest.spyOn(elementMockCopy, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });

      expect(elementMockCopy.getManyMeta()).toStrictEqual(MeldrineMetaData);
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
        this._owner = owner;
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
