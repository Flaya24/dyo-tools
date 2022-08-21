import {DTComponent, DTComponentWithMeta} from "../../src";
import {jest} from "@jest/globals";

// Global test variables
export const IDTest = "DTComponent-id-1234567";
export const KeyTest = "DTComponent-key-1234567";
export const ComponentTypeTest = "DTComponent-componentType-test";
export const ToObjectTest = { type: "DTComponent-test-toObject" };
export const ToStringTest = "DTComponent-test-toString";
export const DomainTest = "DTComponent-domain-test";
export const SubKindTest = "DTComponent-subkind-test";

// Test Child for DTComponent class (mocked abstract methods)
export class DTComponentTest extends DTComponent {
    protected _componentType: string = ComponentTypeTest;

    copy(): DTComponent {
        return this;
    }

    toObject(): any {
        return ToObjectTest;
    }

    toString(): string {
        return ToStringTest;
    }
}

// Mock constructor for DTComponentTest class (getter tests)
interface IDTComponentTestMockProps {
    componentType?: string
    domain?: string
    subKind?: string
    context?: DTComponent
}

export class DTComponentTestMock extends DTComponentTest {
    constructor(props?: IDTComponentTestMockProps) {
        super();
        this._id = IDTest;
        this._key = KeyTest;
        if (props) {
            this._componentType = props.componentType || ComponentTypeTest;
            this._domain = props.domain || DomainTest;
            this._subKind = props.subKind || SubKindTest;
            this._context = props.context || undefined;
        } else {
            this._componentType = this._componentType || undefined;
            this._domain = undefined;
            this._subKind = undefined;
            this._context = undefined;
        }

    }
}

// Stub for Component (used for other tests)
export class DTComponentStub extends DTComponentTest {
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
    // Constructor
    mock.prototype.constructor.mockImplementation(function (key?: string) {
        this._id = IDTest;
        this._key = key || this._id;
    })
}
