import type { IPath } from "../../types/drawing";

export const createPath = (Overrides = {}) : IPath => {
    return (
        {
            userId: "jjkcjdcj",
            points: [
                {x: 6, y: 2},
                {x: 1, y: 9},
                {x: 3, y: 8}
            ],
            ...Overrides
        }
    )
}