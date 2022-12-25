import {DTPlayer} from '../../src';
import {IMetaDataTest} from './DTComponentWithMeta.double';

/******************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * *****/
export const IDTest = 'DTPlayer-id-1234567';
export const KeyTest = 'DTPlayer-key-1234567';
export const toStringTest = 'DTPlayer Stub toString';

/******************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * *****/
export class DTPlayerTest extends DTPlayer<IMetaDataTest> {
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

  th_set_meta(meta: IMetaDataTest): void {
    this._meta = meta;
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


