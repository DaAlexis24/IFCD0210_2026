import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/client';
import { GenreModelSchema } from '../../genres/entities/genre.entity.ts';
import { ReviewModelSchema } from '../../reviews/entities/review.entity.ts';

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     Film:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - year
 *         - director
 *         - duration
 *         - poster
 *         - rate
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           example: 1
 *         title:
 *           type: string
 *           example: The Matrix
 *         year:
 *           type: integer
 *           format: int32
 *           example: 1999
 *         director:
 *           type: string
 *           example: Lana Wachowski
 *         duration:
 *           type: integer
 *           format: int32
 *           description: Duration in minutes.
 *           example: 136
 *         poster:
 *           type: string
 *           nullable: true
 *           description: Poster URL (optional).
 *           example: https://example.com/posters/matrix.jpg
 *         rate:
 *           type: number
 *           format: float
 *           description: Rating from 0 to 9.9 (max 1 decimal).
 *           example: 8.7
 *         genres:
 *           type: array
 *           description: Included when the endpoint loads relations.
 *           items:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sci-Fi
 *         reviews:
 *           type: array
 *           description: Included only in endpoints that load reviews.
 *           items:
 *             type: object
 *             additionalProperties: true
 *
 */

export const FilmModelSchema = z.object({
    id: z.number(),
    title: z.string(),
    year: z.number(),
    director: z.string(),
    duration: z.number(),
    poster: z.string().nullable(),
    rate: z.instanceof(Decimal),
    genres: z.array(GenreModelSchema.omit({ id: true })).optional(),
    get reviews() {
        return z.array(ReviewModelSchema.omit({ film: true })).optional();
    },
});

export type Film = z.infer<typeof FilmModelSchema>;
