import {afterEach, beforeEach, describe, expect, jest, test} from '@jest/globals';
import {DomainTest, DTManagerStubDomain, DTManagerTest, inheritance, ScopesTest} from "./DTManager.double";
import DTManager from "../../src/core/DTManager";
import {DTBunchStub, generateMockedElements, IDTest as IDTestBunch} from "./DTBunch.double";

describe('class DYOToolsManager', () => {
  let managerMock: any;

  beforeEach(() => {
    managerMock = new DTManagerTest();
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
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('creation simple with key', () => {
      const newManager = new DTManagerTest();

      expect(newManager.th_prop_items()).toStrictEqual({});
      expect(newManager.th_prop_scopes()).toStrictEqual(['default', 'virtual']);
      expect(newManager.th_prop_actions()).toStrictEqual({});

      // Library tests
      expect(newManager.th_prop_library().constructor.mock.calls.length).toBe(1);
      expect(newManager.th_prop_library().constructor.mock.calls[0][0]).toBe('library');
      expect(newManager.th_prop_library().constructor.mock.calls[0][1]).toStrictEqual([]);
      expect(newManager.th_prop_library().constructor.mock.calls[0][2].virtualContext).toBe(true);
    });

    test('creation simple without key - use domain if defined', () => {
      const newManager = new DTManager();
      const newManagerWithDomain = new DTManagerStubDomain();
      const newManagerWithDomain2 = new DTManagerStubDomain(null);

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
      const newManager = new DTManagerTest(null, mockedElements);

      expect(newManager.th_prop_items()).toStrictEqual({});
      expect(newManager.th_prop_scopes()).toStrictEqual(['default', 'virtual']);
      expect(newManager.th_prop_actions()).toStrictEqual({});

      expect(newManager.th_prop_library().constructor.mock.calls.length).toBe(1);
      expect(newManager.th_prop_library().constructor.mock.calls[0][0]).toBe('library');
      expect(newManager.th_prop_library().constructor.mock.calls[0][1]).toStrictEqual(mockedElements);
      expect(newManager.th_prop_library().constructor.mock.calls[0][2].virtualContext).toBe(true);
    });

    test('creation with elements for library and scopes', () => {
      const mockedElements = generateMockedElements(5);
      const newManager = new DTManagerTest(null, mockedElements, ScopesTest);

      expect(newManager.th_prop_items()).toStrictEqual({});
      expect(newManager.th_prop_actions()).toStrictEqual({});

      expect(newManager.th_prop_library().constructor.mock.calls.length).toBe(1);
      expect(newManager.th_prop_library().constructor.mock.calls[0][0]).toBe('library');
      expect(newManager.th_prop_library().constructor.mock.calls[0][1]).toStrictEqual(mockedElements);
      expect(newManager.th_prop_library().constructor.mock.calls[0][2].virtualContext).toBe(true);

      expect(newManager.th_prop_scopes()).toStrictEqual([
        'default',
        'virtual',
        ...ScopesTest
      ]);
    });
  });

  describe('add', () => {
    test('add a new item - empty bunch', () => {
      const bunch = new DTBunchStub();
      managerMock.add(bunch);

      expect(managerMock.th_prop_item(IDTestBunch)).toBeDefined();
      expect(Object.keys(managerMock.th_prop_item(IDTestBunch))).toStrictEqual(['scope', 'item']);
      expect(managerMock.th_prop_item(IDTestBunch).scope).toBe('default');
      expect(managerMock.th_prop_item(IDTestBunch).item.getId()).toBe(IDTestBunch);
    });
  });
});
