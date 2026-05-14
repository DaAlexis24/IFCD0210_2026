import { HomeView } from "./home.ts"

test('HomeView', async () => {
    expect(typeof await HomeView.render()).toBe('string')
})

test('HomeView', async () => {
    expect(typeof await HomeView.render(false)).toBe('string')
})
