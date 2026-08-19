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
        imageUrl: "/images/projects/portfolio.png",
    },
    {
        title: "Personal Portfolio Website V2",
        description: " My updated portfolio website showcasing projects, skills, and web development work.",
        techStack: ["Next.js", "React", "TypeScript", "Three.js", "Tailwind CSS", "Vercel"],
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

function ProjectCard({ project }: { project: Project }) {
    const isComingSoon = project.imageUrl === "Coming Soon";

    return (
        <div
            data-project-card
            className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card transition-[transform,box-shadow] duration-300 ease-[ease] hover:-translate-y-1 hover:shadow-card-hover"
        >
            {/* Image — edge to edge */}
            <div className="relative w-full h-[200px] shrink-0 overflow-hidden bg-inset">
                {project.imageUrl && !isComingSoon ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1280px) 50vw, 400px"
                        className="object-cover opacity-80"
                    />
                ) : (
                    <div className="flex w-full h-full items-center justify-center">
                        <span className="text-[0.75rem] tracking-[0.3em] uppercase text-ink-faint font-bold">
                            {isComingSoon ? "In Development" : "No Preview"}
                        </span>
                    </div>
                )}
                {/* Gradient bleed into card body */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 [background:linear-gradient(to_bottom,transparent,var(--color-card))]" />
            </div>

            {/* Card body */}
            <div className="flex grow flex-col gap-3.5 p-7">

                {/* Title + category badge */}
                <div className="flex items-start justify-between gap-3">
                    <h3 className="flex-1 text-base font-semibold text-ink leading-[1.35] tracking-[-0.01em]">
                        {project.title}
                    </h3>
                    <span className="shrink-0 whitespace-nowrap rounded-sm border border-line py-[0.28rem] px-[0.6rem] text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-ink-faint">
                        {project.category}
                    </span>
                </div>

                {/* Description */}
                <p className="overflow-hidden text-[0.85rem] leading-[1.75] text-ink-dim [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                    {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-[0.4rem]">
                    {project.techStack.map((tech, i) => (
                        <span key={i} className="rounded-sm border border-line bg-inset py-[0.28rem] px-[0.65rem] text-[0.75rem] font-medium tracking-[0.04em] text-ink-faint">
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Push buttons to bottom */}
                <div className="grow" />

                {/* Buttons */}
                <div className="flex gap-2.5 pt-[1.125rem] border-t border-line">
                    {project.demoUrl && !isComingSoon && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm border border-accent-line bg-accent py-2.5 px-4 text-[0.75rem] font-semibold tracking-[0.1em] uppercase no-underline text-ink transition-[background,border-color,color] duration-200 hover:border-line-strong hover:bg-accent-hover"
                        >
                            <FaExternalLinkAlt className="shrink-0 text-[0.75rem]" />
                            {project.demoLabel ?? "Live Demo"}
                        </a>
                    )}
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm border border-line bg-transparent py-2.5 px-4 text-[0.75rem] font-semibold tracking-[0.1em] uppercase no-underline text-ink-dim transition-[background,border-color,color] duration-200 hover:border-line-mid hover:bg-inset hover:text-ink-soft"
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
                    <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-ink">
                        Projects and freelance work
                    </h1>
                </div>

                {/* Filter */}
                <div className="flex justify-center mb-10">
                    <LayoutGroup>
                        <div className="relative flex w-full sm:inline-flex sm:w-auto items-center gap-1.5 rounded-md border border-line bg-inset p-1.5">
                            {filterButtons.map(btn => {
                                const isActive = filter === btn.value;
                                return (
                                    <button
                                        key={btn.value}
                                        onClick={() => setFilter(btn.value as typeof filter)}
                                        className="relative z-[1] flex-1 min-w-0 sm:flex-none sm:min-w-[6.5rem] cursor-pointer rounded-sm border-0 bg-transparent py-2 px-2 sm:px-6 text-[0.75rem] font-semibold tracking-[0.04em] sm:tracking-[0.08em] uppercase transition-colors duration-200"
                                        style={{ color: isActive ? "var(--color-ink)" : "var(--color-ink-faint)" }}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="filter-indicator"
                                                className="absolute inset-0 z-[-1] rounded-sm border border-accent-line bg-accent"
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
                        className="grid gap-6 grid-cols-1 sm:[grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]"
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
