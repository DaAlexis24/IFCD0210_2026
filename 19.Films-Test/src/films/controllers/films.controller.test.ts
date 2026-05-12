import type { Request, Response, NextFunction } from 'express';
import type { FilmsRepo } from '../repos/films.repo.ts';
import { FilmsController } from './films.controller.ts';
import { InternalServerError, NotFoundError } from '../../errors/http-error.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

describe('Given a instantiated Films Controller', () => {
    let controller: FilmsController;
    let repo: FilmsRepo;
    let req: Request;
    let res: Response;
    let next: NextFunction;
    beforeEach(async () => {
        // const mockFilms = [
        //     { id: 1, title: 'Film 1' },
        //     { id: 2, title: 'Film 2' },
        // ];
        repo = {} as FilmsRepo;
        req = {} as Request;
        res = {
            status: vi.fn().mockReturnValue(res),
            json: vi.fn(),
            send: vi.fn(),
        } as unknown as Response;
        next = vi.fn() as NextFunction;
        controller = new FilmsController(repo);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('When we instantiate it', () => {
        test('Then it should be defined', () => {
            // Act & Assert
            expect(controller).toBeDefined();
        });
        test('Then it should be a instance of FilmRepo', () => {
            // Act & Assert
            expect(controller).toBeInstanceOf(FilmsController);
        });
    });

    describe('When method getAllFilms is called', () => {
        describe('And repo return valid data', () => {
            test('Then it call json with a list of films', async () => {
                // Arrange
                repo.getAllFilms = vi.fn().mockResolvedValueOnce([]);
                // Act
                await controller.getAllFilms(req, res, next);
                // Assert
                expect(repo.getAllFilms).toHaveBeenCalled();
                expect(next).not.toHaveBeenCalled();
            });
        });
        describe('And repo throw an Error', () => {
            test('', async () => {
                // Arrange
                repo.getAllFilms = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));
                // Act
                await controller.getAllFilms(req, res, next);
                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('When method getFilmById is called', () => {
        describe('And repo return valid data', () => {
            test('Then it call json with a film', async () => {
                // Arrange
                const mockFilm = { id: 1 };
                req.params = { id: '1' };
                repo.getFilmByID = vi.fn().mockResolvedValueOnce(mockFilm);
                // Act
                await controller.getFilmById(req, res, next);
                // Assert
                expect(repo.getFilmByID).toHaveBeenCalledWith(1);
                expect(res.json).toHaveBeenCalledWith(mockFilm);
                expect(next).not.toHaveBeenCalled();
            });
        });
        describe('And repo throw a Prisma Error', () => {
            test('', async () => {
                // Arrange
                req.params = { id: '1' };
                repo.getFilmByID = vi
                    .fn()
                    .mockRejectedValueOnce(new PrismaClientKnownRequestError(
                        'Any message', {
                            code: 'P2025',
                            clientVersion: '1'
                        }
                    ));
                // Act
                await controller.getFilmById(req, res, next);
                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });
        describe('And repo throw a generic Error', () => {
            test('', async () => {
                // Arrange
                req.params = { id: '1' };
                repo.getFilmByID = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));
                // Act
                await controller.getFilmById(req, res, next);
                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('When method createFilm is called', () => {
        describe('And repo return valid data', () => {
            test('Then it call status with 201 and json with a film', async () => {
                // Arrange
                const mockFilm = { id: 1 };
                req.body = { title: 'Film 1' };
                repo.createFilm = vi.fn().mockResolvedValueOnce(mockFilm);
                // Act
                await controller.createFilm(req, res, next);
                // Assert
                expect(repo.createFilm).toHaveBeenCalledWith(req.body);
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.status(201).json).toHaveBeenCalledWith(mockFilm);
                expect(next).not.toHaveBeenCalled();
            });
        });
        describe('And repo throw an Error', () => {
            test('', async () => {
                // Arrange
                req.body = { title: 'Film 1' };
                repo.createFilm = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));
                // Act
                await controller.createFilm(req, res, next);
                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('When method updateFilm is called', () => {
        describe('And repo return valid data', () => {
            test('Then it call json with a film', async () => {
                // Arrange
                const mockFilm = { id: 1 };
                req.params = { id: '1' };
                req.body = { title: 'Film 1' };
                repo.updateFilm = vi.fn().mockResolvedValueOnce(mockFilm);
                // Act
                await controller.updateFilm(req, res, next);
                // Assert
                expect(repo.updateFilm).toHaveBeenCalledWith(1, req.body);
                expect(res.json).toHaveBeenCalledWith(mockFilm);
                expect(next).not.toHaveBeenCalled();
            });
        });
        describe('And repo throw an Error', () => {
            test('', async () => {
                // Arrange
                req.params = { id: '1' };
                req.body = { title: 'Film 1' };
                repo.updateFilm = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));
                // Act
                await controller.updateFilm(req, res, next);
                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('When method deleteFilm is called', () => {
        describe('And repo return valid data', () => {
            test('Then it call status with 204', async () => {
                // Arrange
                req.params = { id: '1' };
                repo.deleteFilm = vi.fn().mockResolvedValueOnce({});
                // Act
                await controller.deleteFilm(req, res, next);
                // Assert
                expect(repo.deleteFilm).toHaveBeenCalledWith(1);
                expect(res.status).toHaveBeenCalledWith(204);
                expect(res.status(204).send).toHaveBeenCalled();
                expect(next).not.toHaveBeenCalled();
            });
        });
        describe('And repo throw an Error', () => {
            test('', async () => {
                // Arrange
                req.params = { id: '1' };
                repo.deleteFilm = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));
                // Act
                await controller.deleteFilm(req, res, next);
                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });
});
