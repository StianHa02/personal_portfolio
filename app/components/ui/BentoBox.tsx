"use client";

import { ReactNode } from "react";

interface BentoBoxProps {
    title?: string | ReactNode;
    children: ReactNode;
    className?: string;
    accent?: boolean;
}

export function BentoBox({ title, children, className = ""}: BentoBoxProps) {
    return (
        <div
            className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 bg-[#0b0b12] border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.4)] ${className}`}
        >
            <div className="relative flex flex-col gap-6 pt-8 px-9 pb-10">
                {title && (
                    <div
                        className="text-[0.6rem] tracking-[0.35em] uppercase font-medium text-white/[0.55] [font-family:var(--font-inter),sans-serif]"
                    >
                        {title}
                    </div>
                )}
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
