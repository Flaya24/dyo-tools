import { DTBunch, DTComponent } from '../index';
import DYOToolsElement from '../core/DTElement';

/** Constants Enum * */
export enum FilterOperatorType {
  EQ = '$eq',
  IN = '$in',
  NIN = '$nin',
  NE = '$ne',
  LTE = '$lte',
  GTE = '$gte',
  CONTAINS = '$contains',
  NCONTAINS = '$ncontains',
}

/** Common Types * */
export type StandardPrimitiveType = string | number | boolean | null | undefined;
export type StandardPrimitiveTypeWithArray = string | number | boolean | Array<string | number | boolean> | null | undefined;

/** DYO Finder interfaces * */
export type DYOFinderConfiguration = Record<string, DYOFinderConfigurationProp>;
export type DYOFinderComponentType = DTComponent & {
  getAll: () => DTComponent[],
};

export interface DYOFinderConfigurationPropDefault {
  operators: FilterOperatorType[],
  getValue: (item: DTComponent, ctx?: DTComponent) => StandardPrimitiveType,
  objectSearch: false,
}

export interface DYOFinderConfigurationPropObjectSearch {
  operators: FilterOperatorType[],
  getValue: (item: DTComponent, ctx?: DTComponent) => Record<string, StandardPrimitiveTypeWithArray>,
  objectSearch: true,
}
export type DYOFinderConfigurationProp = DYOFinderConfigurationPropDefault | DYOFinderConfigurationPropObjectSearch;

export interface DYOFinderFilterOperatorBase {
  [FilterOperatorType.EQ]: StandardPrimitiveType
  [FilterOperatorType.IN]: Array<StandardPrimitiveType>
  [FilterOperatorType.NIN]: Array<StandardPrimitiveType>
  [FilterOperatorType.NE]: StandardPrimitiveType
}
export interface DYOFinderFilterOperatorAdvanced {
  [FilterOperatorType.LTE]: number
  [FilterOperatorType.GTE]: number
  [FilterOperatorType.CONTAINS]: StandardPrimitiveType
  [FilterOperatorType.NCONTAINS]: StandardPrimitiveType
}

export type DYOFinderFilterOperator = DYOFinderFilterOperatorBase & DYOFinderFilterOperatorAdvanced;
export type DYOFinderFilterOperatorArgument = Partial<DYOFinderFilterOperator | Record<string, Partial<DYOFinderFilterOperator>>>;
export type DYOFinderFilters = Record<string, DYOFinderFilterOperatorArgument>;

/** DTComponent interfaces * */
/**
 * DTComponent default options configuration.
 */
export interface DTComponentOptions {
  /**
   * Default *false*. If *true*, no exception is thrown when an error occurred, a new DTError instance is
   * added to the _errors property array instead. If *false*, throw the exception with a DTError instance.
   */
  errors: boolean
}

export interface DTComponentToObject {
  id: string
  key: string
  type: string
}

/** DTComponentWithMeta interfaces * */
export type DTAcceptedMetaData = Record<
string,
StandardPrimitiveTypeWithArray
>;

/** DTElement interfaces * */
export interface DTElementToObject<IComponentMeta> extends DTComponentToObject {
  owner?: string
  meta?: Partial<IComponentMeta>
}

/** DTBunch interfaces * */
/**
 * DTBunch option configuration.
 */
export interface DTBunchOptions extends DTComponentOptions {
  /**
   * Default *false*. If *true*, an error occurred when adding a new DTElement with the same key of an
   * existing element into the bunch.
   */
  uniqueKey: boolean
  /**
   * Default *false*. If *true*, when a new DTElement is added, the owner of this element becomes
   * automatically the current bunch owner.
   */
  replaceIndex: boolean
  /**
   * Default *false*. If *true*, the context is not changed when a new DTElement is added.
   * If *false*, when a new DTElement is added, the context of this element becomes automatically the current bunch instance
   * and the element is removed from the old context Component (if defined).
   */
  inheritOwner: boolean
  /**
   * Default *false*. If *true*, when a new DTElement is added at existing index (using **addAtIndex**
   * or **addManyAtIndex** method), this component replaces the old one. If *false*, this component is added at the specified
   * index and other existing component are reindexed with the following index.
   */
  virtualContext: boolean
}

export interface DTBunchToObject<IComponentMeta> extends DTComponentToObject {
  items: Array<DTElementToObject<DTAcceptedMetaData>>
  owner?: string
  meta?: Partial<IComponentMeta>
}

export interface DTBunchFilters {
  id: Partial<DYOFinderFilterOperatorBase>
  key: Partial<DYOFinderFilterOperatorBase>
  context: Partial<DYOFinderFilterOperatorBase>
  owner: Partial<DYOFinderFilterOperatorBase>
  meta: Record<string, Partial<DYOFinderFilterOperatorAdvanced>>
}

/** DTPlayer interfaces * */
export interface DTPlayerToObject<IComponentMeta> extends DTComponentToObject {
  meta?: Partial<IComponentMeta>
}

/** DTManager interfaces * */
export type DTManagerItemsType<IBunchItem extends DYOToolsElement<DTAcceptedMetaData>> = Record<string, DTManagerItemType<IBunchItem>>;
export type DTManagerItemType<IBunchItem extends DYOToolsElement<DTAcceptedMetaData>> = {
  scope: string,
  item: DTBunch<IBunchItem>,
};

export interface DTManagerFilters extends DYOFinderFilters {
  id: Partial<DYOFinderFilterOperatorBase>
  key: Partial<DYOFinderFilterOperatorBase>
  owner: Partial<DYOFinderFilterOperatorBase>
  scope: Partial<DYOFinderFilterOperatorBase>
  meta: Record<string, Partial<DYOFinderFilterOperatorAdvanced>>
}

/**
 * DTManager option configuration.
 */
export interface DTManagerOptions extends DTComponentOptions {
  /**
   * Default *false*. If *true*, when a bunch instance is removed from the Manager _items, the process performs also
   * a removal from the Manager Library of all DTElement instances of the bunch.
   */
  libraryDeletion: boolean,
}

export interface DTManagerToObject extends DTComponentToObject {
  items: Array<DTBunchToObject<DTAcceptedMetaData> & { scope: string }>
}
