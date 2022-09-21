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

// Specific DTManager class with mocked domain
export class DTManagerWithDomain extends DTManager {
  protected _domain = DomainTest;

  getDomain(): string {
    return DomainTest;
  }
}




