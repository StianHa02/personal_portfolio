"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "motion/react";
import { focusRing } from "./styles";

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
// Each row is `pr-3`, so a dot's centre sits this far in from the column's right edge.
// The track is positioned off the same number rather than a hardcoded one, otherwise
// the two drift apart the moment DOT_SIZE or the padding changes.
const DOT_INSET = 12;
const TRACK_W = 1;
const DOT_CENTRE = DOT_INSET + DOT_SIZE / 2;
// Deliberately opaque rather than a translucent ink token: the track line runs behind
// the dots, and any alpha here lets it show straight through them. This is the flat
// equivalent of rgba(237,233,223,0.38) over --color-page.
const INACTIVE_DOT = "#636161";

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
                className="absolute bg-line-strong"
                style={{
                    width: TRACK_W,
                    top: ROW_HEIGHT / 2 + DOT_SIZE / 2,
                    height: totalHeight - DOT_SIZE,
                    right: DOT_CENTRE - TRACK_W / 2,
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
                            className={`${focusRing} rounded-sm flex h-8 items-center gap-2 pr-3 ${isActive ? "cursor-default" : "cursor-pointer"}`}
                            aria-label={section.label}
                        >
                            {/* Label */}
                            <span
                                className="pointer-events-none text-[0.7rem] tracking-[0.2em] uppercase whitespace-nowrap transition-[opacity,transform] duration-200"
                                style={{
                                    color: isActive
                                        ? "var(--color-ink)"
                                        : "var(--color-ink-soft)",
                                    fontWeight: isActive ? 600 : 500,
                                    opacity: hovered || isActive ? 1 : 0,
                                    transform: `translateX(${hovered || isActive ? 0 : 6}px)`,
                                }}
                            >
                                {section.label}
                            </span>

                            <motion.div
                                className="w-2 h-2 shrink-0 rounded-full"
                                animate={{
                                    scale: hoveredIndex === i
                                        ? (ACTIVE_SIZE + 6) / DOT_SIZE
                                        : isActive
                                        ? ACTIVE_SIZE / DOT_SIZE
                                        : 1,
                                    background: isActive ? "var(--color-ink)" : INACTIVE_DOT,
                                    boxShadow: isActive
                                        ? "0 0 8px rgba(237,233,223,0.45)"
                                        : hoveredIndex === i
                                        ? "0 0 6px rgba(237,233,223,0.2)"
                                        : "0 0 0px rgba(237,233,223,0)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 25,
                                }}
                            />
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}
