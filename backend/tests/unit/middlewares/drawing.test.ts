import { vi, expect, describe, beforeEach, it } from 'vitest'
import Drawing from '../../../src/models/Drawing';
import * as apiResponse from '../../../src/middlewares/apiResponse';
import { drawingBelongTo, validateDrawingId, validateCreateDrawingPost, validateModifyDrawingPost } from '../../../src/middlewares/validateDrawing';
import { Types } from 'mongoose';
import * as validateDrawing from '../../../src/middlewares/validateDrawing';

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

    describe('CreateDrawing middlewares', () => {
        it('Devrait echouer pour champ title manquant', async () => {
            req = {body: {
                //title: 'Titre 1',
                theme: 'Nature',
                description: 'essaie',
                maxParticipants: 2
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "Invalid input: expected string, received undefined", 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour champ title contenant que des espaces', async () => {
            req = {body: {
                title: '      ',
                theme: 'Nature',
                description: 'essaie',
                maxParticipants: 2
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "Titre vide", 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour champ description manquant', async () => {
            req = {body: {
                title: 'Titre 1',
                theme: 'Nature',
                //description: 'essaie',
                maxParticipants: 2
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "Invalid input: expected string, received undefined", 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour title contenant que des espaces', async () => {
            req = {body: {
                title: 'Titre 1',
                theme: 'Nature',
                description: '      ',
                maxParticipants: 2
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "Description Vide", 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour theme manquant', async () => {
            req = {body: {
                title: 'Titre 1',
                //theme: 'Nature',
                description: 'je suis',
                maxParticipants: 2
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "Invalid input: expected string, received undefined", 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour theme contenant que des espaces', async () => {
            req = {body: {
                title: 'Titre 1',
                theme: '   ',
                description: 'je suis',
                maxParticipants: 2
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "Theme vide", 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour participant < 2', async () => {
            req = {body: {
                title: 'Titre 1',
                theme: 'theme',
                description: 'je suis',
                maxParticipants: 1
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "min 2 participant", 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour participant > 8', async () => {
            req = {body: {
                title: 'Titre 1',
                theme: 'theme',
                description: 'je suis',
                maxParticipants: 9
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "max 8 participants", 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait reussir avec participant manquand', async () => {
            req = {body: {
                title: 'Titre 1',
                theme: 'theme',
                description: 'je suis',
                //maxParticipants: 9
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })

        it('Devrait reussir pour données valides', async () => {
            req = {body: {
                title: 'Titre 1',
                theme: 'theme',
                description: 'je suis',
                maxParticipants: 5
            }}
            
            await validateCreateDrawingPost()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    });

    describe('validateDrawingId middlewares', () => {
        it('Drvrait echouer manquant ou non ObjectId', async () => {
            req = {params: {}};
            await validateDrawingId()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "  n'est pas un ObjectId", 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour drawing inexistant', async () => {
            req = {params: {id: `${new Types.ObjectId}`}}

            vi.mocked(Drawing.findById).mockReturnValue({
                lean: vi.fn().mockResolvedValue(null),
            } as any);

            await validateDrawingId()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'drawing do not exist', 404);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour drawing pas terminé', async () => {
            req = {params: {id: `${new Types.ObjectId}`}}

            vi.mocked(Drawing.findById).mockReturnValue({
                lean: vi.fn().mockResolvedValue({isDone: false}),
            } as any);

            await validateDrawingId()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Drawing not public', 403);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait echouer pour drawing pas public', async () => {
            req = {params: {id: `${new Types.ObjectId}`}}

            vi.mocked(Drawing.findById).mockReturnValue({
                lean: vi.fn().mockResolvedValue({isDone: true, isPublic: false}),
            } as any);

            await validateDrawingId()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Drawing not public', 403);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait reuusir pour données valides', async () => {
            req = {params: {id: `${new Types.ObjectId}`}}

            vi.mocked(Drawing.findById).mockReturnValue({
                lean: vi.fn().mockResolvedValue({isDone: true, isPublic: true}),
            } as any);

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
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, "Le dessin n'existe pas", 404);
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