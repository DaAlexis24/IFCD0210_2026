import { FilmsRepository } from './films-repository';

describe('Given a instance of Films Repository', () => {
    // Arrange
    const repo = new FilmsRepository();

    describe('When the method getAll is called', () => {
        describe('And fetch response is ok', () => {
            beforeEach(() => {
                // Arrange
                vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                    ok: true,
                    json: vi.fn().mockResolvedValueOnce([]),
                } as unknown as Response);
            });
            test('Then it return the fetch data', async () => {
                // Act
                const films = await repo.getAll();
                // Assert
                expect(fetch).toHaveBeenCalled();
                expect(films).toBeInstanceOf(Array);
            });
        });
        describe('And fetch response is NOT ok', () => {
            beforeEach(() => {
                // Arrange
                vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                    ok: false,
                } as unknown as Response);
            });
            test('Then it reject the promise', async () => {
                // Act and Assert
                expect(repo.getAll()).rejects.toThrow();
            });
        });
    });
});
