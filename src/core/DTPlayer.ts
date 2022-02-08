import DYOToolsComponentWithMeta from './DTComponentWithMeta';
import { DTAcceptedMetaData, DTPlayerToObject } from '../types';

export default class DYOToolsPlayer<IComponentMeta extends DTAcceptedMetaData> extends DYOToolsComponentWithMeta<IComponentMeta> {
  /**
   * Defining component type to "player".
   */
  protected _componentType = 'player';

  /**
   * Create and return a new DTPlayer instance by applying from current instance :
   * - Copy _key property
   * - Copy _meta property
   *
   * @returns New DTPlayer instance copied.
   */
  copy(): DYOToolsPlayer<IComponentMeta> {
    const copyElement = new DYOToolsPlayer<IComponentMeta>(this._key);
    copyElement.setManyMeta({ ...this.getManyMeta() });

    return copyElement;
  }

  /**
   * Return JSON Object representation of the Player instance.
   *
   * JSON Object returned has the following structure :
   * * **id** : _id property of the Player.
   * * **key** : _key property of the Player.
   * * **type** : _componentType property of the Player.
   * * **meta** : JSON Object of all current metadata in _meta property of the Player (only if not empty).
   *
   * @returns JSON Object representation of the Player.
   */
  toObject(): DTPlayerToObject<IComponentMeta> {
    const objectPlayer: DTPlayerToObject<IComponentMeta> = {
      id: this._id,
      key: this._key,
      type: this._componentType,
    };

    if (this._meta && Object.keys(this._meta).length > 0) {
      objectPlayer.meta = { ...this.getManyMeta() };
    }

    return objectPlayer;
  }

  /**
   * Return String representation of the Player instance.
   *
   * @returns String representation of the Player.
   */
  toString(): string {
    return `Component ${this._key} - Type: Player`;
  }
}
