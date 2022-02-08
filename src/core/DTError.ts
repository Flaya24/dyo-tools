import DYOToolsComponent from './DTComponent';

export default class DYOToolsError extends Error {
  /**
   * Error code.
   *
   * Available error codes are :
   * * **id_conflict** : _id property conflict between two DTComponent in the same context.
   * * **key_conflict** : _key property conflict between two DTComponent in the same context.
   */
  protected code: string;

  /**
   * Error trigger date.
   */
  protected timestamp: Date;

  /**
   * DTComponent which trigger the error during its current execution process.
   */
  protected initiator?: DYOToolsComponent;

  /**
   * DTComponent which is directly involved in the error trigger.
   */
  protected convicted?: DYOToolsComponent;

  /**
   * Set all property for a new DTError.
   *
   * @param code
   * @param message
   * @param initiator
   * @param convicted
   */
  constructor(code: string, message: string, initiator?: DYOToolsComponent, convicted?: DYOToolsComponent) {
    super(message);
    this.code = code;
    this.timestamp = new Date();
    this.initiator = initiator;
    this.convicted = convicted;
  }

  /**
   * Getter for code property.
   */
  getCode(): string {
    return this.code;
  }

  /**
   * Getter for message property (inherited from Error).
   */
  getMessage(): string {
    return this.message;
  }

  /**
   * Getter for timestamp property.
   */
  getTimestamp(): Date {
    return this.timestamp;
  }

  /**
   * Getter for initiator property.
   */
  getInitiator(): DYOToolsComponent {
    return this.initiator;
  }

  /**
   * Getter for convicted property.
   */
  getConvicted(): DYOToolsComponent {
    return this.convicted;
  }
}
