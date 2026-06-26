import { vi, expect, describe, beforeEach, it, afterEach } from 'vitest'
import User from '../../../src/models/User'
import * as apiResponse from '../../../src/middlewares/apiResponse'
import { validateConnexion } from '../../../src/middlewares/validateConnexion'
import * as validators from '../../../src/utils/validator'
import { validateAdminPost } from '../../../src/middlewares/validate'
import bcrypt from 'bcryptjs'
import { Types } from 'mongoose'
import Drawing from '../../../src/models/Drawing'
import * as validateConnexionForm from '../../../src/middlewares/validateConnexion'

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
            vi.spyOn(validateConnexionForm.validateConnexionForm, 'safeParse').mockReturnValue({
                success: true,
                data: {
                    username: "thesimiii",
                    password: "#Thesim25"
                }
            } as any);

            await validateConnexion()(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Username doesn\'t exist', 400);
            expect(bcrypt.compare).not.toHaveBeenCalled();
        })

        it('Devrait echouer si le password est incorrect', async () => {
            const compareSpy = vi.spyOn(bcrypt, 'compare');

            vi.mocked(User.findOne).mockResolvedValue({password: "hash"} as any);
            compareSpy.mockImplementation((p, h) => {return false});
            vi.spyOn(validateConnexionForm.validateConnexionForm, 'safeParse').mockReturnValue({
                success: true,
                data: {
                    username: "thesimiii",
                    password: "#Thesim25"
                }
            } as any);

            await validateConnexion()(req, res, next)

            expect(next).not.toHaveBeenCalled()
            expect(apiResponse.sendError).toHaveBeenCalled();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Password is incorrect', 400);
            expect(bcrypt.compare).toHaveBeenCalled();
        })

        it('Devrait reussir', async () => {
            const compareSpy = vi.spyOn(bcrypt, 'compare');

            vi.mocked(User.findOne).mockResolvedValue({password: "hash"} as any);
            compareSpy.mockImplementation((p, h) => {return true});
            vi.spyOn(validateConnexionForm.validateConnexionForm, 'safeParse').mockReturnValue({
                success: true,
                data: {
                    username: "thesimiii",
                    password: "#Thesim25"
                }
            } as any);

            await validateConnexion()(req, res, next)

            expect(next).toHaveBeenCalled()
            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalled();
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

        it('devrait echouer si l\'id n\'existe pas', async() => {
            req = {params : {ici : "ici"}}
            await validateAdminPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalledOnce();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, '  is not an ObjectId', 400);
            expect(next).not.toHaveBeenCalled()
        })

        it('Devrait echouer si le drawing avec cet id n\'exists pas', async() => {
            req = {params: {id: `${new Types.ObjectId}`}};

            vi.mocked(Drawing.findById).mockResolvedValue(null as any)
            await validateAdminPost()(req, res, next);

            expect(apiResponse.sendError).toHaveBeenCalledOnce();
            expect(apiResponse.sendError).toHaveBeenCalledWith(res, 'Drawing not found', 404);
            expect(next).not.toHaveBeenCalled()
        })

        it('Devrait reussir si le drawing avec cet id exists pas', async() => {
            req = {params: {id: `${new Types.ObjectId}`}};

            vi.mocked(Drawing.findById).mockResolvedValue({} as any)
            await validateAdminPost()(req, res, next);

            expect(apiResponse.sendError).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled()
        })
    })
})