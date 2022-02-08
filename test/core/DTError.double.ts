import { DTError } from '../../src';
import { DTComponentStub } from './DTComponent.double';

// Global Variables
export const CodeTest = 'DTError-code-123456';
export const MessageTest = 'DTError-message-test';
export const TimestampTest = 1500000000000;

// Stub for Error (used for other tests)
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

// Mock Constructor for DTError
export class DTErrorMock extends DTError {
  constructor(setComponents = false) {
    super('', '');
    this.code = CodeTest;
    this.message = MessageTest;
    this.timestamp = new Date(TimestampTest);
    if (setComponents) {
      this.initiator = new DTComponentStub('initiator');
      this.convicted = new DTComponentStub('convicted');
    }
  }
}
