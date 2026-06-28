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
import * as helpers from '../../src/utils/helpers'
import { createMockAuthor } from '../factories/authorFactory';
import * as validateDrawing from '../../src/middlewares/validateDrawing';
import * as drawingHelpers from '@utils/drawingHelpers';
import redis from '../../src/config/redis';


vi.mock('../../src/models/User');
vi.mock('../../src/utils/validator');
vi.mock('bcrypt');
vi.mock('../../src/models/Comment');
vi.mock('../../src/models/Drawing');
vi.mock('../../src/utils/helpers')
vi.mock('@utils/drawingHelpers')
vi.mock('../../src/config/redis', () => {
    const data = new Map<string, string>();

    return {
        default: {
            on: vi.fn(),
            get: vi.fn(async (key: string) => data.get(key) ?? null),
            set: vi.fn(async (key: string, value: string) => {
                data.set(key, value);
                return 'OK';
            }),
            setex: vi.fn(async (key: string, _ttl: number, value: string) => {
                data.set(key, value);
                return 'OK';
            }),
            del: vi.fn(async (key: string) => {
                return data.delete(key) ? 1 : 0;
            }),
            expire: vi.fn(async () => 1),
            __reset: () => data.clear(),
        }
    }
})

beforeEach(() => {
    vi.clearAllMocks();
    (redis as any).__reset?.();
    vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(null);
});


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

