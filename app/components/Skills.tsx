"use client";

import { Cormorant_Garamond } from "next/font/google";
import { BentoBox } from "./ui";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
});

interface Skill { name: string; level?: "Expert" | "Proficient" | "Learning" }
interface SkillCategory { title: string; skills: Skill[] }

const levelConfig = {
    Expert:     { dot: "#ede9df",           pill: { color: "rgba(237,233,223,0.62)", background: "rgba(237,233,223,0.05)", border: "1px solid rgba(237,233,223,0.14)" } },
    Proficient: { dot: "rgba(255,255,255,0.35)", pill: { color: "rgba(255,255,255,0.42)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)"  } },
    Learning:   { dot: "rgba(255,255,255,0.18)", pill: { color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" } },
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

                <div className="text-center mb-12">
                    <p className={`text-[0.6rem] tracking-[0.4em] uppercase text-white/30 font-light mb-3 ${cormorant.className}`}>
                        What I work with
                    </p>
                    <h1 className={`text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-[#ede9df] ${cormorant.className}`}>
                        Skills &amp; Technologies
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {skillCategories.map((cat, idx) => (
                        <BentoBox key={idx} title={cat.title} accent={idx === 0}>
                            <div className="flex flex-wrap gap-2">
                                {cat.skills.map((skill, si) => {
                                    const cfg = levelConfig[skill.level ?? "Learning"];
                                    return (
                                        <span
                                            key={si}
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-light tracking-wide transition-all duration-300 hover:brightness-125 ${cormorant.className}`}
                                            style={{ fontSize: "0.7rem", letterSpacing: "0.05em", ...cfg.pill }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
                                            {skill.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </BentoBox>
                    ))}
                </div>

                {/* Legend */}
                <div className={`flex items-center justify-center gap-8 mt-8 ${cormorant.className}`}>
                    {(["Expert", "Proficient", "Learning"] as const).map(level => (
                        <div key={level} className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: levelConfig[level].dot }} />
                            <span className="text-[0.55rem] tracking-[0.3em] uppercase font-light"
                                  style={{ color: "rgba(255,255,255,0.28)" }}>
                                {level}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}