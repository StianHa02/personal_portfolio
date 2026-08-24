"use client";

import {useEffect, useRef, useState} from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { FaGithub, FaExternalLinkAlt, FaTrophy, FaPlus, FaMinus } from "react-icons/fa";
import Image from "next/image";
import { badge, badgeWin, buttonGhost, buttonPrimary, chip, focusRing, sectionHeading, sectionInner } from "./ui";

/**
 * What the project *was* — a client job, a competition, a summer post. This is
 * what a reader actually wants from the badge; `category` below only feeds the
 * filter, and the tech chips already say whether it was fullstack.
 */
type ProjectKind = "Freelance" | "Internship" | "Hackathon" | "Challenge" | "Personal";

interface Project {
    id: string;
    title: string;
    kind: ProjectKind;
    /** Client, employer, or competition. Rendered under the title when present. */
    org?: string;
    /** Competition win — earns the one hue spent on these cards. */
    won?: boolean;
    description: string;
    /** One line on what you personally built, as opposed to what the project is. */
    contribution?: string;
    /** 2–3 bullets on what was hard and what you decided. Shown in the disclosure. */
    highlights?: string[];
    techStack: string[];
    category: "frontend" | "fullstack";
    demoUrl?: string;
    demoLabel?: string;
    githubUrl?: string;
    imageUrl?: string;
}

/**
 * Ordered strongest credential first: paid internship, paying client, the two
 * competition wins, then the personal work. A recruiter reads left to right and
 * stops early.
 *
 * Mimir's `contribution` and `highlights` come from the internship reference letter
 * and are accurate as written.
 *
 * from what each project already states plus its stack, with no invented metrics and
 * no claims about impact, but rewrite them in your own words before you send this to
 * anyone. This is the part of the page an interviewer will ask you about.
 */
const projects: Project[] = [
    {
        id: "mimir",
        title: "Summer Internship 2026",
        kind: "Internship",
        org: "Mimir",
        description: "Cloud-native media asset management platform for broadcasters.",
        contribution: "Treated as a regular developer, not an intern.",
        highlights: [
            "Tickets shipped to customers including Netflix, Viaplay, CNBC, Warner Bros. Discovery and The New York Times.",
            "Familiarity with the national and international media industry, and a network inside it.",
            "UI work in the Vue and TypeScript client plus backend tasks, alongside senior developers.",
        ],
        techStack: ["Vue", "TypeScript", "AWS", "Docker", "GitHub CLI"],
        category: "fullstack",
        demoUrl: "https://onemimir.com",
        demoLabel: "Website",
        imageUrl: "/images/projects/mimir2.png",
    },
    {
        id: "bergen-klatreklubb",
        title: "Bergen Crag Database",
        kind: "Freelance",
        org: "Bergen Klatreklubb",
        description: "A digital replacement for the climbing club's printed guidebook, with a personal climbing log on top.",
        contribution: "Ongoing frontend work in a live, volunteer-run codebase.",
        highlights: [
            "A mature codebase in Norwegian, built for climbers rather than developers.",
            "Shipping safely into something already in use: features go out behind flags and land dark.",
            "Recurring UI gets extracted into shared components rather than copied.",
        ],
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Linear", "React Aria"],
        category: "fullstack",
        demoUrl: "https://ute.bergenklatreklubb.no/",
        imageUrl: "/images/projects/bergenklatreklubb.png",
    },
    {
        id: "venue",
        title: "VENUE",
        kind: "Hackathon",
        org: "WEBCOM 2026",
        won: true,
        description: "A web app for finding people to join activities, based on their interests and availability.",
        contribution: "Built with a team under hackathon time pressure, and won the competition.",
        highlights: [
            "Scoped to what could actually ship in the time available, which meant cutting features rather than half-finishing them.",
            "Supabase for auth and data so the team could spend its hours on the matching experience instead of infrastructure.",
        ],
        techStack: ["TypeScript", "Supabase", "Next.js"],
        category: "fullstack",
        githubUrl: "https://github.com/jonasjus/webathon",
        demoUrl: "https://hjms-webathon.vercel.app/",
        imageUrl: "/images/projects/venue.png",
    },
    {
        id: "face-blur",
        title: "Face Blur Privacy Tool",
        kind: "Challenge",
        org: "Fonn Group",
        won: true,
        description: "Face-blurring web app with a Next.js client, a FastAPI backend and a multi-node AWS deployment.",
        contribution: "Built end to end, specialising in infrastructure.",
        highlights: [
            "Custom autoscaler on AWS: CloudWatch, EventBridge and Lambda start and drain a burst EC2 node.",
            "Shared-nothing nodes with their own Redis and storage, so scaling out is one more instance.",
            "SCRFD and ArcFace on ONNX behind FastAPI, with CI and CD on GitHub Actions.",
        ],
        techStack: ["Next.js", "FastAPI", "Python", "Docker", "Redis", "AWS", "GitHub Actions"],
        category: "fullstack",
        githubUrl: "https://github.com/StianHa02/BlurThatGuyProject",
        imageUrl: "/images/projects/blurthatguy.png",
    },
    {
        id: "portfolio-v2",
        title: "Personal Portfolio Website V2",
        kind: "Personal",
        description: "This site, a portfolio built around an interactive WebGL Rubik's cube.",
        contribution: "Designed and built it, including the cube renderer and its solver.",
        highlights: [
            "The cube is Three.js, driven by scroll and draggable by hand, with the solver in a Web Worker.",
            "Colour tokens are derived from measured contrast ratios, so every text step clears WCAG AA.",
            "Scroll and resize handlers are coalesced to one measurement per frame.",
        ],
        techStack: ["Next.js", "React", "TypeScript", "Three.js", "Tailwind CSS", "Vercel"],
        category: "frontend",
        githubUrl: "https://github.com/StianHa02/personal_portfolio",
        demoUrl: "https://stianha.com",
        imageUrl: "/images/projects/portfoliov2.png",
    },
    {
        id: "portfolio-v1",
        title: "Personal Portfolio Website V1",
        kind: "Personal",
        description: "The first version, my starting point with Next.js and Vercel.",
        contribution: "Built and deployed it while learning the framework.",
        highlights: [
            "Kept here on purpose: the gap between this and V2 is the clearest evidence of what changed in a year.",
        ],
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Aceternity UI"],
        category: "frontend",
        githubUrl: "https://github.com/StianHa02/personal_website",
        imageUrl: "/images/projects/portfolio.png",
    },
];

