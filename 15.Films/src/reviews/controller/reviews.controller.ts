import { env } from '../../config/env.ts';
import debug from 'debug';
import type { ReviewsRepo } from '../repo/reviews.repo.ts';
import type { Request, Response, NextFunction } from 'express';

const log = debug(`${env.PROJECT_NAME}:controller:reviews`);
log('Loading reviews controller...');

export class ReviewsController {
    #repo: ReviewsRepo;
    constructor(repo: ReviewsRepo) {
        this.#repo = repo;
    }

    async getAllFilmsReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const reviews = await this.#repo.getAllFilmsReviews(
                Number(req.params.filmID),
            );
            return res.json(reviews);
        } catch (error) {
            next(error);
        }
    }

    async getAllUserReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const reviews = await this.#repo.getAllUserReviews(
                Number(req.params.userID),
            );
            return res.json(reviews);
        } catch (error) {
            next(error);
        }
    }

    // - POST /reviews/:filmId/ [User] -> token :userId

    async createReview(req: Request, res: Response, next: NextFunction) {

        try {
            const review = await this.#repo.createReview({
                ...req.body,
                filmID: Number(req.params.filmID),
                userID: Number(req.user?.id),
            });
            return res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }


}
