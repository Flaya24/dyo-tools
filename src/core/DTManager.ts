import DYOToolsComponent from "./DTComponent";
import DYOToolsBunch from "./DTBunch";
import DYOToolsError from "./DTError";

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
    let scope;
    if (!targetScope) {
      scope = virtualContext ? 'virtual': 'default';
    } else {
      let errorCode: string;
      let errorMessage: string;
      if (!this.isValidScope(targetScope)) {
        errorCode = 'invalid_scope';
        errorMessage = "Scope provided doesn't exist in the manager";
      }
      if (virtualContext && targetScope !== 'virtual') {
        errorCode = 'forbidden_scope';
        errorMessage = "Scope provided cannot be associated to a virtual bunch";
      }
      if (!virtualContext && targetScope === 'virtual') {
        errorCode = 'forbidden_virtual_scope';
        errorMessage = "Virtual Scope provided cannot be associated to a physical bunch";
      }

      if (errorCode && errorMessage) {
        this.triggerError(new DYOToolsError(errorCode, errorMessage, this, item));
        return;
      }
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

  isValidScope(scope: string): boolean {
    return this._scopes.includes(scope);
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
