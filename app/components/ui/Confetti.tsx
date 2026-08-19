"use client";

import { useEffect, useRef } from "react";
import { FACE_COLORS } from "../cube/state";

/*
 * A one-shot burst for the moment the cube is solved by hand. Deliberately small:
 * the cube is the payoff, this just marks it. Canvas rather than DOM nodes so the
 * whole thing is one compositor layer that disposes itself when the run ends.
 */

// The cube's own faces — the confetti reads as pieces of it coming apart.
const COLORS = Object.values(FACE_COLORS);
const COUNT = 70;
const DURATION = 2200;
const GRAVITY = 0.00075;   // px per ms²
const DRAG = 0.9985;

interface Piece {
    x: number; y: number;
    vx: number; vy: number;
    rot: number; vrot: number;
    w: number; h: number;
    color: string;
}

export default function Confetti({ onDone }: { onDone?: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // Held in a ref so an inline arrow from the parent can't restart the animation.
    const onDoneRef = useRef(onDone);
    useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            onDoneRef.current?.();
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) { onDoneRef.current?.(); return; }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0, h = 0;
        const resize = () => {
            w = window.innerWidth; h = window.innerHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        // Burst from the middle of the viewport, where the cube sits.
        const ox = w / 2, oy = h / 2;
        const pieces: Piece[] = Array.from({ length: COUNT }, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.18 + Math.random() * 0.42;
            return {
                x: ox + (Math.random() - 0.5) * 60,
                y: oy + (Math.random() - 0.5) * 60,
                vx: Math.cos(angle) * speed,
                // Biased upward so it arcs before falling, rather than just dropping.
                vy: Math.sin(angle) * speed - 0.28,
                rot: Math.random() * Math.PI,
                vrot: (Math.random() - 0.5) * 0.012,
                w: 5 + Math.random() * 5,
                h: 8 + Math.random() * 6,
                color: COLORS[(Math.random() * COLORS.length) | 0],
            };
        });

        let raf = 0;
        let last = performance.now();
        const start = last;

        const frame = (now: number) => {
            const dt = Math.min(now - last, 48);   // clamp so a backgrounded tab can't teleport them
            last = now;
            const elapsed = now - start;

            if (elapsed >= DURATION) {
                ctx.clearRect(0, 0, w, h);
                onDoneRef.current?.();
                return;
            }

            // Hold full opacity, then fade over the last third.
            const fade = elapsed < DURATION * 0.66 ? 1 : 1 - (elapsed - DURATION * 0.66) / (DURATION * 0.34);

            ctx.clearRect(0, 0, w, h);
            ctx.globalAlpha = fade;
            for (const p of pieces) {
                p.vy += GRAVITY * dt;
                p.vx *= DRAG;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.rot += p.vrot * dt;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;
                // Squash on rotation so each piece reads as a flat flake turning over.
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot)));
                ctx.restore();
            }
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);

        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-50"
        />
    );
}
