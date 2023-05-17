import { DYOFinderConfiguration, FilterOperatorType } from '../../src/types';
import DYOFinder from '../../src/libs/DYOFinder';
import { DTBunchStub } from '../core/DTBunch.double';
import { DTElementStubExtended } from '../core/DTElement.double';

/** ****************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * **** */
const baseOperators = [
  FilterOperatorType.EQ,
  FilterOperatorType.IN,
  FilterOperatorType.NIN,
  FilterOperatorType.NE,
];

const advancedOperators = [
  FilterOperatorType.GTE,
  FilterOperatorType.LTE,
  FilterOperatorType.CONTAINS,
  FilterOperatorType.NCONTAINS,
];

export const DefaultConfiguration: DYOFinderConfiguration = {
  propString: {
    operators: baseOperators,
    getValue: (item: any) => item.getPropString(),
  },
  propArray: {
    operators: baseOperators,
    getValue: (item: any) => item.getPropArray(),
  },
  propNumber: {
    operators: baseOperators,
    getValue: (item: any) => item.getPropNumber(),
  },
  propBoolean: {
    operators: baseOperators,
    getValue: (item: any) => item.getPropBoolean(),
  },
  propObject: {
    operators: baseOperators,
    getValue: (item: any) => item.getPropObject(),
  },
};

/** ****************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * **** */
export default class DYOFinderTest extends DYOFinder {
  th_get_component(): any {
    return this._component;
  }

  th_get_configuration(): DYOFinderConfiguration {
    return this._configuration;
  }
}

/** ****************** STUB CLASS
 * Stub class, for using in other component
 * **** */

/** ****************** HELPER METHODS
 * Additional helper methods to use with testing
 * **** */
export function generateComponent(): DTBunchStub {
  const elementFindStubData = [
    {
      propString: 'item_prime',
      propArray: ['tag1', 'tag2'],
      propNumber: 17,
      propBoolean: true,
      propObject: {
        data: 'value',
      },
    },
    {
      propString: 'item_prime',
      propArray: ['tag1', 'tag2', 'tag3'],
      propNumber: 19,
      propBoolean: false,
      propObject: {
        data: 'value',
      },
    },
    {
      propString: 'item_second',
      propArray: ['tag1', 'tag3'],
      propNumber: 23,
      propBoolean: true,
      propObject: {
        data: 'value',
      },
    },
    {
      propString: 'item_third',
      propArray: ['tag2'],
      propNumber: 17,
      propBoolean: false,
      propObject: null,
    },
    {
      propString: 'item_second',
      propArray: [],
      propNumber: 31,
      propBoolean: true,
      propObject: null,
    },
  ];

  const items = [];
  let itemIndex = 0;
  for (const data of elementFindStubData) {
    const elementStub = new DTElementStubExtended();
    elementStub.parentIndex = itemIndex;
    elementStub.setPropString(data.propString);
    elementStub.setPropArray(data.propArray);
    elementStub.setPropNumber(data.propNumber);
    elementStub.setPropBoolean(data.propBoolean);
    elementStub.setPropObject(data.propObject);

    items.push(elementStub);
    itemIndex += 1;
  }

  return new DTBunchStub(items);
}
