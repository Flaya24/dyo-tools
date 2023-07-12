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

  /**
   * DTBunch instances managed by the Manager.
   *
   * This property is an object with an entry for each bunch :
   * * The key is the bunch _id.
   * * The value is an object with :
   * * * *scope* : the current affected **scope** of the bunch.
   * * * *item* : the DTBunch instance.
   */
  protected _items: DTManagerItemsType<IBunchItem>;

  /**
   * Valid scopes list for bunches.
   *
   * Each bunch is affected to one scope, in order to facilitate filtering and grouping of bunches.
   * A DTManager instance comes with two initial scopes : 'default' and 'virtual'.
   */
  protected _scopes: string[];

  /**
   * Current Library instance for the Manager.
   *
   * The Library is a special virtual bunch which contains all elements added in bunches.
   * The purpose is the guarantee of id uniqueness when transferring elements between bunches.
   * It also facilitates searching elements in all Manager bunches.
   */
  protected _library: DYOToolsBunch<IBunchItem>;

  /**
   * Current DYOFinder instance.
   *
   * This instance offers advanced methods to manipulate items, like searching.
   */
  protected _finder: DYOFinder;

  /**
   * Applying the parent constructor, and execute following process steps :
   * * If **key** isn't provided and the property _domain is defined, the _key property has the _domain value.
   * * Add *default* and *virtual* as basic _scopes value, and add **scopes**.
   * * Create the Library instance, and add **elements** into it.
   * * Initialize *DYOFinder* with **getFinderConfiguration** method.
   *
   * @param key
   * @param elements Array of DTElement instance to add into the Manager Library. Default empty array.
   * @param scopes Array of custom scopes for the Manager. Default empty array.
   * @param options Specific options configuration for the instance. Default empty object.
   */
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

  /**
   * Returns DYOFinder configuration for standard DTManager instance.
   *
   * This method can be overridden to extend the configuration.
   *
   * @returns DYOFinderConfiguration standard configuration.
   */
  getFinderConfiguration(): DYOFinderConfiguration {
    return componentManagerDefaultFinderConfiguration;
  }

  /**
   * Getter for _library property.
   */
  getLibrary(): DYOToolsBunch<IBunchItem> {
    return this._library;
  }

  /**
   * Getter for _scopes property.
   */
  getScopes(): string[] {
    return this._scopes;
  }

  /**
   * Define if a scope name is a valid scope into the Manager.
   *
   * @param scope scope name.
   * @returns boolean if the scope is valid or not.
   */
  isValidScope(scope: string): boolean {
    return this._scopes.includes(scope);
  }

  /**
   * Add a DTBunch **item** into _items Manager property.
   *
   * The adding process has the following specifications :
   * * If the added item has the same _id than existing item, an error occurred (depending on **errors** option).
   * * The bunch item is automatically added to a scope depending on its virtual context :
   * * * *default* if the bunch option **virtualContext** is false.
   * * * *virtual* if the bunch option **virtualContext** is true.
   * * An optional parameter **targetScope** can be passed to force the scope affectation.
   * An error occurred if the affection doesn't conform to the following restrictions :
   * * * Virtual context bunch must be affected to the 'virtual' scope.
   * * * Not virtual context bunch must be affected to the 'default' scope, or any scope other than the 'virtual' one.
   * * All elements of the added bunch item are added to the Manager Library, only if the element doesn't already exist
   * into the Library.
   * * The Manager instance becomes the new context of the added item.
   * * The added item format follows the type DTManagerItemsType.
   * @see DTManagerItemsType
   *
   * @param item A DTBunch instance to add into the Manager.
   * @param targetScope Optional scope for affectation.
   */
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

  /**
   * Add each bunch of an array **items** into _items Manager property.
   *
   * @see [add](#add) method for adding specifications.
   * @param items An array of DTBunch instances to add into the Manager.
   * @param targetScope Optional scope for affectation (all added items are affected).
   */
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

  /**
   * Move a bunch item to a new scope.
   *
   * Note : an error occurred (depending on **errors** option) if the bunch id doesn't exist into the Manager.
   *
   * @see [add](#add) method for restrictions into the scope affectation.
   * @param bunchId _id property of the bunch to move.
   * @param targetScope new scope of the bunch.
   */
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

  /**
   * Return one DTBunch instance included in the _items property by id.
   *
   * @param id bunch id to return.
   * @returns DYOToolsBunch instance that corresponds to the id provided, or undefined if not found.
   */
  get(id: string): DYOToolsBunch<IBunchItem> | undefined {
    return this._items[id]?.item ?? undefined;
  }

  /**
   * Return all DTBunch instance managed into the Manager.
   *
   * @param scope Optional parameter **scope** to return only bunches which are affected to a specific scope.
   * @returns DYOToolsBunch array.
   */
  getAll(scope?: string): DYOToolsBunch<IBunchItem>[] {
    const finalItems = [];
    Object.values(this._items).forEach((item: DTManagerItemType<IBunchItem>) => {
      if (!scope || item.scope === scope) {
        finalItems.push(item.item);
      }
    });

    return finalItems;
  }

  /**
   * Return the current affected scope of a bunch depending on its id.
   *
   * @param id bunch id to return.
   * @returns Current scope affected to the bunch, or undefined if the bunch doesn't exist.
   */
  getScope(id: string): string | undefined {
    return this._items[id] && this._items[id].scope;
  }

  /**
   * Remove one bunch into the _items property of the Manager, depending on its id.
   *
   * If option **libraryDeletion** is *true*, the method performs also a deletion of removed bunch elements
   * in the Manager Library.
   *
   * @param id bunch id to remove.
   */
  remove(id: string): void {
    this.removeMany([id]);
  }

  /**
   * Remove many bunches into the _items property of the Manager, depending on their ids.
   *
   * If option **libraryDeletion** is *true*, the method performs also a deletion of removed bunch elements
   * in the Manager Library.
   *
   * @param ids Array of bunch ids to remove.
   * @param options Optional Manager option configuration object to apply only for this method execution. Options are not
   * saved in current _options property. Available Options are : **libraryDeletion** and **errors**.
   */
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

  /**
   * Remove all bunches into the _items property of the Manager.
   *
   * If option **libraryDeletion** is *true*, the method performs also a deletion of removed bunch elements
   * in the Manager Library.
   */
  removeAll(): void {
    this.removeMany(Object.keys(this._items));
  }

  /**
   * Return an array of DTBunch from _items property filtered with a **filters** argument.
   *
   * This method use the DYOFinder instance **execute** method.
   *
   * Search filters can be applied on following bunch properties :
   * * **id** : property _id. Basic operators only.
   * * **key** : property _key. Basic operators only.
   * * **scope** : affected scope name. Basic operators only.
   * * **owner** : property _id of current _owner instance. Basic operators only.
   * * **meta** : each meta Key of _meta property. Extended operators can be used.
   *
   * Examples of **filters** argument :
   * * { key: { $eq: "key_1" } } : Return all DTBunch instances into _items with *key_1* as _key property.
   * * { scope: { $in: ["default", "scope_1"] } } : Return all DTBunch instances into _items affected to scopes
   * "default" or "scope_1".
   * * { key: { $ne: "key_1" }, meta: { score: { $gte: 50, $lte: 100 } } } : Return all DTBunch instance into _items
   * with _key property different from *key_1*, and meta key *score* value from _meta property between 50 and 100.
   *
   * @param filters Filters Object. The format is :
   * { [property_1] : { [operator_1] : filter_value, [operator_2] : filter_value_2, ... }, [property_2] : { ... }, ... }
   *
   * For **meta**, you have to pass the meta key before the operator :
   * { meta: { [meta_key1] : { [operator_1] : filter_value_1, ... }, [meta_key2] : { ... }, ...  }, ... }
   * @returns Array of DTBunch instance corresponding to the filters. Empty if no filter or invalid ones are passed.
   * @see DYOFinder
   */
  find(filters: Partial<DTManagerFilters>): DYOToolsBunch<IBunchItem>[] {
    return this._finder.execute<DYOToolsBunch<IBunchItem>>(filters);
  }

  /**
   * Remove all items into the Manager Library, and add items from all bunches instance managed by the Manager.
   *
   * This method is useful to guarantee that the Library contains all bunches items, especially after many complex
   * operations.
   */
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

  /**
   * Return JSON Object representation of the Manager instance.
   *
   * JSON Object returned has the following structure :
   * * **id** : _id property of the Manager.
   * * **key** : _key property of the Manager.
   * * **type** : _componentType property of the Manager.
   * * **items** : Array of JSON Object representation for each DTBunch instance in _items property of the Manager.
   *
   * @returns JSON Object representation of the Manager.
   */
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

  /**
   * Return String representation of the Manager instance.
   *
   * @returns String representation of the Manager.
   */
  toString(): string {
    const libraryLabel = `Library: ${this._library.getAll().length}`;

    return `Component ${this._key} - Type: Manager - ${libraryLabel} - Items: ${Object.keys(this._items).length}`;
  }

  /**
   * Get error data for scope affectation. Used in method which performs scope affectation.
   *
   * @param targetScope scope name to check for affectation.
   * @param virtualContext boolean if the bunch to affect has **virtualContext** option enabled or not. Default *false*.
   * @returns An Object with error code and message.
   */
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
