import {afterEach, beforeEach, describe, expect, jest, test,} from '@jest/globals';
import {
  DTComponentWithMetaTest,
  HaileiMetaData,
  IMetaDataTest,
  MeldrineMetaData,
  YssaliaMetaData
} from './DTComponentWithMeta.double';
import {mockOverriddenMethods} from "./DTComponent.double";
import {DTComponent, DTComponentWithMeta} from "../../src";

/******************** MOCK DEPENDENCIES
 * All Dependencies used by the component are mocked with Jest
 * *****/
jest.mock('../../src/core/DTComponent');
mockOverriddenMethods(DTComponent);

/************************* TESTS SUITES *******************************/
describe('class DYOToolsComponentWithMeta', () => {
  let componentWithMetaTest: DTComponentWithMetaTest;

  beforeEach(() => {
    componentWithMetaTest = new DTComponentWithMetaTest();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(DTComponentWithMeta.prototype instanceof DTComponent).toBeTruthy();
    });
  });

  describe('getMeta()', () => {
    test('return undefined if meta is empty', () => {
      expect(componentWithMetaTest.getMeta('name')).toBeUndefined();
    });

    test('return one meta by key', () => {
      componentWithMetaTest.th_set_meta(HaileiMetaData);

      expect(componentWithMetaTest.getMeta('name')).toBe(HaileiMetaData.name);
    });
  });

  describe('setMeta()', () => {
    test('set a new value for a meta', () => {
      componentWithMetaTest.th_set_meta(HaileiMetaData);
      componentWithMetaTest.setMeta('name', MeldrineMetaData.name);

      const newMeta = componentWithMetaTest.th_get_meta();
      expect(newMeta.name === MeldrineMetaData.name).toBeTruthy();
      expect(newMeta.rank === HaileiMetaData.rank).toBeTruthy();
      expect(newMeta.queen === HaileiMetaData.queen).toBeTruthy();
      expect(newMeta.kd[0] === HaileiMetaData.kd[0]).toBeTruthy();
      expect(newMeta.tribes[0] === HaileiMetaData.tribes[0]).toBeTruthy();
    });
  });

  describe('getManyMeta()', () => {
    test('return empty object meta by default', () => {
      const keys: Array<keyof IMetaDataTest> = ['name', 'rank', 'tribes'];

      expect(componentWithMetaTest.getManyMeta()).toStrictEqual({});
      expect(componentWithMetaTest.getManyMeta(keys)).toStrictEqual({});
    });

    test('return all meta', () => {
      componentWithMetaTest.th_set_meta(HaileiMetaData);

      expect(componentWithMetaTest.getManyMeta()).toStrictEqual(HaileiMetaData);
    });

    test('return meta by keys', () => {
      componentWithMetaTest.th_set_meta(HaileiMetaData);
      const keys: Array<keyof IMetaDataTest> = ['name', 'kd', 'queen'];

      expect(componentWithMetaTest.getManyMeta(keys)).toStrictEqual({
        name: HaileiMetaData.name,
        kd: HaileiMetaData.kd,
        queen: HaileiMetaData.queen,
      });
    });

    test('return meta by keys - unexisting keys', () => {
      componentWithMetaTest.th_set_meta(YssaliaMetaData);
      const keys: Array<keyof IMetaDataTest> = ['name', 'rank', 'tribes'];

      expect(componentWithMetaTest.getManyMeta(keys)).toStrictEqual({
        name: YssaliaMetaData.name,
      });
    });
  });

  describe('setManyMeta()', () => {
    test('set new values', () => {
      componentWithMetaTest.th_set_meta(HaileiMetaData);
      const setValues: Partial<IMetaDataTest> = {
        name: MeldrineMetaData.name,
        queen: MeldrineMetaData.queen,
        rank: MeldrineMetaData.rank,
      };

      componentWithMetaTest.setManyMeta(setValues);

      const newMeta = componentWithMetaTest.th_get_meta();
      expect(newMeta.name === MeldrineMetaData.name).toBeTruthy();
      expect(newMeta.queen === MeldrineMetaData.queen).toBeTruthy();
      expect(newMeta.kd[0] === HaileiMetaData.kd[0]).toBeTruthy();
      expect(newMeta.rank === MeldrineMetaData.rank).toBeTruthy();
      expect(newMeta.tribes[0] === HaileiMetaData.tribes[0]).toBeTruthy();
    });

    test('set empty new values (keep former meta)', () => {
      componentWithMetaTest.th_set_meta(HaileiMetaData);

      componentWithMetaTest.setManyMeta({});

      expect(componentWithMetaTest.th_get_meta()).toStrictEqual(HaileiMetaData);
    });
  });
});
