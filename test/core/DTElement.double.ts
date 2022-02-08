import { DTElement } from '../../src';
import { IMetaDataTest, MeldrineMetaData } from './DTComponentWithMeta.double';

// Global Variables
export const IDTest = 'DTElement-id-1234567';
export const KeyTest = 'DTElement-key-1234567';

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

  setManyMeta(metaValues: Partial<IMetaDataTest>) {
    this._meta = MeldrineMetaData;
  }

  getManyMeta(metaKeys: Array<keyof IMetaDataTest> = []): Partial<IMetaDataTest> {
    return this._meta;
  }
}