const filterButtons = [
    { label: "All",       value: "all"      },
    { label: "Frontend",  value: "frontend"  },
    { label: "Fullstack", value: "fullstack" },
];

function ProjectCard({ project, expanded, onToggle }: {
    project: Project;
    expanded: boolean;
    onToggle: () => void;
}) {
    const isComingSoon = project.imageUrl === "Coming Soon";
    const hasDetail = Boolean(project.contribution || project.highlights?.length);
    const panelId = `project-detail-${project.id}`;

    return (
        <div
            data-project-card
            data-project-id={project.id}
            className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card transition-[transform,box-shadow] duration-300 ease-[ease] hover:-translate-y-1 hover:shadow-card-hover"
        >
            {/* Image — edge to edge */}
            <div className="relative w-full h-[200px] shrink-0 overflow-hidden bg-inset">
                {project.imageUrl && !isComingSoon ? (
                    <Image
                        src={project.imageUrl}
                        alt={`Screenshot of ${project.org ?? project.title}`}
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
                {/* A win rides on the image, where there is dead space, rather than
                    competing with the kind badge down in the card body. */}
                {project.won && (
                    <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 ${badgeWin}`}>
                        <FaTrophy aria-hidden="true" className="text-[0.7rem]" />
                        Winner
                    </span>
                )}
                {/* Gradient bleed into card body */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 [background:linear-gradient(to_bottom,transparent,var(--color-card))]" />
            </div>

            {/* Card body. `relative` so the detail panel can cover it without the
                card box ever changing size. */}
            <div className="flex grow flex-col gap-4 p-7">

                {/* Everything above the trigger. `grow` bottom-anchors the trigger and
                    the action row, so the trigger lands in the same place on every card
                    however many rows the chips wrap to. `relative` scopes the panel to
                    this region, so no measured offsets are needed anywhere. */}
                <div className="relative grow">
                <div className="flex flex-col gap-4">

                {/* Title block — name, org and description read as one unit. */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-1 flex-col gap-1">
                            <h3 className="text-base font-semibold text-ink leading-[1.35] tracking-[-0.01em]">
                                {project.title}
                            </h3>
                            {project.org && (
                                <p className="text-[0.78rem] text-ink-faint leading-tight">
                                    {project.org}
                                </p>
                            )}
                        </div>
                        <span className={badge}>
                            {project.kind}
                        </span>
                    </div>

                    <p className="overflow-hidden text-[0.85rem] leading-[1.75] text-ink-dim [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                        {project.description}
                    </p>
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, i) => (
                        <span key={i} className={chip}>
                            {tech}
                        </span>
                    ))}
                </div>

                </div>

                {/* The detail: an overlay over the region above the trigger, so the
                    card, the image and the grid never move. Motion's `layout` animates
                    size changes by scale-transforming the element, which warps the
                    children (the picture included) whenever the box grows. */}
                {hasDetail && expanded && (
                    <div id={panelId} className="absolute inset-0 z-10 flex flex-col gap-2.5 bg-card">
                        {project.contribution && (
                            <p className="text-[0.85rem] font-medium leading-[1.6] text-ink">
                                {project.contribution}
                            </p>
                        )}
                        {project.highlights?.length ? (
                            <ul className="flex flex-col gap-2">
                                {project.highlights.map((h, i) => (
                                    <li key={i} className="flex gap-2.5 text-[0.8rem] leading-[1.6] text-ink-dim">
                                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-ghost" />
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                )}
                </div>

                {/* One button, toggled in place: it never moves, so the way out is
                    exactly where the way in was. */}
                {hasDetail && (
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        className={`${focusRing} flex w-full cursor-pointer items-center justify-start gap-1.5 rounded-sm bg-transparent border-0 p-0 text-left text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-ink-faint transition-colors duration-200 hover:text-ink-soft`}
                    >
                        {/* The label reserves the width of the longer of the two strings
                            by stacking the longest one, invisibly, in the same grid cell.
                            That keeps the icon beside it from shifting when the text
                            changes, without a hardcoded width that would go stale if the
                            wording did. */}
                        <span className="grid">
                            <span aria-hidden="true" className="col-start-1 row-start-1 invisible">
                                What I built
                            </span>
                            <span className="col-start-1 row-start-1">
                                {expanded ? "View less" : "What I built"}
                            </span>
                        </span>
                        {/* Plus/minus rather than a chevron: the panel overlays the card
                            instead of dropping down, so a downward arrow promised motion
                            that does not happen. */}
                        {expanded
                            ? <FaMinus aria-hidden="true" className="shrink-0 text-[0.6rem]" />
                            : <FaPlus aria-hidden="true" className="shrink-0 text-[0.6rem]" />}
                    </button>
                )}

                {/* Buttons */}
                <div className="flex gap-2.5 pt-5 border-t border-line">
                    {project.demoUrl && !isComingSoon && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 ${buttonPrimary}`}
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
                            className={`flex-1 ${buttonGhost}`}
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
    const [filter, setFilter] = useState<"all" | "frontend" | "fullstack">("all");
    const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);
    const gridRef = useRef<HTMLDivElement>(null);
    const [cardHeight, setCardHeight] = useState<number>(0);
    // One card open at a time — two expanded cards in a row leave the grid ragged.
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // An overlay that covers content needs a way out that is not the mouse, and one
    // that is. `pointerdown` fires before `click`, so pressing another card's trigger
    // closes this panel first and then opens that one.
    useEffect(() => {
        if (!expandedId) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpandedId(null); };
        const onPointerDown = (e: PointerEvent) => {
            const card = (e.target as Element | null)?.closest?.("[data-project-card]");
            if (card?.getAttribute("data-project-id") !== expandedId) setExpandedId(null);
        };
        window.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [expandedId]);

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
        <div className={`${sectionInner} max-w-7xl`}>

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className={sectionHeading}>
                    Projects and freelance work
                </h1>
            </div>

            {/* Filter — sits closer to the grid it controls than to the heading. */}
            <div className="flex justify-center mb-6">
                <LayoutGroup>
                    <div className="relative flex w-full sm:inline-flex sm:w-auto items-center gap-1.5 rounded-md border border-line bg-inset p-1.5">
                        {filterButtons.map(btn => {
                            const isActive = filter === btn.value;
                            return (
                                <button
                                    key={btn.value}
                                    onClick={() => { setFilter(btn.value as typeof filter); setExpandedId(null); }}
                                    className={`${focusRing} relative z-[1] flex-1 min-w-0 sm:flex-none sm:min-w-[6.5rem] cursor-pointer rounded-sm border-0 bg-transparent py-2 px-2 sm:px-6 text-[0.75rem] font-semibold tracking-[0.04em] sm:tracking-[0.08em] uppercase transition-colors duration-200`}
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
                    className="grid gap-5 grid-cols-1 sm:[grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map(project => (
                            <motion.div
                                key={project.id}
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
                                <ProjectCard
                                    project={project}
                                    expanded={expandedId === project.id}
                                    onToggle={() => setExpandedId(id => id === project.id ? null : project.id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </LayoutGroup>

        </div>
    );
}
