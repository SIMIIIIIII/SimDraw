import { vi, expect, describe, beforeEach, it } from 'vitest'
import Drawing from '../../../src/models/Drawing';
import * as apiResponse from '../../../src/middlewares/apiResponse';
import { drawingBelongTo, validateDrawingId, validateDrawingPost } from '../../../src/middlewares/validateDrawing';
import { createMockDrawing } from '../../factories/drawingFactory';
import { Types } from 'mongoose';
import Comment from '../../../src/models/Comment';
import { isPartyOn, validateDrawPost } from '../../../src/middlewares/validateDraw'
import * as helpers from '../../../src/utils/helpers'
import * as drawingTypes from '../../../src/types/drawing'

vi.mock('../../../src/models/Comment');
vi.mock('../../../src/models/Drawing');
vi.mock('../../../src/middlewares/apiResponse');
vi.mock('../../../src/utils/helpers')
vi.mock('../../../src/types/drawing')

describe('Drawing middlewares', () => {
    let req: any;
    let res: any;
    let next: any;
    
    beforeEach(() => {
        res = {};
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('isPartyOn middlewares', () => {
        it('Devrait echouer pour drawing inexistant', async () => {
            req = {session : {user : {id: new Types.ObjectId}}}       
            vi.mocked(Drawing.find).mockResolvedValue(null as any);
                    
            await isPartyOn()(req, res, next);
                    
            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'No party On', 404);
            expect(next).not.toHaveBeenCalled();
        })
        

        it('Devrait echouer erreur db', async () => {
            req = {session: {user: {id: new Types.ObjectId}}}
                    
            vi.mocked(Drawing.find).mockRejectedValue(new Error('ici'));
            
            await isPartyOn()(req, res, next);
            
            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'ici', 500);
            expect(next).not.toHaveBeenCalled();
        })

        it('Devrait reusir pour données valides', async () => {
            req = {session: {user: {id: new Types.ObjectId}}}
                    
            vi.mocked(Drawing.find).mockResolvedValue([{
                isDone: false,
                isPublic: false,
                participants: [2],
                maxParticipants: 3,
                _id: new Types.ObjectId
            }] as any);

            vi.mocked(helpers.hasParticipated).mockReturnValue(false);
            
            
            await isPartyOn()(req, res, next);
            
            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })

        it('devrait echouer si déjà participer', async () => {
            const id = new Types.ObjectId;
            req = {
                params: {id: `${id}`},
                session: {user: {id: id}}
            }
            vi.mocked(Drawing.find).mockResolvedValue([] as any);
            vi.mocked(helpers.hasParticipated).mockReturnValue(true);

            await isPartyOn()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'No party On', 404);
            expect(next).not.toHaveBeenCalled();
        })

        it('devrait echouer si max participant', async () => {
            const id = new Types.ObjectId;
            req = {
                params: {id: `${id}`},
                session: {user: {id: id}}
            }
            vi.mocked(Drawing.find).mockResolvedValue([{
                currentTurn: id,
                participants: [8],
                maxParticipants: 1}
            ] as any);
            vi.mocked(Drawing.findByIdAndUpdate).mockResolvedValue({currentTurn: id,});
            vi.mocked(helpers.hasParticipated).mockReturnValue(false);

            await isPartyOn()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'No party On', 404);
            expect(next).not.toHaveBeenCalled();
        })
    })


    describe('validateDrawPost', () => {
        it('devrait echouer pour start manquant', async () => {
            req = {body : {}}
            await validateDrawPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'start index invalid', 400)
            expect(next).not.toHaveBeenCalled();
        })

        it('devrait echouer pour start not number', async () => {
            req = {body : {
                paths: "ici",
                start: "5",
                end: '6'}
            }
            await validateDrawPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'start index invalid', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('devrait echouer pour start < 0', async () => {
            req = {body : {
                paths: "ici",
                start: -1,
                end: '6'}
            }
            await validateDrawPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'start index invalid', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('devrait echouer pour end manquant', async () => {
            req = {body : {start : 0}}
            await validateDrawPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'end index invalid', 400)
            expect(next).not.toHaveBeenCalled();
        })

        it('devrait echouer pour end not number', async () => {
            req = {body : {
                paths: "ici",
                start: 5,
                end: '6'}
            }
            await validateDrawPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'end index invalid', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('devrait echouer pour end < 0', async () => {
            req = {body : {
                paths: "ici",
                start: 3,
                end: -5}
            }
            await validateDrawPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'end index invalid', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('devrait echouer pour path invalid', async()=> {
            req = {body : {
                paths: "ici",
                start: 3,
                end: 5}
            }

            vi.mocked(drawingTypes.isValidPath).mockReturnValue(false);
            await validateDrawPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Path invalid', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('devrait reussir', async()=> {
            req = {body : {
                paths: "ici",
                start: 3,
                end: 5}
            }

            vi.mocked(drawingTypes.isValidPath).mockReturnValue(true);
            await validateDrawPost()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })

        
    })
})