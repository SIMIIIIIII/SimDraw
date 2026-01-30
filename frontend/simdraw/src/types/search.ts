import { Types } from "mongoose";

export interface ITF {
    word: string,
    count: number
}

export interface ITFResult {
    usedWords: string[],
    TFs: ITF[]
}

export interface ITFforIDF{
    drawingId: Types.ObjectId,
    TFs: ITF[],
    usedWords?: string[], // va être effacé après. c'est juste pour faciliter la recherche.
    count?: number
};

export interface ISearchResult{
    
}