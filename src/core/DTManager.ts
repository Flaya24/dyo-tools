import DYOToolsComponent from './DTComponent';
import DYOToolsBunch from './DTBunch';
import DYOToolsError from './DTError';
import {
  DTAcceptedMetaData,
  DTComponentOptions,
  DTManagerFilters,
  DTManagerItemsType,
  DTManagerItemType,
  DTManagerOptions,
  DTManagerToObject,
  DYOFinderConfiguration,
} from '../types';
import DYOFinder from '../libs/DYOFinder';
import { componentManagerDefaultFinderConfiguration, managerDefaultOptions as defaultOptions } from '../constants';
import DYOToolsElement from './DTElement';

export default class DYOToolsManager<
  IBunchItem extends DYOToolsElement<DTAcceptedMetaData>,
> extends DYOToolsComponent<DTManagerOptions> {
  /**
   * Defining component type to "manager".
   */
  protected _componentType = 'manager';

  protected _items: DTManagerItemsType<IBunchItem>;

  protected _scopes: string[];

  protected _library: DYOToolsBunch<IBunchItem>;

  protected _finder: DYOFinder;

  constructor(key?: string, elements: IBunchItem[] = [], scopes: string[] = [], options: Partial<DTManagerOptions> = {}) {
    super(key, { ...defaultOptions, ...options });
    // Use default _domain as _key
    this._key = !key ? (this.getDomain() || this._id) : key;

    this._items = {};
    this._scopes = [
      'default',
      'virtual',
      ...scopes,
    ];
    this._library = new DYOToolsBunch('library', elements, { virtualContext: true });
    this._finder = new DYOFinder(this, this.getFinderConfiguration());
  }

  getFinderConfiguration(): DYOFinderConfiguration {
    return componentManagerDefaultFinderConfiguration;
  }

  getLibrary(): DYOToolsBunch<IBunchItem> {
    return this._library;
  }

  getScopes(): string[] {
    return this._scopes;
  }

  isValidScope(scope: string): boolean {
    return this._scopes.includes(scope);
  }

  add(item: DYOToolsBunch<IBunchItem>, targetScope?: string): void {
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
      scope = virtualContext ? 'virtual' : 'default';
    } else {
      const { code: errorCode, message: errorMessage } = this.getErrorDataForScope(targetScope, virtualContext);

      if (errorCode && errorMessage) {
        this.triggerError(new DYOToolsError(errorCode, errorMessage, this, item));
        return;
      }
      scope = targetScope;
    }

    // Update Library with non-existing new Elements
    if (item.getAll().length) {
      item.getAll().forEach((element: IBunchItem) => {
        if (!this._library.get(element.getId())) {
          this._library.add(element);
        }
      });
    }

    // Update context
    item.setContext<DYOToolsManager<IBunchItem>>(this);
    const oldContext = item.getContext();
    if (oldContext && oldContext.getComponentType() === 'manager') {
      (oldContext as DYOToolsManager<IBunchItem>).remove(item.getId());
    }

    // Add the new item
    this._items[item.getId()] = {
      scope,
      item,
    };
  }

  addMany(items: DYOToolsBunch<IBunchItem>[], targetScope?: string): void {
    const previousItems = { ...this._items };
    const { errors }: DTComponentOptions = this._options;

    try {
      items.forEach((item: DYOToolsBunch<IBunchItem>) => {
        this.add(item, targetScope);
      });
    } catch (err: unknown) {
      this._items = previousItems;
      if (!errors) {
        throw err;
      }
    }
  }

  moveToScope(bunchId: string, targetScope: string): void {
    if (!Object.keys(this._items).includes(bunchId)) {
      this.triggerError(new DYOToolsError(
        'invalid_id',
        'Bunch id provided doesn\'t exist in the manager',
        this,
      ));
      return;
    }

    const bunch = this._items[bunchId].item;

    const { virtualContext } = bunch.getOptions();
    const { code: errorCode, message: errorMessage } = this.getErrorDataForScope(targetScope, virtualContext);
    if (errorCode && errorMessage) {
      this.triggerError(new DYOToolsError(errorCode, errorMessage, this, bunch));
      return;
    }

    this._items[bunchId].scope = targetScope;
  }

  get(id: string): DYOToolsBunch<IBunchItem> | undefined {
    return this._items[id]?.item ?? undefined;
  }

  getAll(scope?: string): DYOToolsBunch<IBunchItem>[] {
    const finalItems = [];
    Object.values(this._items).forEach((item: DTManagerItemType<IBunchItem>) => {
      if (!scope || item.scope === scope) {
        finalItems.push(item.item);
      }
    });

    return finalItems;
  }

  getScope(id: string): string | undefined {
    return this._items[id] && this._items[id].scope;
  }

  remove(id: string): void {
    this.removeMany([id]);
  }

  removeMany(ids: string[], options: Partial<DTManagerOptions> = {}): void {
    const { libraryDeletion } = { ...this._options, ...options };

    ids.forEach((id: string) => {
      if (this._items[id]) {
        if (libraryDeletion) {
          this._items[id].item.getAll().forEach((item: IBunchItem) => {
            this._library.remove(item.getId());
          });
        }

        delete this._items[id];
      }
    });
  }

  removeAll(): void {
    this.removeMany(Object.keys(this._items));
  }

  find(filters: Partial<DTManagerFilters>): DYOToolsBunch<IBunchItem>[] {
    return this._finder.execute<DYOToolsBunch<IBunchItem>>(filters);
  }

  reloadLibrary(): void {
    this._library.removeAll();

    Object.values(this._items).forEach((item: DTManagerItemType<IBunchItem>) => {
      item.item.getAll().forEach((element: IBunchItem) => {
        if (!this._library.get(element.getId())) {
          this._library.add(element);
        }
      });
    });
  }

  toObject(): DTManagerToObject {
    const objectManager: DTManagerToObject = {
      id: this._id,
      key: this._key,
      type: this._componentType,
      items: [],
    };

    Object.keys(this._items).forEach((bunchId: string) => {
      objectManager.items.push({
        scope: this._items[bunchId].scope,
        ...this._items[bunchId].item.toObject(),
      });
    });

    return objectManager;
  }

  toString(): string {
    const libraryLabel = `Library: ${this._library.getAll().length}`;

    return `Component ${this._key} - Type: Manager - ${libraryLabel} - Items: ${Object.keys(this._items).length}`;
  }

  private getErrorDataForScope(targetScope: string, virtualContext = false): { code: string, message: string } {
    const response = { code: '', message: '' };
    if (!this.isValidScope(targetScope)) {
      response.code = 'invalid_scope';
      response.message = "Scope provided doesn't exist in the manager";
    }
    if (virtualContext && targetScope !== 'virtual') {
      response.code = 'forbidden_scope';
      response.message = 'Scope provided cannot be associated to a virtual bunch';
    }
    if (!virtualContext && targetScope === 'virtual') {
      response.code = 'forbidden_virtual_scope';
      response.message = 'Virtual Scope provided cannot be associated to a physical bunch';
    }

    return response;
  }
}
