import {DTBunch, DTElement, DTError, DTManager, DTPlayer} from "../../src";
import {bunchKey, BunchMetaDataType, extractKeysFromBunchList, genBunch, key} from "./v0-2-0.integration.double";
import {IMetaDataTest} from "../core/DTComponentWithMeta.double";
import {ScopesTest} from "../core/DTManager.double";

/************************* INTEGRATION TESTS SUITES *******************************/
/****************************** VERSION 0.2.0 *************************************/

describe("Adding Managers", () => {
  describe("I. Must be bunches handler", () => {
    test("Bunches can be added into the Manager", () => {
      const manager = new DTManager('managerTest');

      manager.add(genBunch()[0]);
      manager.addMany(genBunch(3, 'prime'));

      expect(extractKeysFromBunchList(manager.getAll())).toStrictEqual([
        key(bunchKey, '', 1),
        key(bunchKey, 'prime', 1),
        key(bunchKey, 'prime', 2),
        key(bunchKey, 'prime', 3),
      ])
    });

    test("Adding bunches with same id triggers an error", () => {
      const manager = new DTManager('managerTest');
      const bunchToAdd = genBunch(3);

      manager.addMany(bunchToAdd);

      expect(() => { manager.add(bunchToAdd[0]) }).toThrowError('Bunch with same id already exists in the manager');
    });

    test("Bunches can be removed from the Manager", () => {
      const manager = new DTManager('managerTest');
      const bunchToAdd = genBunch(7);

      manager.addMany(bunchToAdd);
      manager.remove(bunchToAdd[2].getId());
      manager.removeMany([ bunchToAdd[0].getId(), bunchToAdd[4].getId(), bunchToAdd[5].getId() ]);

      expect(extractKeysFromBunchList(manager.getAll())).toStrictEqual([
        key(bunchKey, '', 2),
        key(bunchKey, '', 4),
        key(bunchKey, '', 7),
      ])
    });

    test("Bunches can be fully removed from the manager", () => {
      const manager = new DTManager('managerTest');
      const bunchToAdd = genBunch(7);

      manager.addMany(bunchToAdd);
      manager.removeAll();

      expect(manager.getAll()).toStrictEqual([]);
    });

    test("Bunches can be found into the Manager - simple case with getter", () => {
      const manager = new DTManager('managerTest');
      const bunchToAdd = genBunch(3);

      manager.addMany(bunchToAdd);

      expect(manager.get(bunchToAdd[1].getId()).getKey()).toStrictEqual(key(bunchKey, '', 2));
    });

    test("Bunches can be found into the Manager - complex cases with finder", () => {
      const manager = new DTManager('managerTest');
      const bunchToAdd = genBunch(8);
      const playerTest = new DTPlayer('playerTest')
      bunchToAdd[0].setOwner(playerTest);
      bunchToAdd[3].setManyMeta({ visible: false, kind: 'deck' });
      bunchToAdd[4].setManyMeta({ visible: false, kind: 'deck' });
      bunchToAdd[5].setManyMeta({ visible: false, kind: 'discard' });
      bunchToAdd[6].setManyMeta({ visible: true, kind: 'deck' });
      bunchToAdd[7].setManyMeta({ visible: false, kind: 'trash' });

      manager.add(genBunch()[0]);
      manager.addMany(bunchToAdd);

      expect(extractKeysFromBunchList(manager.find({ id: { $eq: bunchToAdd[1].getId() }}))).toStrictEqual([
        key(bunchKey, '', 2),
      ]);
      expect(extractKeysFromBunchList(manager.find({
        key: { $eq: key(bunchKey, '', 1) },
        owner: { $ne: playerTest.getId() }
      }))).toStrictEqual([
        key(bunchKey, '', 1),
      ]);
      expect(extractKeysFromBunchList(manager.find({
        meta: { kind: { $in: ['deck', 'discard'] }, visible: { $eq: false }},
        key: { $ne: key(bunchKey, '', 4) },
      }))).toStrictEqual([
        key(bunchKey, '', 5),
        key(bunchKey, '', 6),
      ]);
    });


  });

  describe("II. Must use Scoped bunches", () => {
    test("Scopes are set as constructors and must be valid when adding", () => {
      const manager = new DTManager('managerTest', [], ScopesTest);

      expect(manager.getScopes()).toStrictEqual([
        'default',
        'virtual',
        ...ScopesTest
      ]);
      expect(manager.isValidScope(ScopesTest[0])).toBeTruthy();
      expect(() => { manager.add(genBunch()[0], 'invalidScope') }).toThrowError("Scope provided doesn't exist in the manager");
    });

    test("Bunches can be added into different scope depending on their context", () => {
      const manager = new DTManager('managerTest', [], ScopesTest);

      manager.addMany(genBunch(4));
      manager.addMany(genBunch(3, 'prime', [], { virtualContext: true }));
      manager.addMany(genBunch(2, 'second')[0], ScopesTest[0]);
      const bunchInLastScope = genBunch(1, 'third')[0]
      manager.add(bunchInLastScope, ScopesTest[1]);

      expect(extractKeysFromBunchList(manager.getAll('default'))).toStrictEqual([
        key(bunchKey, '', 1),
        key(bunchKey, '', 2),
        key(bunchKey, '', 3),
        key(bunchKey, '', 4),
      ]);
      expect(extractKeysFromBunchList(manager.getAll('virtual'))).toStrictEqual([
        key(bunchKey, 'prime', 1),
        key(bunchKey, 'prime', 2),
        key(bunchKey, 'prime', 3),
      ]);
      expect(extractKeysFromBunchList(manager.getAll(ScopesTest[0]))).toStrictEqual([
        key(bunchKey, 'second', 1),
        key(bunchKey, 'prime', 2),
      ]);
      expect(manager.getScope(bunchInLastScope.getId())).toBe(ScopesTest[1]);
      expect(manager.getAll('invalidScope').toStrictEqual([]);
    });

    test("Bunches can be moved to valid Scopes", () => {
      const manager = new DTManager('managerTest', [], ScopesTest);
      const bunchToAdd = genBunch(3);

      manager.addMany(bunchToAdd);
      manager.moveToScope(bunchToAdd[0].getId(), ScopesTest[0]);
      manager.moveToScope(bunchToAdd[1].getId(), ScopesTest[1]);

      expect(manager.getScope(bunchToAdd[0].getId())).toBe(ScopesTest[0]);
      expect(manager.getScope(bunchToAdd[1].getId())).toBe(ScopesTest[1]);
      expect(() => { manager.moveToScope(bunchToAdd[2].getId(), 'invalidScope') }).toThrow("Scope provided doesn't exist in the manager");
    });
  })
})
