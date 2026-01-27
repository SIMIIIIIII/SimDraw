import { it, describe, expect, beforeAll } from 'vitest'
import Comment from '../../../src/models/Comment'
import User from '../../../src/models/User'
import Drawing from '../../../src/models/Drawing'
import { Document } from 'mongoose'
import { IDrawing } from '../../../src/types/drawing'
import { IUser } from '../../../src/types/user'

const sim = {
    username: 'simiii',
    name: 'Sim',
    email: 'sim@test.be',
    password: 'Password123!',
}

let user: (IUser & Document) | null;
let drawing: (IDrawing & Document) | null;

describe('Comment models', () => {
    beforeAll(async () => {
        user = await User.create(sim);
        drawing = await Drawing.create({
            title: "Test 1",
            theme: "Test",
            author: {
                authorId: user?._id,
                username: user?.username,
                emoji: user?.emoji
            }
        });
    })

    describe('Creation valide', () => {
        it('Création avec champs requis', async () => {
            const comment = await Comment.create({
                comment: "Je n'aime pas du tout ce dessin",
                postId: drawing?._id,
                author: {
                    authorId: user?._id,
                    username: user?.username
                }
            })

            expect(comment).toBeDefined();
            expect(comment.comment).toBe("Je n'aime pas du tout ce dessin");
            expect(comment.postId).toBe(drawing?._id);
            expect(comment.author.authorId).toBe(user?._id);
            expect(comment.author.username).toBe(user?.username);

            //Optionnel
            expect(comment.author.emoji).toBe(user?.emoji);

            //Timestamps
            expect(comment.createdAt).toBeDefined();
            expect(comment.updatedAt).toBeDefined();
            
        })

        it('comment trim() appliqué', async () => {
            const comment = await Comment.create({
                comment: "   Je n'aime pas du tout ce dessin   ",
                postId: drawing?._id,
                author: {
                    authorId: user?._id,
                    username: user?.username
                }
            })
            expect(comment.comment).toBe("Je n'aime pas du tout ce dessin");
        })

        it('username trim() appliqué', async () => {
            const comment = await Comment.create({
                comment: "Je n'aime pas du tout ce dessin",
                postId: drawing?._id,
                author: {
                    authorId: user?._id,
                    username: `   ${user?.username}    `
                }
            })
            expect(comment.author.username).toBe(user?.username);
        })
    })

    describe('Validation des champs requis', () => {
        it('Devrait echouer sans comment', async () => {
            const comment = {
                postId: drawing?._id,
                author: {
                    authorId: user?._id,
                    username: user?.username
                }
            }

            await expect(Comment.create(comment)).rejects.toThrow();

        })

        it('Devrait echouer sans postId', async () => {
            const comment = {
                comment: "Je n'aime pas du tout ce dessin",
                author: {
                    authorId: user?._id,
                    username: user?.username
                }
            }

            await expect(Comment.create(comment)).rejects.toThrow();

        })

        it('Devrait echouer sans author', async () => {
            const comment = {
                comment: "Je n'aime pas du tout ce dessin",
                postId: drawing?._id,
            }

            await expect(Comment.create(comment)).rejects.toThrow();

        })

        it('Devrait echouer sans authorId', async () => {
            const comment = {
                comment: "Je n'aime pas du tout ce dessin",
                postId: drawing?._id,
                author: {
                    username: user?.username
                }
            }

            await expect(Comment.create(comment)).rejects.toThrow();

        })

        it('Devrait echouer sans username', async () => {
            const comment = {
                comment: "Je n'aime pas du tout ce dessin",
                postId: drawing?._id,
                author: {
                    authorId: user?._id,
                }
            }

            await expect(Comment.create(comment)).rejects.toThrow();

        })
    })

    describe('Validation du format', () => {
        it('Devrait echouer avec username avec moins de 6 lettre', async () => {
            const comment = {
                comment: "Je n'aime pas du tout ce dessin",
                postId: drawing?._id,
                author: {
                    authorId: user?._id,
                    username: 'sim'
                }
            }

            await expect(Comment.create(comment)).rejects.toThrow();
        })
    })

    describe('Champs optionnels', () => {
        it("Création avec emoji defini", async () => {
            const comment = await Comment.create({
                comment: "Je n'aime pas du tout ce dessin",
                postId: drawing?._id,
                author: {
                    authorId: user?._id,
                    username: user?.username,
                    emoji: '1f500',
                }
            })

            expect(comment.author.emoji).toBe('1f500');
        })

        it("Création avec emoji defini et trim()", async () => {
            const comment = await Comment.create({
                comment: "Je n'aime pas du tout ce dessin",
                postId: drawing?._id,
                author: {
                    authorId: user?._id,
                    username: user?.username,
                    emoji: '   1f500    ',
                }
            })

            expect(comment.author.emoji).toBe('1f500');
        })
    })
})