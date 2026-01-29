import { vi, expect, describe, beforeEach, it } from 'vitest'
import Drawing from '../../../src/models/Drawing';
import * as apiResponse from '../../../src/middlewares/apiResponse';
import { validateCommentId, validateCommentPost, validateCommentPut } from '../../../src/middlewares/validateComment';
import { createMockDrawing } from '../../factories/drawingFactory';
import { Types } from 'mongoose';
import Comment from '../../../src/models/Comment';

vi.mock('../../../src/models/Comment');
vi.mock('../../../src/models/Drawing');
vi.mock('../../../src/middlewares/apiResponse');

describe('Comment middlewares', () => {
    let req: any;
    let res: any;
    let next: any;
    
    beforeEach(() => {
        res = {};
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('Comment post middlewares', () => {
        it('Devrait echouer pour champ comment manquant', async () => {
            req = {body: {}}
            await validateCommentPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Empty comment', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour comment contenant que des espaces', async () => {
            req = {body: {comment : "    "}};
            await validateCommentPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Empty comment', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour champs drawingId', async () => {
            req = {body: {comment : "nouveau commentaire"}};
            await validateCommentPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'drawingId missing', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour un non ObjectId', async () => {
            req = {body: {comment : "nouveau commentaire", drawingId: 'ici'}};
            await validateCommentPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, `ici is not an ObjectId`, 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour un dessin inexistant', async () => {
            req = {body: {comment : "nouveau commentaire", drawingId: new Types.ObjectId}};
            vi.mocked(Drawing.findById).mockResolvedValue(null as any);
            await validateCommentPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Drawing doesn\'t exist', 404);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour un dessin non public', async () => {
            req = {body: {comment : "nouveau commentaire", drawingId: new Types.ObjectId}};
            vi.mocked(Drawing.findById).mockResolvedValue(createMockDrawing as any);
            await validateCommentPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Drawins is not public', 403);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait reussir pour des données valide', async () => {
            req = {body: {comment : "nouveau commentaire", drawingId: new Types.ObjectId}};
            vi.mocked(Drawing.findById).mockResolvedValue(createMockDrawing({isPublic: true}) as any);
            await validateCommentPost()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })

    describe('Delete comment middlewares', () => {
        it('Devrait echouer pour le parametre non ObjectId', async () => {
            req = {params: {id: 'ici'}}
            
            await validateCommentId()(req, res, next);
            
            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'ici is not an ObjectId', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour commentaire inexistant', async () => {
            req = {
                params: {id: `${new Types.ObjectId}`},
                session: {user: {id: new Types.ObjectId}}
            }
            vi.mocked(Comment.findById).mockResolvedValue(null as any);
            
            await validateCommentId()(req, res, next);
            
            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Comment do not exist', 404);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour commentaire inexistant', async () => {
            req = {
                params: {id: `${new Types.ObjectId}`},
                session: {user: {id: new Types.ObjectId}}
            }
            vi.mocked(Comment.findById).mockResolvedValue({author: {authorId: new Types.ObjectId}} as any);
            
            await validateCommentId()(req, res, next);
            
            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Not allowed', 403);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour commentaire inexistant', async () => {
            const id = new Types.ObjectId
            req = {
                params: {id: `${new Types.ObjectId}`},
                session: {user: {id: id}}
            }
            vi.mocked(Comment.findById).mockResolvedValue({author: {authorId: id}} as any);
            
            
            await validateCommentId()(req, res, next);
            
            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })

    describe('Modify comment middlewares', () => {
        it('Devrait echouer pour champ comment manquant', async () => {
            req = {body: {}}
            await validateCommentPut()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Empty comment', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour comment contenant que des espaces', async () => {
            req = {body: {comment : "    "}};
            await validateCommentPut()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Empty comment', 400);
            expect(next).not.toHaveBeenCalled();
        })
    })

})