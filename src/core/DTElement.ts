import DYOToolsComponentWithMeta from './DTComponentWithMeta';
import DYOToolsPlayer from './DTPlayer';
import { DTAcceptedMetaData, DTElementToObject } from '../types';
import DYOToolsComponentPhysical from "./DTComponentPhysical";

export default class DYOToolsElement<
  IComponentMeta extends DTAcceptedMetaData,
  > extends DYOToolsComponentPhysical<IComponentMeta> {
  /**
   * Defining component type to "element".
   */
  protected _componentType = 'element';

  /**
   * DTPlayer instance who owns the current element
   */
  private _owner?: DYOToolsPlayer<DTAcceptedMetaData>;

  /**
   * Getter for _owner property.
   */
  getOwner(): DYOToolsPlayer<DTAcceptedMetaData> {
    return this._owner;
  }

  /**
   * Setter for _owner property.
   */
  setOwner(value: DYOToolsPlayer<DTAcceptedMetaData>): void {
    this._owner = value;
  }

  /**
   * Remove the current owner of element.
   */
  removeOwner(): void {
    this._owner = undefined;
  }

  /**
   * Create and return a new DTElement instance by applying from current instance :
   * - Copy _key property
   * - Copy _meta property
   *
   * @returns New DTElement instance copied.
   */
  copy(): DYOToolsElement<IComponentMeta> {
    const copyElement = new DYOToolsElement<IComponentMeta>(this._key);
    copyElement.setManyMeta({ ...this.getManyMeta() });

    return copyElement;
  }

  /**
   * Return JSON Object representation of the Element instance.
   *
   * JSON Object returned has the following structure :
   * * **id** : _id property of the Element.
   * * **key** : _key property of the Element.
   * * **type** : _componentType property of the Element.
   * * **owner** : String representation of the current _owner property of the Element (only if defined).
   * * **meta** : JSON Object of all current metadata in _meta property of the Element (only if not empty).
   *
   * @returns JSON Object representation of the Element.
   */
  toObject(): DTElementToObject<IComponentMeta> {
    const objectElement: DTElementToObject<IComponentMeta> = {
      id: this._id,
      key: this._key,
      type: this._componentType,
    };

    if (this._owner) {
      objectElement.owner = this._owner.toString();
    }

    if (this._meta && Object.keys(this._meta).length > 0) {
      objectElement.meta = { ...this.getManyMeta() };
    }

    return objectElement;
  }

  /**
   * Return String representation of the Element instance.
   *
   * @returns String representation of the Element.
   */
  toString(): string {
    let ownerKey = '';
    if (this._owner) {
      ownerKey = ` - Owner: ${this._owner.getKey()}`;
    }

    return `Component ${this._key} - Type: Element${ownerKey}`;
  }

  do(): void {
  }
}
