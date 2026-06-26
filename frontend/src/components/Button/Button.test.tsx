import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

afterEach(() => {
    cleanup();
});
import Button from './Button';

describe('Button', () => {
    it('affiche le texte passé en props', () => {
        render(
            <MemoryRouter>
                <Button>Click me</Button>
            </MemoryRouter>
        );
        expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined();
    });

    it('affiche la classe du button', () => {
        render(
            <MemoryRouter>
                <Button>Click me</Button>
            </MemoryRouter>
        );
        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeDefined();
        expect(button.className).to.equal('submit-button');
    });
});