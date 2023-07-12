import { afterEach, beforeEach, describe, expect, jest, test, } from '@jest/globals';
import { defaultOptions, DTBunchStub, DTBunchTest, generateMockedElements, IDTest, KeyTest, } from './DTBunch.double';
import {
  DTElementStub,
  HaileiIdTest,
  HaileiKeyTest,
  HaileiToObjectTest,
  IDTest as IDElementTest,
  IldressIdTest,
  IldressKeyTest,
  IldressToObjectTest,
  KeyTest as KeyElementTest,
  MaydenaIdTest,
  MaydenaKeyTest,
  MaydenaToObjectTest,
  MeldrineIdTest,
  MeldrineKeyTest,
  MeldrineToObjectTest,
  YssaliaIdTest,
  YssaliaKeyTest,
  YssaliaToObjectTest,
} from './DTElement.double';
import { DTBunch, DTComponentPhysical } from '../../src';
import DYOToolsElement from '../../src/core/DTElement';
import { BunchMetaData, HaileiMetaData, IMetaDataTest } from './DTComponentWithMeta.double';
import { DTBunchOptions, FilterOperatorType } from '../../src/types';
import {
  DTPlayerStub,
  IDTest as IDTestPlayer,
  IDTest as IDPlayerTest,
  KeyTest as KeyPlayerTest,
  toStringTest as toStringPlayerTest,
} from './DTPlayer.double';
import { checkCallForMockedDTError, CodeTest as DTErrorCodeTest, DTErrorStub } from './DTError.double';
import DYOToolsError from '../../src/core/DTError';
import { mockOverriddenMethods } from './DTComponentPhysical.double';
import { DTManagerStub } from './DTManager.double';
import { componentBunchDefaultFinderConfiguration } from '../../src/constants';
import Mocked = jest.Mocked;
import MockedFunction = jest.MockedFunction;

/** ****************** MOCK DEPENDENCIES
 * All Dependencies used by the component are mocked with Jest
 * **** */
jest.mock('../../src/core/DTElement');
jest.mock('../../src/core/DTManager');
jest.mock('../../src/core/DTError');
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTComponentWithMeta');
jest.mock('../../src/core/DTComponentPhysical');
jest.mock('../../src/libs/DYOFinder');
// Add specific mock for inherited methods to have a basic implementation
mockOverriddenMethods(DTComponentPhysical);

