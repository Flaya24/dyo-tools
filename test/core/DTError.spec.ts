import {
  afterEach, beforeEach, describe, expect, jest, test,
} from '@jest/globals';
import {
  CodeTest, DTErrorMock, MessageTest, TimestampTest,
} from './DTError.double';
import { DTError } from '../../src';
import { DTComponentStub, IDTest as ComponentIdTest } from './DTComponent.double';

describe('class DYOToolsError', () => {
  let errorMock: DTErrorMock;

  beforeEach(() => {
    errorMock = new DTErrorMock();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor()', () => {
    test('creation with standard field (code, message and timestamp)', () => {
      const newError = new DTError(CodeTest, MessageTest);
      const currentDate = new Date();
      jest.spyOn(newError, 'getCode').mockImplementation(function () {
        return this.code;
      });
      jest.spyOn(newError, 'getMessage').mockImplementation(function () {
        return this.message;
      });
      jest.spyOn(newError, 'getTimestamp').mockImplementation(function () {
        return this.timestamp;
      });
      jest.spyOn(newError, 'getInitiator').mockImplementation(function () {
        return this.initiator;
      });
      jest.spyOn(newError, 'getConvicted').mockImplementation(function () {
        return this.convicted;
      });

      expect(newError.getCode()).toBe(CodeTest);
      expect(newError.getMessage()).toBe(MessageTest);
      expect(newError.getTimestamp().toDateString()).toBe(currentDate.toDateString());
      expect(newError.getTimestamp().toTimeString()).toBe(currentDate.toTimeString());
      expect(newError.getInitiator()).toBeUndefined();
      expect(newError.getConvicted()).toBeUndefined();
    });

    test('creation with initiator component', () => {
      const initiatorMock = new DTComponentStub('initiator');
      const newError = new DTError(CodeTest, MessageTest, initiatorMock);
      jest.spyOn(newError, 'getInitiator').mockImplementation(function () {
        return this.initiator;
      });

      expect(newError.getInitiator().getId()).toBe(`${ComponentIdTest}-initiator`);
    });

    test('creation with initiator and convicted component', () => {
      const initiatorMock = new DTComponentStub('initiator');
      const convictedMock = new DTComponentStub('convicted');
      const newError = new DTError(CodeTest, MessageTest, initiatorMock, convictedMock);
      jest.spyOn(newError, 'getConvicted').mockImplementation(function () {
        return this.convicted;
      });

      expect(newError.getConvicted().getId()).toBe(`${ComponentIdTest}-convicted`);
    });
  });

  describe('getCode()', () => {
    test('return code property', () => {
      expect(errorMock.getCode()).toBe(CodeTest);
    });
  });

  describe('getMessage()', () => {
    test('return message property', () => {
      expect(errorMock.getMessage()).toBe(MessageTest);
    });
  });

  describe('getTimestamp()', () => {
    test('return timestamp property', () => {
      expect(errorMock.getTimestamp().getTime()).toBe(TimestampTest);
    });
  });

  describe('getInitiator()', () => {
    test('return initiator component', () => {
      const errorMockSet = new DTErrorMock(true);

      expect(errorMock.getInitiator()).toBeUndefined();
      expect(errorMockSet.getInitiator().getId()).toBe(`${ComponentIdTest}-initiator`);
    });
  });

  describe('getConvicted()', () => {
    test('return convicted component', () => {
      const errorMockSet = new DTErrorMock(true);

      expect(errorMock.getConvicted()).toBeUndefined();
      expect(errorMockSet.getConvicted().getId()).toBe(`${ComponentIdTest}-convicted`);
    });
  });
});
