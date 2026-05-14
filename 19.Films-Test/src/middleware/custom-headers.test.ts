import type { Request, Response, NextFunction } from 'express';

import { customHeaders } from "./custom-headers.ts"

describe('Given the middleware factory customHeaders', () => {
    describe('When the middleware is created and called', () => {
        test('Then next will be called without arguments', () => {
            // Arrange
            const req = {} as Request
            const res = {
                setHeader: vi.fn()
            } as unknown as Response
            const next: NextFunction = vi.fn()

            const middleware = customHeaders('test')
            // Act
            middleware(req, res, next)
            // Assert
            expect(res.setHeader).toHaveBeenCalled()
            expect(next).toHaveBeenCalledWith()
        })
    })
})
