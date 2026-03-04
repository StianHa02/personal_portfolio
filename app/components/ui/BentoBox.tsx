"use client";

import { ReactNode, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
});

interface BentoBoxProps {
    title?: string | ReactNode;
    children: ReactNode;
    className?: string;
    accent?: boolean;
}

export function BentoBox({ title, children, className = "", accent = false }: BentoBoxProps) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [spot, setSpot] = useState({ x: 0, y: 0, opacity: 0 });

    return (
        <div
            ref={boxRef}
            onMouseMove={e => {
                const r = boxRef.current?.getBoundingClientRect();
                if (r) setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, opacity: 1 });
            }}
            onMouseLeave={() => setSpot(p => ({ ...p, opacity: 0 }))}
            className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-0.5 ${className}`}
            style={{
                /* Fully opaque — cube never shows through */
                backgroundColor: "#0b0b12",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 2px 24px rgba(0,0,0,0.5)",
            }}
        >
            {/* Mouse spotlight */}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
                style={{
                    opacity: spot.opacity * 0.8,
                    background: `radial-gradient(320px circle at ${spot.x}px ${spot.y}px, rgba(237,233,223,0.05), transparent 70%)`,
                }}
            />

            {/* Top-edge shimmer on hover */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(237,233,223,0.22), transparent)" }}
            />

            {/* Corner accent marks */}
            {accent && (
                <>
                    <div className="pointer-events-none absolute top-0 left-0 h-px w-10 rounded-tl-2xl" style={{ background: "rgba(237,233,223,0.22)" }} />
                    <div className="pointer-events-none absolute top-0 left-0 w-px h-10" style={{ background: "rgba(237,233,223,0.22)" }} />
                </>
            )}

            <div className="relative p-6 md:p-7">
                {title && (
                    <p className={`mb-5 text-[0.55rem] tracking-[0.4em] uppercase font-light ${cormorant.className}`}
                       style={{ color: "rgba(255,255,255,0.28)" }}>
                        {title}
                    </p>
                )}
                {children}
            </div>
        </div>
    );
}