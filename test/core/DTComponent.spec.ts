import {afterEach, beforeEach, describe, expect, jest, test,} from '@jest/globals';
import {
  ComponentTypeTest,
  DomainTest,
  DTComponentTest,
  DTComponentImpl,
  IDTest,
  KeyTest,
  simulateHierarchy,
  SubKindTest,
} from './DTComponent.double';
import {DTErrorStub} from "./DTError.double";

describe('class DYOToolsComponent', () => {
  let componentTest: DTComponentTest;

  beforeEach(() => {
    componentTest = new DTComponentTest();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor()', () => {
    test('creation without key', () => {
      const component = new DTComponentImpl();
      jest.spyOn(component, 'getId').mockImplementation(function () {
        return this._id;
      });
      jest.spyOn(component, 'getKey').mockImplementation(function () {
        return this._key;
      });

      expect(component.getKey()).toBe(component.getId());
    });

    test('creation with key', () => {
      const component = new DTComponentImpl(KeyTest);
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
      const component = new DTComponentImpl(KeyTest);
      const component2 = new DTComponentImpl(KeyTest);
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
      componentTest.th_set_id(IDTest);
      expect(componentTest.getId()).toBe(IDTest);
    });
  });

  describe('getKey()', () => {
    test('return key', () => {
      componentTest.th_set_key(KeyTest);
      expect(componentTest.getKey()).toBe(KeyTest);
    });
  });

  describe('getComponentType()', () => {
    test('return componentType', () => {
      const componentTestSet = new DTComponentTest();
      componentTestSet.th_set_componentType(`${ComponentTypeTest}-set`);

      expect(componentTest.getComponentType()).toBe(ComponentTypeTest);
      expect(componentTestSet.getComponentType()).toBe(`${ComponentTypeTest}-set`);
    });
  });

  describe('getDomain()', () => {
    test('return domain', () => {
      const componentTestSet = new DTComponentTest();
      componentTestSet.th_set_domain(DomainTest);

      expect(componentTest.getDomain()).toBeUndefined();
      expect(componentTestSet.getDomain()).toBe(DomainTest);
    });
  });

  describe('getSubKind()', () => {
    test('return subkind', () => {
      const componentTestSet = new DTComponentTest();
      componentTestSet.th_set_subKind(SubKindTest);

      expect(componentTest.getSubKind()).toBeUndefined();
      expect(componentTestSet.getSubKind()).toBe(SubKindTest);
    });
  });

  describe('getContext()', () => {
    test('return context', () => {
      const component = new DTComponentTest();
      const componentTestSet = new DTComponentTest();
      componentTestSet.th_set_context(component);

      expect(componentTest.getContext()).toBeUndefined();
      expect(componentTestSet.getContext()).toStrictEqual(component);
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
      const componentRank1 = new DTComponentTest();
      componentRank1.th_set_componentType('rank1');
      componentRank1.th_set_context(componentRank0);

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
      const componentRank1 = new DTComponentTest();
      componentRank1.th_set_componentType('rank1');
      jest.spyOn(componentTest, 'getContext').mockImplementation(function () {
        return this._context;
      });
      componentTest.setContext(componentRank1);

      expect(componentTest.getContext()).toBe(componentRank1);
    });
  });

  describe('removeContext()', () => {
    test('remove the current Context', () => {
      const componentRankSup = new DTComponentTest();
      jest.spyOn(componentTest, 'setContext').mockImplementation(function (context) {
        this._context = context;
      });
      jest.spyOn(componentTest, 'getContext').mockImplementation(function () {
        return this._context;
      });
      componentTest.setContext(componentRankSup);

      componentTest.removeContext();
      expect(componentTest.getContext()).toBeUndefined();
    });
  });

  describe('getErrors()', () => {
    test('return empty errors by default', () => {
      expect(componentTest.getErrors()).toStrictEqual([]);
    });

    test('return array of errors if defined', () => {
      const errors = [new DTErrorStub(), new DTErrorStub()];
      componentTest.th_set_errors(errors);

      expect(componentTest.getErrors()).toStrictEqual(errors);
    });

    test('return errors from higher level component', () => {
      const [componentRank1, componentRank2, componentRank3] = simulateHierarchy(3, { mockGetContext: true });
      componentRank1.th_set_errors([new DTErrorStub(), new DTErrorStub(), new DTErrorStub()]);
      componentRank2.th_set_errors([new DTErrorStub(), new DTErrorStub()]);
      componentRank3.th_set_errors([new DTErrorStub()]);

      expect(componentRank1.getErrors().length).toEqual(3);
      expect(componentRank2.getErrors().length).toEqual(3);
      expect(componentRank3.getErrors().length).toEqual(3);
    })
  });

  describe('getLastError()', () => {
    test('return undefined if no errors', () => {
      expect(componentTest.getLastError()).toBeUndefined();
    });

    test('return the last error', () => {
      const lastError = new DTErrorStub();
      const errors = [new DTErrorStub(), new DTErrorStub(), lastError];
      componentTest.th_set_errors(errors);

      expect(componentTest.getLastError().getTimestamp().toString()).toStrictEqual(lastError.getTimestamp().toString());
    });

    test('return the last error from higher level component', () => {
      const [componentRank1, componentRank2, componentRank3] = simulateHierarchy(3, { mockGetContext: true });
      const lastError = new DTErrorStub();
      componentRank1.th_set_errors([new DTErrorStub(), new DTErrorStub(), lastError]);
      componentRank2.th_set_errors([new DTErrorStub(), new DTErrorStub()]);
      componentRank3.th_set_errors([new DTErrorStub()]);

      expect(componentRank1.getLastError().getTimestamp().toString()).toStrictEqual(lastError.getTimestamp().toString());
      expect(componentRank2.getLastError().getTimestamp().toString()).toStrictEqual(lastError.getTimestamp().toString());
      expect(componentRank3.getLastError().getTimestamp().toString()).toStrictEqual(lastError.getTimestamp().toString());
    });
  });
});
