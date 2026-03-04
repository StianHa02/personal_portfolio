"use client";

import { BentoBox } from "./ui";

const inter = { style: { fontFamily: "var(--font-inter), sans-serif" } };

interface Skill { name: string; level?: "Expert" | "Proficient" | "Learning" }
interface SkillCategory { title: string; skills: Skill[] }

const levelConfig = {
    Expert:     { dot: "#6ee7b7", label: "#6ee7b7", pill: { color: "rgba(110,231,183,0.85)", background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)" } },
    Proficient: { dot: "#93c5fd", label: "#93c5fd", pill: { color: "rgba(147,197,253,0.8)", background: "rgba(147,197,253,0.07)", border: "1px solid rgba(147,197,253,0.18)"  } },
    Learning:   { dot: "#fbbf24", label: "#fbbf24", pill: { color: "rgba(251,191,36,0.75)", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.16)" } },
};

const skillCategories: SkillCategory[] = [
    {
        title: "Frontend",
        skills: [
            { name: "HTML5 & CSS3",      level: "Expert"     },
            { name: "Responsive Design", level: "Expert"     },
            { name: "React",             level: "Proficient" },
            { name: "Next.js",           level: "Proficient" },
            { name: "TypeScript",        level: "Proficient" },
            { name: "Tailwind CSS",      level: "Proficient" },
            { name: "JavaScript (ES6+)", level: "Proficient" },
        ],
    },
    {
        title: "Backend",
        skills: [
            { name: "Node.js",           level: "Proficient" },
            { name: "Python (Flask)",    level: "Proficient" },
            { name: "Supabase",          level: "Proficient" },
            { name: "REST APIs",         level: "Learning"   },
            { name: "PostgreSQL",        level: "Learning"   },
        ],
    },
    {
        title: "Tools & Technologies",
        skills: [
            { name: "Git & GitHub",      level: "Expert"     },
            { name: "npm/yarn",          level: "Proficient" },
            { name: "Vercel",            level: "Proficient" },
            { name: "Jetbrains IDE",     level: "Proficient" },
            { name: "AWS",               level: "Learning"   },
            { name: "Docker",            level: "Learning"   },
            { name: "SEO",               level: "Learning"   },
        ],
    },
    {
        title: "Data Science & ML",
        skills: [
            { name: "NumPy",             level: "Expert"     },
            { name: "Pandas",            level: "Expert"     },
            { name: "Jupyter",           level: "Expert"     },
            { name: "Scikit-learn",      level: "Proficient" },
            { name: "Matplotlib",        level: "Proficient" },
            { name: "PyTorch",           level: "Learning"   },
        ],
    },
];

export default function Skills() {
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center">
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-8 py-24">

                <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                    <p style={{ ...inter.style, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 500, marginBottom: "0.75rem" }}>
                        What I work with
                    </p>
                    <h1 style={{ ...inter.style, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", color: "#ede9df", margin: 0 }}>
                        Skills &amp; Technologies
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {skillCategories.map((cat, idx) => (
                        <BentoBox key={idx} title={cat.title} accent={idx === 0}>
                            <div className="flex flex-wrap gap-3">
                                {cat.skills.map((skill, si) => {
                                    const cfg = levelConfig[skill.level ?? "Learning"];
                                    return (
                                        <span
                                            key={si}
                                            className="inline-flex items-center gap-3 rounded-xl font-medium transition-all duration-300 hover:brightness-125"
                                            style={{
                                                fontFamily: "var(--font-inter), sans-serif",
                                                fontSize: "0.85rem",
                                                letterSpacing: "0.01em",
                                                padding: "0.65rem 1.15rem",
                                                whiteSpace: "nowrap",
                                                ...cfg.pill,
                                            }}
                                        >
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dot }} />
                                            {skill.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </BentoBox>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-10" style={{ marginTop: "3rem" }}>
                    {(["Expert", "Proficient", "Learning"] as const).map(level => (
                        <div key={level} className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: levelConfig[level].dot }} />
                            <span className="text-[0.7rem] tracking-[0.15em] uppercase font-medium"
                                  style={{ fontFamily: "var(--font-inter), sans-serif", color: levelConfig[level].label }}>
                                {level}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}