import {
  jest, describe, expect, test, beforeEach, afterEach,
} from '@jest/globals';
import {
  ComponentTypeTest,
  DomainTest,
  DTComponentTest,
  DTComponentTestMock,
  IDTest,
  KeyTest,
  SubKindTest,
} from './DTComponent.double';

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
      const componentRank1 = new DTComponentTestMock({ componentType: 'rank1' });
      const componentRank2 = new DTComponentTestMock({ componentType: 'rank2', context: componentRank1 });
      const componentRank3 = new DTComponentTestMock({ componentType: 'rank3', context: componentRank2 });
      jest.spyOn(componentRank1, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });
      jest.spyOn(componentRank2, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });
      jest.spyOn(componentRank3, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });

      expect(componentRank3.getContext()).toStrictEqual(componentRank2);
      expect(componentRank3.getContext('rank2')).toStrictEqual(componentRank2);
      expect(componentRank3.getContext('rank1')).toStrictEqual(componentRank1);
      expect(componentRank3.getContext('rank0')).toBeUndefined();
    });

    test('return context with Hierarchy - same type case so return first one', () => {
      const componentRank0 = new DTComponentTestMock({ componentType: 'rank1' });
      const componentRank1 = new DTComponentTestMock({ componentType: 'rank1', context: componentRank0 });
      const componentRank2 = new DTComponentTestMock({ componentType: 'rank2', context: componentRank1 });
      const componentRank3 = new DTComponentTestMock({ componentType: 'rank3', context: componentRank2 });
      jest.spyOn(componentRank0, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });
      jest.spyOn(componentRank1, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });
      jest.spyOn(componentRank2, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });
      jest.spyOn(componentRank3, 'getComponentType').mockImplementation(function () {
        return this._componentType;
      });

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

  describe('removeOwner()', () => {
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
});
