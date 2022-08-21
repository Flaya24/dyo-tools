import {DTComponent, DTComponentWithMeta} from '../../src';
import {DTAcceptedMetaData} from "../../src/types";
import {jest} from "@jest/globals";
import {IDTest, mockOverriddenMethods as parentMockMethods} from "./DTComponent.double";

// Global test variables
export const ComponentTypeTest = 'DTComponentWithMeta-componentType-test';

// Test meta data interface
export interface IMetaDataTest extends DTAcceptedMetaData {
    name: string,
    queen: boolean,
    kd: number[],
    rank?: number,
    tribes?: string[]
}

// Elementary pentacle default values
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

// Mock Inheritance
jest.mock('../../src/core/DTComponent');
parentMockMethods(DTComponent);

export const inheritance = () => {
  return DTComponentWithMeta.prototype instanceof DTComponent;
}

// Test Child for DTComponentWithMeta class (mocked abstract methods)
export class DTComponentWithMetaTest extends DTComponentWithMeta<IMetaDataTest> {
    protected _componentType: string = ComponentTypeTest;

    copy(): DTComponentWithMeta<IMetaDataTest> {
      return this;
    }

    toObject(): any {
      return {};
    }

    toString(): string {
      return '';
    }
}

// Mock constructor for DTComponentTest class (getter tests)
export class DTComponentWithMetaTestMock extends DTComponentWithMetaTest {
  constructor(defaultMeta?: IMetaDataTest) {
    super();
    if (defaultMeta) {
      this._meta = { ...defaultMeta };
    }
  }
}

// Mocked implementations for overridden methods (for children tests)
export function mockOverriddenMethods(mock: any) {
}
