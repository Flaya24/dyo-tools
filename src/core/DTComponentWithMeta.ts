import DYOToolsComponent from './DTComponent';
import { DTAcceptedMetaData, DTComponentOptions } from '../types';

export default abstract class DYOToolsComponentWithMeta<
  IComponentMeta extends DTAcceptedMetaData,
  IComponentOptions extends DTComponentOptions = DTComponentOptions,
  > extends DYOToolsComponent<IComponentOptions> {
  /**
   * Component meta data.
   * Defined by generic type IComponentMeta.
   * @default {}
   */
  protected _meta : Partial<IComponentMeta> = {} as Partial<IComponentMeta>;

  /**
   * Getter for one meta by key.
   *
   * @param metaKey Key name of one meta data.
   *
   * @returns Associated meta **metaKey** value or undefined if not found.
   */
  getMeta<K extends keyof IComponentMeta>(metaKey : K) : IComponentMeta[K] | undefined {
    return this._meta && this._meta[metaKey];
  }

  /**
   * Setter for one meta by key.
   *
   * @param metaKey Key name of the meta data to update.
   * @param metaValue New value to set into the meta data.
   */
  setMeta<K extends keyof IComponentMeta>(metaKey : K, metaValue : IComponentMeta[K]) : void {
    this._meta[metaKey] = metaValue;
  }

  /**
   * Returns multiple defined keys values of meta data.
   *
   * @param metaKeys Array of keys to filter for meta data. If not provided or empty, returns all keys.
   *
   * @returns Meta data object with **metaKeys** provided keys only.
   */
  getManyMeta(metaKeys : Array<keyof IComponentMeta> = []) : Partial<IComponentMeta> {
    const arrayMeta: Partial<IComponentMeta> = {} as Partial<IComponentMeta>;
    if (!metaKeys.length) {
      return this._meta;
    }

    metaKeys.forEach((key) => {
      if (this._meta && this._meta[key]) {
        arrayMeta[key] = this._meta[key];
      }
    });
    return arrayMeta;
  }

  /**
   * Set multiple meta data.
   *
   * @param metaValues Object of meta data to set, according to the meta data property type.
   */
  setManyMeta(metaValues : Partial<IComponentMeta>) : void {
    this._meta = { ...this._meta, ...metaValues };
  }
}
