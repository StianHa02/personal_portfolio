"use client";

import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Footer from "./components/Footer";
import CubeRenderer from "./components/CubeRenderer";

const NAV_SECTIONS = [
    { id: "hero",     label: "Home"     },
    { id: "projects", label: "Projects" },
    { id: "skills",   label: "Skills"   },
    { id: "about",    label: "About"    },
    { id: "footer",   label: "Contact"  },
];

export default function Home() {
    const [sp, setSp]                = useState(0);
    const [activeSection, setActive] = useState("hero");

    useEffect(() => {
        const fn = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setSp(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
        };
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { threshold: 0.4 }
        );
        NAV_SECTIONS.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    const solved = sp > 0.93;

    return (
        <div className="relative bg-[#0e0e16]">
            <CubeRenderer sp={sp} />

            {/* Right dot nav — desktop only */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-6">
                <div className="absolute top-0 bottom-0 w-px bg-white/10" />
                {NAV_SECTIONS.map(section => {
                    const isActive  = activeSection === section.id;
                    const isContact = section.id === "footer";
                    return (
                        <button
                            key={section.id}
                            onClick={() => scrollTo(section.id)}
                            className="relative z-10 cursor-pointer group flex items-center justify-center"
                            aria-label={section.label}
                        >
                            <div
                                className="rounded-full transition-all duration-300"
                                style={{
                                    width:      isActive ? 12 : 8,
                                    height:     isActive ? 12 : 8,
                                    background: isActive
                                        ? (isContact && solved ? "#fcd435" : "#ffffff")
                                        : "rgba(255,255,255,0.25)",
                                    boxShadow: isActive
                                        ? (isContact && solved
                                            ? "0 0 8px rgba(252,212,53,0.7)"
                                            : "0 0 6px rgba(255,255,255,0.4)")
                                        : "none",
                                }}
                            />
                            <span className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 text-[0.6rem] tracking-[0.2em] uppercase text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {section.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <main>
                <section id="hero" className="w-full min-h-screen">
                    <div
                        className="absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-700"
                        style={{ opacity: solved ? 1 : 1 }}
                    >
                        <span className="text-[0.55rem] tracking-[0.38em] uppercase text-[rgba(252,212,53,0.75)]">
                            Scroll down to solve the cube
                        </span>
                    </div>
                    <Hero />
                </section>

                <section id="projects" className="w-full min-h-screen flex items-center justify-center">
                    <Projects />
                </section>

                <section id="skills" className="w-full min-h-screen flex items-center justify-center">
                    <Skills />
                </section>

                <section id="about" className="w-full min-h-screen flex items-center justify-center">
                    <About />
                </section>

                <section
                    id="footer"
                    className="relative w-full min-h-screen flex items-center justify-center transition-all duration-1000 ease-out"
                    style={{
                        opacity:       solved ? 1 : 0,
                        pointerEvents: solved ? "auto" : "none",
                        transform:     solved ? "translateY(0px)" : "translateY(48px)",
                    }}
                >
                    <div
                        className="absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-700"
                        style={{ opacity: solved ? 1 : 0 }}
                    >
                        <span className="text-[0.55rem] tracking-[0.38em] uppercase text-[rgba(252,212,53,0.75)]">
                            ✦ Cube solved — you made it
                        </span>
                    </div>
                    <Footer />
                </section>
            </main>
        </div>
    );
}