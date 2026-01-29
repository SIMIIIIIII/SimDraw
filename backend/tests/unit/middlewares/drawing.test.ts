import { vi, expect, describe, beforeEach, it } from 'vitest'
import Drawing from '../../../src/models/Drawing';
import * as apiResponse from '../../../src/middlewares/apiResponse';
import { drawingBelongTo, validateDrawingId, validateDrawingPost } from '../../../src/middlewares/validateDrawing';
import { Types } from 'mongoose';

vi.mock('../../../src/models/Comment');
vi.mock('../../../src/models/Drawing');
vi.mock('../../../src/middlewares/apiResponse');

describe('Drawing middlewares', () => {
    let req: any;
    let res: any;
    let next: any;
    
    beforeEach(() => {
        res = {};
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('Drawing post middlewares', () => {
        it('Devrait echouer pour champ title manquant', async () => {
            req = {body: {}}
            await validateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Empty title', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour title contenant que des espaces', async () => {
            req = {body: {title: "   "}}
            await validateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Empty title', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour champ description manquant', async () => {
            req = {body: {title: "titre"}}
            await validateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Empty description', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour title contenant que des espaces', async () => {
            req = {body: {title: "titre", description: "    "}}
            await validateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Empty description', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait reussir pour données valides', async () => {
            req = {body: {title: "titre", description: "ici"}}
            await validateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    });

    describe('validateDrawingId middlewares', () => {
        it('Drvrait echouer manquant ou non ObjectId', async () => {
            req = {params: {}};
            await validateDrawingId()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, '  is not an ObjectId', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour drawing inexistant', async () => {
            req = {params: {id: `${new Types.ObjectId}`}}

            vi.mocked(Drawing.findById).mockResolvedValue(null);

            await validateDrawingId()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'drawing do not exist', 404);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour drawing pas terminé', async () => {
            req = {params: {id: `${new Types.ObjectId}`}}

            vi.mocked(Drawing.findById).mockResolvedValue({isDone: false});

            await validateDrawingId()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Drawing not public', 403);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour drawing pas public', async () => {
            req = {params: {id: `${new Types.ObjectId}`}}

            vi.mocked(Drawing.findById).mockResolvedValue({isDone: true, isPublic: false});

            await validateDrawingId()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Drawing not public', 403);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait reuusir pour données valides', async () => {
            req = {params: {id: `${new Types.ObjectId}`}}

            vi.mocked(Drawing.findById).mockResolvedValue({isDone: true, isPublic: true});

            await validateDrawingId()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })

    describe('drawingBelongTo middlewares', () => {
        it('Devrait echouer pour drawing inexistant', async () => {
            req = {params: {id: `${new Types.ObjectId}`}}

            vi.mocked(Drawing.findById).mockResolvedValue(null);

            await drawingBelongTo()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'drawing do not exist', 404);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer si pas autheur', async () => {
            const id = new Types.ObjectId;
            
            req = {
                params: {id: id.toString()},
                session: { user: {id: id}}
            }

            vi.mocked(Drawing.findById).mockResolvedValue({author: {authorId: new Types.ObjectId}});

            await drawingBelongTo()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Not allowed', 403);
            expect(next).not.toHaveBeenCalled();
        })
        

        it('Devrait reussir por données correctes', async () => {
            const id = new Types.ObjectId;
            
            req = {
                params: {id: id.toString()},
                session: { user: {id: id, admin: true}}
            }

            vi.mocked(Drawing.findById).mockResolvedValue({author: {authorId: id}});

            await drawingBelongTo()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })
}) 