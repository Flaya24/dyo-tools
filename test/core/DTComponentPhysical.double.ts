import {DTComponentPhysical, DTComponentWithMeta} from "../../src";
import {IMetaDataTest, mockOverriddenMethods as parentMockMethods} from "./DTComponentWithMeta.double";
import {jest} from "@jest/globals";
import {DTPlayerStub} from "./DTPlayer.double";

/******************** MOCK DEPENDENCIES
 * Dependencies used by the component are mocked with Jest
 * *****/
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTComponentWithMeta');
// Add specific mock for inherited methods to have a basic implementation
parentMockMethods(DTComponentWithMeta);
// inheritance method : Check the correct inheritance
export const inheritance = () => {
    return DTComponentPhysical.prototype instanceof DTComponentWithMeta;
}

/******************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * *****/
export const IDTest = "DTComponentPhysical-id-1234567";
export const KeyTest = "DTComponentPhysical-key-1234567";
export const ComponentTypeTest = "DTComponentPhysical-componentType-test";
export const ToObjectTest = { type: "DTComponentPhysical-test-toObject" };
export const ToStringTest = "DTComponentPhysical-test-toString";

/******************** STUB ABSTRACT IMPLEMENTATION
 * Implementation of abstract component class for tests
 * *****/
export class DTComponentPhysicalImpl extends DTComponentPhysical<IMetaDataTest> {
    protected _componentType: string = ComponentTypeTest;

    copy(): DTComponentPhysical<IMetaDataTest> {
        return this;
    }

    toObject(): any {
        return ToObjectTest;
    }

    toString(): string {
        return ToStringTest;
    }

    do(): void {
    }
}

/******************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * *****/
export class DTComponentPhysicalTest extends DTComponentPhysicalImpl {
    th_get_owner(): DTPlayerStub {
        return this._owner;
    }

    th_set_owner(owner: DTPlayerStub): void {
        this._owner = owner;
    }
}

/******************** STUB CLASS
 * Stub class, for using in other component
 * *****/
export class DTComponentPhysicalStub extends DTComponentPhysicalTest {
    private readonly stubId: string;

    constructor(idSuffix: string = "") {
        super();
        this.stubId = IDTest + (idSuffix && `-${idSuffix}`);
    }

    getId() {
        return this.stubId;
    }
}

/******************** HELPER METHODS
 * Additional helper methods to use with testing
 * *****/
// Mocked implementations for overridden methods (for children tests)
export function mockOverriddenMethods(mock: any) {
    // Constructor
    mock.prototype.constructor.mockImplementation(function (key?: string) {
        this._id = IDTest;
        this._key = key || this._id;
    })
}
