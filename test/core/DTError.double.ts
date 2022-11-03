import { DTError } from '../../src';
import { DTComponentStub } from './DTComponent.double';
import {expect} from "@jest/globals";
import {MockedFunction} from "ts-jest";
import DYOToolsComponent from "../../src/core/DTComponent";

/******************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * *****/
export const CodeTest = 'DTError-code-123456';
export const MessageTest = 'DTError-message-test';
export const TimestampTest = 1500000000000;

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

// // Mock Constructor for DTError
// export class DTErrorMock extends DTError {
//   constructor(setComponents = false) {
//     super('', '');
//     this.code = CodeTest;
//     this.message = MessageTest;
//     this.timestamp = new Date(TimestampTest);
//     if (setComponents) {
//       this.initiator = new DTComponentStub('initiator');
//       this.convicted = new DTComponentStub('convicted');
//     }
//   }
// }

/******************** HELPER METHODS
 * Additional helper methods to use with testing
 * *****/
export const checkCallForMockedDTError = (code, message, initiatorId, convictedId) => {
  const mockedErrorConstructor = DTError.prototype.constructor as MockedFunction<(code: string, message: string, initiator?: DYOToolsComponent, convicted?: DYOToolsComponent) => DTError>;
  if (!mockedErrorConstructor.mock) {
    throw new Error('The DTError Constructor is not a mock');
  } else {
    expect(mockedErrorConstructor.mock.calls.length).toBe(1);
    expect(mockedErrorConstructor.mock.calls[0][0]).toBe(code);
    expect(mockedErrorConstructor.mock.calls[0][1]).toBe(message);
    expect(mockedErrorConstructor.mock.calls[0][2].getId()).toBe(initiatorId);
    expect(mockedErrorConstructor.mock.calls[0][3].getId()).toBe(convictedId);
  }
};

