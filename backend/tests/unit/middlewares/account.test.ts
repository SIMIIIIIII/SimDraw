import { vi, expect, describe, beforeEach, it, afterEach } from 'vitest'
import User from '../../../src/models/User'
import * as apiResponse from '../../../src/middlewares/apiResponse'
import { DoesUserExist } from '../../../src/middlewares/validateConnexion'
import * as validators from '../../../src/utils/validator'
import { validateAdminPost, validateConnexionPost } from '../../../src/middlewares/validate'
import bcrypt from 'bcryptjs'
import { Types } from 'mongoose'
import Drawing from '../../../src/models/Drawing'

vi.mock('../../../src/models/User');
vi.mock('../../../src/middlewares/apiResponse');
vi.mock('../../../src/utils/validator');
vi.mock('bcrypt');
vi.mock('../../../src/models/Drawing');


describe('Account Route', () => {
    describe('DoesUserExist middleware', () => {
        let req: any;
        let res: any;
        let next: any;
        
        beforeEach(() => {
            req = {body: {username: 'sim'}};
            res = {};
            next = vi.fn();
            vi.clearAllMocks();
        })

        it('Devrait Appeler echouer si l\'utilisateur n\'existe pas', async () => {
            vi.spyOn(bcrypt, 'compare');
            vi.mocked(User.findOne).mockResolvedValue(null)

            await DoesUserExist()(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Username doesn\'t exist', 400);
            expect(bcrypt.compare).not.toHaveBeenCalled();
        })

        it('Devrait echouer si le password est incorrect', async () => {
            const compareSpy = vi.spyOn(bcrypt, 'compare');

            vi.mocked(User.findOne).mockResolvedValue({password: "hash"} as any);
            compareSpy.mockImplementation((p, h) => {return false});

            await DoesUserExist()(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Password is incorrect', 400);
            expect(bcrypt.compare).toHaveBeenCalled();
        })

        it('Devrait reussir', async () => {
            const compareSpy = vi.spyOn(bcrypt, 'compare');

            vi.mocked(User.findOne).mockResolvedValue({password: "hash"} as any);
            compareSpy.mockImplementation((p, h) => {return true});

            await DoesUserExist()(req, res, next)

            expect(next).toHaveBeenCalled()
            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalled();
        })
    })

    describe('validateSubscriptionPost middlewares', () => {
        let req: any;
        let res: any;
        let next: any;

        beforeEach(() => {
            res = {};
            next = vi.fn();
            vi.clearAllMocks();
        })

        it('pas des champs username', async() => {
            req = {body: {password: "#Thesim25", email: "sim", name:'sim'}};
            vi.mocked(validators.checkEmail).mockReturnValue(true);
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateConnexionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid username format', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('username invalid', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", email: "sim", name:'sim'}};
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(false);
            await validateConnexionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid username format', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('pas des champs password', async() => {
            req = {body: {username: "simiii", email: "sim", name:'sim'}};
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateConnexionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid password format', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('password invalid', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", email: "sim", name:'sim'}};
            vi.mocked(validators.checkPassword).mockReturnValue(false);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateConnexionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid password format', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('Tout les champ valides', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", email: "sim", name:'sim'}};

            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateConnexionPost()(req, res, next);
            
            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })

    describe('validateAdminPost middlewares', () => {
        let req: any;
        let res: any;
        let next: any;

        beforeEach(() => {
            res = {};
            next = vi.fn();
            vi.clearAllMocks();
        })

        it('devrait echouer si champ choix n\'existe pas', async() => {
            req = {body: {drawingId: new Types.ObjectId}}
            await validateAdminPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalledOnce();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Invalid choice', 400);
            expect(next).not.toHaveBeenCalled()
        })

        it('Devrait echouer si mauvais choix', async() => {
            req = {body: {drawingId: new Types.ObjectId, choice: 'sim'}};
            await validateAdminPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalledOnce();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Invalid choice', 400);
            expect(next).not.toHaveBeenCalled()
        })

        it('Devrait echouer si champs drawingId manque', async() => {
            req = {body: { choice: 'accepter'}};
            await validateAdminPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalledOnce();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Missed drawingId', 400);
            expect(next).not.toHaveBeenCalled()
        })

        it('Devrait echouer si le drawing avec cet id n\'exists pas', async() => {
            req = {body: {drawingId: new Types.ObjectId, choice: 'refuser'}};

            vi.mocked(Drawing.findById).mockResolvedValue(null as any)
            await validateAdminPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalledOnce();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Drawing not found', 404);
            expect(next).not.toHaveBeenCalled()
        })

        it('Devrait reussir avec accepter comme choix', async() => {
            req = {body: {drawingId: new Types.ObjectId, choice: 'accepter'}};

            vi.mocked(Drawing.findById).mockResolvedValue({} as any)
            await validateAdminPost()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled()
        })

        it('Devrait reussir avec refuser comme choix', async() => {
            req = {body: {drawingId: new Types.ObjectId, choice: 'refuser'}};

            vi.mocked(Drawing.findById).mockResolvedValue({} as any)
            await validateAdminPost()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled()
        })
    })
})