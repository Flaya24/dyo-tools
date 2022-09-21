import {
  afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test,
} from '@jest/globals';
import {
  defaultOptions,
  DTBunchMock,
  generateMockedElements,
  HaileiIdTest,
  HaileiKeyTest,
  HaileiToObjectTest,
  IDTest,
  IldressIdTest,
  IldressKeyTest,
  IldressToObjectTest,
  KeyTest,
  MaydenaIdTest,
  MaydenaKeyTest,
  MaydenaToObjectTest,
  MeldrineIdTest,
  MeldrineKeyTest,
  MeldrineToObjectTest,
  YssaliaIdTest,
  YssaliaKeyTest,
  YssaliaToObjectTest,
  inheritance
} from './DTBunch.double';
import {DTBunch, DTError} from '../../src';
import DYOToolsElement from '../../src/core/DTElement';
import { BunchMetaData, IMetaDataTest } from './DTComponentWithMeta.double';
import { DTAcceptedMetaDataValue, DTBunchOptionsConstructor } from '../../src/types';
import {
  DTPlayerStub,
  IDTest as IDPlayerTest,
  KeyTest as KeyPlayerTest,
  toStringTest as toStringPlayerTest,
} from './DTPlayer.double';
import { DTErrorStub } from './DTError.double';
import { validFiltersForItem } from '../../src/utils/filters';
import { DTComponentTestMock, IDTest as IDContextTest } from './DTComponent.double';
import Mocked = jest.Mocked;
import MockedFunction = jest.MockedFunction;

