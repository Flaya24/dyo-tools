import {jest} from '@jest/globals';
import {DTManager, DTComponent} from '../../src';
import {mockOverriddenMethods} from "./DTComponent.double";

// Mocking extra Components for using with Bunch
jest.mock('../../src/core/DTElement');
jest.mock('../../src/core/DTBunch');

// Mock Inheritance
jest.mock('../../src/core/DTComponent');
mockOverriddenMethods(DTComponent);

export const inheritance = () => {
  return DTManager.prototype instanceof DTComponent;
}

// Global Variables
export const IDTest = 'DTManager-id-1234567';
export const KeyTest = 'DTManager-key-1234567';
export const DomainTest = 'DTManager-domain-test';
export const ScopesTest = ['DTManager-scope-test1', 'DTManager-scope-test2']

// DTManager with test helper methods
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
}

// DTManager Stub class with domain
export class DTManagerStubDomain extends DTManagerTest {
  protected _domain = DomainTest;

  getDomain(): string {
    return DomainTest;
  }
}




