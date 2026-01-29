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

vi.mock('../../src/models/User');
vi.mock('../../src/utils/validator');
vi.mock('bcrypt');
vi.mock('../../src/models/Comment');
vi.mock('../../src/models/Drawing');

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

describe('Comment routes', () => {
    it('POST /comment', async () => {
        const agent = request.agent(app);
        await connexion(agent);

        const comment = {comment : "nouveau commentaire", drawingId: new Types.ObjectId};
        vi.mocked(Drawing.findById).mockResolvedValue(createMockDrawing({isPublic: true}) as any);
        vi.mocked(Comment.create).mockResolvedValue({} as any);

        const res = await agent.post('/comment').send(comment);

        expect(res.body.success).toBeTruthy();
        expect(res.status).toBe(201);
        expect(Comment.create).toHaveBeenCalled();
    })

    it('POST /comment erreur server', async () => {
        const agent = request.agent(app);
        await connexion(agent);

        const comment = {comment : "nouveau commentaire", drawingId: new Types.ObjectId};
        vi.mocked(Drawing.findById).mockResolvedValue(createMockDrawing({isPublic: true}) as any);
        vi.mocked(Comment.create).mockRejectedValue(new Error(' '));

        const res = await agent.post('/comment').send(comment);

        expect(res.body.success).toBeFalsy();
        expect(res.status).toBe(500);
        
    })

    it('DELETE /comment/:id', async () => {
        const id = new Types.ObjectId
        const agent = request.agent(app);
        await connexion(agent,true, id);
        
        vi.mocked(Comment.findByIdAndDelete).mockResolvedValue({} as any);
        vi.mocked(Comment.findById).mockResolvedValue({author: {authorId: id}} as any);

        const res = await agent.delete(`/comment/${id}`);
        expect(res.status).toBe(204);
    })

    it('DELETE /comment/:id erreur server', async () => {
        const id = new Types.ObjectId
        const agent = request.agent(app);
        await connexion(agent,true, id);
        
        vi.mocked(Comment.findByIdAndDelete).mockRejectedValue(new Error(' '));
        vi.mocked(Comment.findById).mockResolvedValue({author: {authorId: id}} as any);

        const res = await agent.delete(`/comment/${id}`);
        expect(res.status).toBe(500);
    })

    it ('PUT /comment/:id', async () => {
        const id = new Types.ObjectId
        const agent = request.agent(app);
        await connexion(agent,true, id);
        
        vi.mocked(Comment.findByIdAndUpdate).mockResolvedValue({} as any);
        vi.mocked(Comment.findById).mockResolvedValue({author: {authorId: id}} as any);

        const res = await agent.put(`/comment/${id}`).send({comment: "ici"});
        expect(res.status).toBe(204);
    })

    it ('PUT /comment/:id erreur server', async () => {
        const id = new Types.ObjectId
        const agent = request.agent(app);
        await connexion(agent,true, id);
        
        vi.mocked(Comment.findByIdAndUpdate).mockRejectedValue(new Error(' '));
        vi.mocked(Comment.findById).mockResolvedValue({author: {authorId: id}} as any);

        const res = await agent.put(`/comment/${id}`).send({comment: "ici"});
        expect(res.status).toBe(500);
    })
})