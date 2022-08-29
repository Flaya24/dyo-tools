import {afterEach, beforeEach, describe, expect, jest, test,} from '@jest/globals';
import {
  ComponentTypeTest,
  DomainTest,
  DTComponentTest,
  DTComponentTestMock,
  IDTest,
  KeyTest,
  simulateHierarchy,
  SubKindTest,
} from './DTComponent.double';
import {DTErrorStub} from "./DTError.double";

describe('class DYOToolsComponent', () => {
  let componentMock: DTComponentTestMock;

  beforeEach(() => {
    componentMock = new DTComponentTestMock();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor()', () => {
    test('creation without key', () => {
      const component = new DTComponentTest();
      jest.spyOn(component, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(component, 'getKey').mockImplementation(function () {
        return this._key;
      });

      expect(component.getKey()).toBe(component.getId());
    });

    test('creation with key', () => {
      const component = new DTComponentTest(KeyTest);
      jest.spyOn(component, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(component, 'getKey').mockImplementation(function () {
        return this._key;
      });

      expect(component.getKey()).toBe(KeyTest);
      expect(component.getId() !== component.getKey()).toBeTruthy();
    });

    test('creations have unique ids', () => {
      const component = new DTComponentTest(KeyTest);
      const component2 = new DTComponentTest(KeyTest);
      jest.spyOn(component, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(component2, 'getId').mockImplementation(function () {
        return this._key;
      });

      expect(component.getId() !== component2.getId()).toBeTruthy();
    });
  });

  describe('getId()', () => {
    test('return id', () => {
      expect(componentMock.getId()).toBe(IDTest);
    });
  });

  describe('getKey()', () => {
    test('return key', () => {
      expect(componentMock.getKey()).toBe(KeyTest);
    });
  });

  describe('getComponentType()', () => {
    test('return componentType', () => {
      const componentMockSet = new DTComponentTestMock({ componentType: `${ComponentTypeTest}-set` });

      expect(componentMock.getComponentType()).toBe(ComponentTypeTest);
      expect(componentMockSet.getComponentType()).toBe(`${ComponentTypeTest}-set`);
    });
  });

  describe('getDomain()', () => {
    test('return domain', () => {
      const componentMockSet = new DTComponentTestMock({ domain: DomainTest });

      expect(componentMock.getDomain()).toBeUndefined();
      expect(componentMockSet.getDomain()).toBe(DomainTest);
    });
  });

  describe('getSubKind()', () => {
    test('return subkind', () => {
      const componentMockSet = new DTComponentTestMock({ subKind: SubKindTest });

      expect(componentMock.getSubKind()).toBeUndefined();
      expect(componentMockSet.getSubKind()).toBe(SubKindTest);
    });
  });

  describe('getContext()', () => {
    test('return context', () => {
      const component = new DTComponentTest();
      const componentMockSet = new DTComponentTestMock({ context: component });

      expect(componentMock.getContext()).toBeUndefined();
      expect(componentMockSet.getContext()).toStrictEqual(component);
    });

    test('return context with Hierarchy - simple case', () => {
      const [componentRank1, componentRank2, componentRank3] = simulateHierarchy();

      expect(componentRank3.getContext()).toStrictEqual(componentRank2);
      expect(componentRank3.getContext('rank2')).toStrictEqual(componentRank2);
      expect(componentRank3.getContext('rank1')).toStrictEqual(componentRank1);
      expect(componentRank3.getContext('rank0')).toBeUndefined();
    });

    test('return context with Hierarchy - same type case so return first one', () => {
      const [componentRank0, componentRank2, componentRank3] = simulateHierarchy();
      const componentRank1 = new DTComponentTestMock({ componentType: 'rank1', context: componentRank0 });

      jest.spyOn(componentRank1, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });
      jest.spyOn(componentRank2, 'setContext').mockImplementation(function () {
        this._context = componentRank1;
      });

      componentRank2.setContext(componentRank1);
      expect(componentRank3.getContext('rank1')).toStrictEqual(componentRank1);
    });
  });

  describe('setContext()', () => {
    test('change context', () => {
      const componentRank1 = new DTComponentTestMock({ componentType: 'rank1' });
      jest.spyOn(componentMock, 'getContext').mockImplementation(function () {
        return this._context;
      });
      componentMock.setContext(componentRank1);

      expect(componentMock.getContext()).toBe(componentRank1);
    });
  });

  describe('removeContext()', () => {
    test('remove the current Context', () => {
      const componentRankSup = new DTComponentTestMock();
      jest.spyOn(componentMock, 'setContext').mockImplementation(function (context) {
        this._context = context;
      });
      jest.spyOn(componentMock, 'getContext').mockImplementation(function () {
        return this._context;
      });
      componentMock.setContext(componentRankSup);

      componentMock.removeContext();
      expect(componentMock.getContext()).toBeUndefined();
    });
  });

  describe('getErrors()', () => {
    test('return empty errors by default', () => {
      expect(componentMock.getErrors()).toStrictEqual([]);
    });

    test('return array of errors if defined', () => {
      const errors = [new DTErrorStub(), new DTErrorStub()];
      componentMock.mockDefineErrors(errors);

      expect(componentMock.getErrors()).toStrictEqual(errors);
    });

    test('return errors from higher level component', () => {
      const [componentRank1, componentRank2, componentRank3] = simulateHierarchy(3, { mockGetContext: true });
      componentRank1.mockDefineErrors([new DTErrorStub(), new DTErrorStub(), new DTErrorStub()]);
      componentRank2.mockDefineErrors([new DTErrorStub(), new DTErrorStub()]);
      componentRank3.mockDefineErrors([new DTErrorStub()]);

      expect(componentRank1.getErrors().length).toEqual(3);
      expect(componentRank2.getErrors().length).toEqual(3);
      expect(componentRank3.getErrors().length).toEqual(3);
    })
  });

  describe('getLastError()', () => {
    test('return undefined if no errors', () => {
      expect(componentMock.getLastError()).toBeUndefined();
    });

    test('return the last error', () => {
      const lastError = new DTErrorStub();
      const errors = [new DTErrorStub(), new DTErrorStub(), lastError];
      componentMock.mockDefineErrors(errors);

      expect(componentMock.getLastError().getTimestamp().toString()).toStrictEqual(lastError.getTimestamp().toString());
    });

    test('return the last error from higher level component', () => {
      const [componentRank1, componentRank2, componentRank3] = simulateHierarchy(3, { mockGetContext: true });
      const lastError = new DTErrorStub();
      componentRank1.mockDefineErrors([new DTErrorStub(), new DTErrorStub(), lastError]);
      componentRank2.mockDefineErrors([new DTErrorStub(), new DTErrorStub()]);
      componentRank3.mockDefineErrors([new DTErrorStub()]);

      expect(componentRank1.getLastError().getTimestamp().toString()).toStrictEqual(lastError.getTimestamp().toString());
      expect(componentRank2.getLastError().getTimestamp().toString()).toStrictEqual(lastError.getTimestamp().toString());
      expect(componentRank3.getLastError().getTimestamp().toString()).toStrictEqual(lastError.getTimestamp().toString());
    });
  });
});
