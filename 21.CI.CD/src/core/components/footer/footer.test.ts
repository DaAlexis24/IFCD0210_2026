import { screen, within } from '@testing-library/dom';
import { Footer } from './footer';

describe('Given Footer component', () => {
    const render = (
        element: HTMLElement = document.createElement(Footer.selector),
    ) => {
        // Errores en la sesión previa
        // customElements.define('app-footer', Footer);
        // const co =   document.createElement('div')
        // co.innerHTML = '<app-footer><app-footer>'
        // - el contenedor se compartía entre pruebas,
        // - el componente no se montaba realmente en document.body,
        // - el registro del custom element se hacía
        // con customElements.define(...) directo
        // en vez de usar Footer.register().
        // Eso hacía el test más frágil y menos representativo
        // del comportamiento real.

        // El elemento se recibe como parámetro,
        // lo que permite crear instancias personalizadas del componente
        // para pruebas específicas,
        // como la prueba de la dirección personalizada.
        // Pero con un valor por defecto:
        // document.createElement(Footer.selector).

        // Al montar el componente realmente en document.body
        // Se puede acceder a él en el objeto screen de Testing Library,
        // lo que hace las pruebas más realistas y robustas,
        // ya que simula mejor el entorno en el que se usaría el componente.

        Footer.register(); // customElements.define('app-footer', Footer);
        // crear element...
        document.body.append(element);
        return element;
    };

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('registers safely when called more than once', () => {
        expect(() => {
            Footer.register();
            Footer.register();
        }).not.toThrow();
    });

    test('element could be instantiated', () => {
        const element = render();
        expect(element).toBeInstanceOf(HTMLElement);
        expect(element).toBeInstanceOf(Footer);
    });

    describe('When its render in a document', () => {
        test('Then we can test it WITHOUT the testing library', () => {
            render();
            const footer = document.querySelector('footer');
            expect(footer).toBeInstanceOf(HTMLElement);
        });

        describe('Then we can test roles WITH the testing library', () => {
            test('And renders the footer landmark with the course address', () => {
                render();
                const elementFooter = screen.getByRole('contentinfo', {
                    name: 'main-footer',
                });
                expect(elementFooter).toBeInTheDocument();
                expect(elementFooter).toHaveTextContent(/CFD Alcobendas/i);
            });
        });

        test('Then we can make other tests s WITH the testing library', () => {
            render();
            // -Alternativas a ...ByRole utilizando Testing Library,
            const items = screen.getAllByRole('listitem');
            expect(items.length).toBe(4);
            screen.getByText(/Alcobendas/i);
            screen.getByTitle('footer');
            screen.getByTestId('footer');
        });

        test('renders the social links inside a list', () => {
            render();

            const list = screen.getByRole('list');
            const links = within(list).getAllByRole('link');

            expect(links.length).toBeGreaterThan(0);
            expect(links.length).toBe(4);

            links.forEach((link) => {
                expect(link).toHaveAttribute('href');
                expect(link).toHaveAttribute('target', '_blank');
            });
        });

        test('allows overriding the address when created programmatically', () => {
            render(new Footer('Test address'));
            
            expect(screen.getByText('Test address')).toBeInTheDocument();
        });
    });
});
