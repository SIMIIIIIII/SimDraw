import { ITF, ITFResult, ITFforIDF } from '../../src/types/search'
import { Types } from 'mongoose'
import { vi } from 'vitest'

export const createMockExpectedTF = (overrides = {}) : ITFResult => {
    return {
        usedWords: [],
        TFs: []
    }
}

