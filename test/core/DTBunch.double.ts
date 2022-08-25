import { jest } from '@jest/globals';
import {DTBunch, DTComponentPhysical} from '../../src';
import {
  BunchMetaData,
  HaileiMetaData,
  IldressMetaData,
  IMetaDataTest,
  MaydenaMetaData,
  MeldrineMetaData,
  YssaliaMetaData,
} from './DTComponentWithMeta.double';
import DYOToolsElement from '../../src/core/DTElement';
import { DTBunchOptionsConstructor, DTElementToObject } from '../../src/types';
import { DTErrorStub } from './DTError.double';
import Mocked = jest.Mocked;
import {mockOverriddenMethods} from "./DTComponentPhysical.double";

// Mocking extra Components for using with Bunch
jest.mock('../../src/core/DTElement');
jest.mock('../../src/core/DTError');
jest.mock('../../src/utils/filters');

// Mock Inheritance
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTComponentWithMeta');
jest.mock('../../src/core/DTComponentPhysical');
mockOverriddenMethods(DTComponentPhysical);

export const inheritance = () => {
  return DTBunch.prototype instanceof DTComponentPhysical;
}

// Global Variables
export const IDTest = 'DTBunch-id-1234567';
export const KeyTest = 'DTBunch-key-1234567';

// Default options
export const defaultOptions: DTBunchOptionsConstructor = {
  errors: false,
  uniqueKey: false,
  inheritOwner: false,
  replaceIndex: false,
  virtualContext: false,
};

// Mock Constructor and parent methods for DTElement
export class DTBunchMock extends DTBunch<Mocked<DYOToolsElement<IMetaDataTest>>, IMetaDataTest> {
  constructor(options: Partial<DTBunchOptionsConstructor> = {}) {
    super();
    this._id = IDTest;
    this._key = KeyTest;
    this._errors = [];
    this._globalOptions = { ...defaultOptions, ...options };
    this._items = [];
  }

  getComponentType(): string {
    return this._componentType;
  }

  mockDefineItems(numberItems: number): void {
    this._items = generateMockedElements(numberItems);
  }

  mockDefineOptions(options: Partial<DTBunchOptionsConstructor>): void {
    this._globalOptions = { ...this._globalOptions, ...options };
  }

  mockDefineErrors(errors: Array<DTErrorStub>): void {
    this._errors = errors;
  }

  mockItemGetter(index = 0): Mocked<DYOToolsElement<IMetaDataTest>> | undefined {
    return this._items[index];
  }
}

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

// Function to generate Mocked DTElement for use in parent
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


