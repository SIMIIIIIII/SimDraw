import { Document } from "mongoose";
import { IComment } from "types/comment";
import { IDrawing } from "types/drawing";
import { ITF, ITFforIDF, ITFResult } from "types/search";
import Drawing from "@models/Drawing";
import Comment from "@models/Comment";
import natural from 'natural'
const tokenizer = new natural.WordTokenizer();

const ponctuation = '.,;:!?…\'"``«»\'\'"")[]{}–—-_/*&@#%°';

const removeAccent = (accent : string) : string => {
  if (accent.includes("à")) return 'a';
  if (accent.includes("â")) return 'a';
  if (accent.includes("á")) return 'a';
  if (accent.includes("ä")) return 'a';
  if (accent.includes("è")) return 'e';
  if (accent.includes("é")) return 'e';
  if (accent.includes("ê")) return 'e';
  if (accent.includes("ë")) return 'e';
  if (accent.includes("ï")) return 'i';
  if (accent.includes("î")) return 'i';
  if (accent.includes("ì")) return 'i';
  if (accent.includes("í")) return 'i';
  if (accent.includes("ô")) return 'o';
  if (accent.includes("ö")) return 'o';
  if (accent.includes("ó")) return 'o';
  if (accent.includes("ò")) return 'o';
  if (accent.includes("û")) return 'u';
  if (accent.includes("ü")) return 'u';
  if (accent.includes("ú")) return 'u';
  if (accent.includes("ù")) return 'u';
  if (ponctuation.includes(accent)) return ' ';
  return accent;
};


export const search_helpers = {
  filter: (text : string = '') : string[] => {
    const cleaned : string[] = [...text.toLowerCase()]
      .map((char: string) => removeAccent(char))
      .join('')
      .split(' ');

    const tokens : string[] = tokenizer.tokenize(cleaned.join(' '));
    return tokens.filter((word : string) => word.length > 1);
  },
  
  getTF: (text : string) : ITFResult => {
    const filteredWords : string[] = search_helpers.filter(text);

    const tf : ITF[] = [];
    const used : string[] = [];
    const n : number = filteredWords.length;

    for (let index = 0; index < n; index++) {
        const element : string = filteredWords[index]!;

        if (!used.includes(element)) {
            const count = filteredWords.reduce((acc : number, word: string) => {
                return word === element ? acc + 1 : acc;
            }, 0);

            tf.push({
                word: element,
                count: Math.log(1 + count / n),
            });
            used.push(element);
        }
    }

    return { TFs: tf, usedWords: used };
  },

  getIDF: (list_TFs : ITFforIDF[]) : ITF[] => {
    const IDF : ITF[] = [];
    const used :string[] = [];
    const n = list_TFs.length;

    for (let i = 0; i < n; i++) {
      const TFs : ITF[] = list_TFs[i]?.TFs!;

      for (let j = 0; j < TFs.length; j++) {
        const word = TFs[j]?.word;

        if (!used.includes(word!)) {
            const count = list_TFs.reduce((acc : number, doc : ITFforIDF) => {
                return doc.usedWords?.includes(word!) ? acc + 1 : acc;
            }, 0);
            
            IDF.push({
                word: word!,
                count: Math.log(n / count) + 1,
            });
            
            used.push(word!);
        }
      }
    }
    return IDF;
  },
  
    setTFIDF: (list_TF : ITFforIDF[], IDF : ITF[]) : void => {
        for (let i = 0; i < list_TF.length; i++) {
        list_TF[i]?.TFs.forEach((word: ITF) => {
            const idf = IDF.find((m : ITF) => m.word === word.word);
            word.count = word.count * (idf ? idf.count : 1); 
        });
        }
    },

    research: async () : Promise<ITFforIDF[]> => {
        const drawings : (IDrawing & Document)[] = await Drawing.find({ isDone: true, isPublic: true });
        const TF : ITFforIDF[] = [];

        for (let i = 0; i < drawings.length; i++) {
            const comments : (IComment & Document)[] = await Comment.find({ postId: drawings[i]?._id! });

            let words = '';
            for (let j = 0; j < comments.length; j++) {
                words = words.concat(' ').concat(comments[j]?.comment!).trim();
            }

            const tempTF : ITFResult = search_helpers.getTF(
                `${drawings[i]?.description} ${drawings[i]?.title} ${words.trim()}`.trim()
            );

            TF.push({
                drawingId: drawings[i]?._id!,
                TFs: tempTF.TFs,
                usedWords: tempTF.usedWords, // va être effacé après. c'est juste pour faciliter la recherche.
            });
        }

        const IDF : ITF[] = search_helpers.getIDF(TF);
        search_helpers.setTFIDF(TF, IDF);
        
        return TF;
    },

    getTFWithWords: (TFIDF: ITFforIDF[], listWords : string[]): ITFforIDF[] => {
        const filteredWords : ITFforIDF[] = [];
        for (let i = 0; i < TFIDF.length; i++) {
            const doc = TFIDF[i];
            doc!.count = 0;

            for (let j = 0; j < doc!.TFs.length; j++) {
                listWords.forEach((word) => {
                    if (doc?.TFs[j]?.word.includes(word)) doc.count! += doc.TFs[j]!.count;
                });
            }
            if (doc!.count !== 0) filteredWords.push(doc!);
        }

        filteredWords.sort((x, y) => {
            return y?.count! - x?.count!;
        });
        
        return filteredWords;
    },

    getSearchMessage: (drawingsLength : number, searTerm : string) : string => {
        let message : string;
        if (drawingsLength === 1) {
        message = `1 dessin trouvé pour "${searTerm.trim()}"`;
        } else if (drawingsLength === 0) {
        message = `Aucun dessin trouvé pour "${searTerm.trim()}"`;
        } else {
        message = `${drawingsLength} dessins trouvés pour "${searTerm.trim()}"`;
        }

        return message;
    }
};