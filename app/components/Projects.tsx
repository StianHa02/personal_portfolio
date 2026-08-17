"use client";

import {useEffect, useRef, useState} from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";

interface Project {
    title: string;
    description: string;
    techStack: string[];
    category: "frontend" | "fullstack" | "personal";
    demoUrl?: string;
    demoLabel?: string;
    githubUrl?: string;
    imageUrl?: string;
}

const projects: Project[] = [
    {
        title: "Personal Portfolio Website V1",
        description: "First portfolio application built with Next.js and deployed on Vercel.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Aceternity UI"],
        category: "frontend",
        githubUrl: "https://github.com/StianHa02/personal_website",
        demoUrl: "https://personal-website-mu-eight-95.vercel.app/",
        imageUrl: "/images/projects/portfolio.png",
    },
    {
        title: "Personal Portfolio Website V2",
        description: " My updated portfolio website showcasing projects, skills, and web development work.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
        category: "frontend",
        githubUrl: "https://github.com/StianHa02/personal_portfolio",
        demoUrl: "https://stianha.com",
        imageUrl: "/images/projects/portfoliov2.png",
    },
    {
        title: "Bergen Klatreklubb Route Database \n (Freelance)",
        description: "Improving the digital route database for Bergen Klatreklubb through UI updates, bug fixes, and feature improvements.",
        techStack: ["Next.js", "React", "Tailwind CSS", "Supabase", "Linear", "React Aria"],
        category: "fullstack",
        demoUrl: "https://ute.bergenklatreklubb.no/",
        imageUrl: "/images/projects/bergenklatreklubb.png",
    },
    {
        title: "Face Blur Privacy Tool \n (Coding Challenge by Fonn Group)",
        description: "Face-blurring web app using OpenCV with a Next.js frontend and FastAPI backend.",
        techStack: ["Python", "FastAPI", "OpenCV", "Next.js", "AWS EC2"],
        category: "fullstack",
        githubUrl: "https://github.com/StianHa02/BlurThatGuyProject",
        imageUrl: "/images/projects/blurthatguy.png",
    },
    {
        title: "VENUE \n (WEBCOM Hackathon 2026 WINNER)",
        description: "A web app for finding people to join activities, based on their interests and availability.",
        techStack: ["TypeScript", "Supabase", "Next.js"],
        category: "fullstack",
        githubUrl: "https://github.com/jonasjus/webathon",
        demoUrl: "https://hjms-webathon.vercel.app/",
        imageUrl: "/images/projects/venue.png",
    },
    {
        title: "Mimir \n (Summer Internship 2026)",
        description: "Cloud-native media asset management platform for broadcasters. Worked on the Vue/TypeScript client and AWS services.",
        techStack: ["Vue", "TypeScript", "AWS", "Docker", "GitHub CLI"],
        category: "fullstack",
        demoUrl: "https://onemimir.com",
        demoLabel: "Website",
        imageUrl: "/images/projects/mimir2.png",
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
            data-project-card
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b12] shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-[transform,box-shadow] duration-300 ease-[ease] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
        >
            {/* Image — edge to edge */}
            <div className="relative w-full h-[200px] shrink-0 overflow-hidden bg-white/[0.04]">
                {project.imageUrl && !isComingSoon ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover opacity-80"
                    />
                ) : (
                    <div className="flex w-full h-full items-center justify-center">
                        <span className="text-[0.6rem] tracking-[0.3em] uppercase text-white/20 font-bold [font-family:var(--font-inter),sans-serif]">
                            {isComingSoon ? "In Development" : "No Preview"}
                        </span>
                    </div>
                )}
                {/* Gradient bleed into card body */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 [background:linear-gradient(to_bottom,transparent,#0b0b12)]" />
            </div>

            {/* Card body */}
            <div className="flex grow flex-col gap-3.5 pt-6 px-7 pb-7">

                {/* Title + category badge */}
                <div className="flex items-start justify-between gap-3">
                    <h3 className="flex-1 text-base font-semibold text-[rgba(237,233,223,0.92)] leading-[1.35] tracking-[-0.01em] [font-family:var(--font-inter),sans-serif]">
                        {project.title}
                    </h3>
                    <span className="shrink-0 whitespace-nowrap rounded-[0.4rem] border py-[0.28rem] px-[0.6rem] text-[0.58rem] font-semibold tracking-[0.2em] uppercase [font-family:var(--font-inter),sans-serif]" style={{
                        color: cat.color,
                        background: cat.bg,
                        borderColor: cat.border,
                    }}>
                        {project.category}
                    </span>
                </div>

                {/* Description */}
                <p className="overflow-hidden text-[0.85rem] leading-[1.65] text-white/[0.42] [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] [font-family:var(--font-inter),sans-serif]">
                    {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-[0.4rem]">
                    {project.techStack.map((tech, i) => (
                        <span key={i} className="rounded-[0.4rem] border border-white/[0.08] bg-white/[0.04] py-[0.28rem] px-[0.65rem] text-[0.65rem] font-medium tracking-[0.04em] text-white/[0.38] [font-family:var(--font-inter),sans-serif]">
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Push buttons to bottom */}
                <div className="grow" />

                {/* Buttons */}
                <div className="flex gap-2.5 pt-[1.125rem] border-t border-white/[0.07]">
                    {project.demoUrl && !isComingSoon && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.1)] py-2.5 px-4 text-[0.72rem] font-semibold tracking-[0.1em] uppercase no-underline text-[rgba(147,197,253,0.9)] transition-[background,border-color,color] duration-200 hover:border-[rgba(59,130,246,0.4)] hover:bg-[rgba(59,130,246,0.18)] [font-family:var(--font-inter),sans-serif]"
                        >
                            <FaExternalLinkAlt className="shrink-0 text-[0.6rem]" />
                            {project.demoLabel ?? "Live Demo"}
                        </a>
                    )}
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] py-2.5 px-4 text-[0.72rem] font-semibold tracking-[0.1em] uppercase no-underline text-white/60 transition-[background,border-color,color] duration-200 hover:border-white/20 hover:bg-white/[0.09] hover:text-white/90 [font-family:var(--font-inter),sans-serif]"
                        >
                            <FaGithub className="shrink-0 text-[0.8rem]" />
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
    const gridRef = useRef<HTMLDivElement>(null);
    const [cardHeight, setCardHeight] = useState<number>(0);

    // Measure tallest card once on first render (when "all" is shown)
    useEffect(() => {
        if (!gridRef.current || cardHeight > 0) return;
        const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-project-card]");
        let max = 0;
        cards.forEach(c => { if (c.offsetHeight > max) max = c.offsetHeight; });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (max > 0) setCardHeight(max);
    }, [cardHeight]);

    return (
        <div className="relative w-full min-h-screen flex items-start justify-center">
            <div className="relative w-full max-w-7xl mx-auto pt-[clamp(2rem,5dvh,3.5rem)] pb-[clamp(4rem,8dvh,6rem)] px-[clamp(1.5rem,5vw,2rem)]">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-[#ede9df] [font-family:var(--font-inter),sans-serif]">
                        Projects and freelance work
                    </h1>
                </div>

                {/* Filter */}
                <div className="flex justify-center mb-10">
                    <LayoutGroup>
                        <div className="relative inline-flex items-center gap-1.5 rounded-[0.875rem] border border-white/[0.08] bg-white/[0.04] p-1.5">
                            {filterButtons.map(btn => {
                                const isActive = filter === btn.value;
                                return (
                                    <button
                                        key={btn.value}
                                        onClick={() => setFilter(btn.value as typeof filter)}
                                        className="relative z-[1] min-w-[6.5rem] cursor-pointer rounded-[0.625rem] border-0 bg-transparent py-2 px-6 text-[0.72rem] font-semibold tracking-[0.08em] uppercase [font-family:var(--font-inter),sans-serif]"
                                        style={{ color: isActive ? "rgba(147,197,253,0.95)" : "rgba(255,255,255,0.35)" }}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="filter-indicator"
                                                className="absolute inset-0 z-[-1] rounded-[10px] border border-[rgba(59,130,246,0.5)] bg-[rgba(59,130,246,0.32)] shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                                                transition={{ type: "spring", stiffness: 500, damping: 35, borderRadius: { duration: 0 } }}
                                            />
                                        )}
                                        {btn.label}
                                    </button>
                                );
                            })}
                        </div>
                    </LayoutGroup>
                </div>

                {/* Cards grid */}
                <LayoutGroup>
                    <div
                        ref={gridRef}
                        className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]"
                    >
                        <AnimatePresence mode="popLayout">
                            {filtered.map(project => (
                                <motion.div
                                    key={project.title}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        opacity: { duration: 0.4 },
                                        layout: { type: "spring", stiffness: 400, damping: 30 },
                                    }}
                                    style={{ height: cardHeight > 0 ? cardHeight : "auto" }}
                                >
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </LayoutGroup>

            </div>
        </div>
    );
}
