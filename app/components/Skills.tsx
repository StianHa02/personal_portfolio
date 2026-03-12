"use client";

import { useState } from "react";
import {
    SiHtml5, SiCss, SiReact, SiNextdotjs, SiTypescript,
    SiTailwindcss, SiJavascript, SiNodedotjs, SiPython,
    SiFlask, SiFastapi, SiSupabase, SiPostgresql,
    SiGit, SiGithub, SiNpm, SiVercel, SiJetbrains,
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
            { name: "JavaScript",  icon: SiJavascript,  color: "#F7DF1E", level: "Expert"     },
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
            { name: "Flask",       icon: SiFlask,       color: "#cccccc", level: "Proficient" },
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
            { name: "npm",         icon: SiNpm,      color: "#CB3837", level: "Proficient" },
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
    Expert:     { color: "#6ee7b7" },
    Proficient: { color: "#93c5fd" },
    Learning:   { color: "#fbbf24" },
};

function SkillCard({ skill }: { skill: Skill }) {
    const Icon = skill.icon;
    const lvl = levelConfig[skill.level];
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative flex flex-col items-center justify-center gap-2.5 rounded-2xl cursor-default transition-all duration-200 select-none"
            style={{
                padding: "1.25rem 0.75rem 1rem",
                minWidth: "88px",
                flex: "1 1 88px",
                background: hovered ? lvl.color : `${lvl.color}50`,
                border: `1px solid ${lvl.color}bb`,
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Level dot */}
            <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: lvl.color, boxShadow: `0 0 6px ${lvl.color}` }}
            />

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
        </div>
    );
}

export default function Skills() {
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center">
            <div
                className="relative w-full max-w-5xl mx-auto"
                style={{
                    paddingTop: "clamp(5rem, 20dvh, 12rem)",
                    paddingBottom: "clamp(4rem, 8dvh, 6rem)",
                    paddingLeft: "clamp(1.5rem, 5vw, 2rem)",
                    paddingRight: "clamp(1.5rem, 5vw, 2rem)",
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <h1
                        style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "clamp(2rem,5vw,3.5rem)",
                            fontWeight: 300,
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                            color: "#ede9df",
                            margin: 0,
                        }}
                    >
                        Skills &amp; Technologies
                    </h1>
                </div>

                {/* Categories */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                    {skillCategories.map((cat, ci) => (
                        <div key={ci}>
                            <p
                                style={{
                                    fontFamily: "var(--font-inter), sans-serif",
                                    fontSize: "0.6rem",
                                    letterSpacing: "0.35em",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                    color: "rgba(255,255,255,0.3)",
                                    marginBottom: "0.875rem",
                                }}
                            >
                                {cat.title}
                            </p>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
                                {cat.skills.map((skill, si) => (
                                    <SkillCard key={si} skill={skill} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-8" style={{ marginTop: "3rem" }}>
                    {(["Expert", "Proficient", "Learning"] as const).map(level => (
                        <div key={level} className="flex items-center gap-2">
                            <span
                                style={{
                                    width: "7px",
                                    height: "7px",
                                    borderRadius: "50%",
                                    background: levelConfig[level].color,
                                    boxShadow: `0 0 6px ${levelConfig[level].color}`,
                                    display: "inline-block",
                                    flexShrink: 0,
                                }}
                            />
                            <span
                                style={{
                                    fontFamily: "var(--font-inter), sans-serif",
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                    color: levelConfig[level].color,
                                }}
                            >
                                {level}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}