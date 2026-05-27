import { z } from 'zod';
import { GenreModelSchema } from './genre.entity';
import { ReviewModelSchema } from './review.entity';

export const FilmModelSchema = z.object({
    id: z.number(),
    title: z.string(),
    year: z.number(),
    director: z.string(),
    duration: z.number(),
    poster: z.string().nullable(),
    rate: z.number(),
    genres: z.array(GenreModelSchema.omit({ id: true })).optional(),
    get reviews() {
        return z.array(ReviewModelSchema.omit({ film: true })).optional();
    },
});

export type Film = z.infer<typeof FilmModelSchema>;
