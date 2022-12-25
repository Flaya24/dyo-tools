import {describe, expect, jest, test,} from '@jest/globals';
import {DTBunch, DTElement, DTPlayer} from '../../src';
import {DTComponentStub} from "./DTComponent.double";
import {DTPlayerStub} from "./DTPlayer.double";
import {BunchMetaData, HaileiMetaData, IMetaDataTest, PlayerMetaData} from "./DTComponentWithMeta.double";
import {defaultOptions, KeyTest} from "./DTBunch.double";
import {DTErrorStub} from "./DTError.double";

/**
 * Special test suite for copy overridden method
 * Unfortunately copy is very hard to mock correctly in Javascript, due to constructor mocks
 * These test doesn't handle the DOC
 * Mock for :
 *   - DTBunch
 *   - DTElement
 *   - DTPlayer
 */

describe('Inherited method copy', () => {
  describe('DTBunch copy()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    })

    test('copy a bunch - simple case with id and key', () => {
      const bunch = new DTBunch(KeyTest);
      const bunchCopy = bunch.copy();

      expect(bunch.getId() === bunchCopy.getId()).toBeFalsy();
      expect(bunch.getKey() === bunchCopy.getKey()).toBeTruthy();
    });

    test('copy a bunch - not copy owner and context', () => {
      const bunch = new DTBunch(KeyTest);
      jest.spyOn(bunch, 'setContext').mockImplementation(function (context) {
        this._context = context;
      });
      jest.spyOn(bunch, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });

      bunch.setContext(new DTComponentStub())
      bunch.setOwner(new DTPlayerStub());

      const bunchCopy = bunch.copy();
      jest.spyOn(bunchCopy, 'getContext').mockImplementation(function () {
        return this._context;
      });
      jest.spyOn(bunchCopy, 'getOwner').mockImplementation(function () {
        return this._owner;
      });

      expect(bunchCopy.getContext()).toBeUndefined();
      expect(bunchCopy.getOwner()).toBeUndefined();
    });

    test('copy a bunch - copy meta-data and globalOptions', () => {
      const copiedOptions = {
        inheritOwner: true,
        replaceIndex: true,
        virtualContext: true,
      }
      const bunch = new DTBunch('', [], copiedOptions);
      jest.spyOn(bunch, 'getManyMeta').mockImplementation(function () {
        return BunchMetaData;
      });

      const bunchCopy = bunch.copy();

      expect(bunchCopy.getManyMeta()).toStrictEqual(BunchMetaData);
      expect(bunchCopy.getOptions()).toStrictEqual({
        ...defaultOptions,
        ...copiedOptions,
      });
    });

    test('copy a bunch - empty errors', () => {
      const bunch = new DTBunch(KeyTest, [], { errors: true });
      bunch.triggerError(new DTErrorStub());
      bunch.triggerError(new DTErrorStub());

      const bunchCopy = bunch.copy();

      expect(bunchCopy.getErrors().length).toBe(0);
    });

    test('copy a bunch with items - default case', () => {
      const items: Array<DTElement<IMetaDataTest>> = [
        new DTElement(),
        new DTElement(),
        new DTElement(),
      ];
      jest.spyOn(items[0], 'copy');
      jest.spyOn(items[1], 'copy');
      jest.spyOn(items[2], 'copy');
      const bunch = new DTBunch<DTElement<IMetaDataTest>, IMetaDataTest>(KeyTest, items);

      const bunchCopy = bunch.copy();

      expect(bunchCopy.getAll().length).toBe(3);
      expect((items[0].copy as any).mock.calls.length).toBe(1);
      expect((items[1].copy as any).mock.calls.length).toBe(1);
      expect((items[2].copy as any).mock.calls.length).toBe(1);
    });

    test('copy a bunch with items - virtual context case', () => {
      const items: Array<DTElement<IMetaDataTest>> = [
        new DTElement(),
        new DTElement(),
        new DTElement(),
      ];
      jest.spyOn(items[0], 'copy');
      jest.spyOn(items[1], 'copy');
      jest.spyOn(items[2], 'copy');
      const bunch = new DTBunch<DTElement<IMetaDataTest>, IMetaDataTest>(KeyTest, items, { virtualContext: true });

      const bunchCopy = bunch.copy();

      expect(bunchCopy.getAll().length).toBe(3);
      expect((items[0].copy as any).mock.calls.length).toBe(0);
      expect((items[1].copy as any).mock.calls.length).toBe(0);
      expect((items[2].copy as any).mock.calls.length).toBe(0);
    });
  });

  describe('DTElement copy()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    })

    test('copy an element - simple case with id and key', () => {
      const element = new DTElement(KeyTest);
      const elementCopy = element.copy();

      expect(element.getId() === elementCopy.getId()).toBeFalsy();
      expect(element.getKey() === elementCopy.getKey()).toBeTruthy();
    });

    test('copy an element - not copy context', () => {
      const element = new DTElement(KeyTest);
      jest.spyOn(element, 'setContext').mockImplementation(function (context) {
        this._context = context;
      });

      element.setContext(new DTComponentStub());

      const elementCopy = element.copy();
      jest.spyOn(elementCopy, 'getContext').mockImplementation(function () {
        return this._context;
      });

      expect(elementCopy.getContext()).toBeUndefined();
    });

    test('copy an element - copy meta-data and options', () => {
      const element = new DTElement(KeyTest, { errors: true });
      jest.spyOn(element, 'getManyMeta').mockImplementation(function () {
        return HaileiMetaData;
      });

      const elementCopy = element.copy();

      expect(elementCopy.getManyMeta()).toStrictEqual(HaileiMetaData);
      expect(elementCopy.getOptions()).toStrictEqual({ errors: true });
    });

    test('copy an element - empty errors', () => {
      const element = new DTElement(KeyTest, { errors: true });
      element.triggerError(new DTErrorStub());
      element.triggerError(new DTErrorStub());

      const elementCopy = element.copy();

      expect(elementCopy.getErrors().length).toBe(0);
    });
  });

  describe('DTPlayer copy()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    })

    test('copy a player - simple case with id and key', () => {
      const player = new DTPlayer(KeyTest);
      const playerCopy = player.copy();

      expect(player.getId() === playerCopy.getId()).toBeFalsy();
      expect(player.getKey() === playerCopy.getKey()).toBeTruthy();
    });

    test('copy a player - not copy context', () => {
      const player = new DTPlayer(KeyTest);
      jest.spyOn(player, 'setContext').mockImplementation(function (context) {
        this._context = context;
      });

      player.setContext(new DTComponentStub());

      const playerCopy = player.copy();
      jest.spyOn(playerCopy, 'getContext').mockImplementation(function () {
        return this._context;
      });

      expect(playerCopy.getContext()).toBeUndefined();
    });

    test('copy a player - copy meta-data and options', () => {
      const player = new DTPlayer(KeyTest, { errors: true });
      jest.spyOn(player, 'getManyMeta').mockImplementation(function () {
        return PlayerMetaData;
      });

      const playerCopy = player.copy();

      expect(playerCopy.getManyMeta()).toStrictEqual(PlayerMetaData);
      expect(playerCopy.getOptions()).toStrictEqual({ errors: true });
    });

    test('copy a player - empty errors', () => {
      const player = new DTPlayer(KeyTest, { errors: true });
      player.triggerError(new DTErrorStub());
      player.triggerError(new DTErrorStub());

      const playerCopy = player.copy();

      expect(playerCopy.getErrors().length).toBe(0);
    });
  });
});
