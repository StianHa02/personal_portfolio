"use client"

import React, { useEffect, useRef, useCallback } from "react";

type Vec3 = [number, number, number];
type FaceKey = 'R'|'O'|'W'|'Y'|'G'|'B';
type Axis = 'X'|'Y'|'Z';

const FACE_COLORS: Record<FaceKey, string> = {
    R: "#FF2A2A", O: "#FF6A00", W: "#FFFFFF",
    Y: "#FFF200", G: "#00C853E6", B: "#0052cc"
};
const DARK = "#0e0e16";

const rx = ([x,y,z]: Vec3, a: number): Vec3 => { const c=Math.cos(a),s=Math.sin(a); return [x,y*c-z*s,y*s+z*c]; };
const ry = ([x,y,z]: Vec3, a: number): Vec3 => { const c=Math.cos(a),s=Math.sin(a); return [x*c+z*s,y,-x*s+z*c]; };
const rz = ([x,y,z]: Vec3, a: number): Vec3 => { const c=Math.cos(a),s=Math.sin(a); return [x*c-y*s,x*s+y*c,z]; };
const rot = (v: Vec3, ax: Axis, a: number): Vec3 => ax === "X" ? rx(v,a) : ax === "Y" ? ry(v,a) : rz(v,a);
const snap = (v: Vec3): Vec3 => v.map(n=>Math.round(n)) as Vec3;
const proj = ([x,y,z]: Vec3, sc: number, cx: number, cy: number): [number, number] => { const d=6/(6+z+0.001); return [cx+x*sc*d,cy-y*sc*d]; };

const N6: Vec3[] = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const B = 0.5;
const FACE_VERTS_FULL: Vec3[][] = [
    [[B,B,-B],[B,B,B],[B,-B,B],[B,-B,-B]],
    [[-B,B,B],[-B,B,-B],[-B,-B,-B],[-B,-B,B]],
    [[-B,B,B],[B,B,B],[B,B,-B],[-B,B,-B]],
    [[-B,-B,-B],[B,-B,-B],[B,-B,B],[-B,-B,B]],
    [[B,B,B],[-B,B,B],[-B,-B,B],[B,-B,B]],
    [[-B,B,-B],[B,B,-B],[B,-B,-B],[-B,-B,-B]],
];

const S = 0.42;
const FACE_VERTS_STICKER: Vec3[][] = [
    [[B,S,-S],[B,S,S],[B,-S,S],[B,-S,-S]],
    [[-B,S,S],[-B,S,-S],[-B,-S,-S],[-B,-S,S]],
    [[-S,B,S],[S,B,S],[S,B,-S],[-S,B,-S]],
    [[-S,-B,-S],[S,-B,-S],[S,-B,S],[-S,-B,S]],
    [[S,S,B],[-S,S,B],[-S,-S,B],[S,-S,B]],
    [[-S,S,-B],[S,S,-B],[S,-S,-B],[-S,-S,-B]],
];

type Piece = { pos: Vec3; stickers: (FaceKey | null)[] };

