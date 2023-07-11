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
      const component = new DTComponentTest();
      const component2 = new DTComponentTest(null);

      expect(component.th_get_key()).toBe(component.th_get_id());
      expect(component2.th_get_key()).toBe(component2.th_get_id());
    });

    test('creation with key', () => {
      const component = new DTComponentTest(KeyTest);

      expect(component.th_get_key()).toBe(KeyTest);
      expect(component.th_get_id() !== component.th_get_key()).toBeTruthy();
    });

    test('creations have unique ids', () => {
      const component = new DTComponentTest(KeyTest);
      const component2 = new DTComponentTest(KeyTest);

      expect(component.th_get_id() !== component2.th_get_id()).toBeTruthy();
    });

    test('creations without options - default', () => {
      const component = new DTComponentTest();

      expect(component.th_get_options()).toStrictEqual({
        errors: false
      });
    });

    test('creations with options', () => {
      const component = new DTComponentTest(KeyTest, { errors: true, option1: false, option2: true });

      expect(component.th_get_options()).toStrictEqual({
        errors: true,
        option1: false,
        option2: true
      });
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
    beforeEach(() => {
      componentTest = new DTComponentTest();
    });

    test('return context', () => {
      const component = new DTComponentTest();
      const componentTestSet = new DTComponentTest();
      componentTestSet.th_set_context(component);
      jest.spyOn(component, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });
      jest.spyOn(componentTestSet, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });

      expect(componentTest.getContext()).toBeUndefined();
      expect(componentTestSet.getContext()).toStrictEqual(component);
    });

    test('return context with Hierarchy - simple case', () => {
      const [componentRank1, componentRank2, componentRank3] = simulateHierarchy();
      jest.spyOn(componentRank3, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });

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
      componentRank2.th_set_context(componentRank1);
      jest.spyOn(componentRank1, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });

      expect(componentRank3.getContext('rank1')).toStrictEqual(componentRank1);
    });
  });

  describe('setContext()', () => {
    test('change context', () => {
      const componentRank1 = new DTComponentTest();
      componentRank1.th_set_componentType('rank1');

      componentTest.setContext(componentRank1);
      expect(componentTest.th_get_context()).toBe(componentRank1);
    });
  });

  describe('removeContext()', () => {
    test('remove the current Context', () => {
      const componentRankSup = new DTComponentTest();
      componentTest.th_set_context(componentRankSup);

      componentTest.removeContext();
      expect(componentTest.th_get_context()).toBeUndefined();
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

  describe('triggerError()', () => {
    test('default throw an exception error - option errors false', () => {
      const error = new DTErrorStub();

      expect(() => componentTest.triggerError(error)).toThrow(error);
    });

    test('stack new error - option errors true', () => {
      componentTest.th_set_options({ errors: true });
      const error = new DTErrorStub();

      componentTest.triggerError(error);
      expect(componentTest.th_get_errors().length).toBe(1);
    });

    test('throw new error in higher level component - option errors false', () => {
      const [componentRank1, componentRank2, componentRank3] = simulateHierarchy(3, { mockGetContext: true });
      componentRank1.th_set_options({ errors: false });
      componentRank2.th_set_options({ errors: true });
      componentRank3.th_set_options({ errors: true });
      const error = new DTErrorStub();

      expect(() => componentRank3.triggerError(error)).toThrow(error);
      expect(componentRank2.th_get_errors().length).toBe(0);
      expect(componentRank1.th_get_errors().length).toBe(0);
    });

    test('stack new error in higher level component - option errors true', () => {
      const [componentRank1, componentRank2, componentRank3] = simulateHierarchy(3, { mockGetContext: true });
      componentRank1.th_set_options({ errors: true });
      componentRank2.th_set_options({ errors: false });
      const error = new DTErrorStub();

      componentRank3.triggerError(error);
      expect(componentRank1.th_get_errors().length).toBe(1);
      expect(componentRank2.th_get_errors().length).toBe(0);
      expect(componentRank3.th_get_errors().length).toBe(0);
    });
  });

  describe('clearErrors()', () => {
    test('reset errors array', () => {
      componentTest.th_set_errors([new DTErrorStub(), new DTErrorStub()]);

      componentTest.clearErrors();
      expect(componentTest.th_get_errors().length).toBe(0);
    });

    test('reset errors in higher level components', () => {
      const [componentRank1, componentRank2, componentRank3] = simulateHierarchy(3, { mockGetContext: true });
      componentRank1.th_set_errors([new DTErrorStub(), new DTErrorStub(), new DTErrorStub()]);
      componentRank2.th_set_errors([new DTErrorStub(), new DTErrorStub()]);
      componentRank3.th_set_errors([new DTErrorStub()]);

      componentRank3.clearErrors();
      expect(componentRank1.th_get_errors().length).toBe(0);
      expect(componentRank2.th_get_errors().length).toBe(0);
      expect(componentRank3.th_get_errors().length).toBe(0);
    });
  });

  describe('getOptions()', () => {
    test('return options', () => {
      componentTest.th_set_options({ errors: true, option1: false, option2: true });

      expect(componentTest.getOptions()).toStrictEqual({ errors: true, option1: false, option2: true });
    });
  });
});
