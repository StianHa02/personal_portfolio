// Renderer-agnostic Rubik's cube simulation.
// Shared by the WebGL renderer (CubeGL) and the canvas-2D fallback (CubeRenderer2D).

export type Vec3 = [number, number, number];
export type FaceKey = 'R'|'O'|'W'|'Y'|'G'|'B';
export type Axis = 'X'|'Y'|'Z';

export const FACE_COLORS: Record<FaceKey, string> = {
    R: "#FF2A2A", O: "#FF6A00", W: "#FFFFFF",
    Y: "#FFF200", G: "#1FD400", B: "#0052cc"
};
export const DARK = "#0e0e16";

export const rx = ([x,y,z]: Vec3, a: number): Vec3 => { const c=Math.cos(a),s=Math.sin(a); return [x,y*c-z*s,y*s+z*c]; };
export const ry = ([x,y,z]: Vec3, a: number): Vec3 => { const c=Math.cos(a),s=Math.sin(a); return [x*c+z*s,y,-x*s+z*c]; };
export const rz = ([x,y,z]: Vec3, a: number): Vec3 => { const c=Math.cos(a),s=Math.sin(a); return [x*c-y*s,x*s+y*c,z]; };
export const rot = (v: Vec3, ax: Axis, a: number): Vec3 => ax === "X" ? rx(v,a) : ax === "Y" ? ry(v,a) : rz(v,a);
export const snap = (v: Vec3): Vec3 => v.map(n=>Math.round(n)) as Vec3;

/** Face normals, indexed the same way as a piece's `stickers` array. */
export const N6: Vec3[] = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];

export type Piece = { pos: Vec3; stickers: (FaceKey | null)[] };

export function buildSolved(): Piece[] {
    const out: Piece[] = [];
    for (let x=-1;x<=1;x++) for (let y=-1;y<=1;y++) for (let z=-1;z<=1;z++) {
        out.push({ pos:[x,y,z] as Vec3, stickers:[
                x===1?"R":null, x===-1?"O":null,
                y===1?"W":null, y===-1?"Y":null,
                z===1?"G":null, z===-1?"B":null,
            ]});
    }
    return out;
}

/** Rotates one layer by `angle` (any multiple of 90°), returning a new piece array. */
export function applyMove(pieces: Piece[], axis: Axis, layer: number, angle: number): Piece[] {
    return pieces.map(({pos,stickers})=>{
        const coord = axis === "X" ? pos[0] : axis === "Y" ? pos[1] : pos[2];
        if (Math.round(coord) !== layer) return {pos,stickers};
        const np = snap(rot(pos,axis,angle));
        const ns: (FaceKey|null)[] = [null,null,null,null,null,null];
        for (let i=0;i<6;i++) {
            if (!stickers[i]) continue;
            const rn = snap(rot(N6[i],axis,angle));
            const di = N6.findIndex(n=>n[0]===rn[0]&&n[1]===rn[1]&&n[2]===rn[2]);
            if (di>=0) ns[di] = stickers[i];
        }
        return {pos:np,stickers:ns};
    });
}

export type Move = { axis: Axis, layer: number, angle: number };

/* ── Standard face-move notation ───────────────────────────────────────── */

export type Face = 'U' | 'D' | 'R' | 'L' | 'F' | 'B';
/** A face turn: `n` is quarter-turns clockwise-from-outside (1, 2 or 3). */
export type FaceMove = { face: Face; n: 1 | 2 | 3 };

export const FACES: Face[] = ['U', 'D', 'R', 'L', 'F', 'B'];

const Q = Math.PI / 2;

/**
 * Which layer each face occupies, and the sign that makes a positive `n` read as
 * clockwise *looking at that face from outside*. Rotations follow the right-hand
 * rule, so the positive layer of each axis turns negative and vice versa.
 */
