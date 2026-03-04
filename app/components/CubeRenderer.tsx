"use client"

import React, { useEffect, useRef, useCallback } from "react";

type Vec3 = [number, number, number];
type FaceKey = 'R'|'O'|'W'|'Y'|'G'|'B';
type Axis = 'X'|'Y'|'Z';

const FACE_COLORS: Record<FaceKey, string> = {
    R: "#FF2A2A", O: "#FF6A00", W: "#FFFFFF",
    Y: "#FFF200", G: "rgba(0,200,83,0.9)", B: "#0052cc"
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

function buildSolved() {
    const out:any[] = [];
    for (let x=-1;x<=1;x++) for (let y=-1;y<=1;y++) for (let z=-1;z<=1;z++) {
        out.push({ pos:[x,y,z], stickers:[
                x===1?"R":null, x===-1?"O":null,
                y===1?"W":null, y===-1?"Y":null,
                z===1?"G":null, z===-1?"B":null,
            ]});
    }
    return out;
}

function applyMove(pieces: {pos: Vec3, stickers: (FaceKey|null)[]}[], axis: Axis, layer: number, angle: number) {
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

function drawScene(ctx: CanvasRenderingContext2D, W:number, H2:number, sp:number, autoRY:number, autoRX:number) {
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
    const sc = isMobile ? W*0.22 : Math.min(W,H2)*0.16;
    const cx = W/2;
    const cy = isMobile ? H2*0.42 : H2/2;
    const cornerR = sc * 0.06;

    const quads: {pts:[number,number][], color:string, z:number, rounded:boolean}[] = [];

    for (const {pos,stickers} of pieces) {
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
                quads.push({ pts: stickerPts, color: FACE_COLORS[stickers[fi] as FaceKey], z: stickerZ - 0.001, rounded: true });
            }
        }
    }

    quads.sort((a,b)=>b.z-a.z);
    for (const {pts,color,rounded} of quads) {
        if (rounded) drawRoundedQuad(ctx, pts, cornerR);
        else {
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
            ctx.closePath();
        }
        ctx.fillStyle = color;
        ctx.fill();
    }
}

export default function CubeRenderer({ sp }: { sp: number }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const rafRef = useRef<number | null>(null);
    const ryRef = useRef<number>(0.5);
    const lastTs = useRef<number | null>(null);

    const resize = useCallback(()=>{
        const c = canvasRef.current; if(!c) return;
        const dpr = window.devicePixelRatio || 1;
        c.width = Math.floor(window.innerWidth * dpr);
        c.height = Math.floor(window.innerHeight * dpr);
        c.style.width = window.innerWidth + "px";
        c.style.height = window.innerHeight + "px";
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
            drawScene(ctx, c.width / dpr, c.height / dpr, sp, ryRef.current, -0.38);
        }
        rafRef.current = requestAnimationFrame(loop);
    },[sp]);

    useEffect(()=>{
        resize();
        window.addEventListener("resize", resize);
        rafRef.current = requestAnimationFrame(loop);
        return ()=>{
            window.removeEventListener("resize", resize);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            ctxRef.current = null;
        };
    },[resize, loop]);

    return (
        <canvas ref={canvasRef} style={{position: 'fixed', top: 0, left: 0, zIndex: 0, display: 'block'}} />
    );
}

