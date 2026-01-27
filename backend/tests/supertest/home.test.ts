import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import app from '../../src/app';
import Drawing from '../../src/models/Drawing';
import { createMockDrawing } from '../factories/drawingFactory';
import { search_helpers } from '../../src/utils/searchHelpers'; 

vi.mock('../../src/models/Drawing');
vi.mock('../../src/models/Comment');
vi.mock('../../src/utils/searchHelpers', () => ({
    search_helpers: {
        filter: vi.fn(),
        research: vi.fn(),
        getTFWithWords: vi.fn(),
        getSearchMessage: vi.fn()
    },
}));

describe('Home Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Tester la page 404', () => {
        it('Il devrait retourner le status 404', async () => {
            expect((await request(app).get('/sim')).status).toBe(404);
        })
    })

    describe("GET '\'", () => {
        it('devrait retourner la liste des dessins', async () => {
            const mockDrawings = [
                createMockDrawing({title: 'Dessin 1'}),
                createMockDrawing({title: 'Dessin 2'})
            ];

            vi.mocked(Drawing.find).mockResolvedValue(mockDrawings as any);
            
            const res = await request(app).get('/');

            expect(res.status).toBe(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data.canModify).toBeUndefined;

        })
    })

    describe("GET '/by/author/:id' ", () => {
        it('devrait retourner la liste des dessins', async () => {
            const mockDrawings = [
                createMockDrawing({title: 'Dessin 1'}),
                createMockDrawing({title: 'Dessin 2'})
            ];

            vi.mocked(Drawing.find).mockResolvedValue(mockDrawings as any);
            
            const res = await request(app).get(`/by/author/${mockDrawings[0].author.authorId}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data.canModify).toBeUndefined;

        })

        it('devrait retourner l\'erreur 400 pour id invalid ', async () => {
            const mockDrawings = [
                createMockDrawing({title: 'Dessin 1'}),
                createMockDrawing({title: 'Dessin 2'})
            ];

            vi.mocked(Drawing.find).mockResolvedValue(mockDrawings as any);
            
            const res = await request(app).get(`/by/author/011`);
            
            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
            expect(res.body.success).toBeFalsy();

        })
    })
    
    describe("GET '/by/theme/:theme' ", () => {
        it('devrait retourner la liste des dessins', async () => {
            const mockDrawings = [
                createMockDrawing({title: 'Dessin 1'}),
                createMockDrawing({title: 'Dessin 2'})
            ];

            vi.mocked(Drawing.find).mockResolvedValue(mockDrawings as any);
            
            const res = await request(app).get(`/by/theme/${mockDrawings[0].theme}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data.canModify).toBeUndefined;

        })
    })

    describe("POST '/research", () => {
        it("Rechercher valide", async () => {
            const mockDrawings = [
                createMockDrawing({
                    title: 'Dessin 1',
                    theme: 'Theme 1',
                    description: "Sim est un informaticien respecté"
                }),
                createMockDrawing({
                    title: 'Dessin 2',
                    theme: 'Theme 2',
                    description: 'Lama est un magicien aimé'
                })
            ];
            vi.mocked(Drawing.find).mockResolvedValue(mockDrawings as any);
            vi.mocked(search_helpers.filter).mockReturnValue([]);
            vi.mocked(search_helpers.research).mockResolvedValue([]);
            vi.mocked(search_helpers.getTFWithWords).mockReturnValue([]);
            vi.mocked(search_helpers.getSearchMessage).mockReturnValue("Sim est là");
            
            const res = await request(app).post('/research').send({"searchTerm": "Sim"});

            expect(res.status).toBe(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.error).toBeUndefined();
            expect(res.body.data).toBeDefined();
        })

        it("Rechercher invalide", async () => {
            const res = await request(app).post('/research').send({"searchTer": "Sim"});

            expect(res.status).toBe(400);
        })
    })

    describe('GET /my_drawings', () => {
        it('Non connecté donc devrait echouer', async () => {
            const res = await request(app).get('/my_drawings');
            expect(res.body.success).toBeFalsy()
            expect(res.status).toBe(401)
        })
    })
})