const FACE_SPEC: Record<Face, { axis: Axis; layer: number; sign: -1 | 1 }> = {
    U: { axis: 'Y', layer:  1, sign: -1 },
    D: { axis: 'Y', layer: -1, sign:  1 },
    R: { axis: 'X', layer:  1, sign: -1 },
    L: { axis: 'X', layer: -1, sign:  1 },
    F: { axis: 'Z', layer:  1, sign: -1 },
    B: { axis: 'Z', layer: -1, sign:  1 },
};

export function faceMoveToMove({ face, n }: FaceMove): Move {
    const { axis, layer, sign } = FACE_SPEC[face];
    // Animate a counter-clockwise turn as -90°, not +270°. Both land on the same
    // permutation, but the long way round reads as three moves instead of one.
    const quarters = n === 3 ? -1 : n;
    return { axis, layer, angle: sign * quarters * Q };
}

/**
 * The reverse mapping, for recording what the user turned by hand. Returns null for
 * middle-slice turns, which are not face moves — they reposition the centres, and the
 * solver's whole notion of "home" assumes centres never move.
 */
export function moveToFaceMove(axis: Axis, layer: number, angle: number): FaceMove | null {
    const face = FACES.find((f) => FACE_SPEC[f].axis === axis && FACE_SPEC[f].layer === layer);
    if (!face) return null;
    let n = Math.round(angle / Q) * FACE_SPEC[face].sign % 4;
    if (n < 0) n += 4;
    return n === 0 ? null : { face, n: n as 1 | 2 | 3 };
}

export function applyFaceMove(pieces: Piece[], fm: FaceMove): Piece[] {
    const m = faceMoveToMove(fm);
    return applyMove(pieces, m.axis, m.layer, m.angle);
}

export function applyFaceMoves(pieces: Piece[], seq: FaceMove[]): Piece[] {
    return seq.reduce(applyFaceMove, pieces);
}

export const invertFaceMove = ({ face, n }: FaceMove): FaceMove =>
    ({ face, n: (4 - n) as 1 | 2 | 3 });

export const invertSequence = (seq: FaceMove[]): FaceMove[] =>
    [...seq].reverse().map(invertFaceMove);

/** Parses "R U R' U2" into face moves. Used by the solver's algorithm tables. */
export function parseMoves(s: string): FaceMove[] {
    return s.trim().split(/\s+/).filter(Boolean).map((tok) => {
        const face = tok[0] as Face;
        if (!FACES.includes(face)) throw new Error(`bad face in "${tok}"`);
        const suffix = tok.slice(1);
        const n = suffix === "'" ? 3 : suffix === '2' ? 2 : suffix === '' ? 1 : NaN;
        if (!n) throw new Error(`bad modifier in "${tok}"`);
        return { face, n: n as 1 | 2 | 3 };
    });
}

export const formatMoves = (seq: FaceMove[]): string =>
    seq.map(({ face, n }) => face + (n === 1 ? '' : n === 2 ? '2' : "'")).join(' ');

/** Collapses consecutive turns of the same face, repeatedly, until nothing changes. */
export function simplify(seq: FaceMove[]): FaceMove[] {
    const out: FaceMove[] = [];
    for (const mv of seq) {
        const prev = out[out.length - 1];
        if (prev && prev.face === mv.face) {
            const n = (prev.n + mv.n) % 4;
            out.pop();
            if (n !== 0) out.push({ face: mv.face, n: n as 1 | 2 | 3 });
        } else {
            out.push(mv);
        }
    }
    // One pass can expose new adjacencies (e.g. R U U' R' → R R' → nothing).
    return out.length === seq.length ? out : simplify(out);
}

