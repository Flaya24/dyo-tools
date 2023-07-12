import {DTComponentWithMeta} from '../../src';
import {DTAcceptedMetaData} from "../../src/types";

/******************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * *****/
// Test meta data interface
export interface IMetaDataTest extends DTAcceptedMetaData {
  name: string,
  queen: boolean,
  kd: number[],
  rank?: number,
  tribes?: string[]
}

// Global properties
export const IDTest = "DTComponentWithMeta-id-1234567";
export const KeyTest = "DTComponentWithMeta-key-1234567";
export const ComponentTypeTest = 'DTComponentWithMeta-componentType-test';
export const ToObjectTest = { type: "DTComponentWithMeta-test-toObject" };
export const ToStringTest = "DTComponentWithMeta-test-toString";

// Specific components tests meta-data
export const HaileiMetaData: IMetaDataTest = {
  name: 'Hailei Dorcan Kazan',
  queen: true,
  kd: [47, 1],
  rank: 1,
  tribes: ['Peuple de Salta', 'Fils de Salta', 'Peuple Kanti'],
};
export const MeldrineMetaData: IMetaDataTest = {
  name: 'Meldrine Goldmane',
  queen: false,
  kd: [53, 0],
  rank: 2,
  tribes: ['Lodaniens'],
};
export const MaydenaMetaData: IMetaDataTest = {
  name: "Maydena 'Intan Kazan",
  queen: true,
  kd: [29, 0],
  tribes: ['Exil rouge', 'Désolation'],
};
export const IldressMetaData: IMetaDataTest = {
  name: 'Electel Ildress',
  queen: false,
  kd: [19, 1],
  rank: 3,
};
export const YssaliaMetaData: IMetaDataTest = {
  name: 'Yssalia du Gillit',
  queen: true,
  kd: [23, 0],
};

// Player default value
export const PlayerMetaData: IMetaDataTest = {
  name: 'Llhôonn',
  queen: true,
  kd: [0, 0],
}

// Bunch default value
export const BunchMetaData: IMetaDataTest = {
  name: 'Elementary Pentacle',
  queen: true,
  kd: [117, 3],
};

/******************** STUB ABSTRACT IMPLEMENTATION
 * Implementation of abstract component class for tests
 * *****/
export class DTComponentWithMetaImpl extends DTComponentWithMeta<IMetaDataTest> {
    protected _componentType: string = ComponentTypeTest;

    copy(): DTComponentWithMeta<IMetaDataTest> {
      return this;
    }

    toObject(): any {
      return ToObjectTest;
    }

    toString(): string {
      return ToStringTest;
    }
}

/******************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * *****/
export class DTComponentWithMetaTest extends DTComponentWithMetaImpl {
  th_get_meta(): Partial<IMetaDataTest> {
    return this._meta;
  }

  th_set_meta(meta: Partial<IMetaDataTest>): void {
    this._meta = meta;
  }
}

/******************** HELPER METHODS
 * Additional helper methods to use with testing
 * *****/
// Mocked implementations for overridden methods (for children tests)
export function mockOverriddenMethods(mock: any) {
  // Constructor
  mock.prototype.constructor.mockImplementation(function (key?: string) {
    this._id = IDTest;
    this._key = key || this._id;
    this._errors = [];
    return this;
  })
}
