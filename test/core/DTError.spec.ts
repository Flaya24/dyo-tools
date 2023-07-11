import {afterEach, beforeEach, describe, expect, jest, test,} from '@jest/globals';
import {CodeTest, DTErrorTest, MessageTest, TimestampTest,} from './DTError.double';
import {DTComponentStub, IDTest as ComponentIdTest} from './DTComponent.double';

/************************* TESTS SUITES *******************************/
describe('class DYOToolsError', () => {
  let errorTest: DTErrorTest;

  beforeEach(() => {
    errorTest = new DTErrorTest(CodeTest, MessageTest);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor()', () => {
    test('creation with standard field (code, message and timestamp)', () => {
      const newError = new DTErrorTest(CodeTest, MessageTest);
      const currentDate = new Date();

      expect(newError.th_get_code()).toBe(CodeTest);
      expect(newError.th_get_message()).toBe(MessageTest);
      expect(newError.th_get_timestamp().toDateString()).toBe(currentDate.toDateString());
      expect(newError.th_get_timestamp().toTimeString()).toBe(currentDate.toTimeString());
      expect(newError.th_get_initiator()).toBeUndefined();
      expect(newError.th_get_convicted()).toBeUndefined();
    });

    test('creation with initiator component', () => {
      const initiatorMock = new DTComponentStub('initiator');
      const newError = new DTErrorTest(CodeTest, MessageTest, initiatorMock);

      expect(newError.th_get_initiator().getId()).toBe(`${ComponentIdTest}-initiator`);
    });

    test('creation with initiator and convicted component', () => {
      const initiatorMock = new DTComponentStub('initiator');
      const convictedMock = new DTComponentStub('convicted');
      const newError = new DTErrorTest(CodeTest, MessageTest, initiatorMock, convictedMock);

      expect(newError.th_get_convicted().getId()).toBe(`${ComponentIdTest}-convicted`);
    });
  });

  describe('getCode()', () => {
    test('return code property', () => {
      expect(errorTest.getCode()).toBe(CodeTest);
    });
  });

  describe('getMessage()', () => {
    test('return message property', () => {
      expect(errorTest.getMessage()).toBe(MessageTest);
    });
  });

  describe('getTimestamp()', () => {
    test('return timestamp property', () => {
      errorTest.th_set_timestamp(new Date(TimestampTest));

      expect(errorTest.getTimestamp().getTime()).toBe(TimestampTest);
    });
  });

  describe('getInitiator()', () => {
    test('return empty initiator component by default', () => {
      expect(errorTest.getInitiator()).toBeUndefined();
    });

    test('return initiator component when set', () => {
      errorTest.th_set_initiator(new DTComponentStub('initiator'));

      expect(errorTest.getInitiator().getId()).toBe(`${ComponentIdTest}-initiator`);
    });
  });

  describe('getConvicted()', () => {
    test('return empty convicted component by default', () => {
      expect(errorTest.getConvicted()).toBeUndefined();
    });

    test('return convicted component when set', () => {
      errorTest.th_set_convicted(new DTComponentStub('convicted'));

      expect(errorTest.getConvicted().getId()).toBe(`${ComponentIdTest}-convicted`);
    });
  });
});
