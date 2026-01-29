import { describe, it, expect, vi } from 'vitest';
import { hasCommented, formattedParticipants, hasParticipated } from '../../../src/utils/helpers'
import { createMockDrawing } from '../../factories/drawingFactory'
import { Types } from 'mongoose';
import User from '../../../src/models/User'
import { createMockComment } from '../../factories/commentFactory';
import { createMockAuthor } from '../../factories/authorFactory';
import { IParticipant } from '../../../src/types/drawing';

vi.mock('../../../src/models/User');

describe('Teste utils/helpers', () => {
    describe('test formattedParticipants', () => {

        it('Devrait ajouter une liste avec participants sans doublons', async () => {
            const id = new Types.ObjectId;
            const id2 = new Types.ObjectId;

            const drawing = createMockDrawing({
                participants: [
                    {userId: id},
                    {userId: id},
                    {userId: id2}
                ]
            });

            vi.mocked(User.findById).mockResolvedValue({username: 'simiii'})

            await formattedParticipants(drawing);

            expect(drawing.formattedParticipants).toBeDefined();
            expect(drawing.formattedParticipants).toStrictEqual([
                {userId: id, username: 'simiii'},
                {userId: id2, username: 'simiii'}
            ])
        })

        it('Devrait remplir username par inconnu.e', async () => {
            const id = new Types.ObjectId;
            const id2 = new Types.ObjectId;

            const drawing = createMockDrawing({
                participants: [
                    {userId: id},
                    {userId: id},
                    {userId: id2}
                ]
            });

            vi.mocked(User.findById).mockResolvedValue(null);

            await formattedParticipants(drawing);

            expect(drawing.formattedParticipants).toBeDefined();
            expect(drawing.formattedParticipants).toStrictEqual([
                {userId: id, username: 'Inconnu.e'},
                {userId: id2, username: 'Inconnu.e'}
            ])
        })
    })

    describe('Tester hasCommented', () => {
        it('hasPosted est à true pour l\'auteur', () => {
            const author = createMockAuthor();
            const comment = createMockComment({author: author});
            const comment2 = createMockComment();

            hasCommented([comment, comment2], author.authorId);

            expect(comment.hasPosted).toBeDefined();
            expect(comment2.hasPosted).toBeUndefined();
            expect(comment.hasPosted).toBeTruthy()
            
        })
    })

    describe('Tester hasParticipated', () => {
        it('Devrait retourner true', () => {
            const id = new Types.ObjectId
            const participants: IParticipant[] = [
                {
                    userId: new Types.ObjectId,
                    start: 0,
                    end: 5
                },

                {
                    userId: id,
                    start: 0,
                    end: 5
                }
            ]

            expect(hasParticipated(participants, id)).toBeTruthy();
        })

        it('Devrait retourner false', () => {
            const id = new Types.ObjectId
            const participants: IParticipant[] = [
                {
                    userId: new Types.ObjectId,
                    start: 0,
                    end: 5
                },

                {
                    userId: new Types.ObjectId,
                    start: 0,
                    end: 5
                }
            ]

            expect(hasParticipated(participants, id)).toBeFalsy();
        })
    })
})