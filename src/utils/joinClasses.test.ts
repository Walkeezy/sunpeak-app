import { describe, expect, test } from 'vitest';
import { joinClasses } from './joinClasses';

describe('joinClasses', () => {
  const data = [
    {
      array: ['class-1', 'class-2'],
      expected: 'class-1 class-2',
    },
    {
      array: ['class-1', 'class-2', 'class-3', false, undefined],
      expected: 'class-1 class-2 class-3',
    },
    {
      array: [],
      expected: '',
    },
  ];

  test.each(data)('return classes correctly', ({ array, expected }) => {
    expect(joinClasses(array)).toStrictEqual(expected);
  });
});
