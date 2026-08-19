"use client";

import { useState } from "react";
import {
    SiHtml5, SiCss, SiReact, SiNextdotjs, SiTypescript,
    SiTailwindcss, SiJavascript, SiNodedotjs, SiPython,
    SiFastapi, SiSupabase, SiPostgresql,
    SiGit, SiGithub, SiVercel, SiJetbrains,
    SiDocker, SiNumpy, SiPandas,
    SiJupyter, SiScikitlearn, SiPytorch,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { IconType } from "react-icons";

interface Skill {
    name: string;
    icon: IconType;
    color: string;
    level: "Expert" | "Proficient" | "Learning";
}

interface SkillCategory {
    title: string;
    skills: Skill[];
}

const skillCategories: SkillCategory[] = [
    {
        title: "Frontend",
        skills: [
            { name: "HTML5",       icon: SiHtml5,       color: "#E34F26", level: "Expert"     },
            { name: "CSS3",        icon: SiCss,        color: "#1572B6", level: "Expert"     },
            { name: "JavaScript",  icon: SiJavascript,  color: "#F7DF1E", level: "Proficient"     },
            { name: "TypeScript",  icon: SiTypescript,  color: "#3178C6", level: "Proficient" },
            { name: "React",       icon: SiReact,       color: "#61DAFB", level: "Proficient" },
            { name: "Next.js",     icon: SiNextdotjs,   color: "#ffffff", level: "Proficient" },
            { name: "Tailwind",    icon: SiTailwindcss, color: "#06B6D4", level: "Proficient" },
        ],
    },
    {
        title: "Backend",
        skills: [
            { name: "Python",      icon: SiPython,      color: "#3776AB", level: "Proficient" },
            { name: "Node.js",     icon: SiNodedotjs,   color: "#339933", level: "Proficient" },
            { name: "FastAPI",     icon: SiFastapi,     color: "#009688", level: "Proficient" },
            { name: "Supabase",    icon: SiSupabase,    color: "#3ECF8E", level: "Proficient" },
            { name: "PostgreSQL",  icon: SiPostgresql,  color: "#4169E1", level: "Learning"   },
        ],
    },
    {
        title: "Tools & DevOps",
        skills: [
            { name: "Git",         icon: SiGit,      color: "#F05032", level: "Expert"     },
            { name: "GitHub",      icon: SiGithub,   color: "#cccccc", level: "Expert"     },
            { name: "Vercel",      icon: SiVercel,   color: "#cccccc", level: "Proficient" },
            { name: "JetBrains",   icon: SiJetbrains,color: "#FF318C", level: "Proficient" },
            { name: "AWS",         icon: FaAws,   color: "#FF9900", level: "Learning"   },
            { name: "Docker",      icon: SiDocker,   color: "#2496ED", level: "Learning"   },
        ],
    },
    {
        title: "Data Science & ML",
        skills: [
            { name: "NumPy",        icon: SiNumpy,      color: "#4DABCF", level: "Expert"     },
            { name: "Pandas",       icon: SiPandas,     color: "#e70488", level: "Expert"     },
            { name: "Jupyter",      icon: SiJupyter,    color: "#F37626", level: "Expert"     },
            { name: "Scikit-learn", icon: SiScikitlearn,color: "#F7931E", level: "Proficient" },
            { name: "PyTorch",      icon: SiPytorch,    color: "#EE4C2C", level: "Learning"   },
        ],
    },
];

/**
 * Pull a brand colour toward the page's neutral. Hue survives — React still reads
 * cyan, Python still blue — but the chroma comes down so 23 logos side by side stop
 * reading as a rainbow. Clamping lightness handles the outliers for free: Next.js's
 * pure #ffffff and GitHub's #cccccc come down off white without needing a special case.
 */
function mute(hex: string, sMul = 0.5, lMin = 0.45, lMax = 0.72): string {
    const n = parseInt(hex.replace("#", ""), 16);
    const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    let h = 0, sat = 0;
    if (d !== 0) {
        sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = max === r ? ((g - b) / d + (g < b ? 6 : 0))
          : max === g ? (b - r) / d + 2
          : (r - g) / d + 4;
        h /= 6;
    }
    const s2 = sat * sMul;
    const l2 = Math.min(Math.max(l, lMin), lMax);

    const hue = (t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p2 + (q - p2) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p2 + (q - p2) * (2 / 3 - t) * 6;
        return p2;
    };
    const q = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
    const p2 = 2 * l2 - q;
    const to = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
    return s2 === 0
        ? `#${to(l2)}${to(l2)}${to(l2)}`
        : `#${to(hue(h + 1 / 3))}${to(hue(h))}${to(hue(h - 1 / 3))}`;
}

// Muted more gently than the logos — these drive the dots and the legend, and need to
// stay tellable apart at 5px.
const levelConfig = {
    Expert:     { color: mute("#6ee7b7", 0.7), filled: 3 },
    Proficient: { color: mute("#93c5fd", 0.7), filled: 2 },
    Learning:   { color: mute("#fbbf24", 0.7), filled: 1 },
};

function SkillCard({ skill }: { skill: Skill }) {
    const Icon = skill.icon;
    const lvl = levelConfig[skill.level];
    const muted = mute(skill.color);
    const [hovered, setHovered] = useState(false);

    return (
        <div
            data-skill-card
            className="relative flex min-w-[88px] flex-[1_1_88px] flex-col items-center justify-center gap-2.5 rounded-lg pt-5 px-3 pb-4 cursor-default border transition-all duration-200 select-none"
            style={{
                // Neutral plate in both states. The tech's own colour lives in the
                // icon and the level's colour lives in the dots — nowhere else.
                background: hovered ? "var(--color-accent)" : "var(--color-card)",
                borderColor: hovered ? "var(--color-line-mid)" : "var(--color-line)",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Icon */}
            <Icon
                className="text-3xl shrink-0"
                style={{
                    color: muted,
                    filter: `drop-shadow(0 0 8px ${muted}33)`,
                }}
            />

            {/* Name */}
            <span className="text-center whitespace-nowrap text-[0.75rem] font-medium tracking-wide leading-tight text-ink-soft">
                {skill.name}
            </span>

            {/* 3-dot level indicator */}
            <div className="flex items-center gap-1">
                {[0, 1, 2].map(i => (
                    <span
                        key={i}
                        className="w-[5px] h-[5px] rounded-full"
                        style={{
                            background: i < lvl.filled ? lvl.color : `${lvl.color}28`,
                            boxShadow: i < lvl.filled ? `0 0 5px ${lvl.color}` : "none",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Skills() {
    return (
        <div className="relative w-full min-h-screen flex items-start justify-center">
            <div
                className="relative w-full max-w-5xl mx-auto pt-[clamp(2rem,5dvh,3.5rem)] pb-[clamp(4rem,8dvh,6rem)] px-[clamp(1.5rem,5vw,2rem)]"
            >
                {/* Header */}
                <div className="text-center mb-0">
                    <h1
                        className="mb-5 text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-ink"
                    >
                        Skills &amp; Technologies
                    </h1>

                    {/* Legend */}
                    <div className="flex items-center justify-between sm:justify-center sm:gap-8 w-full mb-0">
                        {(["Expert", "Proficient", "Learning"] as const).map(level => (
                            <div key={level} className="flex items-center gap-2">
                                {/* 3-dot pattern in legend */}
                                <div className="flex items-center gap-[3px]">
                                    {[0, 1, 2].map(i => (
                                        <span
                                            key={i}
                                            className="inline-block w-[5px] h-[5px] rounded-full"
                                            style={{
                                                background: i < levelConfig[level].filled ? levelConfig[level].color : `${levelConfig[level].color}28`,
                                                boxShadow: i < levelConfig[level].filled ? `0 0 5px ${levelConfig[level].color}` : "none",
                                            }}
                                        />
                                    ))}
                                </div>
                                <span
                                    className="text-[0.75rem] tracking-[0.15em] uppercase font-medium"
                                    style={{
                                        color: levelConfig[level].color,
                                    }}
                                >
                                    {level}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-col gap-10 mt-5">
                    {skillCategories.map((cat, ci) => (
                        <div key={ci}>
                            <p
                                className="mb-1 text-[0.75rem] tracking-[0.35em] uppercase font-medium text-ink-faint"
                            >
                                {cat.title}
                            </p>

                            <div className="flex flex-wrap gap-2.5">
                                {cat.skills.map((skill, si) => (
                                    <SkillCard key={si} skill={skill} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}
