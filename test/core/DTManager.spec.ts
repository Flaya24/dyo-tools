import {afterEach, beforeEach, describe, expect, jest, test} from '@jest/globals';
import {DomainTest, DTManagerWithDomain, inheritance, ScopesTest} from "./DTManager.double";
import DTManager from "../../src/core/DTManager";
import {defaultOptions as bunchDefaultOptions, generateMockedElements} from "./DTBunch.double";

describe('class DYOToolsManager', () => {
  // let bunchMock: DTBunchMock;

  beforeEach(() => {
    // bunchMock = new DTBunchMock();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(inheritance()).toBeTruthy();
    });
  });

  describe('constructor()', () => {
    test('creation simple with key', () => {
      // WIP
      const newManager = new DTManager();
      jest.spyOn(newManager, 'getAll').mockImplementation(function () {
        return this._items;
      });
      jest.spyOn(newManager, 'getScopes').mockImplementation(function () {
        return this._scopes;
      });
      jest.spyOn(newManager, 'getActions').mockImplementation(function () {
        return this._actions;
      });
      jest.spyOn(newManager, 'getLibrary').mockImplementation(function () {
        return this._library;
      });

      expect(newManager.getAll()).toStrictEqual({});
      expect(newManager.getScopes()).toStrictEqual(['default', 'virtual']);
      expect(newManager.getActions()).toStrictEqual({});

      // Library tests
      expect(newManager.getLibrary().constructor.mock.calls.length).toBe(1);
      expect(newManager.getLibrary().constructor.mock.calls[0][0]).toBe('library');
      expect(newManager.getLibrary().constructor.mock.calls[0][1]).toStrictEqual([]);
      expect(newManager.getLibrary().constructor.mock.calls[0][2].virtualContext).toBe(true);
    });

    test('creation simple without key - use domain if defined', () => {
      const newManager = new DTManager();
      const newManagerWithDomain = new DTManagerWithDomain();
      const newManagerWithDomain2 = new DTManagerWithDomain(null);

      jest.spyOn(newManager, 'getKey').mockImplementation(function () {
        return this._key;
      });
      jest.spyOn(newManagerWithDomain, 'getKey').mockImplementation(function () {
        return this._key;
      });
      jest.spyOn(newManagerWithDomain2, 'getKey').mockImplementation(function () {
        return this._key;
      });

      expect(newManager.getKey() === DomainTest).toBe(false);
      expect(newManagerWithDomain.getKey() === DomainTest).toStrictEqual(true);
      expect(newManagerWithDomain2.getKey() === DomainTest).toStrictEqual(true);
    });

    test('creation with elements for library', () => {
      const mockedElements = generateMockedElements(5);
      const newManager = new DTManager(null, mockedElements);

      jest.spyOn(newManager, 'getLibrary').mockImplementation(function () {
        return this._library;
      });
      expect(newManager.getAll()).toStrictEqual({});
      expect(newManager.getScopes()).toStrictEqual(['default', 'virtual']);
      expect(newManager.getActions()).toStrictEqual({});

      expect(newManager.getLibrary().constructor.mock.calls.length).toBe(1);
      expect(newManager.getLibrary().constructor.mock.calls[0][0]).toBe('library');
      expect(newManager.getLibrary().constructor.mock.calls[0][1]).toStrictEqual(mockedElements);
      expect(newManager.getLibrary().constructor.mock.calls[0][2].virtualContext).toBe(true);
    });

    test('creation with elements for library and scopes', () => {
      const mockedElements = generateMockedElements(5);
      const newManager = new DTManager(null, mockedElements, ScopesTest);

      jest.spyOn(newManager, 'getLibrary').mockImplementation(function () {
        return this._library;
      });
      jest.spyOn(newManager, 'getScopes').mockImplementation(function () {
        return this._scopes;
      });

      expect(newManager.getAll()).toStrictEqual({});
      expect(newManager.getActions()).toStrictEqual({});

      expect(newManager.getLibrary().constructor.mock.calls.length).toBe(1);
      expect(newManager.getLibrary().constructor.mock.calls[0][0]).toBe('library');
      expect(newManager.getLibrary().constructor.mock.calls[0][1]).toStrictEqual(mockedElements);
      expect(newManager.getLibrary().constructor.mock.calls[0][2].virtualContext).toBe(true);

      expect(newManager.getScopes()).toStrictEqual([
        'default',
        'virtual',
        ...ScopesTest
      ]);
    });
  });
});
