import { vi, it, describe, expect, beforeEach } from 'vitest';
import User from '../../src/models/User';
import app from '../../src/app'
import request from 'supertest';
import * as validators from '../../src/utils/validator'
import bcrypt from 'bcryptjs'
import { Types } from 'mongoose';
import TestAgent from 'supertest/lib/agent';
import { createUser } from '../factories/userFactories';
import Comment from '../../src/models/Comment';
import Drawing from '../../src/models/Drawing';
import { createMockDrawing } from '../factories/drawingFactory';
import { AnyCnameRecord } from 'dns';
import * as helpers from '../../src/utils/helpers'
import * as apiResponse from '../../src/middlewares/apiResponse'
import { createMockAuthor } from '../factories/authorFactory';
import * as drawingTypes from '../../src/types/drawing';

vi.mock('../../src/models/User');
vi.mock('../../src/utils/validator');
vi.mock('bcrypt');
vi.mock('../../src/models/Comment');
vi.mock('../../src/models/Drawing');
vi.mock('../../src/utils/helpers')
vi.mock('../../src/types/drawing')


const connexion = async(
    agent : TestAgent,
    admin: boolean = true,
    userId: Types.ObjectId = new Types.ObjectId
) => {          
    vi.mocked(validators.checkPassword).mockReturnValue(true);
    vi.mocked(validators.checkUsername).mockReturnValue(true);
    vi.mocked(User.findOne).mockResolvedValue(createUser({admin: admin, _id: userId}) as any);
    vi.spyOn(bcrypt, 'compare').mockImplementation((p, h) => {return true});
                
    await agent.post('/account/login').send(createUser());        
}

describe('Draw routes', () => {
    describe('GET /draw/:id', () => {
        it('devrait reussir', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);
            await connexion(agent);

            
            vi.mocked(Drawing.findById).mockResolvedValue({
                participants: ["oo"], maxParticipants: 2, isDone: false, isPublic: false
            });
            vi.mocked(Drawing.findByIdAndUpdate).mockResolvedValue({_id: id,});
            vi.mocked(helpers.hasParticipated).mockReturnValue(false);

            const res = await agent.get(`/draw/${id}`);
            
            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(200);
        })

        it('devrait echouer', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);
            await connexion(agent);

            
            vi.mocked(Drawing.findById).mockResolvedValue({
                participants: ["oo"], maxParticipants: 2, isDone: false, isPublic: false
            });
            vi.mocked(Drawing.findByIdAndUpdate).mockRejectedValue(new Error('ici'));
            vi.mocked(helpers.hasParticipated).mockReturnValue(false);

            const res = await agent.get(`/draw/${id}`);
            
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(500);
        })
    })

    describe('PUT /drawing/:id', () => {
        beforeEach(() => {
            vi.clearAllMocks()
        })
        it('Devrait reussir sans mettre isDone à true', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(Drawing.findById).mockResolvedValue({
                participants: ["oo"], maxParticipants: 2, isDone: false, isPublic: false
            });
            vi.mocked(Drawing.findByIdAndUpdate).mockResolvedValue({participants:["is"], maxParticipants: 2});
            vi.mocked(helpers.hasParticipated).mockReturnValue(false);
            vi.mocked(drawingTypes.isValidPath).mockReturnValue(true);
            vi.mocked(User.findByIdAndUpdate).mockResolvedValue({});

            const res = await agent.put(`/draw/${id}`).send({ paths: "ici", start: 3, end: 5});
            
            expect(res.status).toBe(204);
            expect(Drawing.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        })

        it('Devrait reussir en mettant isDone à true', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(Drawing.findById).mockResolvedValue({
                participants: ["oo"], maxParticipants: 2, isDone: false, isPublic: false
            });
            vi.mocked(Drawing.findByIdAndUpdate).mockResolvedValue({participants:["is"], maxParticipants: 1});
            vi.mocked(helpers.hasParticipated).mockReturnValue(false);
            vi.mocked(drawingTypes.isValidPath).mockReturnValue(true);
            vi.mocked(User.findByIdAndUpdate).mockResolvedValue({});

            const res = await agent.put(`/draw/${id}`).send({ paths: "ici", start: 3, end: 5});
            
            expect(res.status).toBe(204);
            expect(Drawing.findByIdAndUpdate).toHaveBeenCalledTimes(2);
        })

        it('Devrait echouer', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);
            await connexion(agent);

            vi.mocked(Drawing.findById).mockResolvedValue({
                participants: ["oo"], maxParticipants: 2, isDone: false, isPublic: false
            });
            vi.mocked(Drawing.findByIdAndUpdate).mockResolvedValue({participants:["is"], maxParticipants: 1});
            vi.mocked(helpers.hasParticipated).mockReturnValue(false);
            vi.mocked(drawingTypes.isValidPath).mockReturnValue(true);
            vi.mocked(User.findByIdAndUpdate).mockRejectedValue(new Error('ici'));

            const res = await agent.put(`/draw/${id}`).send({ paths: "ici", start: 3, end: 5});
            
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(500);
        })
    })

    describe('PUT /draw/giveup/:id', () => {
        it('devrait reussir', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);
            await connexion(agent);

            
            vi.mocked(Drawing.findById).mockResolvedValue({
                participants: ["oo"], maxParticipants: 2, isDone: false, isPublic: false
            });
            vi.mocked(Drawing.findByIdAndUpdate).mockResolvedValue({_id: id,});
            vi.mocked(helpers.hasParticipated).mockReturnValue(false);

            const res = await agent.put(`/draw/giveup/${id}`);
            
            expect(res.status).toBe(204);
        })

        it('devrait echouer', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);
            await connexion(agent);

            
            vi.mocked(Drawing.findById).mockResolvedValue({
                participants: ["oo"], maxParticipants: 2, isDone: false, isPublic: false
            });
            vi.mocked(Drawing.findByIdAndUpdate).mockRejectedValue(new Error('ici'));
            vi.mocked(helpers.hasParticipated).mockReturnValue(false);

            const res = await agent.put(`/draw/giveup/${id}`);
            
            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(500);
        })


    })
})