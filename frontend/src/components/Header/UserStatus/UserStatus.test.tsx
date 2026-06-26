import { it, expect, describe, afterEach } from 'vitest';
import { UserStatus } from './UserStatus';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { IUser } from '../../../types/user';



describe('UserStatus', () => {
    afterEach(() => {
        cleanup();
    });

    it('un utilisateur non connecté', async () => {
        render(
            <MemoryRouter>
                <UserStatus user={null} />
            </MemoryRouter>
        );

        const connexion = await screen.findAllByRole('link');

        expect(connexion).toBeDefined()
        expect(connexion).toHaveLength(1)
        expect(connexion[0].innerHTML).toContain("Connexion")
        expect(connexion[0].href).toContain('/connexion');
    })

    it('un utilisateur connecté', async () => {
        const user : IUser = {
            userId: "ihsnsns",
            username: "simiii",
            admin: true
        }
        render(
            <MemoryRouter>
                <UserStatus user={user} />
            </MemoryRouter>
        );

        const connexion = await screen.findAllByRole('link');

        expect(connexion).toBeDefined()
        expect(connexion).toHaveLength(1)
        expect(connexion[0].innerHTML).toContain("simiii")
        expect(connexion[0].href).toContain('/account');
    })
})