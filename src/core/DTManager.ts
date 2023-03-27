import DYOToolsComponent from "./DTComponent";
import DYOToolsBunch from "./DTBunch";
import DYOToolsError from "./DTError";
import {DTManagerItemsType} from "../types";

export default class DYOToolsManager extends DYOToolsComponent {
  /**
   * Defining component type to "manager".
   */
  protected _componentType = 'manager';

  protected _items: DTManagerItemsType;

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
    // Id conflict
    if (Object.keys(this._items).includes(item.getId())) {
      this.triggerError(new DYOToolsError(
        'id_conflict',
        'Bunch with same id already exists in the manager',
        this,
        item,
      ));
      return;
    }

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

    // Update Library with non-existing new Elements
    if (item.getAll().length) {
      item.getAll().forEach((element: any) => {
        if (!this._library.get(element.getId())) {
          this._library.add(element);
        }
      });
    }

    // Update context
    item.setContext<DYOToolsManager>(this);
    const oldContext = item.getContext();
    if (oldContext && oldContext.getComponentType() === 'manager') {
      (oldContext as DYOToolsManager).remove(item.getId());
    }

    // Add the new item
    this._items[item.getId()] = {
      scope,
      item
    }
  }

  addMany(items: any[]): void {
    items.forEach((item: any) => {
      this.add(item);
    })
  }

  remove(id: string): void {

  }

  get(id: string): any {
    return this._items[id]?.item ?? undefined;
  }

  getAll(scope?: string): any {
    const finalItems = [];
    Object.values(this._items).forEach((item: any) => {
      if (!scope || item.scope === scope) {
        finalItems.push(item.item);
      }
    })

    return finalItems;
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
