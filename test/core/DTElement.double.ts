import { DTElement, DTComponentPhysical } from '../../src';
import { IMetaDataTest, MeldrineMetaData } from './DTComponentWithMeta.double';
import {jest} from "@jest/globals";
import {mockOverriddenMethods} from "./DTComponentPhysical.double";

// Global Variables
export const IDTest = 'DTElement-id-1234567';
export const KeyTest = 'DTElement-key-1234567';

// Mock Inheritance
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTComponentWithMeta');
jest.mock('../../src/core/DTComponentPhysical');
mockOverriddenMethods(DTComponentPhysical);

// Mock Constructor and parent methods for DTElement
export class DTElementMock extends DTElement<IMetaDataTest> {
  constructor() {
    super();
    this._id = IDTest;
    this._key = KeyTest;
  }

  getComponentType(): string {
    return this._componentType;
  }
}

// Inheritance
export const inheritance = () => {
  return DTElement.prototype instanceof DTComponentPhysical;
}
