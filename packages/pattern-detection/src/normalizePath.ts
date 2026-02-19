export interface Point {
  x: number;
  y: number;
}

/**
 * Resample a path to exactly N points (equal spacing along path length).
 */
export function resamplePath(path: Point[], numPoints: number): Point[] {
  if (path.length < 2) return path;
  const out: Point[] = [];
  const totalLen = pathLength(path);
  if (totalLen === 0) return path;

  let traveled = 0;
  let segIndex = 0;
  let segStart = path[0]!;

  for (let i = 0; i < numPoints; i++) {
    const target = (i / (numPoints - 1)) * totalLen;

    while (segIndex < path.length - 1 && traveled + dist(segStart, path[segIndex + 1]!) < target) {
      traveled += dist(segStart, path[segIndex + 1]!);
      segIndex++;
      segStart = path[segIndex]!;
    }

    const next = path[segIndex + 1];
    if (next) {
      const segLen = dist(segStart, next);
      const t = segLen > 0 ? (target - traveled) / segLen : 0;
      out.push({
        x: segStart.x + (next.x - segStart.x) * t,
        y: segStart.y + (next.y - segStart.y) * t,
      });
    } else {
      out.push({ ...path[path.length - 1]! });
    }
  }
  return out;
}

function pathLength(path: Point[]): number {
  let len = 0;
  for (let i = 0; i < path.length - 1; i++) {
    len += dist(path[i]!, path[i + 1]!);
  }
  return len;
}

function dist(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Normalize path: resample to fixed size, center, and scale to fit in [0, size] x [0, size].
 */
export function normalizePath(path: Point[], numPoints: number, size: number): Point[] {
  const resampled = resamplePath(path, numPoints);
  const bounds = boundingBox(resampled);
  const w = bounds.maxX - bounds.minX || 1;
  const h = bounds.maxY - bounds.minY || 1;
  const scale = size / Math.max(w, h);
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const half = size / 2;
  return resampled.map((p) => ({
    x: (p.x - cx) * scale + half,
    y: (p.y - cy) * scale + half,
  }));
}

export function boundingBox(path: Point[]): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of path) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY };
}
