import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Types } from 'mongoose';
import Drawing from '../../../models/Drawing';
import { IDrawingDocument } from '../../../models/Drawing';

describe('Drawing Model - Instance Methods', () => {
    let testDrawing: IDrawingDocument;
    const userId1 = new Types.ObjectId();
    const userId2 = new Types.ObjectId();

    beforeEach(async () => {
        // Créer un dessin de test
        testDrawing = await Drawing.create({
            title: 'Test Drawing',
            theme: 'Nature',
            author: {
                authorId: new Types.ObjectId(),
                username: 'testuser',
                emoji: '1f600'
            },
            maxParticipants: 2,
            isPublic: true
        }) as IDrawingDocument;
    });

    afterEach(async () => {
        // Nettoyer après chaque test
        if (testDrawing._id) {
            await Drawing.deleteOne({ _id: testDrawing._id });
        }
    });

    describe('hasLiked()', () => {
        it('should return false when user has not liked the drawing', () => {
            const hasLiked = testDrawing.hasLiked(userId1);
            expect(hasLiked).toBe(false);
        });

        it('should return true when user has liked the drawing', async () => {
            testDrawing.whoLiked.push(userId1);
            await testDrawing.save();

            const hasLiked = testDrawing.hasLiked(userId1);
            expect(hasLiked).toBe(true);
        });
    });

    describe('toggleLike()', () => {
        it('should add a like and return +1 when user has not liked', async () => {
            const delta = await testDrawing.toggleLike(userId1);

            expect(delta).toBe(1);
            expect(testDrawing.likes).toBe(1);
            expect(testDrawing.hasLiked(userId1)).toBe(true);
        });

        it('should remove a like and return -1 when user has already liked', async () => {
            // Ajoute un like d'abord
            await testDrawing.toggleLike(userId1);

            // Puis retire le like
            const delta = await testDrawing.toggleLike(userId1);

            expect(delta).toBe(-1);
            expect(testDrawing.likes).toBe(0);
            expect(testDrawing.hasLiked(userId1)).toBe(false);
        });

        it('should handle multiple users liking independently', async () => {
            // User1 like
            const delta1 = await testDrawing.toggleLike(userId1);
            expect(delta1).toBe(1);
            expect(testDrawing.likes).toBe(1);

            // User2 like
            const delta2 = await testDrawing.toggleLike(userId2);
            expect(delta2).toBe(1);
            expect(testDrawing.likes).toBe(2);

            // User1 unlike
            const delta3 = await testDrawing.toggleLike(userId1);
            expect(delta3).toBe(-1);
            expect(testDrawing.likes).toBe(1);

            // User2 still has liked
            expect(testDrawing.hasLiked(userId2)).toBe(true);
            expect(testDrawing.hasLiked(userId1)).toBe(false);
        });

        it('should never go below 0 likes', async () => {
            // Même si on essaie de retirer un like inexistant
            const delta = await testDrawing.toggleLike(userId1);
            expect(delta).toBe(1);

            await testDrawing.toggleLike(userId1); // -1
            await testDrawing.toggleLike(userId1); // +1 again
            
            expect(testDrawing.likes).toBeGreaterThanOrEqual(0);
        });
    });
});

describe('Drawing Model - Static Methods', () => {
    beforeEach(async () => {
        // Crée quelques dessins de test
        await Drawing.create([
            {
                title: 'Public Done Drawing',
                theme: 'Nature',
                author: {
                    authorId: new Types.ObjectId(),
                    username: 'user1',
                    emoji: '1f600'
                },
                isPublic: true,
                isDone: true
            },
            {
                title: 'Public In Progress Drawing',
                theme: 'Art',
                author: {
                    authorId: new Types.ObjectId(),
                    username: 'user2',
                    emoji: '1f603'
                },
                isPublic: true,
                isDone: false,
                maxParticipants: 2,
                participants: [
                    {
                        userId: new Types.ObjectId(),
                        start: 0,
                        end: 100
                    },
                    {
                        userId: new Types.ObjectId(),
                        start: 100,
                        end: 200
                    }
                ]
            },
            {
                title: 'Private Drawing',
                theme: 'Abstract',
                author: {
                    authorId: new Types.ObjectId(),
                    username: 'user3',
                    emoji: '1f604'
                },
                isPublic: false,
                isDone: true
            }
        ]);
    });

    afterEach(async () => {
        // Nettoie tous les dessins de test
        await Drawing.deleteMany({
            title: { $in: ['Public Done Drawing', 'Public In Progress Drawing', 'Private Drawing'] }
        });
    });

    describe('findPublicCompleted()', () => {
        it('should return only public drawings that are done or fully participated', async () => {
            const drawings = await Drawing.findPublicCompleted();

            expect(drawings.length).toBeGreaterThanOrEqual(2);
            
            // Tous les dessins retournés doivent être publics
            expect(drawings.every(d => d.isPublic)).toBe(true);

            // Et doivent être soit done soit fully participated
            drawings.forEach(drawing => {
                const isFull = drawing.participants.length >= (drawing.maxParticipants || 1);
                expect(drawing.isDone || isFull).toBe(true);
            });
        });

        it('should not return private drawings', async () => {
            const drawings = await Drawing.findPublicCompleted();

            const hasPrivate = drawings.some(d => !d.isPublic);
            expect(hasPrivate).toBe(false);
        });
    });
});
