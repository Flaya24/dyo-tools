import {beforeEach, describe, expect, test} from '@jest/globals';
import { DTPlayerMock, IDTest, KeyTest, inheritance } from './DTPlayer.double';
import { DTComponentTestMock } from './DTComponent.double';
import { PlayerMetaData } from './DTComponentWithMeta.double';

describe('class DYOToolsPlayer', () => {
  let playerMock: DTPlayerMock;

  beforeEach(() => {
    playerMock = new DTPlayerMock();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('inheritance', () => {
    test('check good inheritance for class', () => {
      expect(inheritance()).toBeTruthy();
    });
  });

  describe('_componentType', () => {
    test('componentType must be "player"', () => {
      expect(playerMock.getComponentType()).toBe('player');
    });
  });

  describe('copy()', () => {
    test('copy a player - simple case with id and key', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      const playerMockCopy = playerMock.copy();
      jest.spyOn(playerMock, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(playerMockCopy, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(playerMock, 'getKey').mockImplementation(function () {
        return this._key;
      });
      jest.spyOn(playerMockCopy, 'getKey').mockImplementation(function () {
        return this._key;
      });

      expect(playerMock.getId() === playerMockCopy.getId()).toBeFalsy();
      expect(playerMock.getKey() === playerMockCopy.getKey()).toBeTruthy();
    });

    test('copy a player - not copy context', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      jest.spyOn(playerMock, 'setContext').mockImplementation(function (context) {
        this._context = context;
      });

      playerMock.setContext(new DTComponentTestMock());

      const playerMockCopy = playerMock.copy();
      jest.spyOn(playerMockCopy, 'getContext').mockImplementation(function () {
        return this._context;
      });

      expect(playerMockCopy.getContext()).toBeUndefined();
    });

    test('copy a player - copy meta-data', () => {
      // This test doesn't mock the DOC (Depended-on Component) correctly
      // Need to change implementation to implement correct testing
      playerMock.setManyMeta({});

      const playerMockCopy = playerMock.copy();
      jest.spyOn(playerMockCopy, 'getManyMeta').mockImplementation(function () {
        return this._meta;
      });

      expect(playerMockCopy.getManyMeta()).toStrictEqual(PlayerMetaData);
    });
  });

  describe('toObject()', () => {
    test('toObject output standard', () => {
      const toObjectPlayer = playerMock.toObject();

      expect(Object.keys(toObjectPlayer)).toStrictEqual(['id', 'key', 'type']);
      expect(toObjectPlayer.id).toBe(IDTest);
      expect(toObjectPlayer.key).toBe(KeyTest);
      expect(toObjectPlayer.type).toBe('player');
    });

    test('toObject output standard with meta', () => {
      playerMock.setManyMeta({});

      const toObjectPlayer = playerMock.toObject();
      expect(Object.keys(toObjectPlayer)).toStrictEqual(['id', 'key', 'type', 'meta']);
      expect(toObjectPlayer.meta).toStrictEqual(PlayerMetaData);
    });
  });

  describe('toString()', () => {
    test('string output standard', () => {
      const toStringElement = playerMock.toString();

      expect(toStringElement).toBe(`Component ${KeyTest} - Type: Player`);
    });
  });
});
