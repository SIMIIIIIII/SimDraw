import { useEffect, useRef, useState } from 'react';
import RedrawCanvas from './RedrawCanvas';
import type { IDrawing, IPath } from '../../types/drawing';
import './Canva.css'


interface ICanvasProps {
  drawingPath: IPath[],
  index: number
}

const Canvas = ({ drawingPath, index } : ICanvasProps) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  // Intersection Observer pour détecter quand le canvas est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasDrawn) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasDrawn]);

  // Dessiner le canvas seulement quand il devient visible
  useEffect(() => {
    if (!isVisible || hasDrawn) return;

    const canvas : HTMLCanvasElement = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dessiner les paths du drawing
    if (drawingPath && drawingPath.length > 0) {
      RedrawCanvas(ctx, canvas, drawingPath);
      setHasDrawn(true);
    }
  }, [isVisible, drawingPath, hasDrawn]);

  return (
    <div ref={containerRef} className='bloc-canvas'>
      <canvas
        ref={canvasRef}
        id={`drawingCanvas-${index}`}
        title={`drawingCanvas-${index}`}
        className={hasDrawn ? 'visible' : 'hidden'}
      ></canvas>
      {!hasDrawn && (
        <div className='hasUp'>
          Chargement...
        </div>
      )}
    </div>
  );
};

export default Canvas;
