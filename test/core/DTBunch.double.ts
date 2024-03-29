import { DTBunch, DTComponent } from '../../src';
import { bunchDefaultOptions as DTBunchDefaultOptions } from '../../src/constants';
import {
  HaileiMetaData,
  IldressMetaData,
  IMetaDataTest,
  MaydenaMetaData,
  MeldrineMetaData,
  YssaliaMetaData,
} from './DTComponentWithMeta.double';
import DYOToolsElement from '../../src/core/DTElement';
import { DTBunchOptions, DTElementToObject } from '../../src/types';
import Mocked = jest.Mocked;
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
  MeldrineToObjectTest, YssaliaIdTest, YssaliaKeyTest, YssaliaToObjectTest,
} from './DTElement.double';
import { DTErrorStub } from './DTError.double';
import { DTPlayerStub } from './DTPlayer.double';
import DYOFinder from '../../src/libs/DYOFinder';

/** ****************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * **** */
// Global Bunch constants
export const IDTest = 'DTBunch-id-1234567';
export const IDTestLibrary = 'DTBunch-id-library-1234567';
export const KeyTest = 'DTBunch-key-1234567';
export const defaultOptions: DTBunchOptions = DTBunchDefaultOptions;

// Specific Bunch constants
export const bunch1IdTest = `${IDTest}_1`;
export const bunch1toObjectTest = {
  id: bunch1IdTest, key: 'bunch1-key-test', type: 'bunch', items: [HaileiToObjectTest],
};
export const bunch2IdTest = `${IDTest}_2`;
export const bunch2toObjectTest = {
  id: bunch2IdTest, key: 'bunch2-key-test', type: 'bunch', items: [],
};
export const bunch3IdTest = `${IDTest}_3`;
export const bunch3toObjectTest = {
  id: bunch3IdTest, key: 'bunch3-key-test', type: 'bunch', items: [],
};

/** ****************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * **** */
export class DTBunchTest extends DTBunch<Mocked<DYOToolsElement<IMetaDataTest>>, IMetaDataTest> {
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

  th_get_context(): DTComponent | undefined {
    return this._context;
  }

  th_set_context(context: DTComponent): void {
    this._context = context;
  }

  th_get_items(): Mocked<DYOToolsElement<IMetaDataTest>>[] {
    return this._items;
  }

  th_set_items(items: Mocked<DYOToolsElement<IMetaDataTest>>[]): void {
    this._items = items;
  }

  th_set_errors(errors: Array<DTErrorStub>): void {
    this._errors = errors;
  }

  th_get_options(): any {
    return this._options;
  }

  th_set_options(options: any): void {
    this._options = {
      ...this._options,
      ...options,
    };
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

  th_get_finder(): DYOFinder {
    return this._finder;
  }
}

/** ****************** STUB CLASS
 * Stub class, for using in other component
 * **** */
export class DTBunchStub extends DTBunchTest {
  constructor(items: Array<Mocked<DYOToolsElement<IMetaDataTest>>> = []) {
    super();
    this._id = IDTest;
    this._key = KeyTest;
    this._errors = [];
    this._items = items;
    this._options = DTBunchDefaultOptions;
  }

  getId(): string {
    return IDTest;
  }

  getKey(): string {
    return KeyTest;
  }

  getAll(): Array<Mocked<DYOToolsElement<IMetaDataTest>>> {
    return this._items;
  }

  getAllKeys(): string[] {
    return this._items.map((item: DYOToolsElement<IMetaDataTest>) => item.getKey());
  }
}

// Specific Stub Library for Manager
export class DTBunchStubLibrary extends DTBunchStub {
  constructor(items: Array<Mocked<DYOToolsElement<IMetaDataTest>>> = []) {
    super(items);
    this._id = IDTestLibrary;
    this._key = 'library';
    this._errors = [];
    this._items = items;
    this._options = {
      ...DTBunchDefaultOptions,
      virtualContext: true,
    };
  }

  getId(): string {
    return IDTestLibrary;
  }

  getKey(): string {
    return 'library';
  }

  get(id: string): Mocked<DYOToolsElement<IMetaDataTest>> | undefined {
    const itemFiltered = this._items.filter((item: Mocked<DYOToolsElement<IMetaDataTest>>) => item.getId() === id);
    return itemFiltered.length > 0 ? itemFiltered[0] : undefined;
  }
}

/** ****************** HELPER METHODS
 * Additional helper methods to use with testing
 * **** */

// Function to generate Mocked DTElement collection
// Warning : DYOToolsElement class must be MOCKED to use this !
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