/** *********************** TESTS SUITES ****************************** */
describe('class DYOToolsBunch', () => {
  let bunchTest: DTBunchTest;

  beforeEach(() => {
    bunchTest = new DTBunchTest();
    bunchTest.th_set_options(defaultOptions);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(DTBunch.prototype instanceof DTComponentPhysical).toBeTruthy();
    });
  });

  describe('constructor()', () => {
    let addManyImpl;

    beforeEach(() => {
      jest.resetAllMocks();
      addManyImpl = DTBunch.prototype.addMany;
      DTBunch.prototype.addMany = jest.fn();
    });

    afterEach(() => {
      DTBunch.prototype.addMany = addManyImpl;
    });

    test('creation simple with key', () => {
      const newBunch = new DTBunchTest(KeyTest);
      const parentConstructorMock = (DTComponentPhysical.prototype.constructor as MockedFunction<(key: string, options: any) => void>).mock;

      expect(parentConstructorMock.calls[0][0]).toBe(KeyTest);
      expect(parentConstructorMock.calls[0][1]).toStrictEqual(defaultOptions);
      expect(newBunch.th_get_items()).toStrictEqual([]);

      // Finder initialization
      expect((newBunch.th_get_finder() as any).constructor.mock.calls.length).toBe(1);
      expect((newBunch.th_get_finder() as any).constructor.mock.calls[0][0]).toStrictEqual(newBunch);
      expect((newBunch.th_get_finder() as any).constructor.mock.calls[0][1]).toStrictEqual(componentBunchDefaultFinderConfiguration);
    });

    test('creation with items', () => {
      new DTBunchTest(KeyTest, generateMockedElements(3));
      const mockedAddMany = DTBunch.prototype.addMany as MockedFunction<(items: Array<Mocked<DYOToolsElement<IMetaDataTest>>>) => void>;

      expect(mockedAddMany.mock.calls.length).toBe(1);
      expect(mockedAddMany.mock.calls[0][0].length).toBe(3);
      expect(mockedAddMany.mock.calls[0][0][0].getKey()).toBe(HaileiKeyTest);
      expect(mockedAddMany.mock.calls[0][0][1].getKey()).toBe(MeldrineKeyTest);
      expect(mockedAddMany.mock.calls[0][0][2].getKey()).toBe(MaydenaKeyTest);
    });

    test('creations with options', () => {
      const testOptions: Partial<DTBunchOptions> = {
        errors: true,
        uniqueKey: true,
        inheritOwner: true,
      };
      const newBunch = new DTBunchTest(KeyTest, [], testOptions);
      const parentConstructorMock = (DTComponentPhysical.prototype.constructor as MockedFunction<(key: string, options: any) => void>).mock;

      expect(parentConstructorMock.calls[0][0]).toBe(KeyTest);
      expect(parentConstructorMock.calls[0][1]).toStrictEqual({
        errors: true,
        uniqueKey: true,
        inheritOwner: true,
        replaceIndex: false,
        virtualContext: false,
      });
      expect(newBunch.th_get_items()).toStrictEqual([]);
    });
  });

  describe('_componentType', () => {
    test('componentType must be "bunch"', () => {
      expect(bunchTest.th_get_componentType()).toBe('bunch');
    });
  });

  describe('getFinderConfiguration()', () => {
    const baseOperators = [
      FilterOperatorType.EQ,
      FilterOperatorType.IN,
      FilterOperatorType.NIN,
      FilterOperatorType.NE,
    ];
    const advancedOperators = [
      ...baseOperators,
      FilterOperatorType.GTE,
      FilterOperatorType.LTE,
      FilterOperatorType.CONTAINS,
      FilterOperatorType.NCONTAINS,
    ];

    test('check finder configuration for id attribute', () => {
      const finderConfigurationToCheck = bunchTest.getFinderConfiguration().id;

      expect(finderConfigurationToCheck.operators).toStrictEqual(baseOperators);
      expect(finderConfigurationToCheck.getValue(new DTElementStub())).toBe(IDElementTest);
      expect(finderConfigurationToCheck.objectSearch).toBe(false);
    });

    test('check finder configuration for key attribute', () => {
      const finderConfigurationToCheck = bunchTest.getFinderConfiguration().key;

      expect(finderConfigurationToCheck.operators).toStrictEqual(baseOperators);
      expect(finderConfigurationToCheck.getValue(new DTElementStub())).toBe(KeyElementTest);
      expect(finderConfigurationToCheck.objectSearch).toBe(false);
    });

    test('check finder configuration for owner attribute - empty owner', () => {
      const element = new DTElementStub();
      jest.spyOn(element, 'getOwner').mockImplementation(() => undefined);

      const finderConfigurationToCheck = bunchTest.getFinderConfiguration().owner;

      expect(finderConfigurationToCheck.operators).toStrictEqual(baseOperators);
      expect(finderConfigurationToCheck.getValue(element)).toBeNull();
      expect(finderConfigurationToCheck.objectSearch).toBe(false);
    });

    test('check finder configuration for owner attribute - with owner', () => {
      const element = new DTElementStub();
      jest.spyOn(element, 'getOwner').mockImplementation(() => new DTPlayerStub());

      const finderConfigurationToCheck = bunchTest.getFinderConfiguration().owner;

      expect(finderConfigurationToCheck.operators).toStrictEqual(baseOperators);
      expect(finderConfigurationToCheck.getValue(element)).toBe(IDTestPlayer);
      expect(finderConfigurationToCheck.objectSearch).toBe(false);
    });

    test('check finder configuration for context attribute - empty context', () => {
      const element = new DTElementStub();
      jest.spyOn(element, 'getContext').mockImplementation(() => undefined);

      const finderConfigurationToCheck = bunchTest.getFinderConfiguration().context;

      expect(finderConfigurationToCheck.operators).toStrictEqual(baseOperators);
      expect(finderConfigurationToCheck.getValue(element)).toBeNull();
      expect(finderConfigurationToCheck.objectSearch).toBe(false);
    });

    test('check finder configuration for context attribute - with context', () => {
      const element = new DTElementStub();
      const bunch = new DTBunchStub();
      jest.spyOn(bunch, 'getId').mockImplementation(() => `${IDTest}_other_context`);
      jest.spyOn(element, 'getContext').mockImplementation(() => bunch);

      const finderConfigurationToCheck = bunchTest.getFinderConfiguration().context;

      expect(finderConfigurationToCheck.operators).toStrictEqual(baseOperators);
      expect(finderConfigurationToCheck.getValue(element)).toBe(`${IDTest}_other_context`);
      expect(finderConfigurationToCheck.objectSearch).toBe(false);
    });

    test('check finder configuration for meta attribute', () => {
      const element = new DTElementStub();
      jest.spyOn(element, 'getManyMeta').mockImplementation(() => HaileiMetaData);

      const finderConfigurationToCheck = bunchTest.getFinderConfiguration().meta;

      expect(finderConfigurationToCheck.operators).toStrictEqual(advancedOperators);
      expect(finderConfigurationToCheck.getValue(element)).toStrictEqual(HaileiMetaData);
      expect(finderConfigurationToCheck.objectSearch).toBe(true);
    });
  });

  describe('setOwner()', () => {
    beforeEach(() => {
      jest.spyOn(bunchTest, 'getOwner').mockImplementation(() => new DTPlayerStub());
    });

    test('add a new owner - not updating elements owner when inheritOwner = false', () => {
      bunchTest.th_set_options({ inheritOwner: false });
      bunchTest.th_set_items(generateMockedElements(3));

      const owner = new DTPlayerStub();
      bunchTest.setOwner(owner);

      expect(bunchTest.th_get_items()[0].setOwner.mock.calls.length).toBe(0);
      expect(bunchTest.th_get_items()[1].setOwner.mock.calls.length).toBe(0);
      expect(bunchTest.th_get_items()[2].setOwner.mock.calls.length).toBe(0);
    });

    test('add a new owner - updating elements owner when inheritOwner = true', () => {
      bunchTest.th_set_options({ inheritOwner: true });
      bunchTest.th_set_items(generateMockedElements(3));

      const owner = new DTPlayerStub();
      bunchTest.setOwner(owner);

      expect(bunchTest.th_get_items()[0].setOwner.mock.calls.length).toBe(1);
      expect(bunchTest.th_get_items()[0].setOwner.mock.calls[0][0].getId()).toBe(IDPlayerTest);
      expect(bunchTest.th_get_items()[1].setOwner.mock.calls.length).toBe(1);
      expect(bunchTest.th_get_items()[1].setOwner.mock.calls[0][0].getId()).toBe(IDPlayerTest);
      expect(bunchTest.th_get_items()[2].setOwner.mock.calls.length).toBe(1);
      expect(bunchTest.th_get_items()[2].setOwner.mock.calls[0][0].getId()).toBe(IDPlayerTest);
    });
  });

  describe('removeOwner()', () => {
    test('remove current Owner - not updating elements owner when inheritOwner = false', () => {
      bunchTest.th_set_options({ inheritOwner: true });
      bunchTest.th_set_items(generateMockedElements(2));

      bunchTest.th_set_options({ inheritOwner: false });
      bunchTest.removeOwner();

      expect(bunchTest.th_get_items()[0].removeOwner.mock.calls.length).toBe(0);
      expect(bunchTest.th_get_items()[1].removeOwner.mock.calls.length).toBe(0);
    });

    test('remove current Owner - updating elements owner when inheritOwner = true', () => {
      bunchTest.th_set_options({ inheritOwner: true });
      bunchTest.th_set_items(generateMockedElements(2));

      bunchTest.removeOwner();

      expect(bunchTest.th_get_items()[0].removeOwner.mock.calls.length).toBe(1);
      expect(bunchTest.th_get_items()[1].removeOwner.mock.calls.length).toBe(1);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      bunchTest.th_set_items(generateMockedElements(5));
    });

    test('return an item by its id', () => {
      expect(bunchTest.get(`${MaydenaIdTest}-2`).getKey()).toBe(MaydenaKeyTest);
      expect(bunchTest.get(`${YssaliaIdTest}-4`).getKey()).toBe(YssaliaKeyTest);
    });

    test('return an item by its index', () => {
      expect(bunchTest.get(2).getKey()).toBe(MaydenaKeyTest);
      expect(bunchTest.get(4).getKey()).toBe(YssaliaKeyTest);
    });

    test('return undefined if item not found by id', () => {
      expect(bunchTest.get('id-123456')).toBeUndefined();
    });

    test('return undefined if item not found by index', () => {
      expect(bunchTest.get(11)).toBeUndefined();
    });

    test('return undefined if item not found by index - incoherent index', () => {
      expect(bunchTest.get(-11)).toBeUndefined();
    });
  });

  describe('getAll()', () => {
    test('return empty array if no items', () => {
      expect(bunchTest.getAll()).toStrictEqual([]);
    });

    test('return all items array', () => {
      bunchTest.th_set_items(generateMockedElements(5));

      expect(bunchTest.getAll()[0].getKey()).toBe(HaileiKeyTest);
      expect(bunchTest.getAll()[1].getKey()).toBe(MeldrineKeyTest);
      expect(bunchTest.getAll()[2].getKey()).toBe(MaydenaKeyTest);
      expect(bunchTest.getAll()[3].getKey()).toBe(IldressKeyTest);
      expect(bunchTest.getAll()[4].getKey()).toBe(YssaliaKeyTest);
    });
  });

  describe('indexOf()', () => {
    beforeEach(() => {
      bunchTest.th_set_items(generateMockedElements(5));
    });

    test('return index of an item by id', () => {
      expect(bunchTest.indexOf(`${MaydenaIdTest}-2`)).toBe(2);
      expect(bunchTest.indexOf(`${YssaliaIdTest}-4`)).toBe(4);
    });

    test('return -1 if id is not found', () => {
      expect(bunchTest.indexOf('id-123456')).toBe(-1);
    });
  });

  // TODO : Add test cases for updating Library from manager
  describe('addAtIndex()', () => {
    let objectToAdd;
    let objectsToAdd;

    beforeEach(() => {
      jest.spyOn(bunchTest, 'getId').mockReturnValue(IDTest);

      bunchTest.th_set_items(generateMockedElements(5));

      objectsToAdd = generateMockedElements(6);
      objectToAdd = objectsToAdd[5];
      jest.spyOn(bunchTest, 'find').mockReturnValue([objectToAdd]);
    });

    test('add a new item at last index - simple case', () => {
      bunchTest.addAtIndex(objectToAdd, 5);

      expect(bunchTest.th_get_items()[5].getId()).toBe(objectToAdd.getId());
    });

    test('add a new item at specified index and reindex - default case', () => {
      bunchTest.addAtIndex(objectToAdd, 2);

      expect(bunchTest.th_get_items()[2].getId()).toBe(objectToAdd.getId());
      expect(bunchTest.th_get_items()[3].getId()).toBe(`${MaydenaIdTest}-2`);
      expect(bunchTest.th_get_items()[4].getId()).toBe(`${IldressIdTest}-3`);
      expect(bunchTest.th_get_items()[5].getId()).toBe(`${YssaliaIdTest}-4`);
    });

    test('add a new item at specified index and replace - replace option', () => {
      bunchTest.addAtIndex(objectToAdd, 2, { replaceIndex: true });

      expect(bunchTest.th_get_items()[2].getId()).toBe(objectToAdd.getId());
      expect(bunchTest.th_get_items()[3].getId()).toBe(`${IldressIdTest}-3`);
      expect(bunchTest.th_get_items()[4].getId()).toBe(`${YssaliaIdTest}-4`);
      expect(bunchTest.th_get_items()[5]).toBeUndefined();
    });

    test('add a new item at lower index', () => {
      bunchTest.addAtIndex(objectToAdd, -11);

      expect(bunchTest.th_get_items()[0].getId()).toBe(objectToAdd.getId());
      expect(bunchTest.th_get_items()[1].getId()).toBe(`${HaileiIdTest}-0`);
    });

    test('add a new item at greater index', () => {
      bunchTest.addAtIndex(objectToAdd, 11);

      expect(bunchTest.th_get_items()[5].getId()).toBe(objectToAdd.getId());
      expect(bunchTest.th_get_items()[6]).toBeUndefined();
    });

    test('trigger conflict when adding two same ids - parent triggerError', () => {
      const mockedTriggerError = DTBunch.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;

      bunchTest.addAtIndex(objectsToAdd[0], 2);

      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'id_conflict',
        'Element with same id already exists in the bunch',
        IDTest,
        objectsToAdd[0].getId(),
      );
    });

    test('no conflict when adding two same keys - default case', () => {
      const mockedTriggerError = DTBunch.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;

      bunchTest.addAtIndex(objectToAdd, 2);

      expect(mockedTriggerError.mock.calls.length).toBe(0);
      expect((bunchTest.find as any).mock.calls.length).toBe(0);
      expect(bunchTest.th_get_items()[0].getKey()).toBe(HaileiKeyTest);
      expect(bunchTest.th_get_items()[2].getKey()).toBe(HaileiKeyTest);
    });

    test('trigger conflict when adding two same keys - uniqueKey option and parent triggerError', () => {
      const mockedTriggerError = DTBunch.prototype.triggerError as MockedFunction<(error: DYOToolsError) => void>;

      bunchTest.addAtIndex(objectToAdd, 2, { uniqueKey: true });

      expect(mockedTriggerError.mock.calls.length).toBe(1);
      checkCallForMockedDTError(
        'key_conflict',
        'Element with same key already exists in the bunch',
        IDTest,
        objectToAdd.getId(),
      );
      expect((bunchTest.find as any).mock.calls.length).toBe(1);
      expect((bunchTest.find as any).mock.calls[0][0]).toStrictEqual({ key: { $eq: objectToAdd.getKey() } });
      expect(bunchTest.th_get_items()[2].getId()).toBe(`${MaydenaIdTest}-2`);
    });

    test('not inherit owner when adding an item - default case', () => {
      const owner = new DTPlayerStub();
      bunchTest.th_set_owner(owner);

      bunchTest.addAtIndex(objectToAdd, 2);

      expect(bunchTest.th_get_owner().getId()).toBe(IDPlayerTest);
      expect(objectToAdd.setOwner.mock.calls.length).toBe(0);
    });

    test('inherit owner when adding an item - inheritOwner option', () => {
      const owner = new DTPlayerStub();
      bunchTest.th_set_owner(owner);

      bunchTest.addAtIndex(objectToAdd, 2, { inheritOwner: true });

      expect(bunchTest.th_get_owner().getId()).toBe(IDPlayerTest);
      expect(objectToAdd.setOwner.mock.calls.length).toBe(1);
      expect(objectToAdd.setOwner.mock.calls[0][0].getId()).toBe(IDPlayerTest);
    });

    test('set context when adding an item - default case', () => {
      bunchTest.addAtIndex(objectToAdd, 2);

      expect(bunchTest.th_get_items()[2].setContext.mock.calls.length).toBe(1);
      expect(bunchTest.th_get_items()[2].setContext.mock.calls[0][0].getId()).toBe(IDTest);
    });

    test('not set context when adding an item - virtualContext option', () => {
      bunchTest.th_set_options({ virtualContext: true });

      bunchTest.addAtIndex(objectToAdd, 2);

      expect(bunchTest.th_get_items()[2].setContext.mock.calls.length).toBe(0);
    });

    test('set context when adding an item - remove from old bunch', () => {
      const bunchTestOld = new DTBunchTest();
      bunchTestOld.th_set_items(generateMockedElements(6));
      objectToAdd = bunchTestOld.th_get_items()[5];
      objectToAdd.setContext(bunchTestOld);
      objectToAdd.setContext.mockClear();
      jest.spyOn(bunchTestOld, 'remove').mockImplementation(() => {});
      jest.spyOn(bunchTestOld, 'getComponentType').mockImplementation(() => 'bunch');

      bunchTest.addAtIndex(objectToAdd, 2);

      expect(bunchTest.th_get_items()[2].setContext.mock.calls.length).toBe(1);
      expect(bunchTest.th_get_items()[2].setContext.mock.calls[0][0].getId()).toBe(IDTest);
      expect((bunchTestOld.remove as any).mock.calls.length).toBe(1);
      expect((bunchTestOld.remove as any).mock.calls[0][0]).toBe(objectToAdd.getId());
    });

    test('set context when adding an item - dont remove if virtualContext option', () => {
      const bunchTestOld = new DTBunchTest();
      bunchTestOld.th_set_items(generateMockedElements(6));
      objectToAdd = bunchTestOld.th_get_items()[5];
      jest.spyOn(bunchTestOld, 'remove').mockImplementation(() => {});

      bunchTest.th_set_options({ virtualContext: true });
      bunchTest.addAtIndex(objectToAdd, 2);

      expect(bunchTest.th_get_items()[2].setContext.mock.calls.length).toBe(0);
      expect((bunchTestOld.remove as any).mock.calls.length).toBe(0);
    });

    test('manager context - add item into the manager library', () => {
      const managerTest = new DTManagerStub();
      jest.spyOn(bunchTest, 'getContext').mockImplementation(
        (contextType) => contextType === 'manager' && managerTest,
      );
      jest.spyOn(managerTest, 'getLibrary').mockImplementation(() => managerTest.th_get_library());
      jest.spyOn(managerTest.th_get_library(), 'add');

      bunchTest.addAtIndex(objectToAdd, 5);

      expect((managerTest.th_get_library().add as any).mock.calls.length).toBe(1);
      expect((managerTest.th_get_library().add as any).mock.calls[0][0]).toStrictEqual(objectToAdd);
    });

    test('manager context - not add existing item into the manager library', () => {
      const managerTest = new DTManagerStub();
      jest.spyOn(bunchTest, 'getContext').mockImplementation(
        (contextType) => contextType === 'manager' && managerTest,
      );
      jest.spyOn(managerTest, 'getLibrary').mockImplementation(() => managerTest.th_get_library());
      jest.spyOn(managerTest.th_get_library(), 'add');
      managerTest.th_get_library().th_set_items([objectToAdd]);

      bunchTest.addAtIndex(objectToAdd, 5);

      expect((managerTest.th_get_library().add as any).mock.calls.length).toBe(0);
    });
  });

  describe('add()', () => {
    let objectsToAdd;
    let objectToAdd;

    beforeEach(() => {
      jest.spyOn(bunchTest, 'addAtIndex').mockImplementation(() => {});

      bunchTest.th_set_items(generateMockedElements(5));

      objectsToAdd = generateMockedElements(6);
      objectToAdd = objectsToAdd[5];
    });

    test('add as last item using addAtIndex', () => {
      const testBunchOptions = {
        replaceIndex: true,
        inheritOwner: true,
      };
      bunchTest.add(objectToAdd, testBunchOptions);

      expect((bunchTest.addAtIndex as any).mock.calls.length).toBe(1);
      expect((bunchTest.addAtIndex as any).mock.calls[0][0].getId()).toBe(objectToAdd.getId());
      expect((bunchTest.addAtIndex as any).mock.calls[0][1]).toBe(5);
      expect((bunchTest.addAtIndex as any).mock.calls[0][2]).toStrictEqual(testBunchOptions);
    });
  });

  describe('addManyAtIndex()', () => {
    let itemsToAdd;
    let itemLibrary;

    beforeEach(() => {
      jest.spyOn(bunchTest, 'addAtIndex').mockImplementation(() => {});

      bunchTest.th_set_items(generateMockedElements(5));

      itemLibrary = generateMockedElements(8);
      itemsToAdd = [itemLibrary[5], itemLibrary[6], itemLibrary[7]];
    });

    test('add many items at index using addAtIndex - simple case', () => {
      const testBunchOptions = {
        replaceIndex: true,
        inheritOwner: true,
      };
      const indexToAdd = 2;
      bunchTest.addManyAtIndex(itemsToAdd, indexToAdd, testBunchOptions);

      expect((bunchTest.addAtIndex as any).mock.calls.length).toBe(3);
      for (let i = 0; i < 3; i++) {
        expect((bunchTest.addAtIndex as any).mock.calls[i][0].getId()).toBe(itemsToAdd[i].getId());
        expect((bunchTest.addAtIndex as any).mock.calls[i][1]).toBe(i + indexToAdd);
        expect((bunchTest.addAtIndex as any).mock.calls[i][2]).toStrictEqual(testBunchOptions);
      }
    });

    test('add many items at index using addAtIndex - index lower than 0', () => {
      const indexToAdd = -11;
      bunchTest.addManyAtIndex(itemsToAdd, indexToAdd);

      expect((bunchTest.addAtIndex as any).mock.calls.length).toBe(3);
      for (let i = 0; i < 3; i++) {
        expect((bunchTest.addAtIndex as any).mock.calls[i][0].getId()).toBe(itemsToAdd[i].getId());
        expect((bunchTest.addAtIndex as any).mock.calls[i][1]).toBe(i);
      }
    });

    test('errors when adding many items at index - default case - add no items and throw error', () => {
      const indexToAdd = 2;
      let errorThrown: DTErrorStub;
      jest.spyOn(bunchTest, 'addAtIndex').mockImplementationOnce((item, index, options) => {
        throw new DTErrorStub();
      });

      try {
        bunchTest.addManyAtIndex(itemsToAdd, indexToAdd);
      } catch (error: unknown) {
        errorThrown = error as DTErrorStub;
      }

      expect(errorThrown).toBeDefined();
      expect(DTErrorStub).toHaveBeenCalled();
      expect(errorThrown.getCode()).toBe(DTErrorCodeTest);
      expect((bunchTest.addAtIndex as any).mock.calls.length).toBe(1);
      expect((bunchTest.addAtIndex as any).mock.calls[0][0].getId()).toBe(itemsToAdd[0].getId());
      expect((bunchTest.addAtIndex as any).mock.calls[0][1]).toBe(indexToAdd);
    });

    test('errors when adding many items at index - errors case - add success items and stack errors for others', () => {
      const indexToAdd = 2;
      const errors = [];
      jest.spyOn(bunchTest, 'addAtIndex')
        .mockImplementationOnce((item, index, options) => {
          errors.push(new DTErrorStub());
        })
        .mockImplementationOnce((item, index, options) => {
          errors.push(new DTErrorStub());
        });

      bunchTest.addManyAtIndex(itemsToAdd, indexToAdd, { errors: true });

      expect(errors.length).toBe(2);
      expect(DTErrorStub).toHaveBeenCalled();
      expect((bunchTest.addAtIndex as any).mock.calls.length).toBe(3);
      expect((bunchTest.addAtIndex as any).mock.calls[0][0].getId()).toBe(itemsToAdd[0].getId());
      expect((bunchTest.addAtIndex as any).mock.calls[1][0].getId()).toBe(itemsToAdd[1].getId());
      expect((bunchTest.addAtIndex as any).mock.calls[2][0].getId()).toBe(itemsToAdd[2].getId());
    });
  });

  describe('addMany()', () => {
    let itemsToAdd;
    let itemLibrary;

    beforeEach(() => {
      jest.spyOn(bunchTest, 'addManyAtIndex').mockImplementation(() => {});

      bunchTest.th_set_items(generateMockedElements(5));

      itemLibrary = generateMockedElements(8);
      itemsToAdd = [itemLibrary[5], itemLibrary[6], itemLibrary[7]];
    });

    test('add many items as last item using addManyAtIndex', () => {
      const testBunchOptions = {
        replaceIndex: true,
        inheritOwner: true,
      };

      bunchTest.addMany(itemsToAdd, testBunchOptions);

      expect((bunchTest.addManyAtIndex as any).mock.calls.length).toBe(1);
      expect((bunchTest.addManyAtIndex as any).mock.calls[0][0].length).toBe(3);
      expect((bunchTest.addManyAtIndex as any).mock.calls[0][0][0].getId()).toBe(`${HaileiIdTest}-5`);
      expect((bunchTest.addManyAtIndex as any).mock.calls[0][0][1].getId()).toBe(`${MeldrineIdTest}-6`);
      expect((bunchTest.addManyAtIndex as any).mock.calls[0][0][2].getId()).toBe(`${MaydenaIdTest}-7`);
      expect((bunchTest.addManyAtIndex as any).mock.calls[0][1]).toBe(5);
      expect((bunchTest.addManyAtIndex as any).mock.calls[0][2]).toStrictEqual(testBunchOptions);
    });
  });

  describe('removeMany()', () => {
    const checkAllItemsInBunch = (bunch: DTBunchTest, itemRemoved = 3) => {
      const sup = itemRemoved;
      expect(bunchTest.getAll().length).toBe(5 - sup);
      expect(bunchTest.th_get_items()[0].getId()).toBe(`${HaileiIdTest}-0`);
      itemRemoved < 1 && expect(bunchTest.th_get_items()[1 - sup].getId()).toBe(`${MeldrineIdTest}-1`);
      itemRemoved < 2 && expect(bunchTest.th_get_items()[2 - sup].getId()).toBe(`${MaydenaIdTest}-2`);
      itemRemoved < 3 && expect(bunchTest.th_get_items()[3 - sup].getId()).toBe(`${IldressIdTest}-3`);
      expect(bunchTest.th_get_items()[4 - sup].getId()).toBe(`${YssaliaIdTest}-4`);
    };

    beforeEach(() => {
      jest.spyOn(bunchTest, 'removeContext').mockImplementation(() => {});

      bunchTest.th_set_items(generateMockedElements(5));
    });

    test('remove many items by ids', () => {
      bunchTest.removeMany([`${MeldrineIdTest}-1`, `${MaydenaIdTest}-2`, `${IldressIdTest}-3`]);

      checkAllItemsInBunch(bunchTest);
    });

    test('remove many items by indexes', () => {
      bunchTest.removeMany([1, 2, 3]);

      checkAllItemsInBunch(bunchTest);
    });

    test('remove only item with corresponding ids', () => {
      bunchTest.removeMany([`${MeldrineIdTest}-1`, `${MaydenaIdTest}-2`, 'id-12345']);

      checkAllItemsInBunch(bunchTest, 2);
    });

    test('remove only item with corresponding indexes', () => {
      bunchTest.removeMany([1, 2, 11]);

      checkAllItemsInBunch(bunchTest, 2);
    });

    test('remove only item with corresponding indexes - incoherent index', () => {
      bunchTest.removeMany([-11, 2, 1, -13]);

      checkAllItemsInBunch(bunchTest, 2);
    });

    test('define context at undefined for removed items - default case', () => {
      const items = [
        bunchTest.th_get_items()[1],
        bunchTest.th_get_items()[2],
      ];

      bunchTest.removeMany([`${MeldrineIdTest}-1`, `${MaydenaIdTest}-2`]);
      items.push(bunchTest.th_get_items()[0]);
      items.push(bunchTest.th_get_items()[1]);
      bunchTest.removeMany([0, 1]);

      expect(items[0].removeContext.mock.calls.length).toBe(1);
      expect(items[1].removeContext.mock.calls.length).toBe(1);
      expect(items[2].removeContext.mock.calls.length).toBe(1);
      expect(items[3].removeContext.mock.calls.length).toBe(1);
    });

    test('not change context for removed items - virtual context option', () => {
      const items = [
        bunchTest.th_get_items()[1],
        bunchTest.th_get_items()[2],
      ];
      bunchTest.th_set_options({ virtualContext: true });
      bunchTest.removeMany([`${MeldrineIdTest}-1`, `${MaydenaIdTest}-2`]);
      items.push(bunchTest.th_get_items()[0]);
      items.push(bunchTest.th_get_items()[1]);
      bunchTest.removeMany([0, 1]);

      expect(items[0].removeContext.mock.calls.length).toBe(0);
      expect(items[1].removeContext.mock.calls.length).toBe(0);
      expect(items[2].removeContext.mock.calls.length).toBe(0);
      expect(items[3].removeContext.mock.calls.length).toBe(0);
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      jest.spyOn(bunchTest, 'removeMany').mockImplementation(() => {
      });

      bunchTest.th_set_items(generateMockedElements(5));
    });

    test('remove one item by id using removeMany', () => {
      bunchTest.remove(`${MaydenaIdTest}-2`);

      expect((bunchTest.removeMany as any).mock.calls.length).toBe(1);
      expect((bunchTest.removeMany as any).mock.calls[0][0]).toStrictEqual([`${MaydenaIdTest}-2`]);
    });

    test('remove one item by index using removeMany', () => {
      bunchTest.remove(2);

      expect((bunchTest.removeMany as any).mock.calls.length).toBe(1);
      expect((bunchTest.removeMany as any).mock.calls[0][0]).toStrictEqual([2]);
    });
  });

  describe('removeAll()', () => {
    beforeEach(() => {
      jest.spyOn(bunchTest, 'removeMany').mockImplementation(() => {
      });

      bunchTest.th_set_items(generateMockedElements(5));
    });

    test('remove all items using removeMany', () => {
      bunchTest.removeAll();

      expect((bunchTest.removeMany as any).mock.calls.length).toBe(1);
      expect((bunchTest.removeMany as any).mock.calls[0][0]).toStrictEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('copy()', () => {
    // @see copy.spec.ts for unit tests about copy method
  });

  describe('find()', () => {
    test('find items using DYOFinder - empty case', () => {
      bunchTest.find({});

      expect((bunchTest.th_get_finder() as any).execute.mock.calls.length).toBe(1);
      expect((bunchTest.th_get_finder() as any).execute.mock.calls[0][0]).toStrictEqual({});
    });

    test('find items using DYOFinder', () => {
      const testFilters = { id: { $eq: 'id_bunch' }, key: { $ne: 'key_test' } };
      bunchTest.find(testFilters);

      expect((bunchTest.th_get_finder() as any).execute.mock.calls.length).toBe(1);
      expect((bunchTest.th_get_finder() as any).execute.mock.calls[0][0]).toStrictEqual(testFilters);
    });
  });

  describe('toObject()', () => {
    beforeEach(() => {
      bunchTest.th_set_id(IDTest);
      bunchTest.th_set_key(KeyTest);
    });

    test('toObject output standard', () => {
      const toObjectBunch = bunchTest.toObject();

      expect(Object.keys(toObjectBunch)).toStrictEqual(['id', 'key', 'type', 'items']);
      expect(toObjectBunch.id).toBe(IDTest);
      expect(toObjectBunch.key).toBe(KeyTest);
      expect(toObjectBunch.type).toBe('bunch');
      expect(toObjectBunch.items.length).toBe(0);
    });

    test('toObject output standard with owner', () => {
      bunchTest.th_set_owner(new DTPlayerStub());

      const toObjectBunch = bunchTest.toObject();
      expect(Object.keys(toObjectBunch)).toStrictEqual(['id', 'key', 'type', 'items', 'owner']);
      expect(toObjectBunch.owner.toString()).toBe(toStringPlayerTest);
    });

    test('toObject output standard with owner and meta', () => {
      jest.spyOn(bunchTest, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });

      bunchTest.th_set_owner(new DTPlayerStub());
      bunchTest.th_set_meta(BunchMetaData);

      const toObjectBunch = bunchTest.toObject();
      expect(Object.keys(toObjectBunch)).toStrictEqual(['id', 'key', 'type', 'items', 'owner', 'meta']);
      expect(toObjectBunch.meta).toStrictEqual(BunchMetaData);
    });

    test('toObject output standard with items', () => {
      bunchTest.th_set_items(generateMockedElements(5));
      const toObjectBunch = bunchTest.toObject();

      expect(Object.keys(toObjectBunch)).toStrictEqual(['id', 'key', 'type', 'items']);
      expect(toObjectBunch.items.length).toBe(5);
      expect(toObjectBunch.items).toStrictEqual([
        HaileiToObjectTest,
        MeldrineToObjectTest,
        MaydenaToObjectTest,
        IldressToObjectTest,
        YssaliaToObjectTest,
      ]);
    });
  });

  describe('toString()', () => {
    beforeEach(() => {
      bunchTest.th_set_key(KeyTest);
    });

    test('string output standard', () => {
      const toStringBunch = bunchTest.toString();

      expect(toStringBunch).toBe(`Component ${KeyTest} - Type: Bunch - Items: 0`);
    });

    test('string output standard with items', () => {
      bunchTest.th_set_items(generateMockedElements(5));
      const toStringBunch = bunchTest.toString();

      expect(toStringBunch).toBe(`Component ${KeyTest} - Type: Bunch - Items: 5`);
    });

    test('string output standard with items and owner', () => {
      bunchTest.th_set_items(generateMockedElements(5));
      bunchTest.th_set_owner(new DTPlayerStub());

      const toStringBunch = bunchTest.toString();
      expect(toStringBunch).toBe(`Component ${KeyTest} - Type: Bunch - Owner: ${KeyPlayerTest} - Items: 5`);
    });
  });
});
