import { API_URL } from "../config/config";

export class UsersRepository {
    #url = `${API_URL}/user/register`;

    async register(data: FormData) {
        console.log(data)
        fetch(this.#url, {
            method: 'POST',
            body: data
        })
    }
}
