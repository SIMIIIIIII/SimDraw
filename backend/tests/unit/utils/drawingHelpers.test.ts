import { describe, it, expect, beforeEach } from 'vitest'
import { setCanModify, sortByUpdatedAt } from '../../../src/utils/drawingHelpers'
import { IDrawing } from '../../../src/types/drawing'
import { Types } from 'mongoose'
import { createMockDrawing } from '../../factories/drawingFactory'
import { createMockAuthor } from '../../factories/authorFactory'

let drawing1 : IDrawing;
let drawing2 : IDrawing;

describe('DrawingsHelper dans outil', () => {
    describe("La fonction setCanModify", async () => {
        beforeEach(() => {
            drawing1 = createMockDrawing();
            drawing2 = createMockDrawing({
                author: createMockAuthor({aithorId: new Types.ObjectId}),
            }) 
        })
        

        it("Le canModify de drawing1 devrait être true et celui de drawing2 est undefinded", async () => {
            setCanModify([drawing1, drawing2], drawing1.author.authorId);
            expect(drawing1?.canModify).toBeTruthy();
            expect(drawing2?.canModify).toBeUndefined();
        })

        it("Le canModify de drawing1 devrait être undefined et celui de drawing2 est true", async () => {
            setCanModify([drawing1, drawing2], drawing2.author.authorId);
            expect(drawing2?.canModify).toBeTruthy();
            expect(drawing1?.canModify).toBeFalsy();
        })
    })

    describe("La fonction sortByUpdatedAt", () => {
        beforeEach(() => {
            const olderDate = new Date('2025-01-01');
            const newerDate = new Date('2025-06-01');
            
            drawing1 = createMockDrawing({ updatedAt: olderDate });
            drawing2 = createMockDrawing({ updatedAt: newerDate });
        })

        it("Il devrait retourner drawing2 en premier (date plus récente)", async() => {
            const drawings : IDrawing[] = [drawing1, drawing2]; 
            
            sortByUpdatedAt(drawings);
            
            expect(drawings[0]._id).toBe(drawing2._id);
        })

        it("Il devrait retourner drawing1 en premier (date plus récente)", async() => {
            drawing1.updatedAt = new Date('2026-01-01'); // Plus récent que drawing2
            const drawings : IDrawing[] = [drawing1, drawing2];

            sortByUpdatedAt(drawings);
            
            expect(drawings[0]._id).toBe(drawing1._id);
        })
        
        it("Il devrait trier par likes si les dates sont égales", async() => {
            drawing1.updatedAt = new Date('2025-01-01');
            drawing2.updatedAt = new Date('2025-01-01');
            drawing1.likes = 10;
            drawing2.likes = 5;
            
            const drawings : IDrawing[] = [drawing2, drawing1];
            
            sortByUpdatedAt(drawings);
            
            expect(drawings[0]._id).toBe(drawing1._id);
        })
    })
})