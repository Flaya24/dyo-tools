import { DTElement } from '../../src';
import { IMetaDataTest } from './DTComponentWithMeta.double';
import { DTPlayerStub } from './DTPlayer.double';

/** ****************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * **** */
// Global constants
export const IDTest = 'DTElement-id-1234567';
export const KeyTest = 'DTElement-key-1234567';

// Specific elements constants
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

/** ****************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * **** */
export class DTElementTest extends DTElement<IMetaDataTest> {
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

  th_get_owner(): DTPlayerStub {
    return this._owner;
  }

  th_set_owner(owner: DTPlayerStub): void {
    this._owner = owner;
  }

  th_set_meta(meta: IMetaDataTest): void {
    this._meta = meta;
  }
}
/** ****************** STUB CLASS
 * Stub class, for using in other component
 * **** */
export class DTElementStub extends DTElement<IMetaDataTest> {
  public parentIndex: number;

  constructor(index = 0) {
    super();
    this._key = KeyTest;
    this.parentIndex = index;
  }
}
export class DTElementStubExtended extends DTElementStub {
  private propString: string;

  private propArray: string[];

  private propNumber: number;

  private propBoolean: boolean;

  private propObject: Record<string, unknown>;

  private propMeta: Record<string, unknown>;

  getPropString(): string {
    return this.propString;
  }

  setPropString(propString: string): void {
    this.propString = propString;
  }

  getPropArray(): string[] {
    return this.propArray;
  }

  setPropArray(propArray: string[]): void {
    this.propArray = propArray;
  }

  getPropNumber(): number {
    return this.propNumber;
  }

  setPropNumber(propNumber: number): void {
    this.propNumber = propNumber;
  }

  getPropBoolean(): boolean {
    return this.propBoolean;
  }

  setPropBoolean(propBoolean: boolean): void {
    this.propBoolean = propBoolean;
  }

  getPropObject(): Record<string, unknown> {
    return this.propObject;
  }

  setPropObject(propObject: Record<string, unknown>): void {
    this.propObject = propObject;
  }

  getPropMeta(): Record<string, unknown> {
    return this.propMeta;
  }

  setPropMeta(propMeta: Record<string, unknown>): void {
    this.propMeta = propMeta;
  }
}
