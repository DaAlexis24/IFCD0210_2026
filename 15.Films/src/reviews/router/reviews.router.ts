import { Router } from 'express';
import { env } from '../../config/env.ts';
import debug from 'debug';
import type { AuthInterceptor } from '../../middleware/auth.interceptor.ts';
import type { ReviewsController } from '../controller/reviews.controller.ts';

const log = debug(`${env.PROJECT_NAME}:router:reviews`);
log('Loading reviews router...');


export class ReviewsRouter {
    #controller: ReviewsController;
    #router: Router;
    #authInterceptor: AuthInterceptor;
    constructor(
        controller: ReviewsController,
        authInterceptor: AuthInterceptor,
    ) {
        log('Initializing reviews router...');
        this.#router = Router();
        this.#controller = controller;
        this.#authInterceptor = authInterceptor;
    
        this.#router.get(
            '/films/:filmID',
            this.#authInterceptor.authenticate.bind(this.#authInterceptor),
            this.#controller.getAllFilmsReviews.bind(this.#controller),
        );

        this.#router.get(
            '/users/:userID',
            this.#authInterceptor.authenticate.bind(this.#authInterceptor),
            this.#controller.getAllUserReviews.bind(this.#controller),
        );

        this.#router.post(
            '/:filmID',
            this.#authInterceptor.authenticate.bind(this.#authInterceptor),
            this.#controller.createReview.bind(this.#controller),
        );
    
    }

        get router() {
        return this.#router;
    }
}
