import { vi, it, describe, expect, beforeEach } from 'vitest';
import User from '../../src/models/User';
import app from '../../src/app'
import request from 'supertest';
import * as validators from '../../src/utils/validator'
import { IUser } from '../../src/types/user';
import bcrypt from 'bcryptjs'
import { Types } from 'mongoose';
import TestAgent from 'supertest/lib/agent';

vi.mock('../../src/models/User');
vi.mock('../../src/utils/validator');
vi.mock('bcrypt');

const user : IUser = {
    _id: new Types.ObjectId,
    username: 'simiii',
    name: "SIM",
    password: "#TheSim25",
    email: 'thesim@sim.dev',
    emoji: '1f600',
    admin: true
}

const connexion = async(agent : TestAgent) => {          
    vi.mocked(validators.checkPassword).mockReturnValue(true);
    vi.mocked(validators.checkUsername).mockReturnValue(true);
    vi.mocked(User.findOne).mockResolvedValue(user as any);
    vi.spyOn(bcrypt, 'compare').mockImplementation((p, h) => {return true});
                
    await agent.post('/account/login').send(user);        
}

describe('Account Route', () => {
    const agent = request.agent(app);
    describe('Connexion route', () => {
        it('inscription reussite', async () => {
            
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

    describe('User Info', () => {
        it('Echouer pour utilisateur non connecté', async () => {
            vi.mocked(User.findById).mockResolvedValue(user);
            
            const res = await request(app).get('/account');
            
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(401);
        })

        it('Reussite pour utilisateur connecté', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(User.findById).mockResolvedValue(user);

            const res = await agent.get('/account');
            
            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(200);
        })
        
    })

    describe('Deconnexion', () => {
        it('devrait se deconnecté', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(User.findById).mockResolvedValue(user);

            let res = await agent.get('/account');
            
            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(200);

            res = await agent.get('/account/logout');
            
            expect(res.status).toBe(204);

            res = await agent.get('/account');
            
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(401);
        })
    })
})