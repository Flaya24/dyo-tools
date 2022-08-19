import { DTAcceptedMetaData } from "../types";
import DYOToolsComponentWithMeta from "./DTComponentWithMeta";
import DYOToolsPlayer from "./DTPlayer";

export default abstract class DYOToolsComponentPhysical<
  IComponentMeta extends DTAcceptedMetaData,
  > extends DYOToolsComponentWithMeta<IComponentMeta> {

  private _owner?: DYOToolsPlayer<DTAcceptedMetaData>;

  private _events?: any;

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
   * Abstract method for copying the Component and returning it.
   */
  abstract copy(): DYOToolsComponentPhysical<IComponentMeta>;

  addEvent(): void {

  }

  removeEvent(): void {

  }

  validEvents(): void {

  }

  triggerEvent(): void {

  }

  abstract do(): void;
}
