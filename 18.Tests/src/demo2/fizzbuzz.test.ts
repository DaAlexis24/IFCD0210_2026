// ejercicio clásico de programación
// que consiste en imprimir números del 1 al 100
// con reglas específicas:
// - sustituir múltiplos de 3 por "Fizz",
// - múltiplos de 5 por "Buzz", y
// - los múltiplos de ambos (3 y 5) por "FizzBuzz"

import { fizzBuzz, fizzBuzzSerie } from './fiFizzbuzz.ts';
import { vi } from 'vitest'

describe('Given fizzBuzz function', () => {
    describe('When it receives 3', () => {
        it('Then it should return Fizz', () => {
            // Arrange
            const input = 3;
            const expectedOutput = 'Fizz';
            // Act
            const result = fizzBuzz(input);
            // Assert
            expect(result).toBe(expectedOutput);
        });
    });
    describe('When it receives 9', () => {
        it('Then it should return Fizz', () => {
            // Arrange
            const input = 9;
            const expectedOutput = 'Fizz';
            // Act
            const result = fizzBuzz(input);
            // Assert
            expect(result).toBe(expectedOutput);
        });
    });
    describe('When it receives 5', () => {
        it('Then it should return Buzz', () => {
            // Arrange
            const input = 5;
            const expectedOutput = 'Buzz';
            // Act
            const result = fizzBuzz(input);
            // Assert
            expect(result).toBe(expectedOutput);
        });
    });
    describe('When it receives 15', () => {
        it('Then it should return FizzBuzz', () => {
            // Arrange
            const input = 15;
            const expectedOutput = 'FizzBuzz';
            // Act
            const result = fizzBuzz(input);
            // Assert
            expect(result).toBe(expectedOutput);
        });
    });
    describe('When it receives 30', () => {
        it('Then it should return FizzBuzz', () => {
            // Arrange
            const input = 30;
            const expectedOutput = 'FizzBuzz';
            // Act
            const result = fizzBuzz(input);
            // Assert
            expect(result).toBe(expectedOutput);
        });
    });
    describe('When it receives 10', () => {
        it('Then it should return Buzz', () => {
            // Arrange
            const input = 10;
            const expectedOutput = 'Buzz';
            // Act
            const result = fizzBuzz(input);
            // Assert
            expect(result).toBe(expectedOutput);
        });
    });
    describe('When it receives 1', () => {
        it('Then it should return 1', () => {
            // Arrange
            const input = 1;
            const expectedOutput = '1';
            // Act
            const result = fizzBuzz(input);
            // Assert
            expect(result).toBe(expectedOutput);
        });
    });
    describe('When it receives 13', () => {
        it('Then it should return 13', () => {
            // Arrange
            const input = 13;
            const expectedOutput = '13';
            // Act
            const result = fizzBuzz(input);
            // Assert
            expect(result).toBe(expectedOutput);
        });
    });
});


describe('Given fizzBuzzSerie', () => {
    describe('When its call with 10',() => {
        test('Then console log will be call 10 times', () => {
            // Arrange
            const limit = 10
            vi.spyOn(console, 'log').mockImplementation(() => {
                //
            })
            
            // Act
            fizzBuzzSerie(limit)

            //Assert
            expect(console.log).toHaveBeenCalledTimes(limit)

        })
    })
})
