import Drawing from "../models/Drawing";

export const setTimer = (drawingId : string) => {
    setTimeout(
      async () => {
        await Drawing.findByIdAndUpdate(drawingId, { currentTurn: null });
      },
      60 * 1000
    );
}