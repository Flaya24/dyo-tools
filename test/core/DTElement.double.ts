import { DTElement, DTComponentPhysical } from '../../src';
import { IMetaDataTest, MeldrineMetaData } from './DTComponentWithMeta.double';
import {jest} from "@jest/globals";
import {mockOverriddenMethods} from "./DTComponentPhysical.double";

// Global Variables
export const IDTest = 'DTElement-id-1234567';
export const KeyTest = 'DTElement-key-1234567';

// Global constants for Mocked DTElements
export const HaileiIdTest = 'DTElement-id-Hailei';
export const HaileiKeyTest = 'DTElement-key-Hailei';
export const HaileiToObjectTest = { id: 'DTElement-id-Hailei', key: 'DTElement-key-Hailei', type: 'element' };
export const MeldrineIdTest = 'DTElement-id-Meldrine';
export const MeldrineKeyTest = 'DTElement-key-Meldrine';
export const MeldrineToObjectTest = { id: 'DTElement-id-Meldrine', key: 'DTElement-key-Meldrine', type: 'element' };
export const MaydenaIdTest = 'DTElement-id-Maydena';
export const MaydenaKeyTest = 'DTElement-key-Maydena';
export const MaydenaToObjectTest = { id: 'DTElement-id-Maydena', key: 'DTElement-key-Maydena', type: 'element' };
export const IldressIdTest = 'DTElement-id-Ildress';
export const IldressKeyTest = 'DTElement-key-Ildress';
export const IldressToObjectTest = { id: 'DTElement-id-Ildress', key: 'DTElement-key-Ildress', type: 'element' };
export const YssaliaIdTest = 'DTElement-id-Yssalia';
export const YssaliaKeyTest = 'DTElement-key-Yssalia';
export const YssaliaToObjectTest = { id: 'DTElement-id-Yssalia', key: 'DTElement-key-Yssalia', type: 'element' };

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
