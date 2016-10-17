// @flow
import { combineValidators } from '../../src';
import { validatePersonDefinition } from './_helpers';

const validatePerson = combineValidators(validatePersonDefinition, {
  serializeValues: values => values(),
});

describe('arbitrary data sources with serializeValues option', () => {
  it('returns an empty object for valid fields', () => {
    const result = validatePerson(() => ({
      name: 'Joe',
      confirmName: 'Joe',
      age: '29',
      job: 'Developer',
    }));

    expect(result).toEqual({});
  });

  it('returns non empty object with error message for invalid age', () => {
    const errorMessages = validatePerson(() => ({
      name: 'Joe',
      confirmName: 'Joe',
      age: 'abc',
    }));

    expect(Object.keys(errorMessages).length).toBe(1);
    expect(typeof errorMessages.age).toBe('string');
    expect(errorMessages.age.length > 1).toBe(true);
  });

  it('returns non empty object with error message for missing name', () => {
    const errorMessages = validatePerson(() => ({}));

    expect(Object.keys(errorMessages).length).toBe(1);
    expect(typeof errorMessages.name).toBe('string');
    expect(errorMessages.name.length > 1).toBe(true);
  });

  it('handles validating missing values', () => {
    const errorMessages = validatePerson();

    expect(Object.keys(errorMessages).length).toBe(1);
    expect(typeof errorMessages.name).toBe('string');
    expect(errorMessages.name.length > 1).toBe(true);
  });

  it('handles validating missing values when serializeValues returns nothing', () => {
    const validatePerson2 = combineValidators(validatePersonDefinition, {
      serializeValues: () => null,
    });

    const errorMessages = validatePerson2({
      name: 'Joe',
      confirmName: 'Joe',
      age: '29',
      job: 'Developer',
    });

    expect(Object.keys(errorMessages).length).toBe(1);
    expect(typeof errorMessages.name).toBe('string');
    expect(errorMessages.name.length > 1).toBe(true);
  });

  it('returns non empty object with error message for invalid name', () => {
    const errorMessages = validatePerson(() => ({ name: '123' }));

    expect(Object.keys(errorMessages).length).toBe(2);
    expect(typeof errorMessages.name).toBe('string');
    expect(errorMessages.name.length > 1).toBe(true);
  });

  it('returns non empty object with error messages for invalid fields', () => {
    const errorMessages = validatePerson(() => ({
      name: '123',
      confirmName: 'Joe',
      age: 'abc',
    }));

    expect(Object.keys(errorMessages).length).toBe(3);

    expect(typeof errorMessages.name).toBe('string');
    expect(typeof errorMessages.confirmName).toBe('string');
    expect(typeof errorMessages.age).toBe('string');

    expect(errorMessages.name.length > 1).toBe(true);
    expect(errorMessages.confirmName.length > 1).toBe(true);
    expect(errorMessages.age.length > 1).toBe(true);
  });

  it('returns non empty object with error message for job if it\'s required', () => {
    const errorMessages = validatePerson(() => ({
      name: 'Joe',
      confirmName: 'Joe',
      age: '18',
    }));

    expect(Object.keys(errorMessages).length).toBe(1);
    expect(typeof errorMessages.job).toBe('string');
    expect(errorMessages.job.length > 1).toBe(true);
  });

  it('returns empty object if job is not required', () => {
    const result = validatePerson(() => ({
      name: 'Joe',
      confirmName: 'Joe',
      age: '17',
    }));

    expect(result).toEqual({});
  });
});
