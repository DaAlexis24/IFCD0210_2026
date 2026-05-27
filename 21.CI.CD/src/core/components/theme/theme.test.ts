import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Theme } from './theme';

describe('Given Theme component', () => {
    const render = (
        element: HTMLElement = document.createElement(Theme.selector),
    ) => {
        Theme.register();
        document.body.append(element);
        return element;
    };

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('registers safely when called more than once', () => {
        expect(() => {
            Theme.register();
            Theme.register();
        }).not.toThrow();
    });

    test('element could be instantiated', () => {
        const element = render();
        expect(element).toBeInstanceOf(HTMLElement);
        expect(element).toBeInstanceOf(Theme);
    });

    describe('When the component has been render', () => {
        beforeEach(() => {
            render();
        });

        test('Then the checkbox is in the document and NOT checked', () => {
            const element = screen.getByLabelText(/claro/i);
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('switch');
            expect(element).not.toBeChecked();
        });

        test('Then the checkbox could be checked (click)', () => {
            const element = screen.getByLabelText(/claro/i);
            expect(element).toBeInTheDocument();
            expect(element).not.toBeChecked();
            element.click();
            expect(element).toBeChecked();
        });

        test('Then the checkbox could be checked (fireEvent)', () => {
            const element = screen.getByLabelText(/claro/i);
            expect(element).toBeInTheDocument();
            expect(element).not.toBeChecked();
            fireEvent.click(element);
            expect(element).toBeChecked();
        });

        test('Then the checkbox could be checked (userEvent)', async () => {
            const element = screen.getByLabelText(/claro/i);
            expect(element).toBeInTheDocument();
            expect(element).not.toBeChecked();
            await userEvent.click(element);
            expect(element).toBeChecked();
        });
    });
});