export function isSolved(pieces: Piece[]): boolean {
    for (const { pos, stickers } of pieces) {
        for (let slot = 0; slot < 6; slot++) {
            const key = stickers[slot];
            if (!key) continue;
            // A sticker is home when its slot's outward normal matches the face it belongs to.
            const n = N6[slot];
            const solvedKey =
                n[0] === 1 ? 'R' : n[0] === -1 ? 'O' :
                n[1] === 1 ? 'W' : n[1] === -1 ? 'Y' :
                n[2] === 1 ? 'G' : 'B';
            if (key !== solvedKey) return false;
            // ...and the piece itself is on that face.
            if (pos[0] * n[0] + pos[1] * n[1] + pos[2] * n[2] !== 1) return false;
        }
    }
    return true;
}

/**
 * Easter egg: the cube opens on Stian's personal-best scramble — the one he solved
 * in 7.6 seconds — rather than a random one. Anyone who recognises it, recognises it.
 */
export const PB_SCRAMBLE = "B F2 R2 D' F2 L2 U' F2 U' L2 B2 R2 F' L2 B' L' D' F' L' F2";

export function randomScramble(len = 25, rnd: () => number = Math.random): FaceMove[] {
    const out: FaceMove[] = [];
    let last: Face | null = null;
    while (out.length < len) {
        const face = FACES[Math.floor(rnd() * 6)];
        if (face === last) continue;     // avoid trivially collapsible pairs
        last = face;
        out.push({ face, n: (1 + Math.floor(rnd() * 3)) as 1 | 2 | 3 });
    }
    return out;
}

/* ── Scroll playback ───────────────────────────────────────────────────── */

/**
 * A solve, expanded into per-move keyframes so scroll position can index into it
 * directly (and run backwards when the user scrolls up).
 */
export type Playback = {
    base: Piece[];
    /** The solve in face notation, kept so callers can reconstruct the exact move
     *  history of any keyframe they take over from. */
    solution: FaceMove[];
    moves: Move[];
    keyframes: Piece[][];
};

/** Expands a move sequence applied to `base` into keyframes. */
export function buildPlayback(base: Piece[], solution: FaceMove[]): Playback {
    const moves: Move[] = solution.map(faceMoveToMove);
    const keyframes: Piece[][] = [base];
    let s = base;
    for (const m of moves) {
        s = applyMove(s, m.axis, m.layer, m.angle);
        keyframes.push(s);
    }
    return { base, solution, moves, keyframes };
}

/**
 * How far the U (white) centre has been twisted by a move sequence.
 *
 * A centre carries a single sticker, so its spin is invisible to `Piece` state —
 * but it is visible on a logo printed there. Only U turns move the U centre: every
 * other face either excludes it (D) or has it on the zero layer (R/L/F/B).
 */
export function centreTwist(moves: FaceMove[]): number {
    let a = 0;
    for (const m of moves) if (m.face === 'U') a += faceMoveToMove(m).angle;
    return a;
}

/** Which keyframe index `sp` currently sits on. */
export function keyframeIndex(pb: Playback, sp: number): number {
    const N = pb.moves.length;
    if (N === 0) return 0;
    return Math.floor(Math.min(Math.max(sp, 0) * N, N - 0.0001));
}

/**
 * Resolves scroll progress `sp` (0..1) to the keyframe being played, the move in
 * flight, and how far through that move we are.
 */
export function resolveScroll(pb: Playback, sp: number): { pieces: Piece[]; move: Move | undefined; t: number } {
    const N = pb.moves.length;
    if (N === 0) return { pieces: pb.keyframes[0], move: undefined, t: 0 };
    const raw = Math.min(Math.max(sp, 0) * N, N - 0.0001);
    const ki = Math.floor(raw);
    return { pieces: pb.keyframes[ki], move: pb.moves[ki], t: raw - ki };
}

/** Screen scale in px per cube unit — the framing the canvas-2D renderer established. */
export function cubeScale(W: number, H: number): number {
    return W < 768 ? W * 0.19 : Math.min(W, H) * 0.16;
}

/** Camera distance baked into the 2D renderer's perspective divide `6/(6+z)`. */
export const CAMERA_DISTANCE = 6;
