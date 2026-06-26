import type { IPath } from "../../types/drawing"
import './DrawControl.css'

interface IDrawControlProps {
    color : string,
    hasStarted : boolean,
    brushSize : number,
    historyIndex : number,
    startIndex : number,
    setColor : (params : string) => void,
    setBrushSize : (params : number) => void,
    handleUndo : () => void,
    handleClear : () => void,
    handleStart : () => void,
    handleSave : () => void,
    handleRedo : () => void,
    paths : IPath[]
}


const DrawControl = ({
    color,
    hasStarted,
    brushSize,
    historyIndex,
    startIndex,
    setColor,
    setBrushSize,
    handleUndo,
    handleClear,
    handleStart,
    handleSave,
    handleRedo,
    paths
} : IDrawControlProps) => {
    return(
        <div className="controls">
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={!hasStarted}
                placeholder="Couleur"
            />
            
            <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                disabled={!hasStarted}
                placeholder="Range"
            />
            
            <button
                onClick={handleUndo}
                disabled={!hasStarted ||
                historyIndex <= startIndex}
            >Undo
            </button>
            
            <button
                onClick={handleRedo}
                disabled={!hasStarted ||
                historyIndex >= paths.length}
            >Redo
            </button>
            
            <button
                onClick={handleClear}
                disabled={!hasStarted ||
                historyIndex === startIndex}
            >Clear
            </button>
            
            <button
                onClick={handleSave}
                disabled={historyIndex === startIndex}
            >Send
            </button>
            
            {!hasStarted && (
                <button onClick={handleStart}>
                    Start
                </button>
            )}
        </div>
    )

}

export default DrawControl