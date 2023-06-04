import { afterEach, beforeEach, describe, expect, jest, test, } from '@jest/globals';
import {
  checkManagerItem,
  DomainTest,
  DTManagerStubDomain,
  DTManagerTest,
  IDTest,
  KeyTest,
  populateManager,
  ScopesTest,
} from './DTManager.double';
import DTManager from '../../src/core/DTManager';
import {
  bunch1toObjectTest,
  bunch2toObjectTest,
  bunch3toObjectTest,
  DTBunchStub,
  DTBunchStubLibrary,
  generateMockedElements,
  IDTest as IDTestBunch,
  IDTestLibrary,
} from './DTBunch.double';
import { mockOverriddenMethods } from './DTComponent.double';
import { DTComponent, DTComponentPhysical, DTElement } from '../../src';
import DYOToolsError from '../../src/core/DTError';
import { checkCallForMockedDTError, DTErrorStub } from './DTError.double';
import { IMetaDataTest } from './DTComponentWithMeta.double';
import { componentManagerDefaultFinderConfiguration, managerDefaultOptions } from '../../src/constants';
import { FilterOperatorType } from '../../src/types';
import MockedFunction = jest.MockedFunction;

/** ****************** MOCK DEPENDENCIES
 * Dependencies used by the component are mocked with Jest
 * **** */
jest.mock('../../src/core/DTElement');
jest.mock('../../src/core/DTBunch');
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTError');
jest.mock('../../src/libs/DYOFinder');
// Add specific mock for inherited methods to have a basic implementation
mockOverriddenMethods(DTComponent);

