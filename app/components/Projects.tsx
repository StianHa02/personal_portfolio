"use client";

import { useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { BentoBox } from "./ui";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
});

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

                {/* Section header */}
                <div className="text-center mb-12">
                    <p className={`text-[0.6rem] tracking-[0.4em] uppercase text-white/30 font-light mb-3 ${cormorant.className}`}>
                        What I&apos;ve built
                    </p>
                    <h1 className={`text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-[#ede9df] mb-8 ${cormorant.className}`}>
                        Projects
                    </h1>

                    {/* Filter pills */}
                    <div className="inline-flex items-center gap-2">
                        {filterButtons.map(btn => (
                            <button
                                key={btn.value}
                                onClick={() => setFilter(btn.value as typeof filter)}
                                className={`px-5 py-2 rounded-lg text-[0.55rem] tracking-[0.3em] uppercase font-light transition-all duration-300 cursor-pointer ${cormorant.className}`}
                                style={
                                    filter === btn.value
                                        ? { color: "rgba(237,233,223,0.65)", background: "rgba(237,233,223,0.07)", border: "1px solid rgba(237,233,223,0.14)" }
                                        : { color: "rgba(255,255,255,0.25)", background: "transparent",              border: "1px solid rgba(255,255,255,0.07)" }
                                }
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex items-center justify-center py-24">
                        <p className={`text-[0.6rem] tracking-[0.4em] uppercase text-white/20 font-light ${cormorant.className}`}>
                            No projects in this category
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {filtered.map((project, idx) => {
                            const hasImage     = project.imageUrl && project.imageUrl !== "Coming Soon";
                            const isComingSoon = project.imageUrl === "Coming Soon";

                            return (
                                <BentoBox key={project.title} accent={idx === 0} className="flex flex-col">
                                    {/* Image */}
                                    <div
                                        className="w-full h-44 mb-6 rounded-lg overflow-hidden"
                                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        {hasImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover opacity-60 hover:opacity-85 transition-opacity duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className={`text-[0.5rem] tracking-[0.35em] uppercase text-white/15 font-light ${cormorant.className}`}>
                                                    {isComingSoon ? "In Development" : "No Preview"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-[1.05rem] font-light text-[#ede9df]/75 leading-snug tracking-wide mb-3 ${cormorant.className}`}>
                                        {project.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`text-sm font-light leading-relaxed tracking-wide mb-5 flex-1 ${cormorant.className}`}
                                       style={{ color: "rgba(255,255,255,0.32)" }}>
                                        {project.description}
                                    </p>

                                    {/* Tech stack */}
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {project.techStack.map((tech, i) => (
                                            <span
                                                key={i}
                                                className={`px-2.5 py-1 rounded-md font-light ${cormorant.className}`}
                                                style={{
                                                    fontSize: "0.65rem",
                                                    letterSpacing: "0.05em",
                                                    color: "rgba(255,255,255,0.28)",
                                                    background: "rgba(255,255,255,0.04)",
                                                    border: "1px solid rgba(255,255,255,0.08)",
                                                }}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Links */}
                                    <div className="flex items-center gap-6 mt-auto pt-4"
                                         style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                        {project.demoUrl && !isComingSoon && (
                                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                                               className={`flex items-center gap-2 transition-colors duration-300 group ${cormorant.className}`}
                                               style={{ color: "rgba(237,233,223,0.38)" }}
                                               onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,223,0.68)")}
                                               onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,223,0.38)")}>
                                                <FaExternalLinkAlt className="text-[0.55rem]" />
                                                <span className="text-[0.58rem] tracking-[0.3em] uppercase font-light">Live Demo</span>
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                               className={`flex items-center gap-2 transition-colors duration-300 ${cormorant.className}`}
                                               style={{ color: "rgba(255,255,255,0.25)" }}
                                               onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.52)")}
                                               onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                                                <FaGithub className="text-[0.55rem]" />
                                                <span className="text-[0.58rem] tracking-[0.3em] uppercase font-light">Code</span>
                                            </a>
                                        )}
                                        {isComingSoon && (
                                            <span className={`text-[0.58rem] tracking-[0.3em] uppercase font-light ${cormorant.className}`}
                                                  style={{ color: "rgba(255,255,255,0.15)" }}>
                                                In Development
                                            </span>
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