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

export const createUser = (overrides = {}) : IUser => {
    return {
        _id: new Types.ObjectId,
        username: 'simiii',
        name: "SIM",
        password: "#TheSim25",
        email: 'thesim@sim.dev',
        emoji: '1f600',
        admin: true,
        ...overrides
    }  
}
