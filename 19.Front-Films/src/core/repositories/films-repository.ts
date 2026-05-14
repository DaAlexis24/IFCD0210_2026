
import { API_URL } from '../config/config';
import type { Film } from '../entities/film.entity';


export class FilmsRepository {
    #url = `${API_URL}/films`;

    async getAll(): Promise<Film[]> {
        const response = await fetch(this.#url);
        if (!response.ok) {
            throw new Error(`Error fetching films: ${response.status}`);
        }

        return (await response.json()) as Film[];
    }
}