describe('Drawing routes', () => {
    describe('GET /drawing:id', () => {
        it('utilisateur non connecté', async () => {
            const id = new Types.ObjectId;
            vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
                _id: id,
                title: 'drawing 1',
                participants: [],
                maxParticipants: 1,
                isDone: true,
                isPublic: true,
            }));

            vi.mocked(helpers.formattedParticipants).mockImplementation(async() => {});
            vi.mocked(Comment.find).mockResolvedValue([]);

            const res = await request(app).get(`/drawing/${id}`);

            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(200);
            expect(helpers.hasCommented).not.toHaveBeenCalled();
        })

        it('utilisateur connecté', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);
            await connexion(agent);
            vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
                _id: id,
                title: 'drawing 2',
                participants: [],
                maxParticipants: 1,
                isDone: true,
                isPublic: true,
            }));

            vi.mocked(helpers.formattedParticipants).mockImplementation(async() => {});
            vi.mocked(Comment.find).mockResolvedValue([]);
            vi.mocked(helpers.hasCommented).mockImplementation(() => {});

            const res = await agent.get(`/drawing/${id}`);

            expect(res.body.success).toBeTruthy();
            expect(res.status).toBe(200);
            expect(helpers.hasCommented).toHaveBeenCalled();
        })

        it('echoué', async () => {
            const id = new Types.ObjectId;
            vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
                _id: id,
                title: 'drawing 3',
                participants: [],
                maxParticipants: 1,
                isDone: true,
                isPublic: true,
            }));

            vi.mocked(helpers.formattedParticipants).mockImplementation(async() => {});
            vi.mocked(Comment.find).mockRejectedValue(new Error(' '));

            const res = await request(app).get(`/drawing/${id}`);

            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(500);
            
        })
    })

    describe('PUT /drawing/like/:id', () => {
        it('Liker un dessin', async() => {
            const id = new Types.ObjectId
            const agent = request.agent(app);
            vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
                _id: id,
                title: 'drawing 4',
                participants: [],
                maxParticipants: 1,
                isDone: true,
                isPublic: true,
            }));
            const drawing = {
                isDone: true,
                isPublic: true,
                whoLiked: [],
                likes: 5,
                toggleLike: vi.fn().mockResolvedValue(1)
            }

            await connexion(agent);

            vi.mocked(Drawing.findById).mockResolvedValue(drawing);

            const res = await agent.put(`/drawing/like/${id}`);

            expect(res.status).toBe(200);
            expect(drawing.toggleLike).toHaveBeenCalled();
        })

        it('Disliker un dessin', async() => {
            const id = new Types.ObjectId
            const agent = request.agent(app);
            vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
                _id: id,
                title: 'drawing 5',
                participants: [],
                maxParticipants: 1,
                isDone: true,
                isPublic: true,
            }));
            const drawing = {
                isDone: true,
                isPublic: true,
                whoLiked: [id],
                likes: 5,
                toggleLike: vi.fn().mockResolvedValue(-1)
            }

            await connexion(agent, true, id);

            vi.mocked(Drawing.findById).mockResolvedValue(drawing);

            const res = await agent.put(`/drawing/like/${id}`);

            expect(res.status).toBe(200);
            expect(drawing.toggleLike).toHaveBeenCalled();
        })

        it('echouer', async() => {
            const id = new Types.ObjectId
            const agent = request.agent(app);
            vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
                _id: id,
                title: 'drawing 6',
                participants: [],
                maxParticipants: 1,
                isDone: true,
                isPublic: true,
            }));
            const drawing = {
                isDone: true,
                isPublic: true,
                whoLiked: [],
                likes: 5,
                toggleLike: vi.fn().mockRejectedValue(new Error(' '))
            }

            await connexion(agent);

            vi.mocked(Drawing.findById).mockResolvedValue(drawing);

            const res = await agent.put(`/drawing/like/${id}`);

            expect(res.body.success).toBeFalsy();
            expect(res.status).toBe(500);
        })
    })


    it('POST /drawing', async() => {
        const agent = request.agent(app);
        await connexion(agent);

        vi.spyOn(validateDrawing.createDrawingSchema, 'safeParse').mockReturnValue({
            success: true,
            data: {
                title: 'Titre 1',
                theme: 'Nature',
                description: 'essaie',
                maxParticipants: 2
            }
        } as any);

        vi.mocked(Drawing.create).mockResolvedValue({} as any);

        const res = await agent.post('/drawing').send({title: 'Titre 1', description: 'essaie'});
        
        expect(res.body.success).toBeTruthy();
        expect(res.status).toBe(201);

    })

    it('POST /drawing echouer', async() => {
        const agent = request.agent(app);
        await connexion(agent);

        vi.spyOn(validateDrawing.createDrawingSchema, 'safeParse').mockReturnValue({
            success: true,
            data: {
                title: 'Titre 1',
                theme: 'Nature',
                description: 'essaie',
                maxParticipants: 2
            }
        } as any);

        vi.mocked(Drawing.create).mockRejectedValue(new Error(' '));

        const res = await agent.post('/drawing').send({title: 'Titre 1', description: 'essaie'});
        
        expect(res.body.success).toBeFalsy();
        expect(res.status).toBe(500);

    })

    it('DELETE /drawing/:id', async () => {
        const agent = request.agent(app);
        await connexion(agent);
        vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(null);

        vi.mocked(Drawing.findById).mockResolvedValue({author: {authorId: new Types.ObjectId}})
        vi.mocked(Drawing.findByIdAndDelete).mockResolvedValue({});

        const res = await agent.delete(`/drawing/${new Types.ObjectId}`);

        expect(res.status).toBe(200);
    })

    it('DELETE /drawing/:id echouer', async () => {
        const agent = request.agent(app);
        await connexion(agent);
        vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(null);

        vi.mocked(Drawing.findById).mockResolvedValue({author: {authorId: new Types.ObjectId}})
        vi.mocked(Drawing.findByIdAndDelete).mockRejectedValue(new Error(' '));

        const res = await agent.delete(`/drawing/${new Types.ObjectId}`);

        expect(res.body.success).toBeFalsy();
        expect(res.status).toBe(500);
    })

    it('PUT /drawing/:id', async () => {
        const id = new Types.ObjectId;
        const agent = request.agent(app);
        const author = createMockAuthor({authorId: id});
        const drawing = createMockDrawing({author: author, isDone: true, isPublic: true})
        vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
            _id: id,
            title: drawing.title,
            participants: drawing.participants,
            maxParticipants: drawing.maxParticipants,
            isDone: true,
            isPublic: true,
        }));

        await connexion(agent, true, id);

        vi.mocked(Drawing.findById).mockResolvedValue(drawing);
        vi.mocked(Drawing.findByIdAndUpdate).mockResolvedValue(drawing);

        const res = await agent.put(`/drawing/${id}`).send({title: "titre", description: 'ici'});
        
        expect(res.body.success).toBeTruthy();
        expect(res.status).toBe(200);
    })

    it('PUT /drawing/:id echoué', async () => {
        const id = new Types.ObjectId;
        const agent = request.agent(app);
        const author = createMockAuthor({authorId: id});
        const drawing = createMockDrawing({author: author, isDone: true, isPublic: true})
        vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
            _id: id,
            title: drawing.title,
            participants: drawing.participants,
            maxParticipants: drawing.maxParticipants,
            isDone: true,
            isPublic: true,
        }));

        await connexion(agent, true, id);

        vi.mocked(Drawing.findById).mockResolvedValue(drawing);
        vi.mocked(Drawing.findByIdAndUpdate).mockRejectedValue(new Error(' '));

        const res = await agent.put(`/drawing/${id}`).send({title: "titre", description: 'ici'});
        
        expect(res.body.success).toBeFalsy();
        expect(res.status).toBe(500);
    })

    describe('Cache validateDrawingId', () => {
        it('cache hit: ne requete pas la DB', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);

            vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
                _id: id,
                title: 'cached drawing',
                participants: [],
                maxParticipants: 1,
                isDone: true,
                isPublic: true,
            }));

            vi.mocked(helpers.formattedParticipants).mockImplementation(async() => {});
            vi.mocked(Comment.find).mockResolvedValue([]);

            const res = await agent.get(`/drawing/${id}`);

            expect(res.status).toBe(200);
            expect(vi.mocked(Drawing.findById)).not.toHaveBeenCalled();
        })

        it('cache miss: lit DB + setex', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);

            vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(null);
            vi.mocked(Drawing.findById).mockReturnValue({
                lean: vi.fn().mockResolvedValue({
                    _id: id,
                    title: 'db drawing',
                    participants: [],
                    maxParticipants: 1,
                    isDone: true,
                    isPublic: true,
                })
            } as any);

            vi.mocked(helpers.formattedParticipants).mockImplementation(async() => {});
            vi.mocked(Comment.find).mockResolvedValue([]);

            const res = await agent.get(`/drawing/${id}`);

            expect(res.status).toBe(200);
            expect(vi.mocked(redis.setex)).toHaveBeenCalled();
        })

        it('cache inaccessible: invalide et renvoie 403', async () => {
            const id = new Types.ObjectId;
            const agent = request.agent(app);

            vi.mocked(drawingHelpers.searchInCache).mockResolvedValue(JSON.stringify({
                _id: id,
                title: 'private drawing',
                participants: [],
                maxParticipants: 2,
                isDone: false,
                isPublic: false,
            }));

            const res = await agent.get(`/drawing/${id}`);

            expect(res.status).toBe(403);
            expect(vi.mocked(redis.del)).toHaveBeenCalledWith(`drawing:${id}`);
        })
    })
})