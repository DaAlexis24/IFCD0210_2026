import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Header } from './header';



describe('Given Header component', () => {

 const render = (
        element: HTMLElement = document.createElement(Header.selector),
    ) => {
        Header.register(); // customElements.define('app-header', Header);
        document.body.append(element);
        return element;
    };

    afterEach(() => {
        document.body.innerHTML = '';
    });


        test('registers safely when called more than once', () => {
            expect(() => {
                Header.register();
                Header.register();
            }).not.toThrow();
        });
    
        test('element could be instantiated', () => {
            const element = render();
            expect(element).toBeInstanceOf(HTMLElement);
            expect(element).toBeInstanceOf(Header);
        });


    describe('When its render in the body', () => {
        test('Then we can test it WITH the testing library', () => {
            render();
            const headerElement = screen.getByRole('banner');
            expect(headerElement).toBeInTheDocument();
        });
    });
});
