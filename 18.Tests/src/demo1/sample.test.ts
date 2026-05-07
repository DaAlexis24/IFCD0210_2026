import { add } from './sample.ts';

describe('Given add function', () => {
    beforeAll(() => {
        // Setup code before running the tests, if needed
    });

    afterAll(() => {
        // Cleanup code after running the tests, if needed
    });

    beforeEach(() => {
        // Code to run before each test, if needed
    });

    afterEach(() => {
        // Code to run after each test, if needed
    });

    describe('When adding 2 and 3', () => {
        test('Then it should return 5', () => {
            const result = add(2, 3);
            // Add your expectations here
            expect(result).toBe(5);
        });
    });

    describe('When adding 2 and -3', () => {
        test('Then it should return -1', () => {
            const result = add(2, -3);
            // Add your expectations here
            expect(result).toBe(-1);
        });
    });

    test('it should add 20 and 3 correctly returning 23', () => {
        // Arrange
        const a = 20;
        const b = 3;
        const expected = 23;
        // Act
        const result = add(a, b);
        // Add your expectations here
        expect(result).toBe(expected);
    });
});
