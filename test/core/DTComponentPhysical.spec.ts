import {beforeEach, describe, jest, test} from '@jest/globals';
import {DTPlayerStub, IDTest as IDPlayerTest,} from './DTPlayer.double';
import {mockOverriddenMethods} from "./DTComponentWithMeta.double";
import {DTComponentPhysicalTest} from './DTComponentPhysical.double';
import {DTComponentPhysical, DTComponentWithMeta} from "../../src";

/******************** MOCK DEPENDENCIES
 * All Dependencies used by the component are mocked with Jest
 * *****/
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTComponentWithMeta');
// Add specific mock for inherited methods to have a basic implementation
mockOverriddenMethods(DTComponentWithMeta);

/************************* TESTS SUITES *******************************/
describe('class DYOToolsComponentPhysical', () => {
  let componentPhysicalTest: DTComponentPhysicalTest;

  beforeEach(() => {
    componentPhysicalTest = new DTComponentPhysicalTest();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(DTComponentPhysical.prototype instanceof DTComponentWithMeta).toBeTruthy();
    });
  });

  describe('getOwner()', () => {
    test('return empty owner by default', () => {
      expect(componentPhysicalTest.getOwner()).toBeUndefined();
    });

    test('return owner when set', () => {
      const owner = new DTPlayerStub();
      componentPhysicalTest.th_set_owner(owner);

      expect(componentPhysicalTest.getOwner().getId()).toBe(IDPlayerTest);
    });
  });

  describe('setOwner()', () => {
    test('add a new owner', () => {
      const owner = new DTPlayerStub();
      componentPhysicalTest.setOwner(owner);

      expect(componentPhysicalTest.th_get_owner().getId()).toBe(IDPlayerTest);
    });
  });

  describe('removeOwner()', () => {
    test('remove the current Owner', () => {
      const owner = new DTPlayerStub();
      componentPhysicalTest.th_set_owner(owner);

      componentPhysicalTest.removeOwner();
      expect(componentPhysicalTest.th_get_owner()).toBeUndefined();
    });
  });
});
