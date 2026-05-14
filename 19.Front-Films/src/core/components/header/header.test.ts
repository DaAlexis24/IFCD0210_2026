import { getByRole } from "@testing-library/dom";
import { Header } from "./header";

Header.render()
const co =   document.createElement('div')
co.innerHTML = '<app-header><app-header>'

describe('Given Header component', () => {
    describe('When its render in a container', () => {
        test('Then we can test it WITH the testing library', () =>{
            const e = getByRole(co, 'banner')
            expect(e).toBeInstanceOf(HTMLElement)
        });
    });
});
        
           
