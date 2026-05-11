import { type Mock, vi } from 'vitest';
import type { AppPrismaClient } from '../../config/db-config.ts';
import type { GenreCreateDTO } from '../entities/genre.dto.ts';
import { GenresRepo } from './genres.repo.ts';

describe('Given a instance of GenresRepo class', () => {
    let repo: GenresRepo;
    let prismaMock: AppPrismaClient;

    beforeEach(() => {
        prismaMock = {
            genre: {
                findMany: vi.fn().mockResolvedValue([]),
                findUniqueOrThrow: vi.fn().mockResolvedValue({}),
                // findUniqueOrThrow: vi
                //     .fn()
                //     .mockImplementation(({ where: { id } }: { where: { id: number } }) => Promise.resolve({ id })),
                create: vi.fn().mockResolvedValue({}),
                update: vi.fn().mockResolvedValue({}),
                delete: vi.fn().mockResolvedValue({}),
            },
        } as unknown as AppPrismaClient;
        repo = new GenresRepo(prismaMock);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    // Arrange

    describe('When we instantiate it', () => {
        test('Then it should be defined', () => {
            // Act & Assert
            expect(repo).toBeDefined();
        });
        test('Then it should be a instance of GenreRepo', () => {
            // Act & Assert
            expect(repo).toBeInstanceOf(GenresRepo);
        });
    });

    describe('When method getAllGenres is called', () => {
        test('Then it return the array of genres', async () => {
            // Act
            const genres = await repo.getAllGenres();
            // Assert
            expect(genres).toEqual([]);
            // Assert de implementación
            expect(prismaMock.genre.findMany).toHaveBeenCalled();
        });
    });
    describe('When method getGenreByID is called', () => {
        describe('And the genre with the given id exists', () => {
            test('Then it return the genre', async () => {
                // Act
                const genre = await repo.getGenreByID(1);
                // Assert de implementacion
                expect(prismaMock.genre.findUniqueOrThrow).toHaveBeenCalled();
                // Assert
                expect(genre).toEqual({});
            });
        });
        describe('And the genre with the given id NOT exists', () => {
            test('Then it throw an error', async () => {
                // Arrange
                (
                    prismaMock.genre.findUniqueOrThrow as Mock
                ).mockRejectedValueOnce(new Error('Genre not found'));
                // Act & Assert
                await expect(repo.getGenreByID(999)).rejects.toThrow(
                    'Genre not found',
                );
            });
        });
    });

    describe('When method createGenre is called', () => {
        test('Then it return the created genre', async () => {
            // Act
            const genre = await repo.createGenre(
                'Test Genre' as GenreCreateDTO['name'],
            );
            // Assert
            expect(genre).toEqual({});
        });
    });

    describe('When method updateGenre is called', () => {
        describe('And the genre with the given id exists', () => {
            test('Then it return the updated genre', async () => {
                // Act
                const genre = await repo.updateGenre(
                    1,
                    'Updated Genre' as unknown as GenreCreateDTO['name'],
                );
                // Assert
                expect(genre).toEqual({});
            });
        });
        describe('And the genre with the given id NOT exists', () => {
            test('Then it throw an error', async () => {
                // Arrange
                (prismaMock.genre.update as Mock).mockRejectedValueOnce(
                    new Error('Genre not found'),
                );
                // Act & Assert
                await expect(
                    repo.updateGenre(
                        999,
                        'Updated Genre' as unknown as GenreCreateDTO['name'],
                    ),
                ).rejects.toThrow('Genre not found');
            });
        });
    });

    describe('When method deleteGenre is called', () => {
        describe('And the genre with the given id exists', () => {
            test('Then it return the deleted genre', async () => {
                // Act
                const genre = await repo.deleteGenre(1);
                // Assert
                expect(genre).toEqual({});
            });
        });
        describe('And the genre with the given id NOT exists', () => {
            test('Then it throw an error', async () => {
                // Arrange
                (prismaMock.genre.delete as Mock).mockRejectedValueOnce(
                    new Error('Genre not found'),
                );
                // Act & Assert
                await expect(repo.deleteGenre(999)).rejects.toThrow(
                    'Genre not found',
                );
            });
        });
    });
});
