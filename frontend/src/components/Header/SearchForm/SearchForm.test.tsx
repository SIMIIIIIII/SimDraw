import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SearchForm } from './SearchForm';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

describe('SearchForm', () => {
    afterEach(() => {
        cleanup();
    });

    describe('Button submit', () => {
        it('le button submit avec parametre par default', () => {
            render(
                <MemoryRouter>
                    <SearchForm>search</SearchForm>
                </MemoryRouter>
            );
            const submit = screen.getByRole('button');

            expect(submit).toBeDefined();
            expect(submit.value).toBe('search')
            expect(submit.disabled).toBeFalsy();
            expect(submit.type).toBe('submit');
        })

        it('le button avec loading defini', () => {
            render(
                <MemoryRouter>
                    <SearchForm loading={true}>search</SearchForm>
                </MemoryRouter>
            );
            const submit = screen.getByRole('button');

            expect(submit).toBeDefined();
            expect(submit.value).toBe('Loading...')
            expect(submit.disabled).toBeTruthy();
            expect(submit.type).toBe('submit');
        })
    })

    describe('textBox', () => {
        it('le search input existe', () => {
            render(
                <MemoryRouter>
                    <SearchForm>search</SearchForm>
                </MemoryRouter>
            );
            const text = screen.getByLabelText(/Recherche/i);

            expect(text).toBeDefined();
            expect(text.placeholder).toBe("Champs de recherche")
        })

        it('update le search box existe', async () => {
            const user = userEvent.setup();
            render(
                <MemoryRouter>
                    <SearchForm>search</SearchForm>
                </MemoryRouter>
            );
            const text = screen.getByLabelText(/Recherche/i);

            await user.type(text, 'Simeon Lama');

            expect(text.value).toBe('Simeon Lama')
        })
    })
    
    
})
