import { describe, it, expect, afterEach, vi, beforeAll } from "vitest";
import { screen, render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Canvas from "./Canvas";
import { createPath } from "../Factories/PathFactory";

class IntersectionObserverMock {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
  constructor() {}
}

vi.mock("./RedrawCanvas")

describe('Canva', () => {
    beforeAll(() => {
        window.IntersectionObserver = IntersectionObserverMock as any;
    });

    afterEach(() => {
        cleanup();
    })

    it('Affiche le canva avec les attributs de base', () => {
        render(
            <MemoryRouter>
                <Canvas drawingPath={ [createPath()] } index={ 2 } />
            </MemoryRouter>    
        )

        const canva = screen.getByTitle('drawingCanvas-2');
        
        expect(canva).toBeDefined();
        expect(canva.classList).toContain('hidden')
        expect(canva.classList).not.toContain('visible')

    })
})