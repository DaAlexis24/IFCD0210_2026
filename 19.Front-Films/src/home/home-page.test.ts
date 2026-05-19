import { screen } from '@testing-library/dom';
import { HomePage } from './home-page';

describe('Given HomePage component', () => {
    beforeEach(() => {
        document.body.innerHTML = '<main></main>';
    });

    const render = (
        element: HTMLElement = document.createElement(HomePage.selector),
    ) => {
        HomePage.register();
        // document.body.append(element);
        return element;
    };

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('registers safely when called more than once', () => {
        expect(() => {
            HomePage.register();
            HomePage.register();
        }).not.toThrow();
    });

    test('element could be instantiated', () => {
        const element = render();
        expect(element).toBeInstanceOf(HTMLElement);
        expect(element).toBeInstanceOf(HomePage);
    });

     describe('When the component has been render', () => {
        beforeEach(() => {
            render();
        });

        test('Then a section will be in the document', () => {
            screen.getByRole('region', {
                name: "home-page"
            })
        })
    });
});
