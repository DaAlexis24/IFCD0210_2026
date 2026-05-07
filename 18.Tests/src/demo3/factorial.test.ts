import { factorial } from './factorial.ts';

describe('factorial', () => {
    test('factorial of 0 is 1', () => {
        expect(factorial(0)).toBe(1);
    });
    test('factorial of 1 is 1', () => {
        expect(factorial(1)).toBe(1);
    });
    test('factorial of 5 is 120', () => {
        expect(factorial(5)).toBe(120);
    });
    test('factorial of 20 is 2.432.902.008.176.640.000', () => {
        expect(factorial(20)).toBe(2_432_902_008_176_640_000);
    });

    test('factorial of 171 throw an error', () => {
        expect(() => factorial(171)).toThrow('Invalid input');
    });
    test('factorial of -2 throw an error', () => {
        expect(() => factorial(-2)).toThrow('Invalid input');
    });
    test('factorial of 2.2 throw an error', () => {
        expect(() => factorial(2.2)).toThrow('Invalid input');
    });
    test('factorial of NaN throw an error', () => {
        expect(() => factorial(NaN)).toThrow('Invalid input');
    });
});

describe("factorial with each and array", () => {
  test.each([
    [0, 1],
    [1, 1],
    [2, 2],
    [5, 120],
    [20, 2_432_902_008_176_640_000]
  ])("should return %i when n is %i", (n, expected) => {
    expect(factorial(n)).toBe(expected);
  });
});

describe("factorial with each and objects", () => {
  test.each([
    { n: 0, expected: 1 },
    { n: 1, expected: 1 },
    { n: 2, expected: 2 },
    { n: 5, expected: 120 },
    {n: 20, expected:  2_432_902_008_176_640_000}
  ])("should return $n when n is $expected", ({ n, expected }) => {
    expect(factorial(n)).toBe(expected);
  });
});
