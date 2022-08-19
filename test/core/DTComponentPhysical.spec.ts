import {beforeEach, describe, test} from '@jest/globals';
import {DTPlayerStub, IDTest as IDPlayerTest,} from './DTPlayer.double';
import {DTComponentPhysicalTestMock, inheritance} from './DTComponentPhysical.double';

describe('class DYOToolsComponentPhysical', () => {
  let componentPhysicalMock: DTComponentPhysicalTestMock;

  beforeEach(() => {
    componentPhysicalMock = new DTComponentPhysicalTestMock();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(inheritance()).toBeTruthy();
    });
  });

  describe('getOwner()', () => {
    test('return empty owner by default', () => {
      expect(componentPhysicalMock.getOwner()).toBeUndefined();
    });

    test('return owner when set', () => {
      const owner = new DTPlayerStub();
      jest.spyOn(componentPhysicalMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });
      componentPhysicalMock.setOwner(owner);

      expect(componentPhysicalMock.getOwner().getId()).toBe(IDPlayerTest);
    });
  });

  describe('setOwner()', () => {
    test('add a new owner', () => {
      const owner = new DTPlayerStub();
      jest.spyOn(componentPhysicalMock, 'getOwner').mockImplementation(function () {
        return this._owner;
      });
      componentPhysicalMock.setOwner(owner);

      expect(componentPhysicalMock.getOwner().getId()).toBe(IDPlayerTest);
    });
  });

  describe('removeOwner()', () => {
    test('remove the current Owner', () => {
      const owner = new DTPlayerStub();
      jest.spyOn(componentPhysicalMock, 'setOwner').mockImplementation(function (owner) {
        this._owner = owner;
      });
      jest.spyOn(componentPhysicalMock, 'getOwner').mockImplementation(function () {
        return this._owner;
      });
      componentPhysicalMock.setOwner(owner);

      componentPhysicalMock.removeOwner();
      expect(componentPhysicalMock.getOwner()).toBeUndefined();
    });
  });
});
