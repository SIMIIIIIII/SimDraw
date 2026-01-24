import { it, describe, beforeEach, expect } from 'vitest'
import Drawing from '../../../src/models/Drawing';
import User from '../../../src/models/User';
import { isVariableWidth } from 'validator';

const sim = {
    username: 'simiii',
    name: 'Sim',
    email: 'sim@test.be',
    password: 'Password123!',
}

describe("Drawings models", () => {
    describe("Création valide", () => {
        beforeEach(async () => {
            await User.create(sim);
        });
        

        it("Il doit créer un drawing avec les champs requis", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();
            

            const drawing = await Drawing.create({
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                }
            });

            expect(drawing).toBeDefined();
            expect(drawing.title).toBe("Test 1");
            expect(drawing.theme).toBe("Test");
            expect(drawing.maxParticipants).toBe(1);
            expect(drawing.author.authorId.toString()).toBe(user?._id.toString());
            expect(drawing.author.username).toBe(user?.username)
            expect(drawing.author.emoji).toBe(user?.emoji)

            // Valeurs par default
            expect(drawing.description).toBeDefined()
            expect(drawing.participants).toBeDefined();
            expect(drawing.participants.length).toBe(0);
            expect(drawing.path).toBeDefined();
            expect(drawing.path.length).toBe(0);
            expect(drawing.currentTurn).toBeNull();
            expect(drawing.likes).toBe(0);
            expect(drawing.isDone).toBeFalsy()
            expect(drawing.isPublic).toBeFalsy()
            expect(drawing.whoLiked).toBeDefined();
            expect(drawing.whoLiked.length).toBe(0);

            // Le timetamps
            expect(drawing.createdAt).toBeDefined();
            expect(drawing.updatedAt).toBeDefined();
        })

        it('Il devrait trim le username du author', async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();
            

            const drawing = await Drawing.create({
                title: "Test 1",
                theme: "Test",
                maxParticipants: 3,
                author: {
                    authorId: user?._id.toString(),
                    username: `  ${user?.username}  `,
                    emoji: user?.emoji
                }
            });

            expect(drawing.author.username).toBe(user?.username);
        })

        it('Il devrait créer le dessin avec l\'emoji par defaut', async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();
            

            const drawing = await Drawing.create({
                title: "Test 1",
                theme: "Test",
                maxParticipants: 3,
                author: {
                    authorId: user?._id.toString(),
                    username: `  ${user?.username}  `,
                }
            });

            expect(drawing.author.emoji).toBe(user?.emoji);
        })
    })

    describe('Validation des champs requis', () => {
        beforeEach(async () => {
            await User.create(sim);
        });

        it("Devrait echouer sans title", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const drawingData = {
                theme: "Test",
                maxParticipants: 3,
                author: {
                    authorId: user?._id.toString(),
                    username: `  ${user?.username}  `,
                    emoji: user?.emoji
                }
            }
            
            await expect(Drawing.create(drawingData)).rejects.toThrow();
        })

        it("Devrait echouer sans theme", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const drawingData = {
                title: "Test",
                maxParticipants: 3,
                author: {
                    authorId: user?._id.toString(),
                    username: `  ${user?.username}  `,
                    emoji: user?.emoji
                }
            }
            
            await expect(Drawing.create(drawingData)).rejects.toThrow();
        });

        it("Devrait echouer sans author.usename", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const drawingData = {
                title: "Test 1",
                theme: "Test",
                maxParticipants: 3,
                author: {
                    authorId: user?._id.toString(),
                    emoji: user?.emoji
                }
            }
            
            await expect(Drawing.create(drawingData)).rejects.toThrow();
        });

        it("Devrait echouer sans author.authorId", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const drawingData = {
                title: "Test 1",
                theme: "Test",
                maxParticipants: 3,
                author: {
                    username: `  ${user?.username}  `,
                    emoji: user?.emoji
                }
            }
            
            await expect(Drawing.create(drawingData)).rejects.toThrow();
        });
        
        it("Devrait echouer sans author", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const drawingData = {
                title: "Test 1",
                theme: "Test",
            }
            
            await expect(Drawing.create(drawingData)).rejects.toThrow();
        })
    })

    describe('Validation du format', () => {
        beforeEach(async () => {
            await User.create(sim);
        });

        it('Devrait échouer avec un username trop court', async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const drawingData = {
                title: "Test 1",
                theme: "Test",
                maxParticipants: 3,
                author: {
                    authorId: user?._id.toString(),
                    username: "sim",
                    emoji: user?.emoji
                }
            }
            
            await expect(Drawing.create(drawingData)).rejects.toThrow();
        })
    })

    describe('Champs optionnels', () => {
        beforeEach(async () => {
            await User.create(sim);
        });

        it("Definir une description", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();
            

            const drawing = await Drawing.create({
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                description: "ici c'est paris"
            });

            expect(drawing.description).toBe('ici c\'est paris');
        })

        it("Definir trim", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();
            

            const drawing = await Drawing.create({
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                description: "  ici c'est paris  "
            });

            expect(drawing.description).toBe('ici c\'est paris');
        })

        it("Definir autres attribut non structure", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();
            

            const drawing = await Drawing.create({
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                likes: 3,
                whoLiked: ["ici", "alors"],
                isDone: true,
                isPublic: true,
                currentTurn: user?._id.toString(),
            });

            expect(drawing.likes).toBe(3);
            expect(drawing.whoLiked.length).toBe(2);
            expect(drawing.whoLiked[0]).toBe('ici');
            expect(drawing.isDone).toBeTruthy();
            expect(drawing.isPublic).toBeTruthy();
            expect(drawing.currentTurn).toBe(user?._id.toString());

        })

        it("Definir les participants", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const participants1 = {
                userId: user?._id.toString(),
                start: 5,
                end: 10
            }

            const participants2 = {
                userId: user?._id.toString(),
                start: 5,
                end: 16
            }
            

            const drawing = await Drawing.create({
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                participants: [participants1, participants2],
                
            });

            expect(drawing).toBeDefined();
            expect(drawing.participants.length).toBe(2);
            expect(drawing.participants[0].isActive).toBeFalsy();
            expect(drawing.participants[1].joinedAt).toBeDefined();
            expect(drawing.participants[1].start).toBe(5);
            expect(drawing.participants[0].end).toBe(10);
            expect(drawing.participants[1].userId).toBe(user?._id.toString());
            

        })

        it("Devrait echouer sans useId de participant", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const participants1 = {
                userId: user?._id.toString(),
                start: 5,
                end: 10
            }

            const participants2 = {
                start: 5,
                end: 16
            }
            

            const drawing = {
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                participants: [participants1, participants2],
                
            };

            await expect(Drawing.create(drawing)).rejects.toThrow();

        })

        it("Devrait echouer sans start de participant", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const participants1 = {
                userId: user?._id.toString(),
                start: 5,
                end: 10
            }

            const participants2 = {
                userId: user?._id.toString(),
                end: 16
            }
            

            const drawing = {
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                participants: [participants1, participants2],
                
            };

            await expect(Drawing.create(drawing)).rejects.toThrow();

        })

        it("Devrait echouer sans end de participant", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            const participants1 = {
                userId: user?._id.toString(),
                start: 5,
            }

            const participants2 = {
                userId: user?._id.toString(),
                start: 5,
                end: 16
            }
            

            const drawing = {
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                participants: [participants1, participants2],
                
            };

            await expect(Drawing.create(drawing)).rejects.toThrow();

        })

        it("Definir path", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            
            const path = {
                points: [{
                    x: 5,
                    y: 9
                }],
                userId: user?._id.toString(),
            }

            const drawing = await Drawing.create({
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                path: [path]
                
            });

            expect(drawing).toBeDefined();
            expect(drawing.path.length).toBe(1);
            expect(drawing.path[0].points.length).toBe(1);
            expect(drawing.path[0].points[0].x).toBe(5);
            expect(drawing.path[0].points[0].y).toBe(9);
            expect(drawing.path[0].color).toBe('#000000');
            expect(drawing.path[0].size).toBe(1);
            expect(drawing.path[0].timestamp).toBeDefined();
            expect(drawing.path[0].userId).toBe(user?._id.toString());
        })

        it("Devrait echouer avec path sans x ", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            
            const path = {
                points: [{
                    y: 9
                }],
                userId: user?._id.toString(),
            }

            const drawing = {
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                path: [path]
            };

            await expect(Drawing.create(drawing)).rejects.toThrow();
        })

        it("Devrait echouer avec path sans y ", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            
            const path = {
                points: [{
                    x: 5,
                }],
                userId: user?._id.toString(),
            }

            const drawing = {
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                path: [path]
            };

            await expect(Drawing.create(drawing)).rejects.toThrow();
        })

        it("Devrait echouer avec path sans points ", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            
            const path = {
                userId: user?._id.toString(),
            }

            const drawing = {
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                path: [path]
            };

            await expect(Drawing.create(drawing)).rejects.toThrow();
        })

        it("Devrait echouer avec path sans userId ", async () => {
            const user = await User.findOne({"username": sim.username});
            expect(user, "Un erreur de l'utilisateur").toBeDefined();

            
            const path = {
                points: [{
                    x: 5,
                    y: 6
                }],
            }

            const drawing = {
                title: "Test 1",
                theme: "Test",
                author: {
                    authorId: user?._id.toString(),
                    username: user?.username,
                    emoji: user?.emoji
                },
                path: [path]
            };

            await expect(Drawing.create(drawing)).rejects.toThrow();
        })


    })

    
})