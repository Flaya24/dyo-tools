import {jest} from '@jest/globals';
import {DTManager, DTComponent} from '../../src';
import {mockOverriddenMethods} from "./DTComponent.double";

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

  th_get_single_item(id: string): any {
    return this._items[id];
  }

  th_get_scopes(): any {
    return this._scopes;
  }

  th_get_actions(): any {
    return this._actions;
  }

  th_get_library(): any {
    return this._library;
  }

  // th_set_library(items: any): void {
  //   return this._library = new DTBunchStub
  // }
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




