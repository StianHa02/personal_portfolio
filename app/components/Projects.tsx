"use client";

import { useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const inter = { fontFamily: "var(--font-inter), sans-serif" };

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
        title: "Personal Portfolio Website V1",
        description: "Modern and interactive portfolio website featuring animated grid backgrounds, bento layouts, toast notifications, and smooth transitions. Built with Next.js, TypeScript and deployed on Vercel.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Aceternity UI"],
        category: "frontend",
        githubUrl: "https://github.com/StianHa02/personal_website",
        demoUrl: "https://personal-website-mu-eight-95.vercel.app/",
        imageUrl: "/images/projects/portfolio.png",
    },
    {
        title: "Personal Portfolio Website V2",
        description: "Modern and interactive portfolio website featuring animated grid backgrounds, bento layouts, toast notifications, and smooth transitions. Built with Next.js, TypeScript and deployed on Vercel.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Aceternity UI"],
        category: "frontend",
        githubUrl: "https://github.com/StianHa02/personal_portfolio",
        demoUrl: "https://stianha.com",
        imageUrl: "/images/projects/portfoliov2.png",
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

const categoryColors: Record<string, { color: string; bg: string; border: string }> = {
    frontend:  { color: "rgba(147,197,253,0.85)", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.2)"  },
    fullstack: { color: "rgba(110,231,183,0.85)", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)"  },
    personal:  { color: "rgba(251,191,36,0.85)",  bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)"  },
};

function ProjectCard({ project }: { project: Project }) {
    const cat = categoryColors[project.category] ?? categoryColors.personal;
    const isComingSoon = project.imageUrl === "Coming Soon";

    return (
        <div
            style={{
                backgroundColor: "#0b0b12",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                borderRadius: "1rem",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(0,0,0,0.55)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 40px rgba(0,0,0,0.4)";
            }}
        >
            {/* Image — edge to edge */}
            <div style={{ width: "100%", height: "200px", position: "relative", flexShrink: 0, background: "rgba(255,255,255,0.04)" }}>
                {project.imageUrl && !isComingSoon ? (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8, display: "block" }}
                    />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ ...inter, fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", fontWeight: 700 }}>
                            {isComingSoon ? "In Development" : "No Preview"}
                        </span>
                    </div>
                )}
                {/* Gradient bleed into card body */}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "64px",
                    background: "linear-gradient(to bottom, transparent, #0b0b12)",
                    pointerEvents: "none",
                }} />
            </div>

            {/* Card body */}
            <div style={{ padding: "1.5rem 1.75rem 1.75rem", display: "flex", flexDirection: "column", flexGrow: 1, gap: "0.875rem" }}>

                {/* Title + category badge */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                    <h3 style={{
                        ...inter,
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "rgba(237,233,223,0.92)",
                        lineHeight: 1.35,
                        letterSpacing: "-0.01em",
                        flex: 1,
                        margin: 0,
                    }}>
                        {project.title}
                    </h3>
                    <span style={{
                        ...inter,
                        fontSize: "0.58rem",
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        padding: "0.28rem 0.6rem",
                        borderRadius: "0.4rem",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        color: cat.color,
                        background: cat.bg,
                        border: `1px solid ${cat.border}`,
                    }}>
                        {project.category}
                    </span>
                </div>

                {/* Description */}
                <p style={{
                    ...inter,
                    fontSize: "0.85rem",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.42)",
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}>
                    {project.description}
                </p>

                {/* Tech stack */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {project.techStack.map((tech, i) => (
                        <span key={i} style={{
                            ...inter,
                            fontSize: "0.65rem",
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                            padding: "0.28rem 0.65rem",
                            borderRadius: "0.4rem",
                            color: "rgba(255,255,255,0.38)",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}>
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Push buttons to bottom */}
                <div style={{ flexGrow: 1 }} />

                {/* Buttons */}
                <div style={{
                    display: "flex",
                    gap: "0.625rem",
                    paddingTop: "1.125rem",
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                }}>
                    {project.demoUrl && !isComingSoon && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                ...inter,
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                padding: "0.625rem 1rem",
                                borderRadius: "0.5rem",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                color: "rgba(147,197,253,0.9)",
                                background: "rgba(59,130,246,0.1)",
                                border: "1px solid rgba(59,130,246,0.22)",
                                transition: "background 0.2s, border-color 0.2s, color 0.2s",
                                cursor: "pointer",
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = "rgba(59,130,246,0.18)";
                                el.style.borderColor = "rgba(59,130,246,0.4)";
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = "rgba(59,130,246,0.1)";
                                el.style.borderColor = "rgba(59,130,246,0.22)";
                            }}
                        >
                            <FaExternalLinkAlt style={{ fontSize: "0.6rem", flexShrink: 0 }} />
                            Live Demo
                        </a>
                    )}
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                ...inter,
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                padding: "0.625rem 1rem",
                                borderRadius: "0.5rem",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                color: "rgba(255,255,255,0.6)",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                transition: "background 0.2s, border-color 0.2s, color 0.2s",
                                cursor: "pointer",
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = "rgba(255,255,255,0.09)";
                                el.style.borderColor = "rgba(255,255,255,0.2)";
                                el.style.color = "rgba(255,255,255,0.9)";
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = "rgba(255,255,255,0.05)";
                                el.style.borderColor = "rgba(255,255,255,0.1)";
                                el.style.color = "rgba(255,255,255,0.6)";
                            }}
                        >
                            <FaGithub style={{ fontSize: "0.8rem", flexShrink: 0 }} />
                            Source
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Projects() {
    const [filter, setFilter] = useState<"all" | "frontend" | "fullstack" | "personal">("all");
    const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);

    return (
        <div className="relative w-full min-h-screen flex items-start justify-center">
            <div className="relative w-full max-w-7xl mx-auto md:py-24" style={{ paddingTop: "clamp(5rem, 20dvh, 12rem)", paddingBottom: "clamp(4rem, 8dvh, 6rem)", paddingLeft: "clamp(1.5rem, 5vw, 2rem)", paddingRight: "clamp(1.5rem, 5vw, 2rem)" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 style={{ ...inter, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", color: "#ede9df", margin: 0 }}>
                        Projects
                    </h1>
                </div>

                {/* Filter */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        padding: "0.375rem",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "0.875rem",
                    }}>
                        {filterButtons.map(btn => {
                            const isActive = filter === btn.value;
                            return (
                                <button
                                    key={btn.value}
                                    onClick={() => setFilter(btn.value as typeof filter)}
                                    style={{
                                        ...inter,
                                        padding: "0.5rem 1.5rem",
                                        borderRadius: "0.625rem",
                                        fontSize: "0.72rem",
                                        fontWeight: 600,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        border: "none",
                                        transition: "all 0.25s ease",
                                        background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                                        color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                                        boxShadow: isActive ? "0 0 12px rgba(255,255,255,0.06)" : "none",
                                    }}
                                >
                                    {btn.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Cards grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "1.5rem",
                    alignItems: "start",
                    minHeight: "calc(2 * 430px + 1.5rem)",
                }}>
                    {filtered.map(project => (
                        <ProjectCard key={project.title} project={project} />
                    ))}
                </div>

            </div>
        </div>
    );
}