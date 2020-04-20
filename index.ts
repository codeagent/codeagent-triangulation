// Import stylesheets
import "./style.css";
import {
  clear,
  drawDot,
  canvas,
  drawPoly,
  drawCircle,
  drawEdge
} from "./draw";
import {
  vec2,
  Polygon,
  rangeRandom,
  dot,
  sub,
  add,
  normalize,
  abs,
  mult,
  length,
  cross,
  Circle,
  getBoundingCirle,
  contains,
  Triangle,
  circleRandom,
  Edge
} from "./math";

type triangle = [vec2, vec2, vec2];

const createCloud = (count: number): vec2[] => {
  const cloud = [];
  while (count-- > 0) {
    cloud.push([
      canvas.width * 0.125 + rangeRandom(0, canvas.width * 0.75),
      canvas.height * 0.125 + rangeRandom(0, canvas.height * 0.75)
    ]);
  }
  return cloud;
};

const getConvexHull = (cloud: vec2[]): Polygon => {
  // 1. Find Farthest Point
  let p0 = cloud[0];
  for (const p of cloud) {
    if (p[1] > p0[1] || (p[1] === p0[1] && p[0] < p0[0])) {
      p0 = p;
    }
  }

  // 2. Sot By angle
  const ex: vec2 = [1.0, 0];

  const sorted = [].concat(cloud).sort((p1: vec2, p2: vec2) => {
    if (p1 === p0) {
      return -1;
    }
    const v1 = sub(p1, p0);
    const v2 = sub(p2, p0);
    const d1 = dot(normalize(v1), ex);
    const d2 = dot(normalize(v2), ex);

    if (abs(d1 - d2) < 1.0e-5) {
      return length(v1) - length(v2);
    }
    return d2 - d1;
  });

  // 3. Loop through list
  const stack = [sorted.shift(), sorted.shift()];
  for (const p of sorted) {
    while (stack.length > 1) {
      const v1 = sub(stack[stack.length - 1], stack[stack.length - 2]);
      const v2 = sub(p, stack[stack.length - 2]);
      if (cross(v1, v2) > 0) {
        break;
      }
      stack.pop();
    }

    stack.push(p);
  }

  return stack as Polygon;
};

const triangulate = (points: vec2[]): Triangle[] => {
  // 1. Create convex hull
  const hull: Polygon = getConvexHull(points);

  // 2. Take first edge (on convex boundary)
  const edges: Edge[] = [[hull[0], hull[1]]];

  // 3. Step over all points
  const triangles: Triangle[] = [];

  while (edges.length) {
    const eg = edges.shift();

    // Take points that are outside of triangulated mesh
    let filtered = points.filter(
      p =>
        p !== eg[0] &&
        p !== eg[1] &&
        cross(sub(eg[1], eg[0]), sub(p, eg[0])) > 0
    );

    // Find best point
    const best = filtered.find(p => {
      const circle = getBoundingCirle(eg[0], eg[1], p);
      return filtered.every(e => e === p || !contains(circle, e));
    });

    if (best) {
      // Extinguish existed one ot push new
      [[eg[0], best], [best, eg[1]]].forEach((e: Edge) => {
        const index = edges.findIndex(ed => ed[0] === e[1] && ed[1] === e[0]);
        if (index === -1) {
          edges.push(e);
        } else {
          edges.splice(index, 1);
        }
      });
      triangles.push({
        p0: eg[0],
        p1: eg[1],
        p2: best
      });
    }
  }

  return triangles;
};

const getEdges = (triangles: Triangle[]): Edge[] => {
  const edges: Edge[] = [];
  for (const t of triangles) {
    [[t.p1, t.p0], [t.p2, t.p1], [t.p0, t.p2]].forEach((e: Edge) => {
      if (
        !edges.find(
          ed =>
            (ed[0] === e[0] && ed[1] === e[1]) ||
            (ed[0] === e[1] && ed[1] === e[0])
        )
      ) {
        edges.push(e);
      }
    });
  }
  return edges;
};

// Animated scene
interface Body {
  position: vec2;
  velocity: vec2;
}

type Scene = Body[];

const createScene = (count: number): Scene => {
  const scene: Scene = [];
  while (count-- > 0) {
    scene.push({
      position: [
        rangeRandom(0, canvas.width),
        rangeRandom(0, canvas.height)
      ],
      velocity: mult(circleRandom(), rangeRandom(4.0, 16.0))
    });
  }
  return scene;
};

const updateScene = (scene: Scene, dt: number): void => {
  scene.forEach(body => {
    body.position = add(body.position, mult(body.velocity, dt));
    if (body.position[0] < -64.0) {
      body.position[0] += canvas.width + 64.0;
    }
    if (body.position[0] >= canvas.width + 64.0) {
      body.position[0] -= canvas.width - 64.0;
    }
    if (body.position[1] < -64.0) {
      body.position[1] += canvas.height + 64.0;
    }
    if (body.position[1] >= canvas.height + 64.0) {
      body.position[1] -= canvas.height - 64.0;
    }
  });
};

const scene: Scene = createScene(128);
let lastFrameTime = Date.now();
let dt = 0.0;

const draw = () => {
  dt = (Date.now() - lastFrameTime) * 1.0e-3;
  lastFrameTime = Date.now();
  updateScene(scene, dt);

  const triangles = triangulate(scene.map(body => body.position));
  const edges = getEdges(triangles);
  clear();
  edges.forEach(ed => drawEdge(ed));
  scene.forEach(body => drawDot(body.position));
  requestAnimationFrame(draw);
};

draw();
