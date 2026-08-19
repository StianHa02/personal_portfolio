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
            className={`group relative rounded-lg overflow-hidden bg-card border border-line shadow-card ${className}`}
        >
            <div className="relative flex flex-col gap-6 p-7">
                {title && (
                    <div
                        className="text-[0.75rem] tracking-[0.35em] uppercase font-medium text-ink-faint"
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
