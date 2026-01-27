import { vi, expect, describe, beforeEach, it, afterEach } from 'vitest'
import User from '../../../src/models/User'
import * as apiResponse from '../../../src/utils/apiResponse'
import { DoesUserExist } from '../../../src/middlewares/validateConnexion'
import * as validators from '../../../src/utils/validator'
import { validateConnexionPost } from '../../../src/middlewares/validate'
import bcrypt from 'bcryptjs'

vi.mock('../../../src/models/User');
vi.mock('../../../src/utils/apiResponse');
vi.mock('../../../src/utils/validator');
vi.mock('bcrypt');


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
})