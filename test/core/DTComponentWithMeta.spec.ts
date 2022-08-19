import {
  jest, describe, expect, test, beforeEach, afterEach,
} from '@jest/globals';
import {
  DTComponentWithMetaTestMock, HaileiMetaData, MeldrineMetaData, IMetaDataTest, YssaliaMetaData,
} from './DTComponentWithMeta.double';

describe('class DYOToolsComponent', () => {
  let componentMock: DTComponentWithMetaTestMock;

  beforeEach(() => {
    componentMock = new DTComponentWithMetaTestMock(HaileiMetaData);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getMeta()', () => {
    test('return one meta by key', () => {
      expect(componentMock.getMeta('name')).toBe(HaileiMetaData.name);
    });

    test('return undefined if meta is empty', () => {
      componentMock = new DTComponentWithMetaTestMock();

      expect(componentMock.getMeta('name')).toBeUndefined();
    });
  });

  describe('setMeta()', () => {
    test('set a new value for a meta', () => {
      jest.spyOn(componentMock, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });

      componentMock.setMeta('name', MeldrineMetaData.name);
      const newMeta = componentMock.getManyMeta();

      expect(newMeta.name === HaileiMetaData.name).toBeFalsy();
      expect(newMeta.rank === HaileiMetaData.rank).toBeTruthy();
      expect(newMeta.queen === HaileiMetaData.queen).toBeTruthy();
      expect(newMeta.kd[0] === HaileiMetaData.kd[0]).toBeTruthy();
      expect(newMeta.tribes[0] === HaileiMetaData.tribes[0]).toBeTruthy();
    });
  });

  describe('getManyMeta()', () => {
    test('return all meta', () => {
      expect(componentMock.getManyMeta()).toStrictEqual(HaileiMetaData);
    });

    test('return meta by keys', () => {
      const keys: Array<keyof IMetaDataTest> = ['name', 'kd', 'queen'];

      expect(componentMock.getManyMeta(keys)).toStrictEqual({
        name: HaileiMetaData.name,
        kd: HaileiMetaData.kd,
        queen: HaileiMetaData.queen,
      });
    });

    test('return meta by keys - unexisting keys', () => {
      componentMock = new DTComponentWithMetaTestMock(YssaliaMetaData);
      const keys: Array<keyof IMetaDataTest> = ['name', 'rank', 'tribes'];

      expect(componentMock.getManyMeta(keys)).toStrictEqual({
        name: YssaliaMetaData.name,
      });
    });

    test('return empty object if meta is empty', () => {
      componentMock = new DTComponentWithMetaTestMock();
      const keys: Array<keyof IMetaDataTest> = ['name', 'rank', 'tribes'];

      expect(componentMock.getManyMeta(keys)).toStrictEqual({});
    });
  });

  describe('setManyMeta()', () => {
    test('set new values', () => {
      jest.spyOn(componentMock, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });
      const setValues: Partial<IMetaDataTest> = {
        name: MeldrineMetaData.name,
        queen: MeldrineMetaData.queen,
        rank: MeldrineMetaData.rank,
      };

      componentMock.setManyMeta(setValues);
      const newMeta = componentMock.getManyMeta();

      expect(newMeta.name === HaileiMetaData.name).toBeFalsy();
      expect(newMeta.queen === HaileiMetaData.queen).toBeFalsy();
      expect(newMeta.kd[0] === HaileiMetaData.kd[0]).toBeTruthy();
      expect(newMeta.rank === HaileiMetaData.rank).toBeFalsy();
      expect(newMeta.tribes[0] === HaileiMetaData.tribes[0]).toBeTruthy();
    });

    test('set no new values', () => {
      jest.spyOn(componentMock, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });

      componentMock.setManyMeta({});
      const newMeta = componentMock.getManyMeta();

      expect(newMeta).toStrictEqual(HaileiMetaData);
    });
  });
});
