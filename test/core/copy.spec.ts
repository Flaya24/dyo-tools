import {describe, expect, jest, test,} from '@jest/globals';
import {DTBunch, DTElement} from '../../src';
import {DTComponentStub} from "./DTComponent.double";
import {DTPlayerStub} from "./DTPlayer.double";
import {BunchMetaData, IMetaDataTest} from "./DTComponentWithMeta.double";
import {defaultOptions, KeyTest} from "./DTBunch.double";
import {DTErrorStub} from "./DTError.double";
import DYOToolsElement from "../../src/core/DTElement";

/**
 * Special test suite for copy overridden method
 * Unfortunately copy is very hard to mock correctly in Javascript, due to constructor mocks
 * These test doesn't handle the DOC
 * Mock for :
 *   - DTBunch
 *   - DTElement
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
      const items: Array<DYOToolsElement<IMetaDataTest>> = [
        new DTElement(),
        new DTElement(),
        new DTElement(),
      ];
      jest.spyOn(items[0], 'copy');
      jest.spyOn(items[1], 'copy');
      jest.spyOn(items[2], 'copy');
      const bunch = new DTBunch<DYOToolsElement<IMetaDataTest>, IMetaDataTest>(KeyTest, items);

      const bunchCopy = bunch.copy();

      expect(bunchCopy.getAll().length).toBe(3);
      expect((items[0].copy as any).mock.calls.length).toBe(1);
      expect((items[1].copy as any).mock.calls.length).toBe(1);
      expect((items[2].copy as any).mock.calls.length).toBe(1);
    });

    test('copy a bunch with items - virtual context case', () => {
      const items: Array<DYOToolsElement<IMetaDataTest>> = [
        new DTElement(),
        new DTElement(),
        new DTElement(),
      ];
      jest.spyOn(items[0], 'copy');
      jest.spyOn(items[1], 'copy');
      jest.spyOn(items[2], 'copy');
      const bunch = new DTBunch<DYOToolsElement<IMetaDataTest>, IMetaDataTest>(KeyTest, items, { virtualContext: true });

      const bunchCopy = bunch.copy();

      expect(bunchCopy.getAll().length).toBe(3);
      expect((items[0].copy as any).mock.calls.length).toBe(0);
      expect((items[1].copy as any).mock.calls.length).toBe(0);
      expect((items[2].copy as any).mock.calls.length).toBe(0);
    });
  });
});
