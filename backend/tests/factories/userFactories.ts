import { Types } from 'mongoose'
import User, { IUserDocument } from '../../src/models/User'
import { IUser } from '../../src/types/user'

export const createMockUser = (overrides = {}) : IUser => {
    return {
        email: 'thesim@sim.dev',
        name : 'THE SIM',
        username: 'simiii',
        password: '#Thesim26',
        ...overrides
    }
}
