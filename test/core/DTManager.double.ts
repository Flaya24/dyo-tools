import {jest} from '@jest/globals';
import {DTManager, DTComponent} from '../../src';
import {mockOverriddenMethods} from "./DTComponent.double";

/******************** MOCK DEPENDENCIES
 * Dependencies used by the component are mocked with Jest
 * *****/
jest.mock('../../src/core/DTElement');
jest.mock('../../src/core/DTBunch');
jest.mock('../../src/core/DTComponent');
// Add specific mock for inherited methods to have a basic implementation
mockOverriddenMethods(DTComponent);
// inheritance method : Check the correct inheritance
export const inheritance = () => {
  return DTManager.prototype instanceof DTComponent;
}

/******************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * *****/
export const IDTest = 'DTManager-id-1234567';
export const KeyTest = 'DTManager-key-1234567';
export const DomainTest = 'DTManager-domain-test';
export const ScopesTest = ['DTManager-scope-test1', 'DTManager-scope-test2']

/******************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * *****/
export class DTManagerTest extends DTManager {
  th_prop_items(): any {
    return this._items;
  }

  th_prop_item(id: string): any {
    return this._items[id];
  }

  th_prop_scopes(): any {
    return this._scopes;
  }

  th_prop_actions(): any {
    return this._actions;
  }

  th_prop_library(): any {
    return this._library;
  }

  th_set_library(items: any): void {
    return this._library = new DTBunchStub
  }
}

/******************** STUB CLASS
 * Stub class, for using in other component
 * *****/
export class DTManagerStubDomain extends DTManagerTest {
  protected _domain = DomainTest;

  getDomain(): string {
    return DomainTest;
  }
}

/******************** HELPER METHODS
 * Additional helper methods to use with testing
 * *****/




