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
  getValue: (item: any, ctx?: any) => StandardPrimitiveType,
  objectSearch: false,
}

export interface DYOFinderConfigurationPropObjectSearch {
  operators: FilterOperatorType[],
  getValue: (item: any, ctx?: any) => Record<string, StandardPrimitiveTypeWithArray>,
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
export interface DTComponentOptions {
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

export interface DTManagerOptions extends DTComponentOptions {
  libraryDeletion: boolean,
}

export interface DTManagerToObject extends DTComponentToObject {
  items: Array<DTBunchToObject<any> & { scope: string }>
}
