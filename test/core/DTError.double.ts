import {DTError} from '../../src';
import {expect} from "@jest/globals";
import {MockedFunction} from "ts-jest";
import DYOToolsComponent from "../../src/core/DTComponent";

/******************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * *****/
export const CodeTest = 'DTError-code-123456';
export const MessageTest = 'DTError-message-test';
export const TimestampTest = 1500000000000;

/******************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * *****/
export class DTErrorTest extends DTError {
  th_get_code(): string {
    return this.code;
  }

  th_get_message(): string {
    return this.message;
  }

  th_get_timestamp(): Date {
    return this.timestamp;
  }

  th_set_timestamp(timestamp: Date): void {
    this.timestamp = timestamp;
  }

  th_get_initiator(): DYOToolsComponent {
    return this.initiator;
  }

  th_set_initiator(initiator: DYOToolsComponent): void {
    this.initiator = initiator;
  }

  th_get_convicted(): DYOToolsComponent {
    return this.convicted;
  }

  th_set_convicted(convicted: DYOToolsComponent): void {
    this.convicted = convicted;
  }
}

/******************** STUB CLASS
 * Stub class, for using in other component
 * *****/
export class DTErrorStub extends DTError {
  constructor() {
    super('', '');
    this.code = CodeTest;
    this.message = MessageTest;
    this.timestamp = new Date(Math.random() * 100000000);
  }

  getCode(): string {
    return CodeTest;
  }

  getMessage(): string {
    return MessageTest;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}

/******************** HELPER METHODS
 * Additional helper methods to use with testing
 * *****/
export const checkCallForMockedDTError = (code, message, initiatorId, convictedId?) => {
  const mockedErrorConstructor = DTError.prototype.constructor as MockedFunction<(code: string, message: string, initiator?: DYOToolsComponent, convicted?: DYOToolsComponent) => DTError>;
  if (!mockedErrorConstructor.mock) {
    throw new Error('The DTError Constructor is not a mock');
  } else {
    expect(mockedErrorConstructor.mock.calls.length).toBe(1);
    expect(mockedErrorConstructor.mock.calls[0][0]).toBe(code);
    expect(mockedErrorConstructor.mock.calls[0][1]).toBe(message);
    expect(mockedErrorConstructor.mock.calls[0][2].getId()).toBe(initiatorId);
    if (convictedId) {
      expect(mockedErrorConstructor.mock.calls[0][3].getId()).toBe(convictedId);
    }
  }
};

