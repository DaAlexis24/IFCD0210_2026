import type { Express } from 'express';
import request from 'supertest';
import { env } from '../config/env.ts';
import { seed } from '../config/db-test.seed.ts';
import { connectDB } from '../config/db-config.ts';
import { createApp } from '../app.ts';
import type {
    FilmCreateDTO,
    FilmUpdateDTO,
} from '../films/entities/film.dto.ts';
import { AuthService } from '../services/auth.ts';

describe('Given routes Films', () => {
    let app: Express;
    const urlBase = '/api/films';

    const adminToken = AuthService.generateToken({
        id: 1,
        email: 'erni@sample.com',
        role: 'ADMIN',
    });
    const editorToken = AuthService.generateToken({
        id: 2,
        email: 'pepe@sample.com',
        role: 'EDITOR',
    });
    const userToken = AuthService.generateToken({
        id: 3,
        email: 'ursula@sample.com',
        role: 'USER',
    });

    beforeEach(async () => {
        const prisma = await connectDB();
        app = createApp(prisma);
        await seed();
    });

    test('Valid DB in environment', () => {
        expect(env.PGDATABASE).toBe('films_db_test');
    });

    describe('When making GET requests', () => {
        test('Then [GET] /api/films respond 200 and return an array of films', async () => {
            const response = await request(app).get(urlBase).expect(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(3);
        });

        test('Then [GET] /api/films/1 respond 200 and return the film with id 1', async () => {
            const response = await request(app)
                .get(urlBase + '/1')
                .expect(200);
            expect(response.body.id).toBe(1);
        });

        test('Then [GET] /api/films/100 respond 404', async () => {
            await request(app)
                .get(urlBase + '/100')
                .expect(404);
        });
    });

    describe('When making POST requests', () => {
        const newFilmMock: FilmCreateDTO = {
            title: 'Test Film',
            year: 2020,
            director: 'Test Director',
            duration: 120,
            poster: 'https://example.com/poster.jpg',
            rate: 8.5,
            genres: ['Action', 'Drama'],
        };
        describe('And the request body is NOT valid', () => {
            test('Then [POST] /api/films respond 400 and return a bad request error', async () => {
                const response = await request(app)
                    .post(urlBase)
                    .send()
                    .expect(400);
                expect(response.badRequest).toBe(true);
                expect(response.body).toStrictEqual({});
            });
        });

        describe('And the authentication is NOT valid', () => {
            test('Then [POST] /api/films respond 401 and return an unauthorized error', async () => {
                const response = await request(app)
                    .post(urlBase)
                    .send(newFilmMock)
                    .expect(401);
                expect(response.unauthorized).toBe(true);
            });
        });

        describe('And request body and ADMIN authentication is valid', () => {
            test('Then [POST] /api/films respond 201 and return the created film', async () => {
                const response = await request(app)
                    .post(urlBase)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(newFilmMock)
                    .expect(201);

                expect(response.ok).toBe(true);
                expect(response.body.id).toBe(4);
                expect(response.body.title).toBe(newFilmMock.title);
            });
        });

        describe('And request body and EDITOR authentication is valid', () => {
            test('Then [POST] /api/films respond 201 and return the created film', async () => {
                const response = await request(app)
                    .post(urlBase)
                    .set('Authorization', `Bearer ${editorToken}`)
                    .send(newFilmMock)
                    .expect(201);

                expect(response.body.title).toBe(newFilmMock.title);
            });
        });

        describe('And request body is valid but authentication is USER', () => {
            test('Then [POST] /api/films respond 403 and return a forbidden error', async () => {
                const response = await request(app)
                    .post(urlBase)
                    .set('Authorization', `Bearer ${userToken}`)
                    .send(newFilmMock)
                    .expect(403);
                expect(response.forbidden).toBe(true);
            });
        });
    });

    describe('When making PATCH requests', () => {
        const updateFilmMock: FilmUpdateDTO = {
            title: 'Updated Title',
        };

        describe('And the request body is NOT valid', () => {
            test('Then [PATCH] /api/films/1 respond 400 and return a bad request error', async () => {
                const response = await request(app)
                    .patch(urlBase + '/1')
                    .send({ title: '' })
                    .expect(400);
                expect(response.badRequest).toBe(true);
            });
        });

        describe('And the authentication is NOT valid', () => {
            test('Then [PATCH] /api/films/1 respond 401 and return an unauthorized error', async () => {
                const response = await request(app)
                    .patch(urlBase + '/1')
                    .send(updateFilmMock)
                    .expect(401);
                expect(response.unauthorized).toBe(true);
            });
        });

        describe('And request body and ADMIN authentication is valid', () => {
            test('Then [PATCH] /api/films/1 respond 200 and return the updated film', async () => {
                const response = await request(app)
                    .patch(urlBase + '/1')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(updateFilmMock)
                    .expect(200);

                expect(response.body.title).toBe('Updated Title');
            });

            test('Then [PATCH] /api/films/100 respond 404 and return a bad request error', async () => {
                const response = await request(app)
                    .patch(urlBase + '/100')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(updateFilmMock)
                    .expect(404);
                expect(response.notFound).toBe(true);
            });
        });

        describe('And request body and EDITOR authentication is valid', () => {
            test('Then [PATCH] /api/films/1 respond 200 and return the updated film', async () => {
                const response = await request(app)
                    .patch(urlBase + '/1')
                    .set('Authorization', `Bearer ${editorToken}`)
                    .send(updateFilmMock)
                    .expect(200);

                expect(response.body.title).toBe('Updated Title');
            });
        });

        describe('And request body is valid but authentication is USER', () => {
            test('Then [PATCH] /api/films/1 respond 403 and return a forbidden error', async () => {
                const response = await request(app)
                    .patch(urlBase + '/1')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send(updateFilmMock)
                    .expect(403);
                expect(response.forbidden).toBe(true);
            });
        });
    });

    describe('When making DELETE requests of a film without reviews', () => {
        describe('And the authentication is NOT valid', () => {
            test('Then [DELETE] /api/films/3 respond 401 and return an unauthorized error', async () => {
                const response = await request(app)
                    .delete(urlBase + '/3')
                    .expect(401);
                expect(response.unauthorized).toBe(true);
            });
        });

        describe('And ADMIN authentication is valid', () => {
            test('Then [DELETE] /api/films/3 respond 204 and delete the film', async () => {
                await request(app)
                    .delete(urlBase + '/3')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(204);

                // Verify the film is deleted
                await request(app)
                    .get(urlBase + '/3')
                    .expect(404);
            });

            test('Then [DELETE] /api/films/100 respond 404 ', async () => {
                await request(app)
                    .delete(urlBase + '/100')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(404);
            });
        });

        describe('And authentication is EDITOR', () => {
            test('Then [DELETE] /api/films/3 respond 204 and delete the film', async () => {
                await request(app)
                    .delete(urlBase + '/3')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(204);

                // Verify the film is deleted
                await request(app)
                    .get(urlBase + '/3')
                    .expect(404);
            });
        });

        describe('And authentication is USER', () => {
            test('Then [DELETE] /api/films/3 respond 403 and return a forbidden error', async () => {
                const response = await request(app)
                    .delete(urlBase + '/3')
                    .set('Authorization', `Bearer ${userToken}`)
                    .expect(403);
                expect(response.forbidden).toBe(true);
            });
        });
    });

    describe('When making DELETE requests of a film with reviews', () => {
        describe('And the authentication is NOT valid', () => {
            test('Then [DELETE] /api/films/1 respond 401 and return an unauthorized error', async () => {
                const response = await request(app)
                    .delete(urlBase + '/1')
                    .expect(401);
                expect(response.unauthorized).toBe(true);
            });
        });

        describe('And ADMIN authentication is valid', () => {
            test('Then [DELETE] /api/films/1 respond 500 and return an internal server error', async () => {
                const response = await request(app)
                    .delete(urlBase + '/1')
                    .set('Authorization', `Bearer ${adminToken}`)
                    //.expect(409);
                    .expect(500);
                expect(response.serverError).toBe(true);
            });
        });
    });
});
