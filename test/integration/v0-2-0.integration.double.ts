import {DTBunch, DTElement} from "../../src";
import {IMetaDataTest} from "../core/DTComponentWithMeta.double";
import {DTBunchOptions} from "../../src/types";

export type BunchMetaDataType = {
  visible: boolean,
  kind?: string,
}
export const bunchKey = 'bunch';

export const genBunch = (nb: number = 1, prefix: string = '', items: DTElement<IMetaDataTest>[] = [], options: Partial<DTBunchOptions> = {}): DTBunch<DTElement<IMetaDataTest>, BunchMetaDataType>[] => {
  const bunches = [];
  let i = 1;
  while (i <= nb) {
    bunches.push(new DTBunch<DTElement<IMetaDataTest>, BunchMetaDataType>(key(bunchKey, prefix, i), items, options));
    i++;
  }

  return bunches;
}

export const key = (name: string, prefix: string = '', cpt: number = 0): string => {
  const fullName = cpt ? `${name}_${cpt}` : name;
  return prefix ? `${prefix}_${fullName}` : fullName;
}

export const extractKeysFromBunchList = (items: DTBunch<DTElement<IMetaDataTest>, BunchMetaDataType>[]): string[] => {
  return items.map(( bunch: DTBunch<DTElement<IMetaDataTest>, BunchMetaDataType>) => bunch.getKey() );
}

