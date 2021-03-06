import { DTPlayer } from '../../src';
import { IMetaDataTest, PlayerMetaData } from './DTComponentWithMeta.double';

// Global Variables
export const IDTest = 'DTPlayer-id-1234567';
export const KeyTest = 'DTPlayer-key-1234567';
export const toStringTest = 'DTPlayer Stub toString';

// Stub for Player (used for other tests)
export class DTPlayerStub extends DTPlayer<{}> {
  constructor() {
    super();
    this._id = IDTest;
    this._key = KeyTest;
  }

  getKey(): string {
    return KeyTest;
  }

  getId(): string {
    return IDTest;
  }

  toString(): string {
    return toStringTest;
  }
}

// Mock Constructor and parent methods for DTPlayer
export class DTPlayerMock extends DTPlayer<IMetaDataTest> {
  constructor() {
    super();
    this._id = IDTest;
    this._key = KeyTest;
  }

  getComponentType(): string {
    return this._componentType;
  }

  setManyMeta(metaValues: Partial<IMetaDataTest>) {
    this._meta = PlayerMetaData;
  }

  getManyMeta(metaKeys: Array<keyof IMetaDataTest> = []): Partial<IMetaDataTest> {
    return this._meta;
  }
}
