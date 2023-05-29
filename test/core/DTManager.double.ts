import { expect } from '@jest/globals';
import { DTManager } from '../../src';
import {
  defaultOptions,
  DTBunchStubLibrary, DTBunchTest, generateMockedElements, IDTest as IDTestBunch,
} from './DTBunch.double';
import { DTManagerItemsType, DTManagerOptions } from '../../src/types';
import DYOFinder from '../../src/libs/DYOFinder';
import Mock = jest.Mock;

/** ****************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * **** */
export const IDTest = 'DTManager-id-1234567';
export const KeyTest = 'DTManager-key-1234567';
export const DomainTest = 'DTManager-domain-test';
export const ScopesTest = ['DTManager-scope-test1', 'DTManager-scope-test2'];

/** ****************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * **** */
export class DTManagerTest extends DTManager {
  th_get_id(): string {
    return this._id;
  }

  th_set_id(id: string): void {
    this._id = id;
  }

  th_get_key(): string {
    return this._key;
  }

  th_set_key(key: string): void {
    this._key = key;
  }

  th_get_componentType(): string {
    return this._componentType;
  }

  th_get_items(): any {
    return this._items;
  }

  th_set_items(items: DTManagerItemsType): void {
    this._items = items;
  }

  th_get_single_item(id: string): any {
    return this._items[id];
  }

  th_get_scopes(): any {
    return this._scopes;
  }

  th_set_scopes(scopes: any): void {
    this._scopes = scopes;
  }

  th_get_library(): any {
    return this._library;
  }

  th_set_library(library: any): void {
    this._library = library;
  }

  th_set_options(options: any): void {
    this._options = {
      ...this._options,
      ...options,
    };
  }

  th_get_finder(): DYOFinder {
    return this._finder;
  }

  th_get_options(): DTManagerOptions {
    return this._options;
  }
}

/** ****************** STUB CLASS
 * Stub class, for using in other component
 * **** */
export class DTManagerStubDomain extends DTManagerTest {
  protected _domain = DomainTest;

  getDomain(): string {
    return DomainTest;
  }
}

/** ****************** HELPER METHODS
 * Additional helper methods to use with testing
 * **** */
// Add mocked bunches and elements to a Manager
export function populateManager(manager: DTManagerTest): DTManagerTest {
  const mockedElements = generateMockedElements(5);

  // Library
  manager.th_set_library(new DTBunchStubLibrary(mockedElements));

  // Scopes
  manager.th_set_scopes(ScopesTest);

  // Bunches
  const bunch1 = new DTBunchTest();
  bunch1.th_set_items(mockedElements);
  bunch1.th_set_id(`${IDTestBunch}_1`);
  jest.spyOn(bunch1, 'getId').mockImplementation(() => `${IDTestBunch}_1`);
  jest.spyOn(bunch1, 'getOptions').mockImplementation(() => ({ ...defaultOptions }));

  const bunch2 = new DTBunchTest();
  bunch2.th_set_id(`${IDTestBunch}_2`);
  jest.spyOn(bunch2, 'getId').mockImplementation(() => `${IDTestBunch}_2`);
  jest.spyOn(bunch2, 'getOptions').mockImplementation(() => ({ ...defaultOptions }));

  const bunch3 = new DTBunchTest();
  bunch3.th_set_id(`${IDTestBunch}_3`);
  bunch3.th_set_options({ virtualContext: true });
  jest.spyOn(bunch3, 'getId').mockImplementation(() => `${IDTestBunch}_3`);
  jest.spyOn(bunch3, 'getOptions').mockImplementation(() => ({ ...defaultOptions, virtualContext: true }));

  const items: DTManagerItemsType = {
    [bunch1.th_get_id()]: {
      scope: 'default',
      item: bunch1,
    },
    [bunch2.th_get_id()]: {
      scope: ScopesTest[0],
      item: bunch2,
    },
    [bunch3.th_get_id()]: {
      scope: 'virtual',
      item: bunch3,
    },
  };
  manager.th_set_items(items);

  return manager;
}

export const checkManagerItem = (managerTest: DTManagerTest, bunchId: string, scope: string): void => {
  expect(managerTest.th_get_single_item(bunchId)).toBeDefined();
  expect(Object.keys(managerTest.th_get_single_item(bunchId))).toStrictEqual(['scope', 'item']);
  expect(managerTest.th_get_single_item(bunchId).scope).toBe(scope);
  expect(managerTest.th_get_single_item(bunchId).item.th_get_id()).toBe(bunchId);
};
