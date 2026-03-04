"use client";

import { useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { BentoBox } from "./ui";

const inter = { style: { fontFamily: "var(--font-inter), sans-serif" } };

interface Project {
    title: string;
    description: string;
    techStack: string[];
    category: "frontend" | "fullstack" | "personal";
    demoUrl?: string;
    githubUrl?: string;
    imageUrl?: string;
}

const projects: Project[] = [
    {
        title: "Personal Portfolio Website",
        description: "Modern and interactive portfolio website featuring animated grid backgrounds, bento layouts, toast notifications, and smooth transitions. Built with Next.js, TypeScript and deployed on Vercel.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Aceternity UI"],
        category: "frontend",
        githubUrl: "https://github.com/StianHa02/personal_website",
        demoUrl: "https://stianha.com",
        imageUrl: "/images/projects/portfolio.png",
    },
    {
        title: "Bergen Klatreklubb Route Database",
        description: "Maintaining and improving the digital route database for Bergen Klatreklubb through UI refinements, bug fixes, and feature updates, ensuring stable performance and responsive design.",
        techStack: ["Next.js", "React", "Tailwind CSS", "Supabase", "Linear", "React Aria"],
        category: "fullstack",
        demoUrl: "https://ute.bergenklatreklubb.no/",
        imageUrl: "/images/projects/bergenklatreklubb.png",
    },
    {
        title: "Face Blur Privacy Tool",
        description: "Web application for automatic face blurring in videos using OpenCV. Built with Next.js for the frontend and a Python (FastAPI) backend for video processing and face detection.",
        techStack: ["Python", "FastAPI", "OpenCV", "Next.js", "Computer Vision"],
        category: "fullstack",
        githubUrl: "https://github.com/StianHa02/BlurThatGuyProject",
        demoUrl: "https://blurthatguy.no",
        imageUrl: "/images/projects/blurthatguy.png",
    },
];

const filterButtons = [
    { label: "All",       value: "all"      },
    { label: "Frontend",  value: "frontend"  },
    { label: "Fullstack", value: "fullstack" },
];

export default function Projects() {
    const [filter, setFilter] = useState<"all" | "frontend" | "fullstack" | "personal">("all");
    const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center">
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-8 py-24">

                <div className="text-center mb-16">
                    <p className="text-[0.65rem] tracking-[0.35em] uppercase text-white/50 font-medium mb-3"
                       style={inter.style}>
                        What I&apos;ve built
                    </p>
                    <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-[#ede9df] mb-10"
                        style={inter.style}>
                        Projects
                    </h1>

                    <div className="inline-flex items-center gap-3">
                        {filterButtons.map(btn => (
                            <button
                                key={btn.value}
                                onClick={() => setFilter(btn.value as typeof filter)}
                                className="px-6 py-2.5 rounded-lg text-[0.7rem] tracking-[0.12em] uppercase font-medium transition-all duration-300 cursor-pointer"
                                style={{
                                    fontFamily: "var(--font-inter), sans-serif",
                                    ...(filter === btn.value
                                        ? { color: "rgba(237,233,223,0.9)", background: "rgba(237,233,223,0.09)", border: "1px solid rgba(237,233,223,0.2)" }
                                        : { color: "rgba(255,255,255,0.45)", background: "transparent", border: "1px solid rgba(255,255,255,0.12)" })
                                }}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex items-center justify-center py-24">
                        <p className="text-[0.65rem] tracking-[0.3em] uppercase text-white/20 font-medium"
                           style={inter.style}>
                            No projects in this category
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {filtered.map((project, idx) => {
                            const hasImage     = project.imageUrl && project.imageUrl !== "Coming Soon";
                            const isComingSoon = project.imageUrl === "Coming Soon";

                            return (
                                <BentoBox key={project.title} accent={idx === 0} className="flex flex-col h-full">
                                    <div
                                        className="w-full h-44 mb-6 rounded-lg overflow-hidden shrink-0"
                                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        {hasImage ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover opacity-60 hover:opacity-85 transition-opacity duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-[0.6rem] tracking-[0.3em] uppercase text-white/15 font-medium"
                                                      style={inter.style}>
                                                    {isComingSoon ? "In Development" : "No Preview"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-[1.1rem] font-medium text-[#ede9df]/90 leading-snug tracking-wide mb-3"
                                        style={inter.style}>
                                        {project.title}
                                    </h3>

                                    {/* Description - Added a fixed bottom margin */}
                                    <p className="text-[0.88rem] font-normal leading-relaxed tracking-wide mb-8"
                                       style={{ ...inter.style, color: "rgba(255,255,255,0.52)" }}>
                                        {project.description}
                                    </p>

                                    {/* Tech stack - Added pt-2 to ensure gap from text even if text grows */}
                                    <div className="flex-1 pt-2">
                                        <div className="flex flex-wrap gap-2.5">
                                            {project.techStack.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="rounded-lg font-medium"
                                                    style={{
                                                        fontFamily: "var(--font-inter), sans-serif",
                                                        fontSize: "0.72rem",
                                                        letterSpacing: "0.01em",
                                                        padding: "0.45rem 0.8rem",
                                                        color: "rgba(147,197,253,0.8)",
                                                        background: "rgba(147,197,253,0.07)",
                                                        border: "1px solid rgba(147,197,253,0.15)",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-8 pt-6"
                                         style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                                        {project.demoUrl && !isComingSoon && (
                                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                                               className="flex items-center gap-3 rounded-lg transition-all duration-300"
                                               style={{
                                                   fontFamily: "var(--font-inter), sans-serif",
                                                   fontSize: "0.78rem",
                                                   fontWeight: 600,
                                                   letterSpacing: "0.06em",
                                                   padding: "0.65rem 1.25rem",
                                                   background: "rgba(110,231,183,0.12)",
                                                   border: "1px solid rgba(110,231,183,0.28)",
                                                   color: "rgba(110,231,183,0.95)",
                                               }}
                                               onMouseEnter={e => {
                                                   e.currentTarget.style.background = "rgba(110,231,183,0.22)";
                                                   e.currentTarget.style.borderColor = "rgba(110,231,183,0.45)";
                                               }}
                                               onMouseLeave={e => {
                                                   e.currentTarget.style.background = "rgba(110,231,183,0.12)";
                                                   e.currentTarget.style.borderColor = "rgba(110,231,183,0.28)";
                                               }}>
                                                <FaExternalLinkAlt style={{ fontSize: "0.65rem" }} />
                                                <span>Live Demo</span>
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                               className="flex items-center gap-3 rounded-lg transition-all duration-300"
                                               style={{
                                                   fontFamily: "var(--font-inter), sans-serif",
                                                   fontSize: "0.78rem",
                                                   fontWeight: 600,
                                                   letterSpacing: "0.06em",
                                                   padding: "0.65rem 1.25rem",
                                                   background: "rgba(255,255,255,0.06)",
                                                   border: "1px solid rgba(255,255,255,0.15)",
                                                   color: "rgba(255,255,255,0.75)",
                                               }}
                                               onMouseEnter={e => {
                                                   e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                                                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
                                               }}
                                               onMouseLeave={e => {
                                                   e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                                               }}>
                                                <FaGithub style={{ fontSize: "0.8rem" }} />
                                                <span>Code</span>
                                            </a>
                                        )}
                                    </div>
                                </BentoBox>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}