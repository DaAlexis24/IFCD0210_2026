import { screen, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Register } from './register';

describe('Given Register component', () => {
    const render = (
        element: HTMLElement = document.createElement(Register.selector),
    ) => {
        Register.register();
        document.body.append(element);
        return element;
    };

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('registers safely when called more than once', () => {
        expect(() => {
            Register.register();
            Register.register();
        }).not.toThrow();
    });

    test('element could be instantiated', () => {
        const element = render();
        expect(element).toBeInstanceOf(HTMLElement);
        expect(element).toBeInstanceOf(Register);
    });

    describe('When the component has been render', () => {
        
        let e: HTMLElement
        
        beforeEach(() => {
            e = render();
            vi.spyOn(e, 'dispatchEvent')
        });

        test('Then a section will be in the document with a heading', () => {
            const sectionElement = screen.getByRole('region', {
                name: 'Registro',
            });
            within(sectionElement).getByRole('heading', {
                name: /registro/i,
                level: 2,
            });
        });

        test('Then a form will be completed and send', async () => {
            const form = screen.getByRole<HTMLFormElement>('form');
            expect(form).toBeInTheDocument();
            const errorArea = screen.getByRole('alert');
            expect(errorArea).toHaveTextContent('');
            await userEvent.type(screen.getByLabelText(/email/i), 'pepe@sample.com');
            await userEvent.type(form.elements.namedItem('password') as HTMLElement, '12345678');
            await userEvent.type(screen.getByLabelText(/nombre/i), 'Pepe');
            await userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
            const button = within(form).getByRole('button');
            await userEvent.click(button);
            expect(errorArea).toHaveTextContent('');
            expect(e.dispatchEvent).toHaveBeenCalled()
            
        });
        test('Then a form UNCOMPLETED will not be send', async () => {
            const form = screen.getByRole('form');
            const errorArea = screen.getByRole('alert');
            expect(errorArea).toHaveTextContent('');
            const button = within(form).getByRole('button');
            await userEvent.click(button);
            expect(errorArea).not.toHaveTextContent('');
        });
    });
});
