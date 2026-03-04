"use client";

import React from "react";

interface NavSection { id: string; label: string }

interface RightDotNavProps {
    sections: NavSection[];
    activeSection: string;
    solved: boolean;
    onNavigate: (id: string) => void;
}

export default function RightDotNav({ sections, activeSection, solved, onNavigate }: RightDotNavProps) {
    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-6">
            <div className="absolute top-0 bottom-0 w-px bg-white/10" />
            {sections.map(section => {
                const isActive = activeSection === section.id;
                const isContact = section.id === "footer";
                return (
                    <button
                        key={section.id}
                        onClick={() => onNavigate(section.id)}
                        className="relative z-10 cursor-pointer group flex items-center justify-center"
                        aria-label={section.label}
                    >
                        <div
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: isActive ? 12 : 8,
                                height: isActive ? 12 : 8,
                                background: isActive ? (isContact && solved ? "#fcd435" : "#ffffff") : "rgba(255,255,255,0.25)",
                                boxShadow: isActive
                                    ? (isContact && solved ? "0 0 8px rgba(252,212,53,0.7)" : "0 0 6px rgba(255,255,255,0.4)")
                                    : "none",
                            }}
                        />

                        <span
                            className={`pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 text-[0.6rem] tracking-[0.2em] uppercase whitespace-nowrap transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            style={{ fontFamily: "var(--font-inter), sans-serif", color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)", fontWeight: isActive ? 500 : 400 }}
                        >
                            {section.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

