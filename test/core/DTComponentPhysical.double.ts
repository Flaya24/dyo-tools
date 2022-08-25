import {DTComponentPhysical, DTComponentWithMeta} from "../../src";
import {IMetaDataTest, mockOverriddenMethods as parentMockMethods} from "./DTComponentWithMeta.double";
import {jest} from "@jest/globals";

// Global test variables
export const IDTest = "DTComponentPhysical-id-1234567";
export const KeyTest = "DTComponentPhysical-key-1234567";
export const ComponentTypeTest = "DTComponentPhysical-componentType-test";
export const ToObjectTest = { type: "DTComponentPhysical-test-toObject" };
export const ToStringTest = "DTComponentPhysical-test-toString";

// Mock Inheritance
jest.mock('../../src/core/DTComponent');
jest.mock('../../src/core/DTComponentWithMeta');
parentMockMethods(DTComponentWithMeta);

export const inheritance = () => {
    return DTComponentPhysical.prototype instanceof DTComponentWithMeta;
}

// Test Child for DTComponentPhysical class (mocked abstract methods)
export class DTComponentPhysicalTest extends DTComponentPhysical<IMetaDataTest> {
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

// Mock constructor for DTComponentPhysicalTest class (getter tests)
export class DTComponentPhysicalTestMock extends DTComponentPhysicalTest {
    constructor() {
        super();
        this._id = IDTest;
        this._key = KeyTest;
    }
}

// Stub for ComponentPhysical (used for other tests)
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

// Mocked implementations for overridden methods (for children tests)
export function mockOverriddenMethods(mock: any) {
    // Constructor (mocked for copy)
    mock.prototype.constructor.mockImplementation(function (key?: string) {
        this._id = IDTest;
        this._key = key || this._id;
    })
}
