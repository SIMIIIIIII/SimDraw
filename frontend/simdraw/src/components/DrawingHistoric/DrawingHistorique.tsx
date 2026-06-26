import type { IDrawing } from "../../types/drawing";
import Canvas from "../Canvas/Canvas";

const DrawingHistorique = ({drawing} : {drawing : IDrawing}) => {
    return (
        <div className="scrollable-element">
            {drawing.participants.map((part, index) => (
                <Canvas
                    drawingPath={drawing.path.slice(part.start, part.end)}
                    index={index}
                />
                ))}
        </div>
    )
}

export default DrawingHistorique