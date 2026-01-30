import type { IPath } from "../../types/drawing";

const RedrawCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  paths: IPath[]
) : void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  paths.forEach((path) => {
    if (!path.points || path.points.length === 0) return;

    ctx.strokeStyle = path.color!;
    ctx.lineWidth = path.size!;
    ctx.lineCap = 'round';
    ctx.beginPath();

    ctx.moveTo(path.points[0].x, path.points[0].y);
    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i].x, path.points[i].y);
    }
    ctx.stroke();
  });
};

export default RedrawCanvas;
