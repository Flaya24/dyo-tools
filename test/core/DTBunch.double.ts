import { jest } from '@jest/globals';
import {DTBunch, DTComponentPhysical} from '../../src';
import {
  HaileiMetaData,
  IldressMetaData,
  IMetaDataTest,
  MaydenaMetaData,
  MeldrineMetaData,
  YssaliaMetaData,
} from './DTComponentWithMeta.double';
import DYOToolsElement from '../../src/core/DTElement';
import { DTBunchOptionsConstructor, DTElementToObject } from '../../src/types';
import Mocked = jest.Mocked;
import {mockOverriddenMethods} from "./DTComponentPhysical.double";
import {
  HaileiIdTest,
  HaileiKeyTest,
  HaileiToObjectTest,
  IldressIdTest,
  IldressKeyTest,
  IldressToObjectTest,
  MaydenaIdTest,
  MaydenaKeyTest,
  MaydenaToObjectTest,
  MeldrineIdTest,
  MeldrineKeyTest,
  MeldrineToObjectTest, YssaliaIdTest, YssaliaKeyTest, YssaliaToObjectTest
} from "./DTElement.double";

/******************** MOCK DEPENDENCIES
 * Dependencies used by the component are mocked with Jest
 * *****/
jest.mock('../../src/core/DTElement');
jest.mock('../../src/core/DTError');
jest.mock('../../src/utils/filters');
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTComponentWithMeta');
jest.mock('../../src/core/DTComponentPhysical');
// Add specific mock for inherited methods to have a basic implementation
mockOverriddenMethods(DTComponentPhysical);
// inheritance method : Check the correct inheritance
export const inheritance = () => {
  return DTBunch.prototype instanceof DTComponentPhysical;
}

/******************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * *****/
export const IDTest = 'DTBunch-id-1234567';
export const KeyTest = 'DTBunch-key-1234567';
export const defaultOptions: DTBunchOptionsConstructor = {
  errors: false,
  uniqueKey: false,
  inheritOwner: false,
  replaceIndex: false,
  virtualContext: false,
};

/******************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * *****/
export class DTBunchTest extends DTBunch<Mocked<DYOToolsElement<IMetaDataTest>>, IMetaDataTest> {
  th_get_componentType(): string {
    return this._componentType;
  }

  th_get_items(): Mocked<DYOToolsElement<IMetaDataTest>>[] {
    return this._items;
  }

  th_set_items(items: Mocked<DYOToolsElement<IMetaDataTest>>[]): void {
    this._items = items;
  }
}

/******************** STUB CLASS
 * Stub class, for using in other component
 * *****/
export class DTBunchStub extends DTBunch<Mocked<DYOToolsElement<IMetaDataTest>>, IMetaDataTest> {
  constructor(items: Array<Mocked<DYOToolsElement<IMetaDataTest>>> = [], options: Partial<DTBunchOptionsConstructor> = {}) {
    super();
    this._id = IDTest;
    this._key = KeyTest;
    this._errors = [];
    this._globalOptions = { ...defaultOptions, ...options };
    this._items = items;
  }

  getId(): string {
    return IDTest;
  }

  getKey(): string {
    return KeyTest;
  }

  getAllKeys(): string[] {
    return this._items.map((item: DYOToolsElement<IMetaDataTest>) => item.getKey());
  }
}

/******************** HELPER METHODS
 * Additional helper methods to use with testing
 * *****/

// Function to generate Mocked DTElement collection
export const generateMockedElements = (numberElements: number): Array<Mocked<DYOToolsElement<IMetaDataTest>>> => {
  const mockedElements = [];
  const mockedData: Array<{ id: string, key: string, meta: IMetaDataTest, toObject: DTElementToObject<IMetaDataTest> }> = [
    {
      id: HaileiIdTest,
      key: HaileiKeyTest,
      meta: HaileiMetaData,
      toObject: HaileiToObjectTest,
    },
    {
      id: MeldrineIdTest,
      key: MeldrineKeyTest,
      meta: MeldrineMetaData,
      toObject: MeldrineToObjectTest,
    },
    {
      id: MaydenaIdTest,
      key: MaydenaKeyTest,
      meta: MaydenaMetaData,
      toObject: MaydenaToObjectTest,
    },
    {
      id: IldressIdTest,
      key: IldressKeyTest,
      meta: IldressMetaData,
      toObject: IldressToObjectTest,
    },
    {
      id: YssaliaIdTest,
      key: YssaliaKeyTest,
      meta: YssaliaMetaData,
      toObject: YssaliaToObjectTest,
    },
  ];

  for (let i = 0; i < numberElements; i++) {
    const mockedElement = new DYOToolsElement() as Mocked<DYOToolsElement<IMetaDataTest>>;
    const selectedMock = i % 5;

    mockedElement.getId.mockReturnValue(`${mockedData[selectedMock].id}-${i}`);
    mockedElement.getKey.mockReturnValue(mockedData[selectedMock].key);
    mockedElement.getManyMeta.mockReturnValue(mockedData[selectedMock].meta);
    mockedElement.setContext.mockImplementation(function (context) {
      this._context = context;
    });
    mockedElement.getContext.mockImplementation(function () {
      return this._context;
    });
    mockedElement.setOwner.mockImplementation(function (owner) {
      this._owner = owner;
    });
    mockedElement.getOwner.mockImplementation(function () {
      return this._owner;
    });
    mockedElement.copy.mockReturnValue(mockedElement);
    mockedElement.toObject.mockReturnValue(mockedData[selectedMock].toObject);

    mockedElements.push(mockedElement);
  }

  return mockedElements;
};


