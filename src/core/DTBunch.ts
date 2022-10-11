import DYOToolsComponentWithMeta from './DTComponentWithMeta';
import DYOToolsElement from './DTElement';
import {
  DTAcceptedMetaData,
  DTBunchFilters, DTBunchFilterWithBaseOperator, DTBunchFilterWithMetaOperator, DTBunchOptions,
  DTBunchToObject,
  FilterOperatorType, StandardPrimitiveType,
} from '../types';
import DYOToolsPlayer from './DTPlayer';
import DYOToolsError from './DTError';
import { validFiltersForItem } from '../utils/filters';
import DYOToolsComponentPhysical from "./DTComponentPhysical";

// Default Options for class
const defaultOptions: DTBunchOptions = {
  errors: false,
  uniqueKey: false,
  inheritOwner: false,
  replaceIndex: false,
  virtualContext: false,
};

export default class DYOToolsBunch<
    IBunchItem extends DYOToolsElement<DTAcceptedMetaData>,
    IComponentMeta extends DTAcceptedMetaData,
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
   * All global option configuration for the current bunch.
   *
   * Options can be :
   * * **errors** : Default *false*. If *true*, no exception is thrown when an error occurred, a new DTError instance is
   * added to the _errors property array instead. If *false*, throw the exception with a DTError instance.
   * * **uniqueKey** : Default *false*. If *true*, an error occurred when adding a new DTElement with the same key of an
   * existing element into the bunch.
   * * **inheritOwner** : Default *false*. If *true*, when a new DTElement is added, the owner of this element becomes
   * automatically the current bunch owner.
   * * **virtualContext** : Default *false*. If *true*, the context is not changed when a new DTElement is added.
   * If *false*, when a new DTElement is added, the context of this element becomes automatically the current bunch instance
   * and the element is removed from the old context Component (if defined).
   * * **replaceIndex** : Default *false*. If *true*, when a new DTElement is added at existing index (using **addAtIndex**
   * or **addManyAtIndex** method), this component replaces the old one. If *false*, this component is added at the specified
   * index and other existing component are reindexed with the following index.
   *
   */
  // protected _globalOptions: DTBunchOptionsConstructor;

  /**
   * Array of DTError occurred during bunch instance execution, ordered by time.
   * Only set if **errors** option is true.
   */
  protected _errors: DYOToolsError[];

  /**
   * Applying the parent constructor, and execute following process steps :
   * * Add **items** to the bunch instance (using adding specifications).
   * * Merge specific **options** configuration with default in _globalOptions.
   *
   * @see [addAtIndex](#addAtIndex) method for adding specifications.
   * @param key
   * @param items Array of DTElement instance to add. Default empty array.
   * @param options Specific options configuration for the instance. Default empty object.
   */
  constructor(key?: string, items: IBunchItem[] = [], options: Partial<DTBunchOptions> = {}) {
    super(key, {...defaultOptions, ...options});

    this._items = [];
    if (items && items.length > 0) {
      this.addMany(items);
    }
  }

  /**
   * Setter for _owner property.
   * TODO : TSDOC Must be updated
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
   * TODO : TSDOC Must be updated
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
   * saved in current _globalOptions property. Available Options are : **uniqueKey**, **inheritOwner**, **replaceIndex**
   * and **errors**.
   */
  add(item: IBunchItem, options: Partial<Omit<DTBunchOptions, 'virtualContext'>> = {}): void {
    this.addAtIndex(item, this._items.length, options);
  }

  /**
   * Add an element **item** at specified **index** into _items property array.
   *
   * The adding process has following specifications :
   * * If the added item has the same _id than existing item, an error occurred (depending on **errors** option).
   * * Option **uniqueKey** = *true*. If the added item has the same _key than existing item,
   * an error occurred (depending on **errors** option).
   * * Option **inheritOwner** = *true*. When the new item is added, its owner is replaced by the current bunch owner.
   * * Option **virtualContext** = *false*. When the new item is added, its context is replaced by the current bunch
   * instance. The item is removed from the old context.
   * * If an item already exists at the specified index, the new item is added at the index, and following items are
   * automatically affected at next indexes. If **replaceIndex** option is *true*, the new item replaces the former one
   * at the index instead.
   *
   * @param item A DTElement instance to add into the bunch.
   * @param index Index value where the item might be added. Must be a number between 0 and the current _items length.
   * If not, the provided argument is automatically changed to 0 or current _items length.
   * @param options Optional Bunch option configuration object to apply only for this method execution. Options are not
   * saved in current _globalOptions property. Available Options are : **uniqueKey**, **inheritOwner**, **replaceIndex**
   * and **errors**.
   */
  addAtIndex(item: IBunchItem, index: number, options: Partial<Omit<DTBunchOptions, 'virtualContext'>> = {}): void {
    const {
      errors, uniqueKey, replaceIndex, inheritOwner, virtualContext
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
        if (errors) {
          this._errors.push(new DYOToolsError(
            'key_conflict',
            'Element with same key already exists in the bunch',
            this,
            item,
          ));
        } else {
          throw new DYOToolsError(
            'key_conflict',
            'Element with same key already exists in the bunch',
            this,
            item,
          );
        }
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
   * saved in current _globalOptions property. Available Options are : **uniqueKey**, **inheritOwner**, **replaceIndex**
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
   * saved in current _globalOptions property. Available Options are : **uniqueKey**, **inheritOwner**, **replaceIndex**
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
   * Search filters can be apply on following DTElement properties :
   * * **id** : property _id. Basic operators only.
   * * **key** : property _key. Basic operators only.
   * * **context** : property _id of current _context instance. Basic operators only.
   * * **owner** : property _id of current _owner instance. Basic operators only.
   * * **meta** : each meta Key of _meta property. Extended operators can be used.
   *
   * For each search filter provided, an object of specific operators is applied :
   * * **BASIC OPERATORS**
   * * **$eq** : The property must be strict equal to the filter value.
   * * **$in** : The property must be included into the filter array.
   * * **$nin** : The property must not be included into the filter array.
   * * **$ne** : The property must be different to the filter value.
   * * **EXTENDED OPERATORS** (meta only)
   * * **$lte** : Number property only. The property must be lower or equal than the filter value.
   * * **$gte** : Number property only. The property must be higher or equal than the filter array.
   * * **$contains** : Array property only. The property must contain the filter value.
   * * **$ncontains** : Array property only. The property must not contain the filter value.
   *
   * If many operators and / or many properties are passed into the **filters** argument, the logic operator applied is
   * **AND**. For **owner** and **context** properties, you can pass *null* to filter elements with no owner or context
   * defined.
   *
   * Examples of **filters** argument :
   * * { key: { $eq: "key_1" } } : Return all DTElement instance into _items with *key_1* as _key property.
   * * { context: { $in: [null, "bunch_1"] } } : Return all DTElement instance into _items having no context or a
   * bunch context with *bunch_1* as _id property.
   * * { key: { $ne: "key_1" }, meta: { score: { $gte: 50, $lte: 50 } } } : Return all DTElement instance into _items
   * with _key property different than *key_1*, and meta key *score* value from _meta property between 50 and 100.
   *
   * @param filters Filters Object. The format is :
   * { [property_1] : { [operator_1] : filter_value, [operator_2] : filter_value_2, ... }, [property_2] : { ... }, ... }
   *
   * For **meta**, you have to pass the meta key before the operator :
   * { meta: { [meta_key1] : { [operator_1] : filter_value_1, ... }, [meta_key2] : { ... }, ...  }, ... }
   * @returns Array of DTElement instance corresponding to the filters. Empty if no filter or invalid ones are passed.
   */
  find(filters: Partial<DTBunchFilters>): IBunchItem[] {
    const filteredItems : IBunchItem[] = [];
    const validOperatorsBase: FilterOperatorType[] = [
      FilterOperatorType.EQ,
      FilterOperatorType.IN,
      FilterOperatorType.NIN,
      FilterOperatorType.NE,
    ];
    const validOperatorsMeta: FilterOperatorType[] = [
      FilterOperatorType.EQ,
      FilterOperatorType.IN,
      FilterOperatorType.NIN,
      FilterOperatorType.NE,
      FilterOperatorType.LTE,
      FilterOperatorType.GTE,
      FilterOperatorType.CONTAINS,
      FilterOperatorType.NCONTAINS,
    ];
    const checkAllValidFiltersForProp = (
      itemProp: StandardPrimitiveType,
      operators: Partial<DTBunchFilterWithBaseOperator>,
      validOperators: FilterOperatorType[],
    ) => {
      if (Object.keys(operators).length) {
        for (const operator of Object.keys(operators)) {
          if (!validOperators.includes(operator as FilterOperatorType)
            || !validFiltersForItem(itemProp, operators[operator], operator as FilterOperatorType.EQ)) {
            return false;
          }
        }
        return true;
      }
      return false;
    };

    for (const item of this._items) {
      let validItem = !!(Object.keys(filters).length);

      // id Filter
      if (filters.id && !checkAllValidFiltersForProp(item.getId(), filters.id, validOperatorsBase)) {
        validItem = false;
      }

      // key Filter
      if (filters.key && !checkAllValidFiltersForProp(item.getKey(), filters.key, validOperatorsBase)) {
        validItem = false;
      }

      // context Filter
      const itemContext = item.getContext() ? item.getContext().getId() : null;
      if (filters.context && !checkAllValidFiltersForProp(itemContext, filters.context, validOperatorsBase)) {
        validItem = false;
      }

      // owner Filter
      const itemOwner = item.getOwner() ? item.getOwner().getId() : null;
      if (filters.owner && !checkAllValidFiltersForProp(itemOwner, filters.owner, validOperatorsBase)) {
        validItem = false;
      }

      // meta Filter
      if (filters.meta) {
        if (Object.keys(filters.meta).length) {
          const itemMeta = item.getManyMeta();
          for (const [meta, filter] of Object.entries(filters.meta as Record<string, Partial<DTBunchFilterWithMetaOperator>>)) {
            const metaValue = Object.prototype.hasOwnProperty.call(itemMeta, meta) ? itemMeta[meta] : null;
            if (!checkAllValidFiltersForProp(metaValue as StandardPrimitiveType, filter, validOperatorsMeta)) {
              validItem = false;
              break;
            }
          }
        }
      }

      if (validItem) {
        filteredItems.push(item);
      }
    }

    return filteredItems;
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

  do(): void {
  }
}
