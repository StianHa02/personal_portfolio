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

const levelConfig = {
    Expert:     { color: "#6ee7b7", filled: 3 },
    Proficient: { color: "#93c5fd", filled: 2 },
    Learning:   { color: "#fbbf24", filled: 1 },
};

function SkillCard({ skill }: { skill: Skill }) {
    const Icon = skill.icon;
    const lvl = levelConfig[skill.level];
    const [hovered, setHovered] = useState(false);

    return (
        <div
            data-skill-card
            className="relative flex min-w-[88px] flex-[1_1_88px] flex-col items-center justify-center gap-2.5 rounded-2xl pt-5 px-3 pb-4 cursor-default transition-all duration-200 select-none"
            style={{
                background: hovered ? lvl.color : `${lvl.color}50`,
                border: `1px solid ${lvl.color}bb`,
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Icon */}
            <Icon
                className="text-3xl shrink-0"
                style={{
                    color: hovered ? "rgba(0,0,0,0.75)" : skill.color,
                    filter: hovered ? "none" : `drop-shadow(0 0 8px ${skill.color}55)`,
                }}
            />

            {/* Name */}
            <span
                className="text-center whitespace-nowrap text-[0.68rem] font-medium tracking-wide leading-tight"
                style={{ color: hovered ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.75)" }}
            >
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
                        className="mb-5 text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-[#ede9df] [font-family:var(--font-inter),sans-serif]"
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
                                    className="text-[0.65rem] tracking-[0.15em] uppercase font-medium [font-family:var(--font-inter),sans-serif]"
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
                                className="mb-2 text-[0.6rem] tracking-[0.35em] uppercase font-medium text-white/30 [font-family:var(--font-inter),sans-serif]"
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