function buildSolved(): Piece[] {
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

function applyMove(pieces: Piece[], axis: Axis, layer: number, angle: number): Piece[] {
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

const MOVES: {axis: Axis, layer: number, angle: number}[] = [
    {axis:"Y",layer: 1,angle:-Math.PI/2},
    {axis:"X",layer:-1,angle: Math.PI/2},
    {axis:"Z",layer: 1,angle:-Math.PI/2},
    {axis:"Y",layer:-1,angle:-Math.PI/2},
    {axis:"X",layer: 1,angle: Math.PI/2},
    {axis:"Z",layer:-1,angle:-Math.PI/2},
    {axis:"Y",layer: 1,angle: Math.PI/2},
    {axis:"X",layer: 1,angle:-Math.PI/2},
];

const KF = (() => {
    let s = buildSolved();
    for (const m of [...MOVES].reverse()) s = applyMove(s,m.axis,m.layer,-m.angle);
    const kf = [s];
    for (const m of MOVES) { s = applyMove(s,m.axis,m.layer,m.angle); kf.push(s); }
    return kf;
})();

function drawRoundedQuad(ctx: CanvasRenderingContext2D, pts: [number,number][], r: number) {
    const len = pts.length;
    ctx.beginPath();
    for (let i = 0; i < len; i++) {
        const prev = pts[(i - 1 + len) % len];
        const curr = pts[i];
        const next = pts[(i + 1) % len];
        const dx1 = prev[0] - curr[0], dy1 = prev[1] - curr[1];
        const dx2 = next[0] - curr[0], dy2 = next[1] - curr[1];
        const l1 = Math.sqrt(dx1*dx1 + dy1*dy1);
        const l2 = Math.sqrt(dx2*dx2 + dy2*dy2);
        const maxR = Math.min(r, l1 * 0.4, l2 * 0.4);
        const p1: [number,number] = [curr[0] + dx1/l1 * maxR, curr[1] + dy1/l1 * maxR];
        const p2: [number,number] = [curr[0] + dx2/l2 * maxR, curr[1] + dy2/l2 * maxR];
        if (i === 0) ctx.moveTo(p1[0], p1[1]);
        else ctx.lineTo(p1[0], p1[1]);
        ctx.quadraticCurveTo(curr[0], curr[1], p2[0], p2[1]);
    }
    ctx.closePath();
}

/**
 * Draws an image mapped onto a quad using two affine-mapped triangles.
 * pts: [topLeft, topRight, bottomRight, bottomLeft] projected screen coords.
 * The image is first drawn as white background, then the logo on top.
 */
function drawImageOnQuad(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    pts: [number,number][],
    cornerR: number
) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    // Draw white rounded quad background first
    drawRoundedQuad(ctx, pts, cornerR);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Helper: draw image mapped onto triangle [d0,d1,d2] from image [s0,s1,s2] (in px)
    const drawTriangle = (
        d0: [number,number], d1: [number,number], d2: [number,number],
        s0: [number,number], s1: [number,number], s2: [number,number]
    ) => {
        // Affine transform: maps s0->d0, s1->d1, s2->d2
        // [d] = M * [s] + t
        // Solve: [d1-d0] = M*[s1-s0], [d2-d0] = M*[s2-s0]
        const ax = s1[0]-s0[0], ay = s1[1]-s0[1];
        const bx = s2[0]-s0[0], by = s2[1]-s0[1];
        const det = ax*by - ay*bx;
        if (Math.abs(det) < 0.0001) return;
        // Inverse: maps d coords back to s
        // We want the transform T such that T * s = d
        // i.e., given s, produce d
        // dx = a*(sx-s0x) + b*(sy-s0y) + d0x   where a,b are columns of M
        const dx1 = d1[0]-d0[0], dy1 = d1[1]-d0[1];
        const dx2 = d2[0]-d0[0], dy2 = d2[1]-d0[1];
        // setTransform(a,b,c,d,e,f) applies: x' = a*x + c*y + e, y' = b*x + d*y + f
        // We want: dest = M * src where src is in image coords
        // M = [[m00, m01],[m10, m11]]
        // m00*(ax)+m01*(ay) = dx1 => col from s-space
        // Actually: [dx1,dy1] = M * [ax,ay], [dx2,dy2] = M * [bx,by]
        // M = [[dx1,dx2],[dy1,dy2]] * inv([[ax,bx],[ay,by]])
        const invDet = 1/det;
        const m00 = (dx1*by - dx2*ay)*invDet;
        const m10 = (dy1*by - dy2*ay)*invDet;
        const m01 = (dx2*ax - dx1*bx)*invDet;
        const m11 = (dy2*ax - dy1*bx)*invDet;
        const tx = d0[0] - m00*s0[0] - m01*s0[1];
        const ty = d0[1] - m10*s0[0] - m11*s0[1];

        ctx.save();
        // Clip to this triangle
        ctx.beginPath();
        ctx.moveTo(d0[0], d0[1]);
        ctx.lineTo(d1[0], d1[1]);
        ctx.lineTo(d2[0], d2[1]);
        ctx.closePath();
        ctx.clip();
        // Apply transform and draw image
        ctx.transform(m00, m10, m01, m11, tx, ty);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    };

    // Add small inset padding so logo doesn't bleed to sticker edge
    const pad = 0.08;
    const lerp = (a:[number,number], b:[number,number], t:number): [number,number] =>
        [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];

    // Inset pts slightly from center
    const center: [number,number] = [
        (pts[0][0]+pts[1][0]+pts[2][0]+pts[3][0])/4,
        (pts[0][1]+pts[1][1]+pts[2][1]+pts[3][1])/4,
    ];
    const inset = pts.map(p => lerp(p, center, pad)) as [number,number][];

    // Map image corners onto inset quad via two triangles
    // Quad order: [0]=TL, [1]=TR, [2]=BR, [3]=BL
    // Triangle 1: TL, TR, BL  →  (0,0),(iw,0),(0,ih)
    drawTriangle(inset[0], inset[1], inset[3], [0,0], [iw,0], [0,ih]);
    // Triangle 2: TR, BR, BL  →  (iw,0),(iw,ih),(0,ih)
    drawTriangle(inset[1], inset[2], inset[3], [iw,0], [iw,ih], [0,ih]);
}

type Quad = {
    pts: [number,number][];
    color: string;
    z: number;
    rounded: boolean;
    isLogo?: boolean;
};

function drawScene(
    ctx: CanvasRenderingContext2D,
    W: number, H2: number,
    sp: number,
    autoRY: number, autoRX: number,
    logoImg: HTMLImageElement | null
) {
    ctx.clearRect(0,0,W,H2);
    ctx.fillStyle = DARK;
    ctx.fillRect(0,0,W,H2);

    const N = KF.length - 1;
    const raw = Math.min(sp*N, N - 0.0001);
    const ki = Math.floor(raw);
    const t = raw - ki;
    const mv = MOVES[ki];
    const pieces = KF[ki];

    const isMobile = W < 768;
    const sc = isMobile ? W*0.22 : Math.min(W,H2)*0.14;
    const cx = isMobile ? W/2 : W * 0.55;
    const cy = isMobile ? H2*0.42 : H2 / 2;
    const cornerR = sc * 0.06;

    const quads: Quad[] = [];

    for (const {pos,stickers} of pieces) {
        // Identify the center white piece (pos=[0,1,0] in solved state)
        // We check the current pos after keyframe interpolation — the center
        // white piece stays at [0,1,0] regardless of moves since it's the
        // center cubie of the top face (never moved by the MOVES sequence).
        const isCenterWhite =
            pos[0] === 0 && pos[1] === 1 && pos[2] === 0;

        for (let fi = 0; fi < 6; fi++) {
            const coord = mv ? (mv.axis === "X" ? pos[0] : mv.axis === "Y" ? pos[1] : pos[2]) : 0;
            const moving = mv ? Math.round(coord) === mv.layer : false;
            const la = moving ? mv.angle * t : 0;

            let n: Vec3 = [...N6[fi]] as Vec3;
            if (moving) n = rot(n, mv.axis, la);
            n = rx(n, autoRX); n = ry(n, autoRY);
            if (n[2] >= 0) continue;

            const fullVerts: Vec3[] = FACE_VERTS_FULL[fi].map(([ox,oy,oz]) => {
                let v: Vec3 = [pos[0] + ox, pos[1] + oy, pos[2] + oz];
                if (moving) v = rot(v, mv.axis, la);
                v = rx(v, autoRX); v = ry(v, autoRY);
                return v;
            });
            const fullZ = fullVerts.reduce((s, v) => s + v[2], 0) / 4;
            const fullPts = fullVerts.map(v => proj(v, sc, cx, cy));
            quads.push({ pts: fullPts, color: "#1a1a1a", z: fullZ, rounded: false });

            if (stickers[fi]) {
                const stickerVerts: Vec3[] = FACE_VERTS_STICKER[fi].map(([ox,oy,oz]) => {
                    let v: Vec3 = [pos[0] + ox, pos[1] + oy, pos[2] + oz];
                    if (moving) v = rot(v, mv.axis, la);
                    v = rx(v, autoRX); v = ry(v, autoRY);
                    return v;
                });
                const stickerZ = stickerVerts.reduce((s, v) => s + v[2], 0) / 4;
                const stickerPts = stickerVerts.map(v => proj(v, sc, cx, cy));

                // fi===2 is the +Y (white/top) face
                const isLogoSticker = isCenterWhite && fi === 2 && logoImg !== null;

                quads.push({
                    pts: stickerPts,
                    color: FACE_COLORS[stickers[fi] as FaceKey],
                    z: stickerZ - 0.001,
                    rounded: true,
                    isLogo: isLogoSticker,
                });
            }
        }
    }

    quads.sort((a,b)=>b.z-a.z);

    for (const {pts,color,rounded,isLogo} of quads) {
        if (isLogo && logoImg) {
            drawImageOnQuad(ctx, logoImg, pts as [number,number][], cornerR);
        } else if (rounded) {
            drawRoundedQuad(ctx, pts as [number,number][], cornerR);
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }
    }
}

export default function CubeRenderer({
                                         sp,
                                         opacity = 1,
                                         logoSrc,
                                     }: {
    sp: number;
    opacity?: number;
    /** Optional URL/path to the logo image to render on the center white sticker */
    logoSrc?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const rafRef = useRef<number | null>(null);
    const ryRef = useRef<number>(0.5);
    const lastTs = useRef<number | null>(null);
    const spRef = useRef<number>(sp);
    const logoImgRef = useRef<HTMLImageElement | null>(null);

    // Update spRef when sp changes
    useEffect(() => {
        spRef.current = sp;
    }, [sp]);

    // Load logo image
    useEffect(() => {
        if (!logoSrc) { logoImgRef.current = null; return; }
        const img = new Image();
        img.onload = () => { logoImgRef.current = img; };
        img.onerror = () => { logoImgRef.current = null; };
        img.src = logoSrc;
    }, [logoSrc]);

    const resize = useCallback(()=>{
        const c = canvasRef.current; if(!c) return;
        const dpr = window.devicePixelRatio || 1;
        const vw = window.visualViewport?.width ?? window.innerWidth;
        const vh = window.visualViewport?.height ?? window.innerHeight;
        c.width = Math.floor(vw * dpr);
        c.height = Math.floor(vh * dpr);
        c.style.width = vw + "px";
        c.style.height = vh + "px";
        const ctx = c.getContext("2d");
        if (!ctx) return;
        if (typeof ctx.resetTransform === "function") ctx.resetTransform();
        if (typeof ctx.setTransform === "function") ctx.setTransform(dpr,0,0,dpr,0,0);
        else ctx.scale(dpr,dpr);
        ctxRef.current = ctx;
        lastTs.current = null;
    },[]);

    const loop = useCallback((ts:number) => {
        if (!lastTs.current) lastTs.current = ts;
        const dt = (ts - lastTs.current) / 1000;
        lastTs.current = ts;
        ryRef.current += dt * 0.22;
        const c = canvasRef.current;
        const ctx = ctxRef.current;
        if (c && ctx) {
            const dpr = window.devicePixelRatio || 1;
            drawScene(ctx, c.width / dpr, c.height / dpr, spRef.current, ryRef.current, -0.38, logoImgRef.current);
        }
        // eslint-disable-next-line react-hooks/immutability
        rafRef.current = requestAnimationFrame(loop);
    },[]);

    useEffect(()=>{
        resize();
        window.addEventListener("resize", resize);
        window.visualViewport?.addEventListener("resize", resize);
        rafRef.current = requestAnimationFrame(loop);
        return ()=>{
            window.removeEventListener("resize", resize);
            window.visualViewport?.removeEventListener("resize", resize);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            ctxRef.current = null;
        };
    },[resize, loop]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', top: 0, left: 0, zIndex: 0,
                display: 'block', opacity,
                transition: 'opacity 0.6s ease',
            }}
        />
    );
}