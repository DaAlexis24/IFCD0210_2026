import { type Mock, vi } from 'vitest';
import type { AppPrismaClient } from '../../config/db-config.ts';
import type { ReviewCreateDTO } from '../entities/review.dto.ts';
import { ReviewsRepo } from './reviews.repo.ts';

describe('Given a instance of ReviewsRepo class', () => {
    let repo: ReviewsRepo;
    let prismaMock: AppPrismaClient;

    beforeEach(() => {
        prismaMock = {
            review: {
                findMany: vi.fn().mockResolvedValue([]),
                create: vi.fn().mockResolvedValue({}),
                update: vi.fn().mockResolvedValue({}),
                delete: vi.fn().mockResolvedValue({}),
            },
        } as unknown as AppPrismaClient;
        repo = new ReviewsRepo(prismaMock);
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
        test('Then it should be a instance of ReviewRepo', () => {
            // Act & Assert
            expect(repo).toBeInstanceOf(ReviewsRepo);
        });
    });

    describe('When method getAllFilmsReviews is called', () => {
        describe('And the review with the given id exists', () => {
            test('Then it return the array of reviews', async () => {
                // Act
                const reviews = await repo.getAllFilmsReviews(1);
                // Assert
                expect(reviews).toEqual([]);
                // Assert de implementación
                expect(prismaMock.review.findMany).toHaveBeenCalled();
            });
        });
        describe('And the review with the given id NOT exists', () => {
            test('Then it return an empty array', async () => {
                // Arrange
                (prismaMock.review.findMany as Mock).mockResolvedValueOnce([]);
                // Act
                const reviews = await repo.getAllFilmsReviews(999);
                // Assert
                expect(reviews).toEqual([]);
            });
        });
    });
    describe('When method getAllUserReviews is called', () => {
        describe('And the review with the given id exists', () => {
            test('Then it return the review', async () => {
                // Act
                const review = await repo.getAllUserReviews(1);
                // Assert de implementacion
                expect(prismaMock.review.findMany).toHaveBeenCalled();
                // Assert
                expect(review).toEqual([]);
            });
        });
        describe('And the review with the given id NOT exists', () => {
            test('Then it return an empty array', async () => {
                // Arrange
                (prismaMock.review.findMany as Mock).mockResolvedValueOnce([]);

                // Act
                const reviews = await repo.getAllUserReviews(999);
                // Assert
                expect(reviews).toEqual([]);
            });
        });
    });

    describe('When method createReview is called', () => {
        test('Then it return the created review', async () => {
            // Act
            const review = await repo.createReview({
                // title: 'Test Review',
                // year: 2024,
                // director: 'Test Director',
                // duration: 120,
                // poster: 'test-poster.jpg',
                // rate: 8.5,
                // genres: ['Action', 'Adventure']
            } as ReviewCreateDTO);
            // Assert
            expect(review).toEqual({});
        });
    });

    describe('When method updateReview is called', () => {
        describe('And the review with the given id exists', () => {
            test('Then it return the updated review', async () => {
                // Act
                const review = await repo.updateReview(1, 1, {
                    // title: 'Updated Test Review',
                    // year: 2025,
                    // director: 'Updated Test Director',
                    // duration: 130,
                    // poster: 'updated-test-poster.jpg',
                    // rate: 9.0,
                    // genres: ['Action', 'Adventure', 'Sci-Fi']
                } as ReviewCreateDTO);
                // Assert
                expect(review).toEqual({});
            });
        });
        describe('And the review with the given id NOT exists', () => {
            test('Then it throw an error', async () => {
                // Arrange
                (prismaMock.review.update as Mock).mockRejectedValueOnce(
                    new Error('Review not found'),
                );
                // Act & Assert
                await expect(
                    repo.updateReview(999, 999, {} as ReviewCreateDTO),
                ).rejects.toThrow('Review not found');
            });
        });
    });

    describe('When method deleteReview is called', () => {
        describe('And the review with the given id exists', () => {
            test('Then it return the deleted review', async () => {
                // Act
                const review = await repo.deleteReview(1, 1);
                // Assert
                expect(review).toEqual({});
            });
        });
        describe('And the review with the given id NOT exists', () => {
            test('Then it throw an error', async () => {
                // Arrange
                (prismaMock.review.delete as Mock).mockRejectedValueOnce(
                    new Error('Review not found'),
                );
                // Act & Assert
                await expect(repo.deleteReview(999, 999)).rejects.toThrow(
                    'Review not found',
                );
            });
        });
    });
});
