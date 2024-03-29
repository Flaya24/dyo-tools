import DYOToolsElement from './DTElement';
import DYOToolsManager from './DTManager';
import {
  DTAcceptedMetaData, DTBunchFilters, DTBunchOptions, DTBunchToObject, DYOFinderConfiguration,
} from '../types';
import DYOToolsPlayer from './DTPlayer';
import DYOToolsError from './DTError';
import DYOToolsComponentPhysical from './DTComponentPhysical';
import { bunchDefaultOptions as defaultOptions, componentBunchDefaultFinderConfiguration } from '../constants';
import DYOFinder from '../libs/DYOFinder';

export default class DYOToolsBunch<
    IBunchItem extends DYOToolsElement<DTAcceptedMetaData>,
    IComponentMeta extends DTAcceptedMetaData = DTAcceptedMetaData,
  > extends DYOToolsComponentPhysical<IComponentMeta, DTBunchOptions> {
  /**
   * Defining component type to "bunch".
   */
  protected _componentType = 'bunch';

  /**
   * Ordered Array of DTElement instance managed by the bunch.
   */
  protected _items: IBunchItem[];

  /**
   * Current DYOFinder instance.
   *
   * This instance offers advanced methods to manipulate items, like searching.
   */
  protected _finder: DYOFinder;

  /**
   * Applying the parent constructor, and execute following process steps :
   * * Add **items** to the bunch instance (using adding specifications).
   * * Merge specific **options** configuration with default in _options.
   * * Initialize *DYOFinder* with **getFinderConfiguration** method.
   *
   * @see [addAtIndex](#addAtIndex) method for adding specifications.
   * @param key
   * @param items Array of DTElement instance to add. Default empty array.
   * @param options Specific options configuration for the instance. Default empty object.
   */
  constructor(key?: string, items: IBunchItem[] = [], options: Partial<DTBunchOptions> = {}) {
    super(key, { ...defaultOptions, ...options });

    this._items = [];
    if (items && items.length > 0) {
      this.addMany(items);
    }

    this._finder = new DYOFinder(this, this.getFinderConfiguration());
  }

  /**
   * Returns DYOFinder configuration for standard DTBunch instance.
   *
   * This method can be overridden to extend the configuration.
   *
   * @returns DYOFinderConfiguration standard configuration.
   */
  getFinderConfiguration(): DYOFinderConfiguration {
    return componentBunchDefaultFinderConfiguration;
  }

  /**
   * Setter for _owner property.
   *
   * If **inheritOwner** is *true*, apply new **owner** to each item.
   */
  setOwner(value: DYOToolsPlayer<DTAcceptedMetaData>): void {
    super.setOwner(value);

    // Update owner elements
    const { inheritOwner } = this._options;
    if (inheritOwner) {
      this._items.forEach((item) => { item.setOwner(this.getOwner()); });
    }
  }

  /**
   * Remove the current owner of bunch.
   *
   * If **inheritOwner** is *true*, remove current owner to each item.
   */
  removeOwner(): void {
    super.removeOwner();

    // Update owner elements
    const { inheritOwner } = this._options;
    if (inheritOwner) {
      this._items.forEach((item) => { item.removeOwner(); });
    }
  }

  /**
   * Add an element **item** as the last element into _items property array.
   *
   * @see [addAtIndex](#addAtIndex) method for adding specifications.
   * @param item A DTElement instance to add into the bunch.
   * @param options Optional Bunch option configuration object to apply only for this method execution. Options are not
   * saved in current _options property. Available Options are : **uniqueKey**, **inheritOwner**, **replaceIndex**
   * and **errors**.
   */
  add(item: IBunchItem, options: Partial<Omit<DTBunchOptions, 'virtualContext'>> = {}): void {
    this.addAtIndex(item, this._items.length, options);
  }

  /**
   * Add an element **item** at specified **index** into _items property array.
   *
   * The adding process has the following specifications :
   * * If the added item has the same _id than existing item, an error occurred (depending on **errors** option).
   * * Option **uniqueKey** = *true*. If the added item has the same _key than existing item,
   * an error occurred (depending on **errors** option).
   * * Option **inheritOwner** = *true*. When the new item is added, its owner is replaced by the current bunch owner.
   * * Option **virtualContext** = *false*. When the new item is added, its context is replaced by the current bunch
   * instance. The item is removed from the old context.
   * * If an item already exists at the specified index, the new item is added at the index, and following items are
   * automatically affected at next indexes. If **replaceIndex** option is *true*, the new item replaces the former one
   * at the index instead.
   * * If the bunch has a parent **Manager**, the added item is also added to the **Manager library**, only if this one
   * doesn't already exist in the library.
   *
   * @param item A DTElement instance to add into the bunch.
   * @param index Index value where the item might be added. Must be a number between 0 and the current _items length.
   * If not, the provided argument is automatically changed to 0 or current _items length.
   * @param options Optional Bunch option configuration object to apply only for this method execution. Options are not
   * saved in current _options property. Available Options are : **uniqueKey**, **inheritOwner**, **replaceIndex**
   * and **errors**.
   */
  addAtIndex(item: IBunchItem, index: number, options: Partial<Omit<DTBunchOptions, 'virtualContext'>> = {}): void {
    const {
      uniqueKey, replaceIndex, inheritOwner, virtualContext,
    }: Partial<DTBunchOptions> = { ...this._options, ...options };
    let hasError = false;
    let finalIndex = index;

    // Handle ID conflicts
    const existingItem = this.get(item.getId());
    if (existingItem) {
      hasError = true;
      this.triggerError(new DYOToolsError(
        'id_conflict',
        'Element with same id already exists in the bunch',
        this,
        item,
      ));
    }

    // Handle Key conflicts
    if (uniqueKey && !hasError) {
      const existingItemByKey = this.find({ key: { $eq: item.getKey() } });
      if (existingItemByKey) {
        hasError = true;
        this.triggerError(new DYOToolsError(
          'key_conflict',
          'Element with same key already exists in the bunch',
          this,
          item,
        ));
      }
    }

    if (!hasError) {
      // Update indexes if out of limits
      if (index < 0) {
        finalIndex = 0;
      }
      if (index > this._items.length) {
        finalIndex = this._items.length;
      }

      // Update Context
      if (!virtualContext) {
        const oldContext = item.getContext();
        if (oldContext && oldContext.getComponentType() === 'bunch') {
          (oldContext as DYOToolsBunch<IBunchItem, DTAcceptedMetaData>).remove(item.getId());
        }
        item.setContext(this);
      }

      // Update Owner
      if (inheritOwner) {
        item.setOwner(this._owner);
      }

      // Update Manager library
      if (this.getContext('manager')) {
        const manager: DYOToolsManager<IBunchItem> = this.getContext('manager') as DYOToolsManager<IBunchItem>;
        if (!manager.getLibrary().get(item.getId())) {
          manager.getLibrary().add(item);
        }
      }

      // Add the new Item
      if (replaceIndex) {
        this._items[finalIndex] = item;
      } else {
        const arrayPart1 = this._items.slice(0, finalIndex);
        const arrayPart2 = this._items.slice(finalIndex);

        this._items = [...arrayPart1, item, ...arrayPart2];
      }
    }
  }

  /**
   * Add each element of an array **items** at the end of the _items property array.
   *
   * @see [addAtIndex](#addAtIndex) method for adding specifications.
   * @param items An array of DTElement instances to add into the bunch.
   * @param options Optional Bunch option configuration object to apply only for this method execution. Options are not
   * saved in current _options property. Available Options are : **uniqueKey**, **inheritOwner**, **replaceIndex**
   * and **errors**.
   */
  addMany(items: IBunchItem[], options: Partial<Omit<DTBunchOptions, 'virtualContext'>> = {}): void {
    this.addManyAtIndex(items, this._items.length, options);
  }

  /**
   * Add each element of an array **items** at specified **index** into _items property array.
   * The first element is added at provided **index** argument, and each next element at next indexes, following adding
   * specifications.
   *
   * @see [addAtIndex](#addAtIndex) method for adding specifications.
   * @param items An array of DTElement instances to add into the bunch.
   * @param index Index value where the item might be added. Must be a number between 0 and the current _items length.
   * If not, the provided argument is automatically changed to 0 or current _items length.
   * @param options Optional Bunch option configuration object to apply only for this method execution. Options are not
   * saved in current _options property. Available Options are : **uniqueKey**, **inheritOwner**, **replaceIndex**
   * and **errors**.
   */
  addManyAtIndex(items: IBunchItem[], index: number, options: Partial<Omit<DTBunchOptions, 'virtualContext'>> = {}): void {
    const previousItems = this._items;
    const { errors }: Partial<DTBunchOptions> = { ...this._options, ...options };
    let currentIndex = index;

    if (index < 0) {
      currentIndex = 0;
    }

    try {
      for (const item of items) {
        this.addAtIndex(item, currentIndex, options);
        currentIndex += 1;
      }
    } catch (exception) {
      if (!errors) {
        this._items = previousItems;
        throw exception;
      }
    }
  }

  /**
   * Return one DTElement instance included in the _items property by index or id.
   *
   * * If a Number is provided, return the DTElement instance at the corresponding index into _items.
   * * If a String is provided, return the DTElement instance with the corresponding _id property into _items.
   *
   * @param index Number index value or String _id value.
   * @returns DTElement instance that corresponds to index or id provided, or undefined if not found.
   */
  get(index: string | number): IBunchItem | undefined {
    if (typeof index === 'number') {
      return this._items[index];
    }
    const itemFiltered = this._items.filter((item: IBunchItem) => item.getId() === index);
    return itemFiltered.length > 0 ? itemFiltered[0] : undefined;
  }

  /**
   * Return all DTElement instance managed by the Bunch.
   *
   * @returns DTElement array corresponding to current _items property.
   */
  getAll(): IBunchItem[] {
    return this._items;
  }

  /**
   * Return current index of a DTElement instance into _items property by _id.
   *
   * @param id String _id value of the DTElement instance.
   * @returns Current index number into _items, or -1 if not found.
   */
  indexOf(id: string): number {
    let indexOfItem = -1;
    for (let i = 0; i < this._items.length; i += 1) {
      if (this._items[i].getId() === id) {
        indexOfItem = i;
        break;
      }
    }
    return indexOfItem;
  }

  /**
   * Remove a DTElement instance into the _items property by index or id.
   *
   * * If a Number is provided, remove the DTElement instance at the corresponding index into _items.
   * * If a String is provided, remove the DTElement instance with the corresponding _id property into _items.
   *
   * Note : Remove also the current context of the removed item (only if Option **virtualContext** is *false*).
   *
   * @param index Number index value or String _id value.
   */
  remove(index: string | number): void {
    if (typeof index === 'number') {
      this.removeMany([index as number]);
    } else {
      this.removeMany([index as string]);
    }
  }

  /**
   * Remove multiple DTElement instances into the _items property by index or id. An array of indexes or ids to remove
   * must be provided.
   *
   * * If a Number Array is provided, remove DTElement instances at corresponding indexes into _items.
   * * If a String Array is provided, remove DTElement instances with corresponding _id properties into _items.
   *
   * Note : Remove also the current context of removed items (only if Option **virtualContext** is *false*).
   *
   * @param indexes Number Array index values or String Array _id values.
   */
  removeMany(indexes: string[] | number[]): void {
    const { virtualContext } = this._options;
    const newItems = [];
    for (let i = 0; i < this._items.length; i += 1) {
      if (typeof indexes[0] === 'number') {
        if (!(indexes as number[]).includes(i)) {
          newItems.push(this._items[i]);
        } else if (!virtualContext) {
          this._items[i].removeContext();
        }
      } else if (!(indexes as string[]).includes(this._items[i].getId())) {
        newItems.push(this._items[i]);
      } else if (!virtualContext) {
        this._items[i].removeContext();
      }
    }

    this._items = newItems;
  }

  /**
   * Remove all DTElement instances into the _items property.
   *
   * Note : Remove also the current context of removed items (only if Option **virtualContext** is *false*).
   */
  removeAll(): void {
    const keysToRemove: number[] = this._items.map((item, index) => index);
    this.removeMany(keysToRemove);
  }

  /**
   * Return an array of DTElement from _items property filtered with a **filters** argument.
   *
   * This method use the DYOFinder instance **execute** method.
   *
   * Search filters can be applied on following DTElement properties :
   * * **id** : property _id. Basic operators only.
   * * **key** : property _key. Basic operators only.
   * * **context** : property _id of current _context instance. Basic operators only.
   * * **owner** : property _id of current _owner instance. Basic operators only.
   * * **meta** : each meta Key of _meta property. Extended operators can be used.
   *
   * Examples of **filters** argument :
   * * { key: { $eq: "key_1" } } : Return all DTElement instance into _items with *key_1* as _key property.
   * * { context: { $in: [null, "bunch_1"] } } : Return all DTElement instance into _items having no context or a
   * bunch context with *bunch_1* as _id property.
   * * { key: { $ne: "key_1" }, meta: { score: { $gte: 50, $lte: 100 } } } : Return all DTElement instance into _items
   * with _key property different than *key_1*, and meta key *score* value from _meta property between 50 and 100.
   *
   * @param filters Filters Object. The format is :
   * { [property_1] : { [operator_1] : filter_value, [operator_2] : filter_value_2, ... }, [property_2] : { ... }, ... }
   *
   * For **meta**, you have to pass the meta key before the operator :
   * { meta: { [meta_key1] : { [operator_1] : filter_value_1, ... }, [meta_key2] : { ... }, ...  }, ... }
   * @returns Array of DTElement instance corresponding to the filters. Empty if no filter or invalid ones are passed.
   * @see DYOFinder
   */
  find(filters: Partial<DTBunchFilters>): IBunchItem[] {
    return this._finder.execute<IBunchItem>(filters);
  }

  /**
   * Create and return a new DTBunch instance by applying from current instance :
   * - Copy _key property
   * - Copy _meta property
   * - Copy _globalOptions property
   * - Make a copy of each element in _items, and add it into _items of the copied Bunch.
   *
   * @returns New DTBunch instance copied.
   */
  copy(): DYOToolsBunch<IBunchItem, IComponentMeta> {
    let copyItems;
    if (this._options.virtualContext) {
      copyItems = this._items;
    } else {
      copyItems = this._items.length === 0 ? [] : this._items.map((item) => item.copy() as IBunchItem);
    }

    const copyBunch = new DYOToolsBunch<IBunchItem, IComponentMeta>(this._key, copyItems, this._options);
    copyBunch.setManyMeta({ ...this.getManyMeta() });

    return copyBunch;
  }

  /**
   * Return JSON Object representation of the Bunch instance.
   *
   * JSON Object returned has the following structure :
   * * **id** : _id property of the Bunch.
   * * **key** : _key property of the Bunch.
   * * **type** : _componentType property of the Bunch.
   * * **items** : Array of JSON Object representation for each DTElement instance in _items property of the Bunch.
   * * **owner** : String representation of the current _owner property of the Bunch (only if defined).
   * * **meta** : JSON Object of all current metadata in _meta property of the Bunch (only if not empty).
   *
   * @returns JSON Object representation of the Bunch.
   */
  toObject(): DTBunchToObject<IComponentMeta> {
    const objectBunch: DTBunchToObject<IComponentMeta> = {
      id: this._id,
      key: this._key,
      type: this._componentType,
      items: [],
    };

    if (this._items.length) {
      objectBunch.items = this._items.map((item) => item.toObject());
    }

    if (this._owner) {
      objectBunch.owner = this._owner.toString();
    }

    if (this._meta && Object.keys(this._meta).length > 0) {
      objectBunch.meta = { ...this.getManyMeta() };
    }

    return objectBunch;
  }

  /**
   * Return String representation of the Bunch instance.
   *
   * @returns String representation of the Bunch.
   */
  toString(): string {
    let ownerKey = '';
    if (this._owner) {
      ownerKey = ` - Owner: ${this._owner.getKey()}`;
    }

    return `Component ${this._key} - Type: Bunch${ownerKey} - Items: ${this._items.length}`;
  }
}
