import { vi, expect, describe, beforeEach, it } from 'vitest'
import User from '../../../src/models/User'
import * as apiResponse from '../../../src/utils/apiResponse'
import { validateUniqueEmail, validateUniqueUsername } from '../../../src/middlewares/validateUniqueDatas'
import * as validators from '../../../src/utils/validator'
import { validateSubscriptionPost } from '../../../src/middlewares/validate'

vi.mock('../../../src/models/User');
vi.mock('../../../src/utils/apiResponse');
vi.mock('../../../src/utils/validator');


describe('Subscription Route', () => {
    describe('validateUniqueUsername middleware', () => {
        let req: any;
        let res: any;
        let next: any;
        
        beforeEach(() => {
            req = {body: {username: 'sim'}};
            res = {};
            next = vi.fn();
            vi.clearAllMocks();
        })

        it('Devrait Appeler next() si l\'utilisateur n\'existe pas', async () => {
            vi.mocked(User.findOne).mockResolvedValue(null)
            await validateUniqueUsername()(req, res, next)
            expect(next).toHaveBeenCalled()
            expect(apiResponse.sendError).not.toHaveBeenCalled()
        })

        it('Devrait Appeler next() si l\'utilisateur existe', async () => {
            vi.mocked(User.findOne).mockResolvedValue({} as any)
            await validateUniqueUsername()(req, res, next)
            expect(next).not.toHaveBeenCalled()
            expect(apiResponse.sendError).toHaveBeenCalled()
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Username already exists', 409);
        })
        
    })

    describe('validateUniqueEmail middleware', () => {
        let req: any;
        let res: any;
        let next: any;
        
        beforeEach(() => {
            req = {body: {email: 'thesim@sim.dev'}};
            res = {};
            next = vi.fn();
            vi.clearAllMocks();
        })

        it('Devrait Appeler next() si l\'utilisateur n\'existe pas', async () => {
            vi.mocked(User.findOne).mockResolvedValue(null)
            await validateUniqueEmail()(req, res, next)
            expect(next).toHaveBeenCalled()
            expect(apiResponse.sendError).not.toHaveBeenCalled()
        })

        it('Devrait Appeler next() si l\'utilisateur existe', async () => {
            vi.mocked(User.findOne).mockResolvedValue({} as any)
            await validateUniqueEmail()(req, res, next)
            expect(next).not.toHaveBeenCalled()
            expect(apiResponse.sendError).toHaveBeenCalled()
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Email already exists', 409);
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

        it('Pas de champs email', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", name:'sim'}};
            vi.mocked(validators.checkEmail).mockReturnValue(true);
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateSubscriptionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid email format', 400)
            expect(next).not.toHaveBeenCalled();
        })

        it('email invalid', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", email: "sim", name:'sim'}};
            vi.mocked(validators.checkEmail).mockReturnValue(false);
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateSubscriptionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid email format', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('pas des champs username', async() => {
            req = {body: {password: "#Thesim25", email: "sim", name:'sim'}};
            vi.mocked(validators.checkEmail).mockReturnValue(true);
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateSubscriptionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid username format', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('username invalid', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", email: "sim", name:'sim'}};
            vi.mocked(validators.checkEmail).mockReturnValue(true);
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(false);
            await validateSubscriptionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid username format', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('pas des champs password', async() => {
            req = {body: {username: "simiii", email: "sim", name:'sim'}};
            vi.mocked(validators.checkEmail).mockReturnValue(true);
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateSubscriptionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid password format', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('password invalid', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", email: "sim", name:'sim'}};
            vi.mocked(validators.checkEmail).mockReturnValue(true);
            vi.mocked(validators.checkPassword).mockReturnValue(false);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateSubscriptionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Invalid password format', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('pas de champs name', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", email: "sim"}};
            vi.mocked(validators.checkEmail).mockReturnValue(true);
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateSubscriptionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Name is required', 400);
            expect(next).not.toHaveBeenCalled();
        })

        it('pas de champs name', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", email: "sim", name: ""}};
            vi.mocked(validators.checkEmail).mockReturnValue(true);
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateSubscriptionPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenLastCalledWith(res, 'Name is required', 400);
            expect(next).not.toHaveBeenCalled();
        })
        


        it('Tout les champ valides', async() => {
            req = {body: {username: "simiii", password: "#Thesim25", email: "sim", name:'sim'}};
            vi.mocked(validators.checkEmail).mockReturnValue(true);
            vi.mocked(validators.checkPassword).mockReturnValue(true);
            vi.mocked(validators.checkUsername).mockReturnValue(true);
            await validateSubscriptionPost()(req, res, next);
            
            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        })
    })
})