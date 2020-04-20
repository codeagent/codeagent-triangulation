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

export const drawDot = (position: vec2) => {
  const OUTER_RADIUS = 6;
  const INNER_RADIUS = 4;
  const PRIMARY_COLOR = "#666666";
  const SECONDARY_COLOR = "#ffffff";

  context.beginPath();
  context.arc(position[0], position[1], OUTER_RADIUS, 0, 2 * PI, false);
  context.fillStyle = SECONDARY_COLOR;
  context.fill();

  context.beginPath();
  context.arc(position[0], position[1], OUTER_RADIUS, 0, 2 * PI, false);
  context.lineWidth = 1;
  context.strokeStyle = PRIMARY_COLOR;
  context.stroke();

  context.beginPath();
  context.arc(position[0], position[1], INNER_RADIUS, 0, 2 * PI, false);
  context.fillStyle = PRIMARY_COLOR;
  context.fill();
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

  const threshold = 96.0;

  context.beginPath();
  const len = length(sub(ed[1], ed[0]));
  const colorVal = floor(lerp(0, 255, min(len / threshold, 1.0)));
  const color = `#${colorVal.toString(16).repeat(3)}`;
  context.strokeStyle = color;
  context.moveTo(ed[0][0], ed[0][1]);
  context.lineTo(ed[1][0], ed[1][1]);

  context.stroke();
};