/** *********************** TESTS SUITES ****************************** */
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
      const parentConstructorMock = (DTComponentPhysical.prototype.constructor as MockedFunction<(key: string, options: any) => void>).mock;

      expect(parentConstructorMock.calls.length).toBe(1);
      expect(parentConstructorMock.calls[0][0]).toBe(KeyTest);
      expect(parentConstructorMock.calls[0][1]).toStrictEqual(managerDefaultOptions);

      expect(newManager.th_get_items()).toStrictEqual({});
      expect(newManager.th_get_scopes()).toStrictEqual(['default', 'virtual']);

      // Library tests
      expect(newManager.th_get_library().constructor.mock.calls.length).toBe(1);
      expect(newManager.th_get_library().constructor.mock.calls[0][0]).toBe('library');
      expect(newManager.th_get_library().constructor.mock.calls[0][1]).toStrictEqual([]);
      expect(newManager.th_get_library().constructor.mock.calls[0][2].virtualContext).toBe(true);

      // Finder initialization
      expect((newManager.th_get_finder() as any).constructor.mock.calls.length).toBe(1);
      expect((newManager.th_get_finder() as any).constructor.mock.calls[0][0]).toStrictEqual(newManager);
      expect((newManager.th_get_finder() as any).constructor.mock.calls[0][1]).toStrictEqual(componentManagerDefaultFinderConfiguration);
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
      const newManager = new DTManagerTest(KeyTest, mockedElements);

      expect(newManager.th_get_items()).toStrictEqual({});
      expect(newManager.th_get_scopes()).toStrictEqual(['default', 'virtual']);

      // Library tests
      expect(newManager.th_get_library().constructor.mock.calls.length).toBe(1);
      expect(newManager.th_get_library().constructor.mock.calls[0][0]).toBe('library');
      expect(newManager.th_get_library().constructor.mock.calls[0][1].length).toStrictEqual(5);
      expect(newManager.th_get_library().constructor.mock.calls[0][1].map((item) => item.getId()))
        .toStrictEqual(mockedElements.map((item) => item.getId()));
      expect(newManager.th_get_library().constructor.mock.calls[0][2].virtualContext).toBe(true);
    });

    test('creation with extended scopes', () => {
      const mockedElements = generateMockedElements(5);
      const newManager = new DTManagerTest(null, mockedElements, ScopesTest);

      expect(newManager.th_get_items()).toStrictEqual({});
      expect(newManager.th_get_scopes()).toStrictEqual([
        'default',
        'virtual',
        ...ScopesTest,
      ]);
    });

    test('creation with specific options', () => {
      const mockedElements = generateMockedElements(5);
      const options = { errors: true, libraryDeletion: true };
      const parentConstructorMock = (DTComponentPhysical.prototype.constructor as MockedFunction<(key: string, options: any) => void>).mock;

      const newManager = new DTManagerTest(null, mockedElements, ScopesTest, options);

      expect(parentConstructorMock.calls.length).toBe(1);
      expect(parentConstructorMock.calls[0][0]).toBe(null);
      expect(parentConstructorMock.calls[0][1]).toStrictEqual(options);
    });
  });

  // TODO : WIP
  describe('getFinderConfiguration()', () => {
    const baseOperators = [
      FilterOperatorType.EQ,
      FilterOperatorType.IN,
      FilterOperatorType.NIN,
      FilterOperatorType.NE,
    ];

    test('check finder configuration for id attribute', () => {
      const finderConfigurationToCheck = managerTest.getFinderConfiguration().id;

      expect(finderConfigurationToCheck.operators).toStrictEqual(baseOperators);
      expect(finderConfigurationToCheck.getValue(new DTBunchStub())).toStrictEqual(IDTestBunch);
      expect(finderConfigurationToCheck.objectSearch).toBe(false);
    });
  });

  describe('getLibrary()', () => {
    test('return current manager Library', () => {
      managerTest.th_set_library(new DTBunchStubLibrary());

      const library: DTBunchStubLibrary = managerTest.getLibrary();
      expect(library).toBeTruthy();
      expect(library.getId()).toBe(IDTestLibrary);
    });
  });

  describe('getScopes()', () => {
    test('return manager scopes', () => {
      managerTest.th_set_scopes(ScopesTest);

      expect(managerTest.getScopes()).toStrictEqual(ScopesTest);
    });
  });

  describe('isValidScope()', () => {
    beforeEach(() => {
      managerTest.th_set_scopes(ScopesTest);
    });

    test('return true if scope exists', () => {
      expect(managerTest.isValidScope(ScopesTest[0])).toBe(true);
    });

    test('return false if scope doesn\'t exist', () => {
      expect(managerTest.isValidScope('invalid_scope')).toBe(false);
    });
  });

  describe('add()', () => {
    let bunchToAdd: DTBunchStub;

    beforeEach(() => {
      jest.spyOn(managerTest, 'getId').mockReturnValue(IDTest);
      jest.spyOn(managerTest, 'isValidScope').mockReturnValue(true);

      // Bunch to add
      bunchToAdd = new DTBunchStub();
      jest.spyOn(bunchToAdd, 'getAll').mockImplementation(function () {
        return this._items;
      });
      jest.spyOn(bunchToAdd, 'getOptions').mockImplementation(function () {
        return this._options;
      });
      jest.spyOn(bunchToAdd, 'getContext').mockImplementation(function () {
        return this._context;
      });

      // Add tests scopes
      managerTest.th_set_scopes([...managerTest.th_get_scopes(), ...ScopesTest]);
    });

    test('add a new item - empty bunch in default scope', () => {
      managerTest.add(bunchToAdd);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(1);
      checkManagerItem(managerTest, IDTestBunch, 'default');
    });

    test('add a new item - empty bunch in specific scope', () => {
      managerTest.add(bunchToAdd, ScopesTest[0]);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(1);
      checkManagerItem(managerTest, IDTestBunch, ScopesTest[0]);
    });

    test('add a new item - virtual bunch in virtual scope', () => {
      bunchToAdd.th_set_options({ virtualContext: true });

      managerTest.add(bunchToAdd);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(1);
      checkManagerItem(managerTest, IDTestBunch, 'virtual');
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
        'Scope provided cannot be associated to a virtual bunch',
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
        'Virtual Scope provided cannot be associated to a physical bunch',
        IDTest,
        bunchToAdd.getId(),
      );
    });

    test('trigger conflict error when adding two same bunch ids', () => {
      const mockedTriggerError = DTManager.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;

      managerTest.add(bunchToAdd);
      managerTest.add(bunchToAdd);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(1);
      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'id_conflict',
        'Bunch with same id already exists in the manager',
        IDTest,
        bunchToAdd.getId(),
      );
    });

    test('add bunch elements into library - simple case', () => {
      const bunchElements = generateMockedElements(5);
      const bunchElementsKeys = bunchElements.map((item: DTElement<IMetaDataTest>) => item.getKey());
      bunchToAdd.th_set_items(bunchElements);

      managerTest.add(bunchToAdd);

      expect(managerTest.th_get_single_item(IDTestBunch).item.getAllKeys()).toStrictEqual(bunchElementsKeys);
      expect(managerTest.th_get_library().add.mock.calls.length).toBe(5);
      let itemCount = 0;
      for (const addCalls of managerTest.th_get_library().add.mock.calls) {
        expect(addCalls[0].getKey()).toBe(bunchElements[itemCount].getKey());
        expect(addCalls[1]).toBeUndefined();
        itemCount += 1;
      }
    });

    test('add bunch elements into library - not adding existing elements in library', () => {
      const bunchElements = generateMockedElements(5);
      const bunchElementsInLibrary = generateMockedElements(2);
      const bunchElementsKeys = bunchElements.map((item: DTElement<IMetaDataTest>) => item.getKey());
      bunchToAdd.th_set_items(bunchElements);
      managerTest.th_set_library(new DTBunchStubLibrary(bunchElementsInLibrary));

      managerTest.add(bunchToAdd);

      expect(managerTest.th_get_single_item(IDTestBunch).item.getAllKeys()).toStrictEqual(bunchElementsKeys);
      expect(managerTest.th_get_library().add.mock.calls.length).toBe(3);
      let itemCount = 2;
      for (const addCalls of managerTest.th_get_library().add.mock.calls) {
        expect(addCalls[0].getKey()).toBe(bunchElements[itemCount].getKey());
        expect(addCalls[1]).toBeUndefined();
        itemCount += 1;
      }
    });

    test('set context when adding an item - default case', () => {
      managerTest.th_set_id(IDTest);

      managerTest.add(bunchToAdd);

      expect((bunchToAdd.setContext as any).mock.calls.length).toBe(1);
      expect((bunchToAdd.setContext as any).mock.calls[0][0].th_get_id()).toBe(IDTest);
    });

    test('set context when adding an item - remove from old manager', () => {
      const oldManagerTest = new DTManagerTest();
      bunchToAdd.th_set_context(oldManagerTest);
      oldManagerTest.th_set_items({ [bunchToAdd.getId()]: { scope: 'default', item: bunchToAdd } });
      managerTest.th_set_id(IDTest);
      oldManagerTest.th_set_id(`${IDTest}-old`);
      jest.spyOn(oldManagerTest, 'remove');
      jest.spyOn(oldManagerTest, 'getComponentType').mockImplementation(() => 'manager');

      managerTest.add(bunchToAdd);

      expect((oldManagerTest.remove as any).mock.calls.length).toBe(1);
      expect((oldManagerTest.remove as any).mock.calls[0][0]).toBe(bunchToAdd.getId());
      expect(Object.keys(managerTest.th_get_items()).length).toBe(1);
      checkManagerItem(managerTest, IDTestBunch, 'default');
    });
  });

  describe('addMany()', () => {
    let mockedAdd: MockedFunction<(item: any, scope?: string) => void>;
    let bunchesToAdd: DTBunchStub[];

    beforeEach(() => {
      jest.spyOn(managerTest, 'add').mockImplementation(() => {});
      mockedAdd = managerTest.add as MockedFunction<(item: any, scope?: string) => void>;

      // Bunches to add
      const bunchToAdd1 = new DTBunchStub();
      bunchToAdd1.th_set_id(`${IDTestBunch}_1`);
      const bunchToAdd2 = new DTBunchStub();
      bunchToAdd2.th_set_id(`${IDTestBunch}_2`);
      const bunchToAdd3 = new DTBunchStub();
      bunchToAdd3.th_set_id(`${IDTestBunch}_3`);
      bunchesToAdd = [bunchToAdd1, bunchToAdd2, bunchToAdd3];

      // Add tests scopes and options
      managerTest.th_set_scopes([...managerTest.th_get_scopes(), ...ScopesTest]);
      managerTest.th_set_options({ errors: false });
    });

    test('add many items - use add method - default case', () => {
      managerTest.addMany(bunchesToAdd);

      expect(mockedAdd.mock.calls.length).toBe(3);
      let itemCount = 0;
      for (const addCalls of mockedAdd.mock.calls) {
        expect(addCalls[0].th_get_id()).toBe(bunchesToAdd[itemCount].th_get_id());
        expect(addCalls[1]).toBeUndefined();
        itemCount += 1;
      }
    });

    test('add many items - use add method - with scope case', () => {
      managerTest.addMany(bunchesToAdd, ScopesTest[0]);

      expect(mockedAdd.mock.calls.length).toBe(3);
      let itemCount = 0;
      for (const addCalls of mockedAdd.mock.calls) {
        expect(addCalls[0].th_get_id()).toBe(bunchesToAdd[itemCount].th_get_id());
        expect(addCalls[1]).toBe(ScopesTest[0]);
        itemCount += 1;
      }
    });

    test('errors when adding many items at index - default case - add no items and throw error', () => {
      jest.spyOn(managerTest, 'add')
        .mockImplementationOnce(function (item) {
          this._items[`${IDTestBunch}_1`] = {
            scope: 'default',
            item,
          };
        })
        .mockImplementationOnce(() => {
          throw new DTErrorStub();
        })
        .mockImplementationOnce(function (item) {
          this._items[`${IDTestBunch}_3`] = {
            scope: 'default',
            item,
          };
        });

      expect(() => { managerTest.addMany(bunchesToAdd); }).toThrow();
      expect(mockedAdd.mock.calls.length).toBe(2);
      expect(Object.keys(managerTest.th_get_items()).length).toBe(0);
    });

    test('errors when adding many items at index - errors case - add success items and stack errors for others', () => {
      managerTest.th_set_options({ errors: true });
      jest.spyOn(managerTest, 'add')
        .mockImplementationOnce(function (item) {
          this._items[`${IDTestBunch}_1`] = {
            scope: 'default',
            item,
          };
        })
        .mockImplementationOnce(function () {
          this._errors = [new DTErrorStub()];
        })
        .mockImplementationOnce(function (item) {
          this._items[`${IDTestBunch}_3`] = {
            scope: 'default',
            item,
          };
        });

      managerTest.addMany(bunchesToAdd);

      expect(mockedAdd.mock.calls.length).toBe(3);
      expect(Object.keys(managerTest.th_get_items()).length).toBe(2);
    });
  });

  describe('moveToScope()', () => {
    beforeEach(() => {
      populateManager(managerTest);

      jest.spyOn(managerTest, 'getId').mockReturnValue(IDTest);
      jest.spyOn(managerTest, 'isValidScope').mockReturnValue(true);
    });

    test('move to default scope', () => {
      managerTest.moveToScope(`${IDTestBunch}_2`, 'default');

      expect(Object.keys(managerTest.th_get_items()).length).toBe(3);
      checkManagerItem(managerTest, `${IDTestBunch}_2`, 'default');
    });

    test('move to existing scope', () => {
      managerTest.moveToScope(`${IDTestBunch}_2`, ScopesTest[1]);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(3);
      checkManagerItem(managerTest, `${IDTestBunch}_2`, ScopesTest[1]);
    });

    test('move to non-existing scope - trigger invalid_scope error', () => {
      const mockedTriggerError = DTManager.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;
      jest.spyOn(managerTest, 'isValidScope').mockReturnValue(false);

      managerTest.moveToScope(`${IDTestBunch}_2`, 'invalid_scope');

      expect(Object.keys(managerTest.th_get_items()).length).toBe(3);
      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'invalid_scope',
        "Scope provided doesn't exist in the manager",
        IDTest,
        `${IDTestBunch}_2`,
      );
    });

    test('move non-virtual bunch to virtual scope - trigger forbidden_virtual_scope error', () => {
      const mockedTriggerError = DTManager.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;

      managerTest.moveToScope(`${IDTestBunch}_2`, 'virtual');

      expect(Object.keys(managerTest.th_get_items()).length).toBe(3);
      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'forbidden_virtual_scope',
        'Virtual Scope provided cannot be associated to a physical bunch',
        IDTest,
        `${IDTestBunch}_2`,
      );
    });

    test('move virtual bunch to non-virtual scope - trigger forbidden_scope error', () => {
      const mockedTriggerError = DTManager.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;

      managerTest.moveToScope(`${IDTestBunch}_3`, ScopesTest[0]);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(3);
      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'forbidden_scope',
        'Scope provided cannot be associated to a virtual bunch',
        IDTest,
        `${IDTestBunch}_3`,
      );
    });

    test('move to same scope - nothing append', () => {
      managerTest.moveToScope(`${IDTestBunch}_1`, 'default');

      expect(Object.keys(managerTest.th_get_items()).length).toBe(3);
      checkManagerItem(managerTest, `${IDTestBunch}_1`, 'default');
    });

    test('move an non-existing bunch id - trigger invalid_id error', () => {
      const mockedTriggerError = DTManager.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;

      managerTest.moveToScope(`${IDTestBunch}_5`, ScopesTest[0]);

      expect(Object.keys(managerTest.th_get_items()).length).toBe(3);
      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'invalid_id',
        'Bunch id provided doesn\'t exist in the manager',
        IDTest,
      );
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      populateManager(managerTest);
    });

    test('return a bunch by its id', () => {
      const bunch = managerTest.get(`${IDTestBunch}_1`);

      expect(bunch).toBeDefined();
      expect(bunch.th_get_id()).toBe(`${IDTestBunch}_1`);
    });

    test('return undefined if bunch is not found', () => {
      const bunch = managerTest.get(`${IDTestBunch}_5`);

      expect(bunch).toBeUndefined();
    });
  });

  describe('getAll()', () => {
    beforeEach(() => {
      populateManager(managerTest);
    });

    test('return all bunch items', () => {
      const bunches = managerTest.getAll();

      const bunchesIds = bunches.map((bunch) => bunch.th_get_id());
      expect(bunchesIds.length).toBe(3);
      expect(bunchesIds.includes(`${IDTestBunch}_1`)).toBeTruthy();
      expect(bunchesIds.includes(`${IDTestBunch}_2`)).toBeTruthy();
      expect(bunchesIds.includes(`${IDTestBunch}_3`)).toBeTruthy();
    });

    test('return empty array if no bunch', () => {
      managerTest.th_set_items({});

      const bunches = managerTest.getAll();

      expect(bunches.length).toBe(0);
    });

    test('scope argument : return only bunches into the scope', () => {
      const bunches = managerTest.getAll(ScopesTest[0]);

      const bunchesIds = bunches.map((bunch) => bunch.th_get_id());
      expect(bunchesIds.length).toBe(1);
      expect(bunchesIds.includes(`${IDTestBunch}_2`)).toBeTruthy();
    });

    test('scope argument : return empty array if no bunch into the scope', () => {
      const bunches = managerTest.getAll(ScopesTest[1]);

      expect(bunches.length).toBe(0);
    });

    test('scope argument : return empty array if invalid scope is passed', () => {
      const bunches = managerTest.getAll('invalid_scope');

      expect(bunches.length).toBe(0);
    });
  });

  describe('getScope()', () => {
    beforeEach(() => {
      populateManager(managerTest);
    });

    test('get scope for an existing bunch id', () => {
      const scope1 = managerTest.getScope(`${IDTestBunch}_1`);
      const scope2 = managerTest.getScope(`${IDTestBunch}_2`);
      const scope3 = managerTest.getScope(`${IDTestBunch}_3`);

      expect(scope1).toBe('default');
      expect(scope2).toBe(ScopesTest[0]);
      expect(scope3).toBe('virtual');
    });

    test('get undefined scope for an non-existing bunch id', () => {
      const scope = managerTest.getScope(`${IDTestBunch}_5`);

      expect(scope).toBeUndefined();
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      populateManager(managerTest);

      jest.spyOn(managerTest, 'removeMany');
    });

    test('remove one item using removeMany', () => {
      managerTest.remove(`${IDTestBunch}_2`);

      expect((managerTest.removeMany as any).mock.calls.length).toBe(1);
      expect((managerTest.removeMany as any).mock.calls[0][0]).toStrictEqual([`${IDTestBunch}_2`]);
    });
  });

  describe('removeMany()', () => {
    beforeEach(() => {
      populateManager(managerTest);
    });

    test('remove multiple bunches from manager', () => {
      managerTest.removeMany([`${IDTestBunch}_1`, `${IDTestBunch}_2`]);

      const newItems = managerTest.th_get_items();
      expect(Object.keys(newItems).length).toBe(1);
      expect(Object.keys(newItems)).toStrictEqual([`${IDTestBunch}_3`]);
    });

    test('remove non-existing bunches - nothing happen', () => {
      managerTest.removeMany([`${IDTestBunch}_5`, `${IDTestBunch}_7`]);

      const newItems = managerTest.th_get_items();
      expect(Object.keys(newItems).length).toBe(3);
      expect(Object.keys(newItems)).toStrictEqual([`${IDTestBunch}_1`, `${IDTestBunch}_2`, `${IDTestBunch}_3`]);
    });

    test('remove multiple bunches from manager - no removal from library by default', () => {
      managerTest.removeMany([`${IDTestBunch}_1`, `${IDTestBunch}_2`]);

      expect(managerTest.th_get_library().remove.mock.calls.length).toBe(0);
    });

    test('remove multiple bunches from manager - libraryDeletion option', () => {
      const libraryElementsIdToRemove = managerTest.th_get_library().th_get_items().map((item: any) => item.getId());
      managerTest.removeMany([`${IDTestBunch}_1`, `${IDTestBunch}_2`], { libraryDeletion: true });

      expect(managerTest.th_get_library().remove.mock.calls.length).toBe(5);
      expect(managerTest.th_get_library().remove.mock.calls.map((call: any) => call[0])).toEqual(libraryElementsIdToRemove);
    });
  });

  describe('removeAll()', () => {
    beforeEach(() => {
      populateManager(managerTest);

      jest.spyOn(managerTest, 'removeMany');
    });

    test('remove all items using removeMany', () => {
      const bunchesIdToRemove = Object.keys(managerTest.th_get_items());
      managerTest.removeAll();

      expect((managerTest.removeMany as any).mock.calls.length).toBe(1);
      expect((managerTest.removeMany as any).mock.calls[0][0]).toStrictEqual(bunchesIdToRemove);
    });
  });

  describe('find()', () => {
    test('find items using DYOFinder - empty case', () => {
      managerTest.find({});

      expect((managerTest.th_get_finder() as any).execute.mock.calls.length).toBe(1);
      expect((managerTest.th_get_finder() as any).execute.mock.calls[0][0]).toStrictEqual({});
    });

    test('find items using DYOFinder', () => {
      const testFilters = { id: { $eq: 'id_bunch' }, key: { $ne: 'key_test' } };
      managerTest.find(testFilters);

      expect((managerTest.th_get_finder() as any).execute.mock.calls.length).toBe(1);
      expect((managerTest.th_get_finder() as any).execute.mock.calls[0][0]).toStrictEqual(testFilters);
    });
  });

  // TODO : Useless ?
  describe('reloadLibrary()', () => {});

  // TODO
  describe('transfer()', () => {});

  describe('toObject()', () => {
    beforeEach(() => {
      managerTest.th_set_id(IDTest);
      managerTest.th_set_key(KeyTest);
    });

    test('toObject output standard', () => {
      const toObjectManager = managerTest.toObject();

      expect(Object.keys(toObjectManager)).toStrictEqual(['id', 'key', 'type', 'items']);
      expect(toObjectManager.id).toBe(IDTest);
      expect(toObjectManager.key).toBe(KeyTest);
      expect(toObjectManager.type).toBe('manager');
      expect(toObjectManager.items.length).toBe(0);
    });

    test('toObject output with items', () => {
      populateManager(managerTest);

      const toObjectManager = managerTest.toObject();

      expect(Object.keys(toObjectManager)).toStrictEqual(['id', 'key', 'type', 'items']);
      expect(toObjectManager.items.length).toBe(3);
      expect(toObjectManager.items).toStrictEqual([
        { scope: 'default', ...bunch1toObjectTest },
        { scope: ScopesTest[0], ...bunch2toObjectTest },
        { scope: 'virtual', ...bunch3toObjectTest },
      ]);
    });
  });

  describe('toString()', () => {
    beforeEach(() => {
      managerTest.th_set_key(KeyTest);
    });

    test('string output standard', () => {
      managerTest.th_set_library(new DTBunchStubLibrary());

      const toStringManager = managerTest.toString();

      expect(toStringManager).toBe(`Component ${KeyTest} - Type: Manager - Library: 0 - Items: 0`);
    });

    test('string output with library', () => {
      populateManager(managerTest);
      managerTest.th_set_items({});

      const toStringManager = managerTest.toString();

      expect(toStringManager).toBe(`Component ${KeyTest} - Type: Manager - Library: 5 - Items: 0`);
    });

    test('string output with library and items', () => {
      populateManager(managerTest);

      const toStringManager = managerTest.toString();

      expect(toStringManager).toBe(`Component ${KeyTest} - Type: Manager - Library: 5 - Items: 3`);
    });
  });
});
