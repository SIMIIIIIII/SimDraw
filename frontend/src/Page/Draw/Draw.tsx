import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { API_URL } from '../../config';
import type { IDrawing, IPath } from '../../types/drawing';
import type { ApiResponse } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import './Draw.css';
import Timer from '../../components/Timer/Timer';
import DrawControl from '../../components/DrawControl/DrawControl';
import RedrawCanvas from '../../components/Canvas/RedrawCanvas'

const TURN_DURATION_SECONDS = 60;

const Draw = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState<IDrawing | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [paths, setPaths] = useState<IPath[]>([]);
    const [currentPath, setCurrentPath] = useState<IPath | null>(null);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(3);
    const [hasStarted, setHasStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(TURN_DURATION_SECONDS);
    const [timerActive, setTimerActive] = useState(false);
    const [searchParams] = useSearchParams();
    const { id: routeDrawingId } = useParams();
    const {user, logout} = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/login');
        else {
            fetch(`${API_URL}/draw`, {
                'credentials': 'include'
            })
            .then(async(response) => {return await response.json()})
            .then((data : ApiResponse<IDrawing>) => {
                if (data.success && data.data){
                    setDrawing(data.data);
                    setPaths(data.data.path || []);
                    setStartIndex(data.data.path?.length || 0);
                    setHistoryIndex(data.data.path?.length || 0);
                }
                else{
                    if (data.error?.includes('Connexion')){
                        logout();
                        navigate('/login');
                    }
                    else {
                        navigate('/drawing/create');
                    }
                }
            })
            .catch((error) => {
                alert('Erreur réseau: ' + error);
                navigate('/');
            });
        }
    }, [routeDrawingId, searchParams, navigate, user, logout]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const visiblePaths = paths.slice(0, historyIndex);
        RedrawCanvas(ctx, canvas, visiblePaths);
        ctx.beginPath();
    }, [paths, historyIndex]);

    useEffect(() => {
        if (timerActive && timeRemaining > 0) {
            const timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeRemaining === 0) {
            const timeout = setTimeout(() => {
                setHasStarted(false);
                setTimerActive(false);
                alert('Temps écoulé!');
            }, 0);

            return () => clearTimeout(timeout);
        }
    }, [timerActive, timeRemaining]);

    
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!hasStarted) return;

        setIsDrawing(true);
        const newPath: IPath = {
            points: [],
            color: color,
            size: brushSize,
            userId: user?.id || ''
        };
        setCurrentPath(newPath);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        ctx?.beginPath();
        draw(e, newPath);
    };

    const stopDrawing = () => {
        if (!isDrawing || !currentPath) return;

        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx?.beginPath();

        if (currentPath.points.length > 0) {
            const newPaths = [...paths.slice(0, historyIndex), currentPath];
            setPaths(newPaths);
            setHistoryIndex(newPaths.length);
        }
        setCurrentPath(null);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>, pathToUpdate?: IPath) => {
        if (!isDrawing && !pathToUpdate) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        x = Math.max(0, Math.min(x, canvas.width));
        y = Math.max(0, Math.min(y, canvas.height));

        const pathUpdate = pathToUpdate || currentPath;
        if (pathUpdate) {
            pathUpdate.points.push({ x, y });

            ctx.lineWidth = pathUpdate.size || brushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = pathUpdate.color || color;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const handleUndo = () => {
        if (!hasStarted || historyIndex <= startIndex) return;
        setHistoryIndex(historyIndex - 1);
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
    };

    const handleRedo = () => {
        if (!hasStarted || historyIndex >= paths.length) return;
        setHistoryIndex(historyIndex + 1);
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
    };

    const handleClear = () => {
        if (!hasStarted) return;
        setPaths(paths.slice(0, startIndex));
        setHistoryIndex(startIndex);
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
    };

    const handleSave = async () => {
        if (!drawing) return;

        const committedPaths = currentPath && currentPath.points.length > 0
            ? [...paths.slice(0, historyIndex), currentPath]
            : paths.slice(0, historyIndex);
        const newPaths = committedPaths.slice(startIndex, committedPaths.length);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        ctx?.beginPath();

        try {
            const response = await fetch(`${API_URL}/draw/${drawing._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paths: newPaths,
                    start: startIndex,
                    end: historyIndex
                })
            });

            const data: ApiResponse<unknown> = await response.json();

            if (data.success) {
                alert('Dessin sauvegardé!');
                navigate('/');
            } else {
                alert(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            alert(`Erreur ${error} `);
        }
    };

    const handleStart = () => {
        setHasStarted(true);
        setTimerActive(true);
        setTimeRemaining(TURN_DURATION_SECONDS);
    };

    if (!drawing) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="draw-container">
            <h2>Drawing App</h2>

            <div className="center">

                <div className="drawing-info">
                    <p><strong>Titre:</strong> {drawing.title}</p>
                    <p><strong>Description:</strong> {drawing.description}</p>
                    <p><strong>Thème:</strong> {drawing.theme}</p>
                </div>

                <Timer
                    timeRemaining={timeRemaining}
                    timerActive={timerActive}
                />

                <DrawControl
                    color={color}
                    hasStarted={hasStarted}
                    handleClear={handleClear}
                    handleRedo={handleRedo}
                    handleSave={handleSave}
                    handleStart={handleStart}
                    handleUndo={handleUndo}
                    brushSize= {brushSize}
                    historyIndex={historyIndex}
                    startIndex={startIndex}
                    setColor={setColor}
                    setBrushSize={setBrushSize}
                    paths={paths}
                />

                <canvas
                    ref={canvasRef}
                    width="800"
                    height="500"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={(e) => draw(e)}
                    onMouseLeave={stopDrawing}
                />
            </div>
        </div>
    );
};

export default Draw;
