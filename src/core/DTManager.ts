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

  add(item: DYOToolsBunch<any, any>, targetScope?: string): void {
    // Define scope validity
    const { virtualContext } = item.getOptions();
    let scope = 'default';
    if (!targetScope) {
      scope = virtualContext ? 'virtual': 'default';
    } else {
      scope = targetScope;
    }

    // Update Library with new Elements
    if (item.getAll().length) {
      this._library.addMany(item.getAll());
    }

    // Add the new item
    item.setContext<DYOToolsManager>(this);
    this._items[item.getId()] = {
      scope,
      item
    }
  }

  getAll(): any {
    return 1;
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
