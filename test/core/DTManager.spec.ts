import {afterEach, beforeEach, describe, expect, jest, test} from '@jest/globals';
import {DomainTest, DTManagerStubDomain, DTManagerTest, IDTest, KeyTest, ScopesTest} from "./DTManager.double";
import DTManager from "../../src/core/DTManager";
import {DTBunchStub, IDTest as IDTestBunch} from "./DTBunch.double";
import {mockOverriddenMethods} from "./DTComponent.double";
import {DTComponent} from "../../src";
import DYOToolsError from "../../src/core/DTError";
import {checkCallForMockedDTError} from "./DTError.double";
import MockedFunction = jest.MockedFunction;

/******************** MOCK DEPENDENCIES
 * Dependencies used by the component are mocked with Jest
 * *****/
jest.mock('../../src/core/DTElement');
jest.mock('../../src/core/DTBunch');
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTError');
// Add specific mock for inherited methods to have a basic implementation
mockOverriddenMethods(DTComponent);

/************************* TESTS SUITES *******************************/
describe('class DYOToolsManager', () => {
  let managerTest: DTManagerTest;

  beforeEach(() => {
    managerTest = new DTManagerTest();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(DTManager.prototype instanceof DTComponent).toBeTruthy();
    });
  });

  describe('_componentType', () => {
    test('componentType must be "bunch"', () => {
      expect(managerTest.th_get_componentType()).toBe('manager');
    });
  });

  describe('constructor()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('creation simple with key', () => {
      const newManager = new DTManagerTest(KeyTest);

      expect(newManager.th_get_items()).toStrictEqual({});
      expect(newManager.th_get_scopes()).toStrictEqual(['default', 'virtual']);
      expect(newManager.th_get_actions()).toStrictEqual({});

      // Library tests
      expect(newManager.th_get_library().constructor.mock.calls.length).toBe(1);
      expect(newManager.th_get_library().constructor.mock.calls[0][0]).toBe('library');
      expect(newManager.th_get_library().constructor.mock.calls[0][1]).toStrictEqual([]);
      expect(newManager.th_get_library().constructor.mock.calls[0][2].virtualContext).toBe(true);
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

    // test('creation with elements for library', () => {
    //   const mockedElements = generateMockedElements(5);
    //   const newManager = new DTManagerTest(null, mockedElements);
    //
    //   expect(newManager.th_prop_items()).toStrictEqual({});
    //   expect(newManager.th_prop_scopes()).toStrictEqual(['default', 'virtual']);
    //   expect(newManager.th_prop_actions()).toStrictEqual({});
    //
    //   expect(newManager.th_prop_library().constructor.mock.calls.length).toBe(1);
    //   expect(newManager.th_prop_library().constructor.mock.calls[0][0]).toBe('library');
    //   expect(newManager.th_prop_library().constructor.mock.calls[0][1]).toStrictEqual(mockedElements);
    //   expect(newManager.th_prop_library().constructor.mock.calls[0][2].virtualContext).toBe(true);
    // });
    //
    // test('creation with elements for library and scopes', () => {
    //   const mockedElements = generateMockedElements(5);
    //   const newManager = new DTManagerTest(null, mockedElements, ScopesTest);
    //
    //   expect(newManager.th_prop_items()).toStrictEqual({});
    //   expect(newManager.th_prop_actions()).toStrictEqual({});
    //
    //   expect(newManager.th_prop_library().constructor.mock.calls.length).toBe(1);
    //   expect(newManager.th_prop_library().constructor.mock.calls[0][0]).toBe('library');
    //   expect(newManager.th_prop_library().constructor.mock.calls[0][1]).toStrictEqual(mockedElements);
    //   expect(newManager.th_prop_library().constructor.mock.calls[0][2].virtualContext).toBe(true);
    //
    //   expect(newManager.th_prop_scopes()).toStrictEqual([
    //     'default',
    //     'virtual',
    //     ...ScopesTest
    //   ]);
    // });
  });

  describe('add', () => {
    let bunchToAdd: DTBunchStub;

    const checkManagerItem = (bunchId: string, scope: string): void => {
      expect(managerTest.th_get_single_item(bunchId)).toBeDefined();
      expect(Object.keys(managerTest.th_get_single_item(bunchId))).toStrictEqual(['scope', 'item']);
      expect(managerTest.th_get_single_item(bunchId).scope).toBe(scope);
      expect(managerTest.th_get_single_item(bunchId).item.getId()).toBe(bunchId);
    }

    beforeEach(() => {
      jest.spyOn(managerTest, 'getId').mockReturnValue(IDTest);
      jest.spyOn(managerTest, 'isValidScope').mockReturnValue(true);

      // Bunch to add
      bunchToAdd = new DTBunchStub();
      jest.spyOn(bunchToAdd, 'getAll').mockImplementation(function() {
        return this._items;
      });
      jest.spyOn(bunchToAdd, 'getOptions').mockImplementation(function() {
        return this._options;
      });

      // Add tests scopes
      managerTest.th_set_scopes([ ...managerTest.th_get_scopes(), ...ScopesTest ]);
    })

    test('add a new item - empty bunch in default scope', () => {
      managerTest.add(bunchToAdd);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(1);
      checkManagerItem(IDTestBunch, 'default');
    });

    test('add a new item - empty bunch in specific scope', () => {
      managerTest.add(bunchToAdd, ScopesTest[0]);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(1);
      checkManagerItem(IDTestBunch, ScopesTest[0]);
    });

    test('add a new item - virtual bunch in virtual scope', () => {
      bunchToAdd.th_set_options({ virtualContext: true });

      managerTest.add(bunchToAdd);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(1);
      checkManagerItem(IDTestBunch, 'virtual');
    });

    test('trigger error if not existing scope for bunch', () => {
      const errorScope = 'not-existing-scope';
      const mockedTriggerError = DTManager.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;
      jest.spyOn(managerTest, 'isValidScope').mockReturnValue(false);

      managerTest.add(bunchToAdd, errorScope);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(0);
      expect((managerTest.isValidScope as any).mock.calls.length).toBe(1);
      expect((managerTest.isValidScope as any).mock.calls[0][0]).toBe(errorScope);
      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'invalid_scope',
        "Scope provided doesn't exist in the manager",
        IDTest,
        bunchToAdd.getId(),
      );
    });

    test('trigger error if invalid scope for virtual bunch', () => {
      bunchToAdd.th_set_options({ virtualContext: true });
      const mockedTriggerError = DTManager.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;

      managerTest.add(bunchToAdd, ScopesTest[0]);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(0);
      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'forbidden_scope',
        "Scope provided cannot be associated to a virtual bunch",
        IDTest,
        bunchToAdd.getId(),
      );
    });

    test('trigger error if invalid virtual scope for bunch', () => {
      const mockedTriggerError = DTManager.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;

      managerTest.add(bunchToAdd, 'virtual');

      expect(Object.keys(managerTest.th_get_items()).length).toBe(0);
      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'forbidden_virtual_scope',
        "Virtual Scope provided cannot be associated to a physical bunch",
        IDTest,
        bunchToAdd.getId(),
      );
    });

    test('trigger conflict when adding two same bunch ids - parent triggerError', () => {
      // TODO
    });

    test('add bunch elements into library - simple case', () => {
      // TODO
    });

    test('add bunch elements into library - not adding existing elements in library', () => {
      // TODO
    });

    // test('add a new item - add bunch elements into library - simple case', () => {
    //   const bunchElements = generateMockedElements(5);
    //   const bunchElementsKeys = bunchElements.map((item: DYOToolsElement<IMetaDataTest>) => item.getKey())
    //   const bunch = new DTBunchStub(generateMockedElements(5));
    //   jest.spyOn(bunch, 'getAll').mockImplementation(function() {
    //     return this._items;
    //   })
    //
    //   managerTest.add(bunch);
    //
    //   expect(managerTest.th_get_single_item(IDTestBunch).item.getAllKeys()).toStrictEqual(bunchElementsKeys);
    //   expect(managerTest.th_get_library().addMany.mock.calls.length).toBe(1);
    //   expect(managerTest.th_get_library().addMany.mock.calls[0][0].map((item) => item.getKey())).toStrictEqual(bunchElementsKeys);
    //   expect(managerTest.th_get_library().addMany.mock.calls[0][1]).toBeUndefined();
    // });

    test('set context when adding an item - default case', () => {
      managerTest.th_set_id(IDTest);

      managerTest.add(bunchToAdd);

      expect((bunchToAdd.setContext as any).mock.calls.length).toBe(1);
      expect((bunchToAdd.setContext as any).mock.calls[0][0].th_get_id()).toBe(IDTest);
    });

    test('set context when adding an item - remove from old manager', () => {
      // TODO
    });
  });
});
