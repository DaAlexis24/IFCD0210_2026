import type { AppPrismaClient } from '../../config/db-config.ts';
import { env } from '../../config/env.ts';
import debug from 'debug';
import type { ReviewCreateDTO } from '../../zod/film.schemas.ts';

const log = debug(`${env.PROJECT_NAME}:repo:reviews`);
log('Loading reviews repo...');

export class ReviewsRepo {
    #prisma: AppPrismaClient;
    constructor(prisma: AppPrismaClient) {
        this.#prisma = prisma;
    }

    async getAllFilmsReviews(filmID: number) {
        log('Getting all reviews of film %s', filmID);
        return await this.#prisma.review.findMany({
            where: {
                filmID,
            },
            omit: {
                filmID: true,
                userID: true,
            },
            include: {
                user: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                surname: true,
                            },
                        },
                    },
                },
                film: {
                    select: {
                        title: true,
                    },
                },
            },
        });
    }

    async getAllUserReviews(userID: number) {
        log('Getting all reviews of user with id %s', userID);
        return await this.#prisma.review.findMany({
            where: {
                userID,
            },
            omit: {
                filmID: true,
                userID: true,
            },
            include: {
                user: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                surname: true,
                            },
                        },
                    },
                },
                film: {
                    select: {
                        title: true,
                        year: true,
                        director: true,
                    },
                },
            },
        });
    }


    async createReview(data: ReviewCreateDTO) {
        log('Creating review for film %s by user %s', data.filmID, data.userID);
        return await this.#prisma.review.create({
            data: {
                review: data.review,
                rate: data.rate,
                date: new Date(),
                filmID: data.filmID,
                userID: data.userID,
            },
        });
    }
}
