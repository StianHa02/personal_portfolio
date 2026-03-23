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
    const activeIndex = sections.findIndex(s => s.id === activeSection);

    const targetY = activeIndex * ROW_HEIGHT;
    const springY = useSpring(targetY, { stiffness: 800, damping: 40, mass: 0.3 });

    const prevIndex = useRef(activeIndex);
    const springScale = useSpring(1, { stiffness: 1200, damping: 28, mass: 0.2 });

    useEffect(() => {
        if (prevIndex.current !== activeIndex) {
            springScale.set(0.4);
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

    const activeColor = "#ffffff";
    const activeGlow = "0 0 6px rgba(255,255,255,0.4)";

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
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            />

            {/* Dot rows — each row is ROW_HEIGHT, dot + label centered within */}
            <div className="relative flex flex-col items-center">
                {sections.map((section, i) => (
                    <button
                        key={section.id}
                        onClick={() => onNavigate(section.id)}
                        className="relative cursor-pointer flex items-center justify-center"
                        style={{ width: 24, height: ROW_HEIGHT }}
                        aria-label={section.label}
                    >
                        <div
                            className="rounded-full"
                            style={{
                                width: DOT_SIZE,
                                height: DOT_SIZE,
                                background: "rgba(255,255,255,0.2)",
                            }}
                        />

                        <span
                            className="pointer-events-none absolute top-1/2 text-[0.6rem] tracking-[0.2em] uppercase whitespace-nowrap"
                            style={{
                                right: 28,
                                fontFamily: "var(--font-inter), sans-serif",
                                color: activeIndex === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
                                fontWeight: activeIndex === i ? 500 : 400,
                                opacity: hovered || activeIndex === i ? 1 : 0,
                                transform: `translateY(-50%) translateX(${hovered || activeIndex === i ? 0 : 4}px)`,
                                transition: "opacity 0.15s, transform 0.15s",
                            }}
                        >
                            {section.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Floating active dot */}
            <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: ACTIVE_SIZE,
                    height: ACTIVE_SIZE,
                    left: "50%",
                    marginLeft: -ACTIVE_SIZE / 2,
                    top: (ROW_HEIGHT - ACTIVE_SIZE) / 2,
                    y: springY,
                    scale: springScale,
                    background: activeColor,
                    boxShadow: activeGlow,
                }}
            />
        </motion.div>
    );
}
