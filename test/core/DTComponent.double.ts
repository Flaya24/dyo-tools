import {DTComponent} from "../../src";
import {DTErrorStub} from "./DTError.double";
import {jest} from "@jest/globals";
import {DTComponentOptions} from "../../src/types";
interface IOptionsTest extends DTComponentOptions {
    option1: boolean
    option2: boolean
}

/******************** STUB PROPERTIES CONSTANTS
 * Fixed properties to use with double classes, avoid auto generated and easy checking on test
 * *****/
export const IDTest = "DTComponent-id-1234567";
export const KeyTest = "DTComponent-key-1234567";
export const ComponentTypeTest = "DTComponent-componentType-test";
export const ToObjectTest = { type: "DTComponent-test-toObject" };
export const ToStringTest = "DTComponent-test-toString";
export const DomainTest = "DTComponent-domain-test";
export const SubKindTest = "DTComponent-subkind-test";

/******************** STUB ABSTRACT IMPLEMENTATION
 * Implementation of abstract component class for tests
 * *****/
export class DTComponentImpl extends DTComponent<IOptionsTest> {
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

/******************** HELPER TEST CLASS
 * Helper test class, inherits the main component
 * Providing methods to property access and other facilities, in order to avoid using class methods
 * *****/
export class DTComponentTest extends DTComponentImpl {
    th_get_id(): string {
        return this._id;
    }

    th_set_id(id: string): void {
        this._id = id;
    }

    th_get_key(): string {
        return this._key;
    }

    th_set_key(key: string): void {
        this._key = key;
    }

    th_set_componentType(componentType: string): void {
        this._componentType = componentType;
    }

    th_set_domain(domain: string): void {
        this._domain = domain;
    }

    th_set_subKind(subKind: string): void {
        this._subKind = subKind;
    }

    th_get_context(): DTComponent | undefined {
        return this._context;
    }

    th_set_context(context: DTComponentTest): void {
        this._context = context;
    }

    th_get_errors(): Array<DTErrorStub> {
       return this._errors;
    }

    th_set_errors(errors: Array<DTErrorStub>): void {
        this._errors = errors;
    }

    th_get_options(): any {
        return this._options;
    }

    th_set_options(options: any): void {
        this._options = options;
    }
}

/******************** STUB CLASS
 * Stub class, for using in other component
 * *****/
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

/******************** HELPER METHODS
 * Additional helper methods to use with testing
 * *****/
// Mocked implementations for overridden methods (for children tests)
export function mockOverriddenMethods(mock: any) {
    // Constructor
    mock.prototype.constructor.mockImplementation(function (key?: string) {
        this._id = IDTest;
        this._key = key || this._id;
        this._errors = [];
        return this;
    })
}

// Hierarchy Simulation
type simulateHierarchyOptions = {
    mockGetContext: boolean
}
export function simulateHierarchy(
  ranks: number = 3,
  options: simulateHierarchyOptions = { mockGetContext: false }): DTComponentTest[] {
    const hierarchyComponents = [];
    let lastRankComponent: DTComponentTest;

    for (let i = 1; i <= ranks; i++) {
        const componentRank = new DTComponentTest();
        componentRank.th_set_componentType(`rank${i}`);
        if (lastRankComponent) {
            componentRank.th_set_context(lastRankComponent);
        }

        if (options.mockGetContext) {
            if (lastRankComponent) {
                const lastComponentRankScoped = lastRankComponent;
                jest.spyOn(componentRank, 'getContext').mockImplementation(function () {
                    return lastComponentRankScoped;
                });
            } else {
                jest.spyOn(componentRank, 'getContext').mockImplementation(function () {
                    return undefined;
                });
            }
        }

        hierarchyComponents.push(componentRank);
        lastRankComponent = componentRank;
    }

    return hierarchyComponents;
}
