import { Footer } from "./footer"
import { getAllByRole, getByRole, getByTestId, getByText, getByTitle } from '@testing-library/dom'

customElements.define('app-footer', Footer);
const co =   document.createElement('div')
co.innerHTML = '<app-footer><app-footer>'

describe('Given Footer component', () => {
    describe('When its render in a container', () => {

        test('Then we can test it WITH the testing library', () =>{
            // Footer.render()
            const e = getByRole(co, 'contentinfo', {
                name: 'main-footer'
            })
            expect(e).toBeInstanceOf(HTMLElement)
        
            const items = getAllByRole(co, 'listitem')
            expect(items.length).toBe(4)
            getByText(co, /Alcobendas/i)
            getByTitle(co, 'footer')
            getByTestId(co, 'footer')
        })
        
        test('Then we can test it WITHOUT the testing library', () => {
            const footer = co.querySelector('footer')
            expect(footer).toBeInstanceOf(HTMLElement)
        })
    })
})


