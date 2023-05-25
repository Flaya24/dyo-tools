import { DTBunch } from '../index';

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

/** DTComponent interfaces * */
export interface DTComponentOptions {
  errors: boolean
}

export interface DTComponentToObject {
  id: string
  key: string
  type: string
}

/** DTComponentWithMeta interfaces * */
export type DTAcceptedMetaDataValue = string | number | boolean | Array<string | number | boolean> | undefined;
export type DTAcceptedMetaData = Record<
string,
DTAcceptedMetaDataValue
>;

/** DTElement interfaces * */
export interface DTElementToObject<IComponentMeta> extends DTComponentToObject {
  owner?: string
  meta?: Partial<IComponentMeta>
}

/** DTBunch interfaces * */
export interface DTBunchOptions extends DTComponentOptions {
  uniqueKey: boolean
  replaceIndex: boolean
  inheritOwner: boolean
  virtualContext: boolean
}

export interface DTBunchToObject<IComponentMeta> extends DTComponentToObject {
  items: Array<DTElementToObject<DTAcceptedMetaData>>
  owner?: string
  meta?: Partial<IComponentMeta>
}

export type DTBunchFilterWithBaseOperator = {
  [FilterOperatorType.EQ]: StandardPrimitiveType
  [FilterOperatorType.IN]: Array<StandardPrimitiveType>
  [FilterOperatorType.NIN]: Array<StandardPrimitiveType>
  [FilterOperatorType.NE]: StandardPrimitiveType
};
export interface DTBunchFilterWithMetaOperator extends DTBunchFilterWithBaseOperator {
  [FilterOperatorType.LTE]: number
  [FilterOperatorType.GTE]: number
  [FilterOperatorType.CONTAINS]: StandardPrimitiveType
  [FilterOperatorType.NCONTAINS]: StandardPrimitiveType
}
export interface DTBunchFilters {
  id: Partial<DTBunchFilterWithBaseOperator>
  key: Partial<DTBunchFilterWithBaseOperator>
  context: Partial<DTBunchFilterWithBaseOperator>
  owner: Partial<DTBunchFilterWithBaseOperator>
  meta: Record<string, Partial<DTBunchFilterWithMetaOperator>>
}

/** DTPlayer interfaces * */
export interface DTPlayerToObject<IComponentMeta> extends DTComponentToObject {
  meta?: Partial<IComponentMeta>
}

/** DTManager interfaces * */
export type DTManagerItemsType = Record<string, DTManagerItemType>;
export type DTManagerItemType = {
  scope: string,
  item: DTBunch<any, any>,
};

/** DYO Finder interfaces * */

export type StandardPrimitiveType = string | number | boolean | null;
export type DYOFinderConfiguration = Record<string, DYOFinderConfigurationProp>;

export interface DYOFinderConfigurationProp {
  operators: FilterOperatorType[],
  getValue: (item: any) => StandardPrimitiveType,
  objectSearch?: boolean,
}

export interface DYOFinderFilterOperator {
  [FilterOperatorType.EQ]: StandardPrimitiveType
  [FilterOperatorType.IN]: Array<StandardPrimitiveType>
  [FilterOperatorType.NIN]: Array<StandardPrimitiveType>
  [FilterOperatorType.NE]: StandardPrimitiveType
  [FilterOperatorType.LTE]: number
  [FilterOperatorType.GTE]: number
  [FilterOperatorType.CONTAINS]: StandardPrimitiveType
  [FilterOperatorType.NCONTAINS]: StandardPrimitiveType
}
export type DYOFinderFilters = Record<string, Partial<DYOFinderFilterOperator |  Record<string, Partial<DYOFinderFilterOperator>>>>;
