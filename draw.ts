import {
  Polygon,
  vec2,
  PI,
  Triangle,
  length,
  sub,
  lerp,
  min,
  floor,
Edge
} from "./math";

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const context = canvas.getContext("2d") as CanvasRenderingContext2D;
export const container = document.getElementById("container") as HTMLDivElement;

export const clear = (): void => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

export const drawPoly = (poly: Polygon, color: string, dashed = false) => {
  context.lineWidth = 1;
  context.strokeStyle = color;
  context.setLineDash(dashed ? [1, 1] : []);

  context.beginPath();
  for (let i = 0; i < poly.length; i++) {
    if (i === 0) {
      context.moveTo(poly[i][0], poly[i][1]);
    }
    context.lineTo(
      poly[(i + 1) % poly.length][0],
      poly[(i + 1) % poly.length][1]
    );
  }
  context.stroke();
  context.setLineDash([]);
};

export const drawDot = (position: vec2, color = "#003300") => {
  context.beginPath();
  context.arc(position[0], position[1], 3, 0, 2 * PI, false);
  context.fillStyle = "green";
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = color;
  context.stroke();
};

export const drawCircle = (center: vec2, radius: number) => {
  context.beginPath();
  context.arc(center[0], center[1], radius, 0, 2 * PI, false);
  context.lineWidth = 1;
  context.strokeStyle = "#888888";
  context.stroke();
};

export const drawEdge = (ed: Edge) => {
  context.lineWidth = 1;
  context.setLineDash([]);

  const threshold = 128.0;

  context.beginPath();
  const len = length(sub(ed[1], ed[0]));
  const colorVal = floor(lerp(6, 15, min(len / threshold, 1.0)));
  const color = `#${colorVal.toString(16).repeat(6)}`;
  context.strokeStyle = color;
  context.moveTo(ed[0][0], ed[0][1]);
  context.lineTo(ed[1][0], ed[1][1]);

  context.stroke();
};
