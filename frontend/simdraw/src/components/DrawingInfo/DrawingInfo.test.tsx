import { describe, it, expect, afterEach} from "vitest";
import { screen, render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DrawingsInfo } from "./DrawingInfo";
import { createDrawing } from "../Factories/DrawFactory";

describe('DrawingInfo', () => {
    afterEach(() => {
        cleanup();
    })

    it("devait afficher composant", () => {
        const drawing = createDrawing();
        render(
            <MemoryRouter>
                <DrawingsInfo drawing={drawing}></DrawingsInfo>
            </MemoryRouter>
        );

        const links = screen.getAllByRole('link');

        const list = [
            `/drawing/${drawing._id}`,
            `/?author=${drawing.author.authorId}`,
            `/?theme=${drawing.theme}`
        ]

        const text = [ 'Drawing 1', 'simiii', 'Theme1' ]
        
        expect(links).toBeDefined();
        expect(links).toHaveLength(3);

        for (let index = 0; index < links.length; index++) {
            expect(links[index].href).toContain(list[index]);
            expect(links[index].innerHTML).toContain(text[index]);
        }
        
    })
})