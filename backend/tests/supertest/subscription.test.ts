import { vi, it, describe, expect, beforeEach } from 'vitest';
import User from '../../src/models/User';
import { failIfConnected } from '../../src/middlewares/auth'
import { validateSubscriptionPost } from '../../src/middlewares/validate';
import { validateUniqueEmail, validateUniqueUsername } from '../../src/middlewares/validateUniqueDatas';
import app from '../../src/app'
import request from 'supertest';
import * as validators from '../../src/utils/validator'
import { IUser } from '../../src/types/user';

vi.mock('../../src/models/User');
vi.mock('../../src/utils/validator');

describe('Subscrition Route', () => {
    it('inscription reussite', async () => {
        const user : IUser = {
            username: 'simiii',
            name: "SIM",
            password: "#TheSim25",
            email: 'thesim@sim.dev'
        }

        vi.mocked(validators.checkEmail).mockReturnValue(true);
        vi.mocked(validators.checkPassword).mockReturnValue(true);
        vi.mocked(validators.checkUsername).mockReturnValue(true);
        vi.mocked(User.create).mockResolvedValue(user as any);

        const res = await request(app).post('/subscription').send(user);

        expect(res.body.success).toBeTruthy;
        expect(res.status).toBe(201);
        expect(res.body.data.password).toBeUndefined();
        expect(res.body.data.email).toBeUndefined();
        
    })

    it('erreur server', async () => {
        const user : IUser = {
            username: 'simiii',
            name: "SIM",
            password: "#TheSim25",
            email: 'thesim@sim.dev'
        }

        vi.mocked(validators.checkEmail).mockReturnValue(true);
        vi.mocked(validators.checkPassword).mockReturnValue(true);
        vi.mocked(validators.checkUsername).mockReturnValue(true);
        vi.mocked(User.create).mockRejectedValue(new Error(' '));

        const res = await request(app).post('/subscription').send(user);

        expect(res.body.success).toBeFalsy();
        expect(res.status).toBe(500);
        
        
    })
})