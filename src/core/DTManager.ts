import DYOToolsComponent from "./DTComponent";
import DYOToolsBunch from "./DTBunch";

export default class DYOToolsManager extends DYOToolsComponent {
  /**
   * Defining component type to "manager".
   */
  protected _componentType = 'manager';

  protected _items: any;

  protected _scopes: any;

  protected _actions: any;

  protected _library: any;

  constructor(key?: string, elements: any[] = [], scopes: string[] = []) {
    super(key);
    // Use default _domain as _key
    this._key = !key ? (this.getDomain() || this._id) : key;

    this._items = {};
    this._scopes = [
      'default',
      'virtual',
      ...scopes
    ];
    this._actions = {};
    this._library = new DYOToolsBunch('library', elements, { virtualContext: true });
  }

  getAll(): any {
    return this._items;
  }

  getScopes(): any {
    return this._scopes;
  }

  getActions(): any {
    return this._actions;
  }

  getLibrary(): any {
    return this._library;
  }

  toString(): string {
    return "";
  }

  toObject(): unknown {
    return undefined;
  }



}