describe('class DYOToolsBunch', () => {
  let bunchMock: DTBunchMock;

  beforeEach(() => {
    bunchMock = new DTBunchMock();
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
    let mockedAddMany; let
      originalAddMany;

    beforeAll(() => {
      originalAddMany = DTBunch.prototype.addMany;
      DTBunch.prototype.addMany = jest.fn();
      mockedAddMany = DTBunch.prototype.addMany as MockedFunction<(items: Array<Mocked<DYOToolsElement<IMetaDataTest>>>) => void>;
    });

    afterAll(() => {
      DTBunch.prototype.addMany = originalAddMany;
    });

    test('creation simple with key', () => {
      const newBunch = new DTBunch(KeyTest);

      jest.spyOn(newBunch, 'get').mockImplementation(function (key) {
        return key === 'options' ? this._globalOptions : undefined;
      });
      jest.spyOn(newBunch, 'getAll').mockImplementation(function () {
        return this._items;
      });

      expect(newBunch.get('options')).toStrictEqual(defaultOptions);
      expect(newBunch.getAll()).toStrictEqual([]);
    });

    test('creation with items', () => {
      const newBunch = new DTBunch<Mocked<DYOToolsElement<IMetaDataTest>>, {}>(KeyTest, generateMockedElements(3));

      jest.spyOn(newBunch, 'getErrors').mockImplementation(function () {
        return this._errors;
      });
      jest.spyOn(newBunch, 'getAll').mockImplementation(function () {
        return this._items;
      });

      expect(newBunch.getErrors()).toStrictEqual([]);
      expect(newBunch.getAll()).toStrictEqual([]);
      expect(mockedAddMany.mock.calls.length).toBe(1);
      expect(mockedAddMany.mock.calls[0][0].length).toBe(3);
      expect(mockedAddMany.mock.calls[0][0][0].getKey()).toBe(HaileiKeyTest);
      expect(mockedAddMany.mock.calls[0][0][1].getKey()).toBe(MeldrineKeyTest);
      expect(mockedAddMany.mock.calls[0][0][2].getKey()).toBe(MaydenaKeyTest);
    });

    test('creations with options', () => {
      const testOptions: Partial<DTBunchOptionsConstructor> = {
        errors: true,
        uniqueKey: true,
        inheritOwner: true,
      };
      const newBunch = new DTBunch<Mocked<DYOToolsElement<IMetaDataTest>>, {}>(KeyTest, [], testOptions);

      jest.spyOn(newBunch, 'get').mockImplementation(function (key) {
        return key === 'options' ? this._globalOptions : undefined;
      });
      jest.spyOn(newBunch, 'getAll').mockImplementation(function () {
        return this._items;
      });
      jest.spyOn(newBunch, 'getErrors').mockImplementation(function () {
        return this._errors;
      });

      expect(newBunch.getErrors()).toStrictEqual([]);
      expect(newBunch.get('options')).toStrictEqual({
        errors: true,
        uniqueKey: true,
        inheritOwner: true,
        replaceIndex: false,
        virtualContext: false,
      });
      expect(newBunch.getAll()).toStrictEqual([]);
    });
  });

  describe('_componentType', () => {
    test('componentType must be "bunch"', () => {
      expect(bunchMock.getComponentType()).toBe('bunch');
    });
  });

  describe('setOwner()', () => {
    beforeEach(() => {
      jest.spyOn(bunchMock, 'getOwner').mockImplementation(function () {
        return new DTPlayerStub();
      });
    });

    test('add a new owner - not updating elements owner when inheritOwner = false', () => {
      bunchMock.mockDefineOptions({ inheritOwner: false });
      bunchMock.mockDefineItems(3);

      const owner = new DTPlayerStub();
      bunchMock.setOwner(owner);

      expect(bunchMock.mockItemGetter(0).setOwner.mock.calls.length).toBe(0);
      expect(bunchMock.mockItemGetter(1).setOwner.mock.calls.length).toBe(0);
      expect(bunchMock.mockItemGetter(2).setOwner.mock.calls.length).toBe(0);
    });

    test('add a new owner - updating elements owner when inheritOwner = true', () => {
      bunchMock.mockDefineOptions({ inheritOwner: true });
      bunchMock.mockDefineItems(3);

      const owner = new DTPlayerStub();
      bunchMock.setOwner(owner);

      expect(bunchMock.mockItemGetter(0).setOwner.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(0).setOwner.mock.calls[0][0].getId()).toBe(IDPlayerTest);
      expect(bunchMock.mockItemGetter(1).setOwner.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(1).setOwner.mock.calls[0][0].getId()).toBe(IDPlayerTest);
      expect(bunchMock.mockItemGetter(2).setOwner.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(2).setOwner.mock.calls[0][0].getId()).toBe(IDPlayerTest);
    });
  });

  describe('removeOwner()', () => {

    test('remove current Owner - not updating elements owner when inheritOwner = false', () => {
      bunchMock.mockDefineOptions({ inheritOwner: true });
      bunchMock.mockDefineItems(2);

      bunchMock.mockDefineOptions({ inheritOwner: false });
      bunchMock.removeOwner();

      expect(bunchMock.mockItemGetter(0).removeOwner.mock.calls.length).toBe(0);
      expect(bunchMock.mockItemGetter(1).removeOwner.mock.calls.length).toBe(0);
    });

    test('remove current Owner - updating elements owner when inheritOwner = true', () => {
      bunchMock.mockDefineOptions({ inheritOwner: true });
      bunchMock.mockDefineItems(2);

      bunchMock.removeOwner();

      expect(bunchMock.mockItemGetter(0).removeOwner.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(1).removeOwner.mock.calls.length).toBe(1);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      bunchMock.mockDefineItems(5);
    });

    test('return an item by its id', () => {
      expect(bunchMock.get(`${MaydenaIdTest}-2`).getKey()).toBe(MaydenaKeyTest);
      expect(bunchMock.get(`${YssaliaIdTest}-4`).getKey()).toBe(YssaliaKeyTest);
    });

    test('return an item by its index', () => {
      expect(bunchMock.get(2).getKey()).toBe(MaydenaKeyTest);
      expect(bunchMock.get(4).getKey()).toBe(YssaliaKeyTest);
    });

    test('return undefined if item not found by id', () => {
      expect(bunchMock.get('id-123456')).toBeUndefined();
    });

    test('return undefined if item not found by index', () => {
      expect(bunchMock.get(11)).toBeUndefined();
    });

    test('return undefined if item not found by index - incoherent index', () => {
      expect(bunchMock.get(-11)).toBeUndefined();
    });
  });

  describe('getAll()', () => {
    test('return empty array if no items', () => {
      expect(bunchMock.getAll()).toStrictEqual([]);
    });

    test('return all items array', () => {
      bunchMock.mockDefineItems(5);

      expect(bunchMock.getAll()[0].getKey()).toBe(HaileiKeyTest);
      expect(bunchMock.getAll()[1].getKey()).toBe(MeldrineKeyTest);
      expect(bunchMock.getAll()[2].getKey()).toBe(MaydenaKeyTest);
      expect(bunchMock.getAll()[3].getKey()).toBe(IldressKeyTest);
      expect(bunchMock.getAll()[4].getKey()).toBe(YssaliaKeyTest);
    });
  });

  describe('indexOf()', () => {
    beforeEach(() => {
      bunchMock.mockDefineItems(5);
    });

    test('return index of an item by id', () => {
      expect(bunchMock.indexOf(`${MaydenaIdTest}-2`)).toBe(2);
      expect(bunchMock.indexOf(`${YssaliaIdTest}-4`)).toBe(4);
    });

    test('return -1 if id is not found', () => {
      expect(bunchMock.indexOf('id-123456')).toBe(-1);
    });
  });

  describe('addAtIndex()', () => {
    let objectToAdd;
    let objectsToAdd;

    const checkErrorCall = (code, message, initiatorId, convictedId) => {
      expect(DTError).toHaveBeenCalled();
      expect((DTError as any).mock.calls.length).toBe(1);
      expect((DTError as any).mock.calls[0][0]).toBe(code);
      expect((DTError as any).mock.calls[0][1]).toBe(message);
      expect((DTError as any).mock.calls[0][2].getId()).toBe(initiatorId);
      expect((DTError as any).mock.calls[0][3].getId()).toBe(convictedId);
    };

    beforeEach(() => {
      (DTError as any).mockReset();
      jest.spyOn(bunchMock, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(bunchMock, 'getErrors').mockImplementation(function () {
        return this._errors;
      });
      jest.spyOn(bunchMock, 'getOwner').mockImplementation(function () {
        return this._owner;
      });
      jest.spyOn(bunchMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });

      bunchMock.mockDefineItems(5);
      bunchMock.mockDefineOptions({
        replaceIndex: false,
        errors: false,
        uniqueKey: false,
        virtualContext: false,
        inheritOwner: false,
      });

      objectsToAdd = generateMockedElements(6);
      objectToAdd = objectsToAdd[5];
      jest.spyOn(bunchMock, 'find').mockReturnValue([objectToAdd]);
    });

    test('add a new item at last index - simple case', () => {
      bunchMock.addAtIndex(objectToAdd, 5);
      expect(bunchMock.mockItemGetter(5).getId()).toBe(objectToAdd.getId());
    });

    test('add a new item at specified index and reindex - default case', () => {
      bunchMock.addAtIndex(objectToAdd, 2);

      expect(bunchMock.mockItemGetter(2).getId()).toBe(objectToAdd.getId());
      expect(bunchMock.mockItemGetter(3).getId()).toBe(`${MaydenaIdTest}-2`);
      expect(bunchMock.mockItemGetter(4).getId()).toBe(`${IldressIdTest}-3`);
      expect(bunchMock.mockItemGetter(5).getId()).toBe(`${YssaliaIdTest}-4`);
    });

    test('add a new item at specified index and replace - replace option', () => {
      bunchMock.addAtIndex(objectToAdd, 2, { replaceIndex: true });
      expect(bunchMock.mockItemGetter(2).getId()).toBe(objectToAdd.getId());
      expect(bunchMock.mockItemGetter(3).getId()).toBe(`${IldressIdTest}-3`);
      expect(bunchMock.mockItemGetter(4).getId()).toBe(`${YssaliaIdTest}-4`);
      expect(bunchMock.mockItemGetter(5)).toBeUndefined();
    });

    test('add a new item at lower index', () => {
      bunchMock.addAtIndex(objectToAdd, -11);
      expect(bunchMock.mockItemGetter(0).getId()).toBe(objectToAdd.getId());
      expect(bunchMock.mockItemGetter(1).getId()).toBe(`${HaileiIdTest}-0`);
    });

    test('add a new item at greater index', () => {
      bunchMock.addAtIndex(objectToAdd, 11);
      expect(bunchMock.mockItemGetter(5).getId()).toBe(objectToAdd.getId());
      expect(bunchMock.mockItemGetter(6)).toBeUndefined();
    });

    test('trigger conflict when adding two same ids - default exception errors', () => {
      let errorThrown;
      try {
        bunchMock.addAtIndex(objectsToAdd[0], 2);
      } catch (error) {
        errorThrown = error;
      }

      expect(errorThrown).toBeDefined();
      checkErrorCall(
        'id_conflict',
        'Element with same id already exists in the bunch',
        IDTest,
        objectsToAdd[0].getId(),
      );
      expect(bunchMock.mockItemGetter(2).getId()).toBe(`${MaydenaIdTest}-2`);
    });

    test('trigger conflict when adding two same ids - stack errors', () => {
      jest.spyOn(bunchMock, 'getErrors').mockImplementation(function () {
        return this._errors;
      });

      bunchMock.addAtIndex(objectsToAdd[0], 2, { errors: true });
      const errors = bunchMock.getErrors();

      expect(errors.length).toBe(1);
      checkErrorCall(
        'id_conflict',
        'Element with same id already exists in the bunch',
        IDTest,
        objectsToAdd[0].getId(),
      );
      expect(bunchMock.mockItemGetter(2).getId()).toBe(`${MaydenaIdTest}-2`);
    });

    test('no conflict when adding two same keys - default case', () => {
      let errorThrown;
      try {
        bunchMock.addAtIndex(objectToAdd, 2);
      } catch (error) {
        errorThrown = error;
      }

      expect(errorThrown).toBeUndefined();
      expect((bunchMock.find as any).mock.calls.length).toBe(0);
      expect(bunchMock.mockItemGetter(0).getKey()).toBe(HaileiKeyTest);
      expect(bunchMock.mockItemGetter(2).getKey()).toBe(HaileiKeyTest);
    });

    test('trigger conflict when adding two same keys - uniqueKey option and exception errors', () => {
      let errorThrown;
      try {
        bunchMock.addAtIndex(objectToAdd, 2, { uniqueKey: true });
      } catch (error) {
        errorThrown = error;
      }

      expect(errorThrown).toBeDefined();
      checkErrorCall(
        'key_conflict',
        'Element with same key already exists in the bunch',
        IDTest,
        objectToAdd.getId(),
      );
      expect((bunchMock.find as any).mock.calls.length).toBe(1);
      expect((bunchMock.find as any).mock.calls[0][0]).toStrictEqual({ key: { $eq: objectToAdd.getKey() } });
      expect(bunchMock.mockItemGetter(2).getId()).toBe(`${MaydenaIdTest}-2`);
    });

    test('trigger conflict when adding two same keys - uniqueKey option and stack errors', () => {
      bunchMock.addAtIndex(objectToAdd, 2, { errors: true, uniqueKey: true });
      jest.spyOn(bunchMock, 'getErrors').mockImplementation(function () {
        return this._errors;
      });

      const errors = bunchMock.getErrors();

      expect(errors.length).toBe(1);
      checkErrorCall(
        'key_conflict',
        'Element with same key already exists in the bunch',
        IDTest,
        objectToAdd.getId(),
      );
      expect(bunchMock.mockItemGetter(2).getId()).toBe(`${MaydenaIdTest}-2`);
    });

    test('not inherit owner when adding an item - default case', () => {
      const owner = new DTPlayerStub();
      bunchMock.setOwner(owner);
      bunchMock.addAtIndex(objectToAdd, 2);

      expect(bunchMock.getOwner().getId()).toBe(IDPlayerTest);
      expect(objectToAdd.setOwner.mock.calls.length).toBe(0);
    });

    test('inherit owner when adding an item - inheritOwner option', () => {
      const owner = new DTPlayerStub();
      bunchMock.setOwner(owner);
      bunchMock.addAtIndex(objectToAdd, 2, { inheritOwner: true });

      expect(bunchMock.getOwner().getId()).toBe(IDPlayerTest);
      expect(objectToAdd.setOwner.mock.calls.length).toBe(1);
      expect(objectToAdd.setOwner.mock.calls[0][0].getId()).toBe(IDPlayerTest);
    });

    test('set context when adding an item - default case', () => {
      bunchMock.addAtIndex(objectToAdd, 2);

      expect(bunchMock.mockItemGetter(2).setContext.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(2).setContext.mock.calls[0][0].getId()).toBe(IDTest);
    });

    test('not set context when adding an item - virtualContext option', () => {
      bunchMock.mockDefineOptions({ virtualContext: true });
      bunchMock.addAtIndex(objectToAdd, 2);

      expect(bunchMock.mockItemGetter(2).setContext.mock.calls.length).toBe(0);
    });

    test('set context when adding an item - remove from old bunch', () => {
      const bunchMockOld = new DTBunchMock();
      bunchMockOld.mockDefineItems(6);
      objectToAdd = bunchMockOld.mockItemGetter(5);
      objectToAdd.setContext(bunchMockOld);
      objectToAdd.setContext.mockClear();
      jest.spyOn(bunchMockOld, 'remove').mockImplementation(() => {});

      bunchMock.addAtIndex(objectToAdd, 2);

      expect(bunchMock.mockItemGetter(2).setContext.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(2).setContext.mock.calls[0][0].getId()).toBe(IDTest);
      expect((bunchMockOld.remove as any).mock.calls.length).toBe(1);
      expect((bunchMockOld.remove as any).mock.calls[0][0]).toBe(objectToAdd.getId());
    });

    test('set context when adding an item - dont remove if virtualContext option', () => {
      const bunchMockOld = new DTBunchMock();
      bunchMockOld.mockDefineItems(6);
      objectToAdd = bunchMockOld.mockItemGetter(5);
      jest.spyOn(bunchMockOld, 'remove').mockImplementation(() => {});

      bunchMock.mockDefineOptions({ virtualContext: true });
      bunchMock.addAtIndex(objectToAdd, 2);

      expect(bunchMock.mockItemGetter(2).setContext.mock.calls.length).toBe(0);
      expect((bunchMockOld.remove as any).mock.calls.length).toBe(0);
    });
  });

  describe('add()', () => {
    let objectsToAdd;
    let objectToAdd;

    beforeEach(() => {
      jest.spyOn(bunchMock, 'addAtIndex').mockImplementation(() => {});

      bunchMock.mockDefineItems(5);

      objectsToAdd = generateMockedElements(6);
      objectToAdd = objectsToAdd[5];
    });

    test('add as last item using addAtIndex', () => {
      const testBunchOptions = {
        replaceIndex: true,
        inheritOwner: true,
      };
      bunchMock.add(objectToAdd, testBunchOptions);

      expect((bunchMock.addAtIndex as any).mock.calls.length).toBe(1);
      expect((bunchMock.addAtIndex as any).mock.calls[0][0].getId()).toBe(objectToAdd.getId());
      expect((bunchMock.addAtIndex as any).mock.calls[0][1]).toBe(5);
      expect((bunchMock.addAtIndex as any).mock.calls[0][2]).toStrictEqual(testBunchOptions);
    });
  });

  describe('addManyAtIndex()', () => {
    let itemsToAdd;
    let itemLibrary;

    beforeEach(() => {
      (DTError as any).mockReset();
      jest.spyOn(bunchMock, 'addAtIndex').mockImplementation(() => {});

      bunchMock.mockDefineItems(5);

      itemLibrary = generateMockedElements(8);
      itemsToAdd = [itemLibrary[5], itemLibrary[6], itemLibrary[7]];
    });

    test('add many items at index using addAtIndex - simple case', () => {
      const testBunchOptions = {
        replaceIndex: true,
        inheritOwner: true,
      };
      const indexToAdd = 2;
      bunchMock.addManyAtIndex(itemsToAdd, indexToAdd, testBunchOptions);

      expect((bunchMock.addAtIndex as any).mock.calls.length).toBe(3);
      for (let i = 0; i < 3; i++) {
        expect((bunchMock.addAtIndex as any).mock.calls[i][0].getId()).toBe(itemsToAdd[i].getId());
        expect((bunchMock.addAtIndex as any).mock.calls[i][1]).toBe(i + indexToAdd);
        expect((bunchMock.addAtIndex as any).mock.calls[i][2]).toStrictEqual(testBunchOptions);
      }
    });

    test('add many items at index using addAtIndex - index lower than 0', () => {
      const indexToAdd = -11;
      bunchMock.addManyAtIndex(itemsToAdd, indexToAdd);

      expect((bunchMock.addAtIndex as any).mock.calls.length).toBe(3);
      for (let i = 0; i < 3; i++) {
        expect((bunchMock.addAtIndex as any).mock.calls[i][0].getId()).toBe(itemsToAdd[i].getId());
        expect((bunchMock.addAtIndex as any).mock.calls[i][1]).toBe(i);
      }
    });

    test('errors when adding many items at index - default case - add no items and throw error', () => {
      const indexToAdd = 2;
      let errorThrown;
      jest.spyOn(bunchMock, 'addAtIndex').mockImplementation(function (item, index, options) {
        if (item.getKey() !== MeldrineKeyTest) {
          throw new DTError('test_error', `Item ${item.getId()}`);
        } else {
          this._items[index] = item;
        }
      });

      try {
        bunchMock.addManyAtIndex(itemsToAdd, indexToAdd);
      } catch (error) {
        errorThrown = error;
      }

      expect(errorThrown).toBeDefined();
      expect(DTError).toHaveBeenCalled();
      expect((DTError as any).mock.calls.length).toBe(1);
      expect((DTError as any).mock.calls[0][0]).toBe('test_error');
      expect((DTError as any).mock.calls[0][1]).toBe(`Item ${itemsToAdd[0].getId()}`);
      expect((bunchMock.addAtIndex as any).mock.calls.length).toBe(1);
      expect((bunchMock.addAtIndex as any).mock.calls[0][0].getId()).toBe(itemsToAdd[0].getId());
      expect((bunchMock.addAtIndex as any).mock.calls[0][1]).toBe(indexToAdd);
      expect(bunchMock.mockItemGetter(2).getKey()).not.toBe(MeldrineKeyTest);
    });

    test('errors when adding many items at index - errors case - add success items and stack errors for others', () => {
      const indexToAdd = 2;
      jest.spyOn(bunchMock, 'addAtIndex').mockImplementation(function (item, index, options) {
        if (item.getKey() !== MeldrineKeyTest) {
          this._errors.push(new DTError('test_error', `Item ${item.getId()}`));
        }
      });
      jest.spyOn(bunchMock, 'getErrors').mockImplementation(function () {
        return this._errors;
      });

      bunchMock.addManyAtIndex(itemsToAdd, indexToAdd, { errors: true });
      const errors = bunchMock.getErrors();

      expect(errors.length).toBe(2);
      expect(DTError).toHaveBeenCalled();
      expect((DTError as any).mock.calls.length).toBe(2);
      expect((DTError as any).mock.calls[0][0]).toBe('test_error');
      expect((DTError as any).mock.calls[0][1]).toBe(`Item ${itemsToAdd[0].getId()}`);
      expect((DTError as any).mock.calls[1][0]).toBe('test_error');
      expect((DTError as any).mock.calls[1][1]).toBe(`Item ${itemsToAdd[2].getId()}`);
      expect((bunchMock.addAtIndex as any).mock.calls.length).toBe(3);
    });
  });

  describe('addMany()', () => {
    let itemsToAdd;
    let itemLibrary;

    beforeEach(() => {
      jest.spyOn(bunchMock, 'addManyAtIndex').mockImplementation(() => {});

      bunchMock.mockDefineItems(5);

      itemLibrary = generateMockedElements(8);
      itemsToAdd = [itemLibrary[5], itemLibrary[6], itemLibrary[7]];
    });

    test('add many items as last item using addManyAtIndex', () => {
      const testBunchOptions = {
        replaceIndex: true,
        inheritOwner: true,
      };
      bunchMock.addMany(itemsToAdd, testBunchOptions);

      expect((bunchMock.addManyAtIndex as any).mock.calls.length).toBe(1);
      expect((bunchMock.addManyAtIndex as any).mock.calls[0][0].length).toBe(3);
      expect((bunchMock.addManyAtIndex as any).mock.calls[0][0][0].getId()).toBe(`${HaileiIdTest}-5`);
      expect((bunchMock.addManyAtIndex as any).mock.calls[0][0][1].getId()).toBe(`${MeldrineIdTest}-6`);
      expect((bunchMock.addManyAtIndex as any).mock.calls[0][0][2].getId()).toBe(`${MaydenaIdTest}-7`);
      expect((bunchMock.addManyAtIndex as any).mock.calls[0][1]).toBe(5);
      expect((bunchMock.addManyAtIndex as any).mock.calls[0][2]).toStrictEqual(testBunchOptions);
    });
  });

  describe('removeMany()', () => {
    const checkAllItemsInBunch = (bunch: DTBunchMock, itemRemoved = 3) => {
      const sup = itemRemoved;
      expect(bunchMock.getAll().length).toBe(5 - sup);
      expect(bunchMock.mockItemGetter(0).getId()).toBe(`${HaileiIdTest}-0`);
      itemRemoved < 1 && expect(bunchMock.mockItemGetter(1 - sup).getId()).toBe(`${MeldrineIdTest}-1`);
      itemRemoved < 2 && expect(bunchMock.mockItemGetter(2 - sup).getId()).toBe(`${MaydenaIdTest}-2`);
      itemRemoved < 3 && expect(bunchMock.mockItemGetter(3 - sup).getId()).toBe(`${IldressIdTest}-3`);
      expect(bunchMock.mockItemGetter(4 - sup).getId()).toBe(`${YssaliaIdTest}-4`);
    };

    beforeEach(() => {
      jest.spyOn(bunchMock, 'getAll').mockImplementation(function () {
        return this._items;
      });
      jest.spyOn(bunchMock, 'removeContext').mockImplementation(() => {});

      bunchMock.mockDefineItems(5);
    });

    test('remove many items by ids', () => {
      bunchMock.removeMany([`${MeldrineIdTest}-1`, `${MaydenaIdTest}-2`, `${IldressIdTest}-3`]);

      checkAllItemsInBunch(bunchMock);
    });

    test('remove many items by indexes', () => {
      bunchMock.removeMany([1, 2, 3]);

      checkAllItemsInBunch(bunchMock);
    });

    test('remove only item with corresponding ids', () => {
      bunchMock.removeMany([`${MeldrineIdTest}-1`, `${MaydenaIdTest}-2`, 'id-12345']);

      checkAllItemsInBunch(bunchMock, 2);
    });

    test('remove only item with corresponding indexes', () => {
      bunchMock.removeMany([1, 2, 11]);

      checkAllItemsInBunch(bunchMock, 2);
    });

    test('remove only item with corresponding indexes - incoherent index', () => {
      bunchMock.removeMany([-11, 2, 1, -13]);

      checkAllItemsInBunch(bunchMock, 2);
    });

    test('define context at undefined for removed items - default case', () => {
      const items = [
        bunchMock.mockItemGetter(1),
        bunchMock.mockItemGetter(2),
      ];

      bunchMock.removeMany([`${MeldrineIdTest}-1`, `${MaydenaIdTest}-2`]);
      items.push(bunchMock.mockItemGetter(0));
      items.push(bunchMock.mockItemGetter(1));
      bunchMock.removeMany([0, 1]);

      expect(items[0].removeContext.mock.calls.length).toBe(1);
      expect(items[1].removeContext.mock.calls.length).toBe(1);
      expect(items[2].removeContext.mock.calls.length).toBe(1);
      expect(items[3].removeContext.mock.calls.length).toBe(1);
    });

    test('not change context for removed items - virtual context option', () => {
      const items = [
        bunchMock.mockItemGetter(1),
        bunchMock.mockItemGetter(2),
      ];
      bunchMock.mockDefineOptions({ virtualContext: true });
      bunchMock.removeMany([`${MeldrineIdTest}-1`, `${MaydenaIdTest}-2`]);
      items.push(bunchMock.mockItemGetter(0));
      items.push(bunchMock.mockItemGetter(1));
      bunchMock.removeMany([0, 1]);

      expect(items[0].removeContext.mock.calls.length).toBe(0);
      expect(items[1].removeContext.mock.calls.length).toBe(0);
      expect(items[2].removeContext.mock.calls.length).toBe(0);
      expect(items[3].removeContext.mock.calls.length).toBe(0);
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      jest.spyOn(bunchMock, 'removeMany').mockImplementation(() => {
      });

      bunchMock.mockDefineItems(5);
    });

    test('remove one item by id using removeMany', () => {
      bunchMock.remove(`${MaydenaIdTest}-2`);

      expect((bunchMock.removeMany as any).mock.calls.length).toBe(1);
      expect((bunchMock.removeMany as any).mock.calls[0][0]).toStrictEqual([`${MaydenaIdTest}-2`]);
    });

    test('remove one item by index using removeMany', () => {
      bunchMock.remove(2);

      expect((bunchMock.removeMany as any).mock.calls.length).toBe(1);
      expect((bunchMock.removeMany as any).mock.calls[0][0]).toStrictEqual([2]);
    });
  });

  describe('removeAll()', () => {
    beforeEach(() => {
      jest.spyOn(bunchMock, 'removeMany').mockImplementation(() => {
      });

      bunchMock.mockDefineItems(5);
    });

    test('remove all items using removeMany', () => {
      bunchMock.removeAll();

      expect((bunchMock.removeMany as any).mock.calls.length).toBe(1);
      expect((bunchMock.removeMany as any).mock.calls[0][0]).toStrictEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('find()', () => {
    const validFiltersForItemMockFn = validFiltersForItem as MockedFunction<typeof validFiltersForItem>;
    const checkItemFound = (items) => {
      expect(items.length).toBe(3);
      expect(items[0].getId()).toBe(`${HaileiIdTest}-0`);
      expect(items[1].getId()).toBe(`${MaydenaIdTest}-2`);
      expect(items[2].getId()).toBe(`${YssaliaIdTest}-4`);
    };
    const generateFiltersCallsResponse = (filters): any => {
      const items = generateMockedElements(5);
      let nbCalls = 0;
      let itemCount = 0;
      let inversion = false;
      const response = { nbCalls: 0, callsData: [] };
      validFiltersForItemMockFn.mockReturnValue(true);

      for (const item of items) {
        for (const prop of Object.keys(filters)) {
          let itemProp: DTAcceptedMetaDataValue = '';
          let operators = { fake: filters[prop] };
          if (prop === 'id') {
            itemProp = item.getId();
          } else if (prop === 'key') {
            itemProp = item.getKey();
          } else if (prop === 'owner') {
            itemProp = itemCount % 2 ? null : IDPlayerTest;
          } else if (prop === 'context') {
            itemProp = itemCount % 2 ? IDContextTest : null;
          } else if (prop === 'meta') {
            operators = filters[prop];
          }

          let metaBreakerLoop = false;
          for (const metaKey of Object.keys(operators)) {
            if (prop === 'meta') {
              itemProp = item.getManyMeta()[metaKey];
            }
            if (metaBreakerLoop) {
              break;
            }

            for (const operator of Object.keys(operators[metaKey])) {
              response.callsData.push([
                itemProp, filters[prop][operator], operator,
              ]);

              if (!(itemCount % 2)) {
                validFiltersForItemMockFn.mockReturnValueOnce(true);
              } else {
                validFiltersForItemMockFn.mockReturnValueOnce(inversion);
                if (inversion === false) {
                  if (prop === 'meta') {
                    metaBreakerLoop = true;
                  }
                  break;
                }
                inversion = !inversion;
              }
              nbCalls++;
            }
          }
        }

        itemCount++;
        inversion = false;
      }

      response.nbCalls = nbCalls;
      return response;
    };

    beforeEach(() => {
      bunchMock.mockDefineItems(5);

      bunchMock.mockItemGetter(0).setOwner(new DTPlayerStub());
      bunchMock.mockItemGetter(1).setContext(new DTComponentTestMock());
      bunchMock.mockItemGetter(2).setOwner(new DTPlayerStub());
      bunchMock.mockItemGetter(3).setContext(new DTComponentTestMock());
      bunchMock.mockItemGetter(4).setOwner(new DTPlayerStub());
    });

    afterEach(() => {
      validFiltersForItemMockFn.mockReset();
    });

    test('find items by id - $eq case', () => {
      const filters = { id: { $eq: 'filter-id' } };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by id - all valid operators', () => {
      const filters = {
        id: {
          $eq: 'filter-id',
          $in: ['filter-id', '12345'],
          $nin: [false, 12345],
          $ne: 'filter-id',
        },
      };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by key - one operator $eq', () => {
      const filters = { key: { $eq: 'filter-key' } };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by key - all valid operators', () => {
      const filters = {
        key: {
          $eq: 'filter-key',
          $in: ['filter-key', '12345'],
          $nin: [false, 12345],
          $ne: 'filter-key',
        },
      };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by owner - $eq case', () => {
      const filters = { owner: { $eq: 'filter-owner-id' } };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by owner - all valid operators', () => {
      const filters = {
        owner: {
          $eq: 'filter-owner-id',
          $in: ['filter-owner-id', '12345'],
          $nin: [null, 12345],
          $ne: 'filter-owner-id',
        },
      };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by context - $eq case', () => {
      const filters = { id: { $eq: 'filter-context-id' } };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by context - all valid operators', () => {
      const filters = {
        context: {
          $eq: 'filter-context-id',
          $in: ['filter-context-id', '12345'],
          $nin: [null, 12345],
          $ne: 'filter-context-id',
        },
      };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by meta - one meta with one operator $eq', () => {
      const filters = { meta: { name: { $eq: 'filter-meta-name' } } };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by meta - several meta with one operator $eq', () => {
      const filters = {
        meta: {
          name: { $eq: 'filter-meta-name' },
          queen: { $eq: false },
          rank: { $eq: 13 },
        },
      };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by meta - one meta with all valid operators', () => {
      const filters = {
        meta: {
          rank: {
            $eq: 5,
            $in: [5, 11],
            $nin: [2, 3],
            $ne: 11,
            $lte: 17,
            $gte: 3,
            $contains: 5,
            $ncontains: 11,
          },
        },
      };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by meta - several meta with several operators', () => {
      const filters = {
        meta: {
          name: {
            $eq: 'filter-meta-name',
            $in: ['filter-meta-name', '12345'],
            $ne: null,
          },
          kd: {
            $contains: 0,
            $ncontains: 53,
          },
          rank: {
            $lte: 17,
            $gte: 3,
          },
        },
      };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by meta - all props with several operators', () => {
      const filters = {
        id: {
          $eq: 'filter-id',
        },
        key: {
          $eq: 'filter-key',
          $in: ['filter-key', '12345'],
        },
        owner: {
          $nin: [null, 12345],
          $ne: 'filter-owner-id',
        },
        context: {
          $in: ['filter-context-id', '12345'],
          $nin: [null, 12345],
          $ne: 'filter-context-id',
        },
        meta: {
          name: {
            $eq: 'filter-meta-name',
            $in: ['filter-meta-name', '12345'],
            $ne: null,
          },
          kd: {
            $contains: 0,
            $ncontains: 53,
          },
          rank: {
            $lte: 17,
            $gte: 3,
          },
        },
      };
      const expectedResponseCalls = generateFiltersCallsResponse(filters);
      const itemsFound = bunchMock.find(filters);

      expect(expectedResponseCalls).toStrictEqual(expectedResponseCalls);
      checkItemFound(itemsFound);
    });

    test('find items by meta - empty filters (return empty array)', () => {
      const filters = {};
      const itemsFound = bunchMock.find(filters);

      expect(itemsFound.length).toBe(0);
      expect(validFiltersForItemMockFn.mock.calls.length).toBe(0);

      validFiltersForItemMockFn.mockReset();
      const filters2 = {
        id: {},
        key: {},
        owner: {},
        context: {},
        meta: {},
      };
      const itemsFound2 = bunchMock.find(filters2);

      expect(itemsFound2.length).toBe(0);
      expect(validFiltersForItemMockFn.mock.calls.length).toBe(0);
    });
  });

  describe('copy()', () => {
    test('copy a bunch - simple case with id and key', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      const bunchMockCopy = bunchMock.copy();
      jest.spyOn(bunchMock, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(bunchMockCopy, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(bunchMock, 'getKey').mockImplementation(function () {
        return this._key;
      });
      jest.spyOn(bunchMockCopy, 'getKey').mockImplementation(function () {
        return this._key;
      });

      expect(bunchMock.getId() === bunchMockCopy.getId()).toBeFalsy();
      expect(bunchMock.getKey() === bunchMockCopy.getKey()).toBeTruthy();
    });

    test('copy a bunch - not copy owner and context', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      jest.spyOn(bunchMock, 'setContext').mockImplementation(function (context) {
        this._context = context;
      });
      jest.spyOn(bunchMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });

      bunchMock.setContext(new DTComponentTestMock());
      bunchMock.setOwner(new DTPlayerStub());

      const bunchMockCopy = bunchMock.copy();
      jest.spyOn(bunchMockCopy, 'getContext').mockImplementation(function () {
        return this._context;
      });
      jest.spyOn(bunchMockCopy, 'getOwner').mockImplementation(function () {
        return this._owner;
      });

      expect(bunchMockCopy.getContext()).toBeUndefined();
      expect(bunchMockCopy.getOwner()).toBeUndefined();
    });

    test('copy a bunch - copy meta-data and globalOptions', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      const mockedSetManyMeta = DTBunch.prototype.setManyMeta as MockedFunction<(metaValues : Partial<{}>) => void>;
      jest.spyOn(bunchMock, 'getManyMeta').mockImplementation(function () {
        return BunchMetaData;
      });

      const copiedOptions: Partial<DTBunchOptionsConstructor> = {
        inheritOwner: true,
        replaceIndex: true,
        virtualContext: true,
      };
      bunchMock.mockDefineOptions(copiedOptions);

      const bunchMockCopy = bunchMock.copy();
      jest.spyOn(bunchMockCopy, 'get').mockImplementation(function (key) {
        return key === 'options' ? this._globalOptions : undefined;
      });

      // Weird behavior of Jest which doesn't clean the mock Calls, so it's the call index 2 to check
      expect(mockedSetManyMeta.mock.calls[2][0]).toStrictEqual(BunchMetaData);
      expect(bunchMockCopy.get('options')).toStrictEqual({
        ...defaultOptions,
        ...copiedOptions,
      });
    });

    test('copy a bunch - empty errors', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      const errors = [new DTErrorStub(), new DTErrorStub()];
      bunchMock.mockDefineErrors(errors);

      const bunchMockCopy = bunchMock.copy();
      jest.spyOn(bunchMockCopy, 'getErrors').mockImplementation(function () {
        return this._errors;
      });

      expect(bunchMockCopy.getErrors().length).toBe(0);
    });

    test('copy a bunch with items - default case', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      bunchMock.mockDefineItems(5);

      const bunchMockCopy = bunchMock.copy();
      jest.spyOn(bunchMockCopy, 'getAll').mockImplementation(function () {
        return this._items;
      });

      const items = bunchMockCopy.getAll();

      expect(items.length).toBe(5);
      expect(bunchMock.mockItemGetter(0).copy.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(1).copy.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(2).copy.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(3).copy.mock.calls.length).toBe(1);
      expect(bunchMock.mockItemGetter(4).copy.mock.calls.length).toBe(1);
    });

    test('copy a bunch with items - virtual context case', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      bunchMock.mockDefineItems(5);
      bunchMock.mockDefineOptions({ virtualContext: true });

      const bunchMockCopy = bunchMock.copy();
      jest.spyOn(bunchMockCopy, 'getAll').mockImplementation(function () {
        return this._items;
      });

      const items = bunchMockCopy.getAll();

      expect(items.length).toBe(5);
      expect(bunchMock.mockItemGetter(0).copy.mock.calls.length).toBe(0);
      expect(bunchMock.mockItemGetter(1).copy.mock.calls.length).toBe(0);
      expect(bunchMock.mockItemGetter(2).copy.mock.calls.length).toBe(0);
      expect(bunchMock.mockItemGetter(3).copy.mock.calls.length).toBe(0);
      expect(bunchMock.mockItemGetter(4).copy.mock.calls.length).toBe(0);
    });
  });

  describe('toObject()', () => {
    test('toObject output standard', () => {
      const toObjectBunch = bunchMock.toObject();

      expect(Object.keys(toObjectBunch)).toStrictEqual(['id', 'key', 'type', 'items']);
      expect(toObjectBunch.id).toBe(IDTest);
      expect(toObjectBunch.key).toBe(KeyTest);
      expect(toObjectBunch.type).toBe('bunch');
      expect(toObjectBunch.items.length).toBe(0);
    });

    test('toObject output standard with owner', () => {
      jest.spyOn(bunchMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });
      bunchMock.setOwner(new DTPlayerStub());

      const toObjectBunch = bunchMock.toObject();
      expect(Object.keys(toObjectBunch)).toStrictEqual(['id', 'key', 'type', 'items', 'owner']);
      expect(toObjectBunch.owner.toString()).toBe(toStringPlayerTest);
    });

    test('toObject output standard with owner and meta', () => {
      jest.spyOn(bunchMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = new DTPlayerStub();
      });
      jest.spyOn(bunchMock, 'setManyMeta').mockImplementation(function () {
        this._meta = BunchMetaData as any;
      });
      jest.spyOn(bunchMock, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });

      bunchMock.setOwner(new DTPlayerStub());
      bunchMock.setManyMeta({});

      const toObjectBunch = bunchMock.toObject();
      expect(Object.keys(toObjectBunch)).toStrictEqual(['id', 'key', 'type', 'items', 'owner', 'meta']);
      expect(toObjectBunch.meta).toStrictEqual(BunchMetaData);
    });

    test('toObject output standard with items', () => {
      bunchMock.mockDefineItems(5);
      const toObjectBunch = bunchMock.toObject();

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
    test('string output standard', () => {
      const toStringBunch = bunchMock.toString();

      expect(toStringBunch).toBe(`Component ${KeyTest} - Type: Bunch - Items: 0`);
    });

    test('string output standard with items', () => {
      bunchMock.mockDefineItems(5);
      const toStringBunch = bunchMock.toString();

      expect(toStringBunch).toBe(`Component ${KeyTest} - Type: Bunch - Items: 5`);
    });

    test('string output standard with items and owner', () => {
      bunchMock.mockDefineItems(5);
      jest.spyOn(bunchMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });

      bunchMock.setOwner(new DTPlayerStub());

      const toStringBunch = bunchMock.toString();
      expect(toStringBunch).toBe(`Component ${KeyTest} - Type: Bunch - Owner: ${KeyPlayerTest} - Items: 5`);
    });
  });
});
