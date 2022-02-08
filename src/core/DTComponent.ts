import * as uuid from 'uuid';

export default abstract class DYOToolsComponent {
  /**
   * Component unique ID. Use uuid v4 generator.
   */
  protected _id: string;

  /**
   * Component specific and accessible label.
   * If not provided, the key is set with ID by default.
   */
  protected _key: string;

  /**
   * Component Parent Context.
   *
   * A component can have only one *physical context*, and be managed by a parent Component.
   */
  protected _context?: DYOToolsComponent;

  /**
   * Higher Level Component category.
   *
   * Describing component Type, like Element, Bunch, Manager...
   */
  protected abstract _componentType: string;

  /**
   * Second Level Component category.
   *
   * Describing component Domain, like Card, Dice, Token...
   */
  protected _domain?: string;

  /**
   * Third Level Component category.
   *
   * Describing component extra type, like Hand, Deck, Trick...
   */
  protected _subKind?: string;

  /**
   * Set automatic unique _id and _key.
   *
   * @param key Optional Key to set. If not provided, set the _key with the _id value.
   */
  constructor(key?: string) {
    this._id = uuid.v4();
    this._key = key || this._id;
  }

  /**
   * Getter for _id property.
   */
  getId(): string {
    return this._id;
  }

  /**
   * Getter for _key property.
   */
  getKey(): string {
    return this._key;
  }

  /**
   * Getter for _context property.
   *
   * @param contextType If provided, the getter parse all component level hierarchy to find the corresponding component
   * with **contextType** as _componentType value, and returns it. Return undefined if not found.
   *
   * @returns Direct parent Component or higher level Component if filtered with **contextType**.
   * Returns undefined if context doesn't exist.
   */
  getContext(contextType?: string): DYOToolsComponent | undefined {
    if (this._context) {
      if (!contextType || this._context.getComponentType() === contextType) {
        return this._context;
      }
      return this._context.getContext(contextType);
    }
    return undefined;
  }

  /**
   * Setter for _context property.
   */
  setContext(value: DYOToolsComponent): void {
    this._context = value;
  }

  /**
   * Remove the current context of component
   */
  removeContext(): void {
    this._context = undefined;
  }

  /**
   * Getter for _componentType property.
   */
  getComponentType(): string {
    return this._componentType;
  }

  /**
   * Getter for _domain property.
   */
  getDomain(): string {
    return this._domain;
  }

  /**
   * Getter for _subKind property.
   */
  getSubKind(): string {
    return this._subKind;
  }

  /**
   * Abstract method for copying the Component and returning it.
   */
  abstract copy(): DYOToolsComponent;

  /**
   * Abstract method for JSON Object representation of the component and returning it.
   */
  abstract toObject(): unknown;

  /**
   * Abstract method for String representation of the component and returning it.
   */
  abstract toString(): string;
}
