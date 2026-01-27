import { vi, it, describe, expect, beforeEach } from 'vitest';
import User from '../../src/models/User';
import app from '../../src/app'
import request from 'supertest';
import * as validators from '../../src/utils/validator'
import { IUser } from '../../src/types/user';
import bcrypt from 'bcryptjs'

vi.mock('../../src/models/User');
vi.mock('../../src/utils/validator');
vi.mock('bcrypt');

describe('Account Route', () => {
    const agent = request.agent(app);
    describe('Connexion route', () => {
        it('inscription reussite', async () => {
            const user : IUser = {
                username: 'simiii',
                name: "SIM",
                password: "#TheSim25",
                email: 'thesim@sim.dev'
            }
            
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            vi.mocked(User.findOne).mockResolvedValue(user as any);
            vi.spyOn(bcrypt, 'compare').mockImplementation((p, h) => {return true});

            const res = await agent.post('/account/login').send(user);

            expect(res.body.success).toBeTruthy;
            expect(res.status).toBe(200);
            expect(res.body.data.password).toBeUndefined();
            expect(res.body.data.email).toBeUndefined();
            
        })
    })
})