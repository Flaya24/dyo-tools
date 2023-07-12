import * as uuid from 'uuid';
import DYOToolsError from './DTError';
import { DTComponentOptions } from '../types';

/**
 * @template {string} DTComponentOptions
 */
export default abstract class DYOToolsComponent<IComponentOptions extends DTComponentOptions = DTComponentOptions> {
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
   * Array of current errors for the Component.
   *
   * Errors are only available if the **errors** option is enabled.
   */
  protected _errors: DYOToolsError[];

  /**
   * Component options configuration.
   * Defined by generic type IComponentOptions.
   *
   * For all component, global option can be :
   * * **errors** : Default *false*. If *true*, no exception is thrown when an error occurred, a new DTError instance is
   * added to the _errors property array instead. If *false*, throw the exception with a DTError instance.
   */
  protected _options: IComponentOptions;

  /**
   * Set automatic unique _id and _key.
   *
   * @param key Optional Key to set. If not provided, set the _key with the _id value.
   * @param options Specific options configuration for the instance. Default empty object.
   */
  constructor(key?: string, options: Partial<IComponentOptions> = {}) {
    this._id = uuid.v4();
    this._key = key || this._id;
    this._errors = [];

    const defaultOptions: DTComponentOptions = {
      errors: false,
    };
    this._options = {
      ...defaultOptions,
      ...options,
    } as IComponentOptions;
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
  getContext<IContext extends DYOToolsComponent = DYOToolsComponent>(contextType?: string): IContext | undefined {
    if (this._context) {
      if (!contextType || this._context.getComponentType() === contextType) {
        return this._context as IContext;
      }
      return this._context.getContext(contextType);
    }
    return undefined;
  }

  /**
   * Setter for _context property.
   */
  setContext<IContext extends DYOToolsComponent = DYOToolsComponent>(value: IContext): void {
    this._context = value;
  }

  /**
   * Remove the current context of component.
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
   * Getter for _errors property.
   *
   * Note : Errors are always provided by the higher order component, defined into the _context property.
   */
  getErrors(): DYOToolsError[] {
    if (this.getContext()) {
      return this.getContext().getErrors();
    }
    return this._errors;
  }

  /**
   * Return the last error (most recent) of the current component. Undefined if _errors is empty.
   *
   * Note : Errors are always provided by the higher order component, defined into the _context property.
   */
  getLastError(): DYOToolsError | undefined {
    if (this.getContext()) {
      return this.getContext().getLastError();
    }
    return this._errors.length > 0 ? this._errors[this._errors.length - 1] : undefined;
  }

  /**
   * Generic method to trigger an error, depending on the **errors** option :
   * * if the option is set to *false*, throw the DTError instance passed as an argument.
   * * if the option is set to *true*, add DTError instance passed as an argument in the _errors array.
   *
   * Note : Errors are always stored into the higher order component, defined into the _context property.
   *
   * @param error DYOToolsError instance to trigger
   */
  triggerError(error: DYOToolsError): void {
    const { errors = false } = this._options;
    if (this.getContext()) {
      this.getContext().triggerError(error);
    } else if (!errors) {
      throw error;
    } else {
      this._errors.push(error);
    }
  }

  /**
   * Clear all current errors.
   *
   * Note : Errors are always stored into the higher order component, defined into the _context property.
   */
  clearErrors(): void {
    if (this.getContext()) {
      this.getContext().clearErrors();
    }
    this._errors = [];
  }

  /**
   * Getter for _options property.
   */
  getOptions(): IComponentOptions {
    return this._options;
  }

  /**
   * Abstract method for JSON Object representation of the component and returning it.
   */
  abstract toObject(): unknown;

  /**
   * Abstract method for String representation of the component and returning it.
   */
  abstract toString(): string;
}
