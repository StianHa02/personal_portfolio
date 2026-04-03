"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "motion/react";

interface NavSection { id: string; label: string }

interface RightDotNavProps {
    sections: NavSection[];
    activeSection: string;
    solved: boolean;
    onNavigate: (id: string) => void;
}

const ROW_HEIGHT = 32;
const DOT_SIZE = 8;
const ACTIVE_SIZE = 13;

export default function RightDotNav({ sections, activeSection, onNavigate }: RightDotNavProps) {
    const [hovered, setHovered] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const activeIndex = sections.findIndex(s => s.id === activeSection);

    const targetY = activeIndex * ROW_HEIGHT;
    const springY = useSpring(targetY, { stiffness: 800, damping: 40, mass: 0.3 });

    const prevIndex = useRef(activeIndex);
    const springScale = useSpring(1, { stiffness: 1200, damping: 28, mass: 0.2 });

    useEffect(() => {
        if (prevIndex.current !== activeIndex) {
            springScale.set(0.6); // slight "pop" when switching
            prevIndex.current = activeIndex;
        }
        springY.set(targetY);
    }, [activeIndex, targetY, springY, springScale]);

    useEffect(() => {
        return springY.on("change", (v) => {
            if (Math.abs(v - targetY) < 2) {
                springScale.set(1);
            }
        });
    }, [springY, targetY, springScale]);

    const totalHeight = (sections.length - 1) * ROW_HEIGHT;

    return (
        <motion.div
            className="fixed right-6 top-1/2 z-50 hidden md:flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ marginTop: -totalHeight / 2 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Track line */}
            <div
                className="absolute bg-white/10"
                style={{
                    width: 1,
                    top: ROW_HEIGHT / 2 + DOT_SIZE / 2,
                    height: totalHeight - DOT_SIZE,
                    right: 15,
                }}
            />

            {/* Dots */}
            <div className="relative flex flex-col items-end">
                {sections.map((section, i) => {
                    const isActive = activeIndex === i;

                    return (
                        <button
                            key={section.id}
                            onClick={() => onNavigate(section.id)}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="flex items-center gap-2"
                            style={{ height: ROW_HEIGHT, paddingRight: 12, cursor: isActive ? "default" : "pointer" }}
                            aria-label={section.label}
                        >
                            {/* Label */}
                            <span
                                className="pointer-events-none text-[0.6rem] tracking-[0.2em] uppercase whitespace-nowrap"
                                style={{
                                    fontFamily: "var(--font-inter), sans-serif",
                                    color: isActive
                                        ? "rgba(255,255,255,0.9)"
                                        : "rgba(255,255,255,0.7)",
                                    fontWeight: isActive ? 500 : 400,
                                    opacity: hovered || isActive ? 1 : 0,
                                    transform: `translateX(${hovered || isActive ? 0 : 6}px)`,
                                    transition: "opacity 0.2s, transform 0.2s",
                                }}
                            >
                                {section.label}
                            </span>

                            <motion.div
                                className="rounded-full"
                                animate={{
                                    scale: hoveredIndex === i
                                        ? (ACTIVE_SIZE + 6) / DOT_SIZE
                                        : isActive
                                        ? ACTIVE_SIZE / DOT_SIZE
                                        : 1,
                                    background: isActive ? "#ffffff" : "#555555",
                                    boxShadow: isActive
                                        ? "0 0 8px rgba(255,255,255,0.5)"
                                        : hoveredIndex === i
                                        ? "0 0 6px rgba(255,255,255,0.15)"
                                        : "0 0 0px rgba(255,255,255,0)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 25,
                                }}
                                style={{
                                    width: DOT_SIZE,
                                    height: DOT_SIZE,
                                    flexShrink: 0,
                                }}
                            />
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}