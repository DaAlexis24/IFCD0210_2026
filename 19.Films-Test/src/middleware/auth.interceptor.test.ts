import type { Request, Response, NextFunction } from 'express';
import { AuthInterceptor } from './auth.interceptor.ts';
import { UnauthorizedError } from '../errors/http-error.ts';
import { AuthService } from '../services/auth.ts';
import type { TokenPayload } from '../types/login.ts';

describe('Given a instance of AuthInterceptor class', () => {

        // Arrange
        let req: Request;
        let res: Response;
        let next: NextFunction;
        let authInterceptor: AuthInterceptor;

        beforeEach(() => {
            const token = 'soy_un_token'
            // AuthService.generateToken({id: 1} as TokenPayload)
        // Arrange
            req = {
                header: vi.fn().mockReturnValue(`Bearer ${token}`)
            } as unknown as Request;
            res = {
                setHeader: vi.fn(),
            } as unknown as Response;
            next = vi.fn();

            authInterceptor = new AuthInterceptor()
        })
    describe('And the method authenticate is call', () => {
        describe('When the user data are OK', () => {
            test('Then next will be called without arguments', async () => {
                // Arrange
                vi.spyOn(AuthService, 'verifyTokenAsync')
                .mockResolvedValueOnce({
                    id: '1'
                } as unknown as TokenPayload)
                // Act
                await authInterceptor.authenticate(req, res, next)
                // Assert
                expect(AuthService.verifyTokenAsync).toHaveBeenCalled()
                expect(req.user).toStrictEqual({id: '1'})
                expect(next).toHaveBeenCalledWith()
            });
        });
        describe('When the req have NOT authorization header', () => {
            test('Then next will be called with argument', async () => {
                // Arrange
                req.header = vi.fn() // () => {}
                // Act
                 await authInterceptor.authenticate(req, res, next)
                // Assert
                expect(next).toHaveBeenCalledWith(expect.objectContaining(
                    {} as UnauthorizedError
                ))
            });
        });

        describe('When the req have authorization header NOT Bearer', () => {
            test('Then next will be called with argument', async () => {
                // Arrange
                req.header = vi.fn().mockReturnValue('No_Bearer token')
                // Act
                 await authInterceptor.authenticate(req, res, next)
                // Assert
                expect(next).toHaveBeenCalledWith(expect.objectContaining(
                    {} as UnauthorizedError
                ))
            });
        });

        describe('When the req have authorization header with NOT valid token', () => {
            test('Then next will be called with argument', async () => {
                 // Arrange
                vi.spyOn(AuthService, 'verifyTokenAsync')
                .mockRejectedValueOnce(new Error('Error'))
                // Act
                await authInterceptor.authenticate(req, res, next)
                // Assert
                
               expect(next).toHaveBeenCalledWith(expect.objectContaining(
                    {} as UnauthorizedError
                ))
            });
        });
    });
});
