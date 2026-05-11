import type { TokenPayload } from '../types/login.ts';
import { AuthService } from './auth.ts';

// vitest.mock('zod', () => {
//     return {
//         object: vitest.fn().mockReturnValue({
//             parse: vitest.fn().mockReturnValue({
//                 SALT_ROUND: 1
//             })
//         }),
//         coerce: {
//             number: vitest.fn(),
//         },
//         enum: vitest.fn(),
//         string: vitest.fn().mockReturnValue(
//             {
//                 optional: vitest.fn(),
//                 min: vitest.fn()
//             }
//         )
//     }
// })

describe('Given method hash from class AuthService', () => {
    describe('When it is executed', () => {
        test('Then return a string', async () => {
            // Arrange
            const password = '123456';
            // Act
            const hash = await AuthService.hash(password);
            // Assert
            expect(hash).toBeTypeOf('string');
            expect(hash.length).toBeGreaterThan(password.length);
        });
    });
});

describe('Given method compare from class AuthService', () => {
    describe('When it is executed with a valid password', async () => {
        test('Then it will return true');
        //Arrange
        const password = '123456';
        const hash = await AuthService.hash(password);
        //Act
        const result = await AuthService.compare(password, hash);
        //Assert
        expect(result).toBe(true);
    });

    describe('When it is executed with a NOT valid password', async () => {
        test('Then it will return false');
        //Arrange
        const password = '123456';
        const hash = await AuthService.hash('Otra cosa');
        //Act
        const result = await AuthService.compare(password, hash);
        //Assert
        expect(result).toBe(false);
    });
});

describe('Given method generateToken from class AuthService', () => {
    describe('When it is executed', () => {
        test('Then it will return a token (string)', () => {
            // Arrange
            const algToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
            const payloadMock = {} as TokenPayload;
            // Act
            const token = AuthService.generateToken(payloadMock);
            // Assert
            expect(token).toBeTypeOf('string');
            expect(token).toContain(algToken);
        });
    });
});

describe('Given method generateTokenAsync from class AuthService', () => {
    describe('When it is executed', () => {
        test('Then it will return a token (string)', async () => {
            // Arrange
            const algToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
            const payloadMock = {} as TokenPayload;
            // Act
            const token = await AuthService.generateTokenAsync(payloadMock);
            // Assert
            expect(token).toBeTypeOf('string');
            expect(token).toContain(algToken);
        });
    });
});

describe('Given method verifyToken from class AuthService', () => {
    describe('When it is executed with valid token', () => {
        test('Then it will return the payload', () => {
            // Arrange
            const payloadMock = { id: 12 } as TokenPayload;
            const token = AuthService.generateToken(payloadMock);
            // Act
            const { iat, ...result } = AuthService.verifyToken(token);
            // Assert
            expect(iat).toBeTypeOf('number');
            expect(result).toEqual(payloadMock);
        });
    });

    describe('When it is executed with NOT valid token', () => {
        test('Then it will throw an error', () => {
            // Arrange
            const badToken = 'no soy un token';
            // Act + Assert
            expect(() => AuthService.verifyToken(badToken)).toThrow();
        });
    });
});

describe('Given method verifyTokenAsync from class AuthService', () => {
    describe('When it is executed with valid token', () => {
        test('Then it will return the payload', async () => {
            // Arrange
            const payloadMock = { id: 12 } as TokenPayload;
            const token = await AuthService.generateTokenAsync(payloadMock);
            // Act
            const { iat, ...result } = await AuthService.verifyTokenAsync(token);
            // Assert
            expect(iat).toBeTypeOf('number');
            expect(result).toEqual(payloadMock);
        });
    });

    describe('When it is executed with NOT valid token', () => {
        test('Then it will reject the promise', async () => {
            // Arrange
            const badToken = 'no soy un token';
            // Act + Assert
            await expect(AuthService.verifyTokenAsync(badToken)).rejects.toThrow();
        });
    });
})
