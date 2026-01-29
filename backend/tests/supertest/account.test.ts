import { vi, it, describe, expect, beforeEach } from 'vitest';
import User from '../../src/models/User';
import app from '../../src/app'
import request from 'supertest';
import * as validators from '../../src/utils/validator'
import bcrypt from 'bcryptjs'
import { Types } from 'mongoose';
import TestAgent from 'supertest/lib/agent';
import { createUser } from '../factories/userFactories';
import Drawing from '../../src/models/Drawing';

vi.mock('../../src/models/User');
vi.mock('../../src/utils/validator');
vi.mock('bcrypt');
vi.mock('../../src/models/Drawing');

const connexion = async(agent : TestAgent, admin: boolean = true) => {          
    vi.mocked(validators.checkPassword).mockReturnValue(true);
    vi.mocked(validators.checkUsername).mockReturnValue(true);
    vi.mocked(User.findOne).mockResolvedValue(createUser({admin: admin}) as any);
    vi.spyOn(bcrypt, 'compare').mockImplementation((p, h) => {return true});
                
    await agent.post('/account/login').send(createUser());        
}

describe('Account Route', () => {
    const agent = request.agent(app);
    describe('Connexion route', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        })
        it('inscription reussite', async () => {
            
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            vi.mocked(User.findOne).mockResolvedValue(createUser() as any);
            vi.spyOn(bcrypt, 'compare').mockImplementation((p, h) => {return true});

            const res = await agent.post('/account/login').send(createUser());

            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(200);
            expect(res.body.data.password).toBeUndefined();
            expect(res.body.data.email).toBeUndefined();
            
        })

        /**
         * it('inscription echouée', async () => {
            
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            vi.mocked(User.findOne).mockRejectedValue(new Error('ici'))
            vi.spyOn(bcrypt, 'compare').mockImplementation((p, h) => {return true});

            const res = await agent.post('/account/login').send(createUser());

            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(500);
        })
         */

        
    })

    describe('User Info', () => {
        it('Echouer pour utilisateur non connecté', async () => {
            vi.mocked(User.findById).mockResolvedValue(createUser());
            
            const res = await request(app).get('/account');
            
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(401);
        })

        it('Reussite pour utilisateur connecté', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(User.findById).mockResolvedValue(createUser());

            const res = await agent.get('/account');
            
            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(200);
        })

        it('erreur serveur', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(User.findById).mockRejectedValue(new Error(''));

            const res = await agent.get('/account');
            
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(500);
        })
        
    })

    describe('Deconnexion', () => {
        it('devrait se deconnecté', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(User.findById).mockResolvedValue(createUser());

            let res = await agent.get('/account');
            
            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(200);

            res = await agent.get('/account/logout');
            
            expect(res.status).toBe(204);

            res = await agent.get('/account');
            
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(401);
        })

        it('erreur server', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(User.findById).mockResolvedValue(createUser());

            let res = await agent.get('/account');
            
            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(200);

            vi.clearAllMocks()
            vi.mocked(User.findById).mockRejectedValue(new Error(''));

            res = await agent.get('/account/logout');
            
            expect(res.status).toBe(204);

            res = await agent.get('/account');
            
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(401);
        })
    })

    describe('Admin', () => {
        it('Connecter mais pas admin', async () => {
            const agent = request.agent(app);
            await connexion(agent, false);

            const res = await agent.get('/account/admin');

            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(403);
        })

        it('Requte reussi avec success', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(Drawing.find).mockResolvedValue({} as any)
            const res = await agent.get('/account/admin');

            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(201);
        })

        it('Erreur server', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(Drawing.find).mockRejectedValue(new Error(' '))
            const res = await agent.get('/account/admin');

            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(500);
        })
    })

    describe('Accepter ou refuser la publication d\'un dessin', () => {
        it('accepter', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(Drawing.findById).mockResolvedValue({} as any);
            vi.mocked(Drawing.findByIdAndUpdate).mockResolvedValue({} as any);

            const res = await agent.put('/account/admin').send(
                {
                    choice: 'accepter',
                    drawingId: new Types.ObjectId
                }
            );
            expect(res.status).toBe(204);
        })

        it('accepter', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(Drawing.findById).mockResolvedValue({} as any);
            vi.mocked(Drawing.findByIdAndDelete).mockResolvedValue({} as any);

            const res = await agent.delete('/account/admin').send(
                {
                    choice: 'refuser',
                    drawingId: new Types.ObjectId
                }
            );
            expect(res.status).toBe(204);
        })

        it('erreur server', async () => {
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(Drawing.findById).mockRejectedValue(new Error(' '));
            vi.mocked(Drawing.findByIdAndDelete).mockResolvedValue({} as any);

            const res = await agent.delete('/account/admin').send(
                {
                    choice: 'refuser',
                    drawingId: new Types.ObjectId
                }
            );
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(500);
        })
    })
})