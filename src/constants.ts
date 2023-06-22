import {
  DTAcceptedMetaData,
  DTBunchOptions,
  DTManagerOptions,
  DYOFinderConfiguration,
  FilterOperatorType,
  StandardPrimitiveType,
} from './types';
import {
  DTBunch, DTComponentPhysical, DTElement, DTManager,
} from './index';

/* ********************** CORE CONSTANTS ********************** */
/** DTBunch constants * */
export const bunchDefaultOptions: DTBunchOptions = {
  errors: false,
  uniqueKey: false,
  inheritOwner: false,
  replaceIndex: false,
  virtualContext: false,
};

/** DTManager constants * */
export const managerDefaultOptions: DTManagerOptions = {
  errors: false,
  libraryDeletion: false,
};

/** DYOFinder configuration constants * */
const baseOperators = [
  FilterOperatorType.EQ,
  FilterOperatorType.IN,
  FilterOperatorType.NIN,
  FilterOperatorType.NE,
];
const advancedOperators = [
  ...baseOperators,
  FilterOperatorType.GTE,
  FilterOperatorType.LTE,
  FilterOperatorType.CONTAINS,
  FilterOperatorType.NCONTAINS,
];

export const componentPhysicalDefaultFinderConfiguration: DYOFinderConfiguration = {
  id: {
    operators: baseOperators,
    getValue: (item: DTComponentPhysical<DTAcceptedMetaData>) => item.getId(),
    objectSearch: false,
  },
  key: {
    operators: baseOperators,
    getValue: (item: DTComponentPhysical<DTAcceptedMetaData>) => item.getKey(),
    objectSearch: false,
  },
  owner: {
    operators: baseOperators,
    getValue: (item: DTComponentPhysical<DTAcceptedMetaData>) => (item.getOwner() ? item.getOwner().getId() : null),
    objectSearch: false,
  },
  meta: {
    operators: advancedOperators,
    getValue: (item: DTComponentPhysical<DTAcceptedMetaData>) => item.getManyMeta(),
    objectSearch: true,
  },
};

export const componentManagerDefaultFinderConfiguration: DYOFinderConfiguration = {
  ...componentPhysicalDefaultFinderConfiguration,
  scope: {
    operators: baseOperators,
    getValue(item: DTBunch<DTElement<DTAcceptedMetaData>>, ctx: DTManager<DTElement<DTAcceptedMetaData>>): StandardPrimitiveType {
      return ctx.getScope(item.getId());
    },
    objectSearch: false,
  },
};

export const componentBunchDefaultFinderConfiguration: DYOFinderConfiguration = {
  ...componentPhysicalDefaultFinderConfiguration,
  context: {
    operators: baseOperators,
    getValue: (item: DTComponentPhysical<DTAcceptedMetaData>) => (item.getContext() ? item.getContext().getId() : null),
    objectSearch: false,
  },
};
