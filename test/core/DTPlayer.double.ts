import {DTPlayer} from '../../src';
import {IMetaDataTest} from './DTComponentWithMeta.double';

/******************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * *****/
export const IDTest = 'DTPlayer-id-1234567';
export const KeyTest = 'DTPlayer-key-1234567';
export const toStringTest = 'DTPlayer Stub toString';

// Mock Constructor and parent methods for DTPlayer
// TODO : migrating
export class DTPlayerMock extends DTPlayer<IMetaDataTest> {
  constructor() {
    super();
    this._id = IDTest;
    this._key = KeyTest;
  }

  getComponentType(): string {
    return this._componentType;
  }
}

/******************** STUB CLASS
 * Stub class, for using in other component
 * *****/
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


