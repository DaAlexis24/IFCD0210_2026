import { FilmsRepository } from "./films-repository"

test('Get All films', async () => {
    const repo = new FilmsRepository()
    const films = await repo.getAll()
    expect(films).toBeInstanceOf(Array)
})
