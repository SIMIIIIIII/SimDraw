import { it, expect, describe, beforeAll, vi, beforeEach, afterEach } from 'vitest'
import { search_helpers } from '../../../src/utils/searchHelpers'
import { ITFResult, ITF, ITFforIDF } from '../../../src/types/search'
import { Types } from 'mongoose'
import Drawing from '../../../src/models/Drawing';
import Comment from '../../../src/models/Comment';
import { createMockDrawing } from '../../factories/drawingFactory';
import { createMockComment } from '../../factories/commentFactory';
import { createMockExpectedTF} from '../../factories/searchFactories';

vi.mock('../../../src/models/Drawing');
vi.mock('../../../src/models/Comment');

let sequence : string = "Assurez-vous que l'extension Vitest détecte vous  workspace. Vous que moi"
let expectedTF : ITFResult = createMockExpectedTF();
let sequence2 : string = "Je suis la personne que je pense être, pour moi et pour vous"
let expectedTF2: ITFResult = createMockExpectedTF();
let expectedIDF : ITF[] = [];
let listITFforIDF: ITFforIDF[] = [];
let expectedSetTFIDF : ITFforIDF[] = []

describe('Search Helpers Util Tests', () => {
    beforeEach(() => {
        expectedTF = {
        usedWords: ["assurez", 'vous', 'que', 'extension', 'vitest', 'detecte', 'workspace', 'moi'],
        TFs: [
            {word: "assurez", count: Math.log(1 + 1/11)}, {word: 'vous', count: Math.log(1 + 3/11)},
            {word: 'que', count: Math.log(1 + 2/11)}, {word: 'extension', count: Math.log(1 + 1/11)},
            {word: 'vitest', count: Math.log(1 + 1/11)}, {word: 'detecte', count: Math.log(1 + 1/11)},
            {word: 'workspace', count: Math.log(1 + 1/11)}, {word: 'moi', count: Math.log(1 + 1/11)}
        ]
    }
    
    expectedTF2 = {
        usedWords: ['je', 'suis', 'la', 'personne', 'que', 'pense', 'etre', 'pour', 'moi', 'et', 'vous'],
        TFs: [
            {word: 'je', count: Math.log(1 + 2/13)}, {word: 'suis', count: Math.log(1 + 1/13)},
            {word: 'la', count: Math.log(1 + 1/13)}, {word: 'personne', count: Math.log(1 + 1/13)},
            {word: 'que', count: Math.log(1 + 1/13)}, {word: 'pense', count: Math.log(1 + 1/13)},
            {word: 'etre', count: Math.log(1 + 1/13)}, {word: 'pour', count: Math.log(1 + 2/13)},
            {word: 'moi', count: Math.log(1 + 1/13)}, {word: 'et', count: Math.log(1 + 1/13)},
            {word: 'vous', count: Math.log(1 + 1/13)}
        ]
    }
    
    expectedIDF = [
        {word: "assurez", count: Math.log(2/1) + 1}, {word: 'vous', count: Math.log(2/2) + 1},
        {word: 'que', count: Math.log(2/2) + 1}, {word: 'extension', count: Math.log(2/1) + 1},
        {word: 'vitest', count: Math.log(2/1) + 1}, {word: 'detecte', count: Math.log(2/1) + 1},
        {word: 'workspace', count: Math.log(2/1) + 1}, {word: 'moi', count: Math.log(2/2) + 1},
        {word: 'je', count: Math.log(2/1) + 1}, {word: 'suis', count: Math.log(2/1) + 1},
        {word: 'la', count: Math.log(2/1) + 1}, {word: 'personne', count: Math.log(2/1) + 1},
        {word: 'pense', count: Math.log(2/1) + 1}, {word: 'etre', count: Math.log(2/1) + 1},
        {word: 'pour', count: Math.log(2/1) + 1}, {word: 'et', count: Math.log(2/1) + 1}
    ];
    
    listITFforIDF = [
        {
            drawingId: new Types.ObjectId,
            TFs: expectedTF.TFs,
            usedWords: expectedTF.usedWords
        },
        {
            drawingId: new Types.ObjectId,
            TFs: expectedTF2.TFs,
            usedWords: expectedTF2.usedWords
        }
    ];
    
    expectedSetTFIDF = [
        {
            drawingId: listITFforIDF[0].drawingId,
            usedWords: listITFforIDF[0].usedWords,
            TFs: [
                {word: "assurez", count: Math.log(1 + 1/11) *( Math.log(2/1) + 1)},
                {word: 'vous', count: Math.log(1 + 3/11) * (Math.log(2/2) + 1)},
                {word: 'que', count: Math.log(1 + 2/11) * (Math.log(2/2) + 1)},
                {word: 'extension', count: Math.log(1 + 1/11) * (Math.log(2/1) + 1)},
                {word: 'vitest', count: Math.log(1 + 1/11) * (Math.log(2/1) + 1)},
                {word: 'detecte', count: Math.log(1 + 1/11) * (Math.log(2/1) + 1)},
                {word: 'workspace', count: Math.log(1 + 1/11) * (Math.log(2/1) + 1)},
                {word: 'moi', count: Math.log(1 + 1/11) * (Math.log(2/2) + 1)}
            ]
        },
        {
            drawingId: listITFforIDF[1].drawingId,
            usedWords: listITFforIDF[1].usedWords,
            TFs: [
                {word: 'je', count: Math.log(1 + 2/13) * (Math.log(2/1) + 1)},
                {word: 'suis', count: Math.log(1 + 1/13) * (Math.log(2/1) + 1)},
                {word: 'la', count: Math.log(1 + 1/13) * (Math.log(2/1) + 1)},
                {word: 'personne', count: Math.log(1 + 1/13) * (Math.log(2/1) + 1)},
                {word: 'que', count: Math.log(1 + 1/13) * (Math.log(2/2) + 1)},
                {word: 'pense', count: Math.log(1 + 1/13) * (Math.log(2/1) + 1)},
                {word: 'etre', count: Math.log(1 + 1/13) * (Math.log(2/1) + 1)},
                {word: 'pour', count: Math.log(1 + 2/13) * (Math.log(2/1) + 1)},
                {word: 'moi', count: Math.log(1 + 1/13) * (Math.log(2/2) + 1)},
                {word: 'et', count: Math.log(1 + 1/13) * (Math.log(2/1) + 1)},
                {word: 'vous', count: Math.log(1 + 1/13) * (Math.log(2/2) + 1)}
            ]
        }
    ]
    })
    describe("Test filter()", () => {
        it("Filtre une phrase normal en miniscule sans accent ni ponctuation", () => {
            const sentence : string = "simeon est une personne formidable";
            const expectedResult : string[] = ["simeon", "est", "une", "personne", "formidable"]
            const actualResult : string[] = search_helpers.filter(sentence);

            expect(actualResult).toHaveLength(5);
            expect(actualResult).toStrictEqual(expectedResult);
        })

        it("Devrait retourner une liste avec toutes les lettre en miniscule", () => {
            const sentence : string = "Simeon est une pErsOnne formidAble";
            const expectedResult : string[] = ["simeon", "est", "une", "personne", "formidable"]
            const actualResult : string[] = search_helpers.filter(sentence);

            expect(actualResult).toHaveLength(5);
            expect(actualResult).toStrictEqual(expectedResult);
        })

        it("Devrait retourner une liste sans les espaces", () => {
            const sentence : string = "   Simeon    est    une    pErsOnne    formidAble   ";
            const expectedResult : string[] = ["simeon", "est", "une", "personne", "formidable"]
            const actualResult : string[] = search_helpers.filter(sentence);

            expect(actualResult).toHaveLength(5);
            expect(actualResult).toStrictEqual(expectedResult);
        })

        it("Devrait remplacer les accent par des voyelle sans accent", () => {
            const sentence : string = "Sîmeon ést une pËrsOnne fòrmidÁble";
            const expectedResult : string[] = ["simeon", "est", "une", "personne", "formidable"]
            const actualResult : string[] = search_helpers.filter(sentence);

            expect(actualResult).toHaveLength(5);
            expect(actualResult).toStrictEqual(expectedResult);
        })

        it("Devrait effacer les signes de pornctuiation", () => {
            const sentence : string = "Sîmeon? ést une pËrsOnne!! fòrmidÁble";
            const expectedResult : string[] = ["simeon", "est", "une", "personne", "formidable"]
            const actualResult : string[] = search_helpers.filter(sentence);

            expect(actualResult).toHaveLength(5);
            expect(actualResult).toStrictEqual(expectedResult);
        })

        it("Devrait effacer les mots qui ne contiennent que les signes de pornctuiation", () => {
            const sentence : string = "!&@ Sîmeon? ést une pËrsOnne!! fòrmidÁble";
            const expectedResult : string[] = ["simeon", "est", "une", "personne", "formidable"]
            const actualResult : string[] = search_helpers.filter(sentence);

            expect(actualResult).toHaveLength(5);
            expect(actualResult).toStrictEqual(expectedResult);
        })

        it("Devrait se debarraser de mot à 1 lettre", () => {
            const sentence : string = "Sîmeon? ést une à pËrsOnne!! e fòrmidÁble@";
            const expectedResult : string[] = ["simeon", "est", "une", "personne", "formidable"]
            const actualResult : string[] = search_helpers.filter(sentence);

            expect(actualResult).toHaveLength(5);
            expect(actualResult).toStrictEqual(expectedResult);
        })

        it("Devrait separer un mot composé en 2 mots", () => {
            const sentence : string = "Sîm-eon? ést une à pËrsO@nne!! e fòrmi?dÁble";
            const expectedResult : string[] = ["sim", "eon", "est", "une", "perso", "nne", "formi", "dable"]
            const actualResult : string[] = search_helpers.filter(sentence);

            expect(actualResult).toHaveLength(8);
            expect(actualResult).toStrictEqual(expectedResult);
        })
    })

    describe('Tester geTF()', () => {
        it('Devrait retourner une TF normal', () => {
            const actualResult : ITFResult = search_helpers.getTF(sequence);
            const actualResult2 : ITFResult = search_helpers.getTF(sequence2);

            expect(actualResult.usedWords).toStrictEqual(expectedTF.usedWords);
            expect(actualResult.TFs).toStrictEqual(expectedTF.TFs);

            expect(actualResult2.usedWords).toStrictEqual(expectedTF2.usedWords);
            expect(actualResult2.TFs).toStrictEqual(expectedTF2.TFs);
        })
    })

    describe('Tester getIDF()', () => {
        it ('Devrait retourner une IDF normale', () => {
            const actualResult : ITF[] = search_helpers.getIDF(listITFforIDF);

            expect(actualResult).toHaveLength(expectedIDF.length);
            expect(actualResult).toStrictEqual(expectedIDF);
        })
    })

    describe('Tester setTFIDF()', () => {
        it('Devrait copy doit contenir la soustraction entre TF et ITF', () => {
            search_helpers.setTFIDF(listITFforIDF, expectedIDF);
            expect(listITFforIDF).toStrictEqual(expectedSetTFIDF);
        })
    })

    describe('tester await search', () => {
        let getTFSpy: ReturnType<typeof vi.spyOn>;
        let getIDFSpy: ReturnType<typeof vi.spyOn>;
        let setTFIDFSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            vi.clearAllMocks();
            vi.clearAllMocks();
            getTFSpy = vi.spyOn(search_helpers, 'getTF');
            getIDFSpy = vi.spyOn(search_helpers, 'getIDF');
            setTFIDFSpy = vi.spyOn(search_helpers, 'setTFIDF');
            
        })

        afterEach(() => {
            getTFSpy.mockRestore();
            getIDFSpy.mockRestore();
            setTFIDFSpy.mockRestore();
        })

        it('Test valide', async () => {
            const mockDrawings = [createMockDrawing()];
            const mockComments = [createMockComment()];
            
            vi.mocked(Drawing.find).mockResolvedValue(mockDrawings as any);
            vi.mocked(Comment.find).mockResolvedValue(mockComments as any);
            
            getTFSpy.mockReturnValue([expectedTF, expectedTF2]);
            getIDFSpy.mockReturnValue(expectedIDF);
            setTFIDFSpy.mockImplementation(() => {});

            const actualResult: ITFforIDF[] = await search_helpers.research();
            
            expect(getTFSpy).toHaveBeenCalled();
            expect(getIDFSpy).toHaveBeenCalled();
            expect(setTFIDFSpy).toHaveBeenCalled();
            expect(Drawing.find).toHaveBeenCalled();
            expect(Comment.find).toHaveBeenCalled();
        })

    })

    describe('Tester getSearchMessage()', () => {
        it('Quand la liste est vide', () => {
            const message: string = search_helpers.getSearchMessage(0, 'Simeon');
            expect(message).toMatch('Aucun');
        })

        it('Quand la liste contient 1 élément', () => {
            const message: string = search_helpers.getSearchMessage(1, 'Simeon');
            expect(message).toMatch('1');
            expect(message).contains('dessin ')
        })

        it('Quand la liste contient plus d\'1 élément', () => {
            const message: string = search_helpers.getSearchMessage(2, 'Simeon');
            expect(message).toMatch('2');
            expect(message).contains('dessins ')
        })
    })

    describe('Tester getTFWithWords()', () => {
        it('Retour une liste non vide dans un seul document', () => {
            const listWords : string[] = ['assurez', 'vitest']
            const expectedResult : ITFforIDF = expectedSetTFIDF[0];

            const actualResult = search_helpers.getTFWithWords(expectedSetTFIDF, listWords);

            expect(actualResult).toStrictEqual([expectedResult]);
        })

        it('Retour une liste non vide dans 2 documents', () => {
            const listWords : string[] = ['moi']

            const actualResult = search_helpers.getTFWithWords(expectedSetTFIDF, listWords);

            expect(actualResult).toStrictEqual(expectedSetTFIDF);
        })

        it('Retour une liste vide pour un mot qui n\'existe pas', () => {
            const listWords : string[] = ['Simeon']

            const actualResult = search_helpers.getTFWithWords(expectedSetTFIDF, listWords);

            expect(actualResult).toHaveLength(0);
        })

        it('Retour une liste vide pour un entré vide', () => {
            const listWords : string[] = []

            const actualResult = search_helpers.getTFWithWords(expectedSetTFIDF, listWords);

            expect(actualResult).toHaveLength(0);
        })

        it('Devrait s\'assurer du bon trie', () => {
            const listWords : string[] = ['etre', 'personne', 'la', 'je', 'suis', 'assurez']

            const actualResult = search_helpers.getTFWithWords(expectedSetTFIDF, listWords);

            expect(actualResult).toHaveLength(2);
            expect(actualResult[0]).toStrictEqual(expectedSetTFIDF[1]);
        })
    })

    

})