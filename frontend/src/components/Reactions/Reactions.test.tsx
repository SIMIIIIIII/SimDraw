import { describe, it, expect, afterEach} from "vitest";
import { screen, render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";


import Reactions from "./Reactions";
import { createDrawing } from "../Factories/DrawFactory";

describe('Reactions', () => {
    afterEach(() => {
        cleanup();
    })

    it("Affiche les icons de commentaires", () => {
        render(
            <MemoryRouter>
                <Reactions drawing={createDrawing()} index={2}></Reactions>
            </MemoryRouter>
        );

        const links = screen.getAllByRole('link');;
        
        expect(links).toBeDefined();
        expect(links).toHaveLength(1);
        expect(links[0].href).toContain('/drawing/1234');
        
    })
})

