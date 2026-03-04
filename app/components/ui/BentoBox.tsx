"use client";

import { ReactNode } from "react";

interface BentoBoxProps {
    title?: string | ReactNode;
    children: ReactNode;
    className?: string;
    accent?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BentoBox({ title, children, className = "", accent = false }: BentoBoxProps) {
    return (
        <div
            className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 ${className}`}
            style={{
                backgroundColor: "#0b0b12",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
        >
            <div className="relative flex flex-col gap-6" style={{ padding: "2rem 2.25rem 2.5rem" }}>
                {title && (
                    <p
                        className="text-[0.6rem] tracking-[0.4em] uppercase font-medium"
                        style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            color: "rgba(255,255,255,0.55)",
                            letterSpacing: "0.35em",
                        }}
                    >
                        {title}
                    </p>
                )}
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}