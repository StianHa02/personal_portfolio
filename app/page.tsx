"use client";

import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Footer from "./components/Footer";
import CubeRenderer from "./components/CubeRenderer";
import RightDotNav from "./components/ui/RightDotNav";

const NAV_SECTIONS = [
    { id: "hero",     label: "Home"     },
    { id: "projects", label: "Projects" },
    { id: "skills",   label: "Skills"   },
    { id: "about",    label: "About"    },
    { id: "footer",   label: "Finale"   },
];

export default function Home() {
    const [sp, setSp]                = useState(0);
    const [activeSection, setActive] = useState("hero");

    useEffect(() => {
        const fn = () => {
            const footerEl = document.getElementById("footer");
            if (!footerEl) return;

            const footerTop = footerEl.offsetTop;
            if (footerTop <= 0) { setSp(0); return; }

            // Use the smaller of footerTop and max possible scroll so sp can always reach 1
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const raw = window.scrollY / Math.min(footerTop, Math.max(maxScroll, 1));
            setSp(Math.min(Math.max(raw, 0), 1));
        };
        window.addEventListener("scroll", fn, { passive: true });
        fn();
        const timeout = setTimeout(fn, 100);
        return () => {
            window.removeEventListener("scroll", fn);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        const fn = () => {
            // Find whichever section's centre is closest to the viewport centre.
            // Works reliably on mobile where sections are taller than 100svh.
            const viewMid = window.scrollY + window.innerHeight / 2;
            let best = NAV_SECTIONS[0].id;
            let bestDist = Infinity;
            NAV_SECTIONS.forEach(s => {
                const el = document.getElementById(s.id);
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const elMid = window.scrollY + rect.top + rect.height / 2;
                const dist = Math.abs(viewMid - elMid);
                if (dist < bestDist) { bestDist = dist; best = s.id; }
            });
            setActive(best);
        };
        window.addEventListener("scroll", fn, { passive: true });
        fn();
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    };

    const solved = sp >= 1;

    // Dim the cube as soon as the user starts scrolling (works on mobile immediately).
    // Restore to full when back at hero (sp ≈ 0) or when the cube is solved.
    const cubeOpacity = solved ? 1 : sp < 0.015 ? 1 : 0.18;
    const cubeInteractive = activeSection === "hero" || (solved && activeSection === "footer");

    return (
        <div className="relative bg-[#0e0e16]">
            <CubeRenderer sp={sp} opacity={cubeOpacity} logoSrc="/favicon.ico" interactionEnabled={cubeInteractive} />


            <RightDotNav
                sections={NAV_SECTIONS.map(s => s.id === "footer" ? { ...s, label: solved ? "Solved!" : s.label } : s)}
                activeSection={activeSection}
                solved={solved}
                onNavigate={scrollTo}
            />

            {/* Scroll indicator — fixed to bottom of viewport, fades out on scroll */}
            <div
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:flex flex-col items-center gap-2"
                style={{
                    opacity: sp < 0.015 ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    pointerEvents: "none",
                }}
            >
                <span className="text-[0.7rem] tracking-[0.35em] uppercase font-semibold text-[#fcd435]"
                      style={{ textShadow: "0 0 14px rgba(252,212,53,0.5)" }}>
                    Scroll to solve
                </span>
                <svg
                    className="animate-bounce"
                    width="20" height="20" viewBox="0 0 24 24" fill="none"
                    style={{ filter: "drop-shadow(0 0 6px rgba(252,212,53,0.6))" }}
                >
                    <path d="M7 10l5 5 5-5" stroke="#fcd435" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <main className="relative z-10">
                <section id="hero" className="w-full" style={{ minHeight: "100lvh" }}>
                    <Hero />
                </section>

                <section id="projects" className="w-full flex items-center justify-center" style={{ minHeight: "100lvh" }}>
                    <Projects />
                </section>

                <section id="skills" className="w-full flex items-center justify-center" style={{ minHeight: "100lvh" }}>
                    <Skills />
                </section>

                <section id="about" className="w-full flex items-center justify-center" style={{ minHeight: "100lvh" }}>
                    <About />
                </section>

                <section
                    id="footer"
                    className="relative w-full transition-all duration-1000 ease-out overflow-hidden"
                    style={{
                        height: "100lvh",
                        opacity:       solved ? 1 : 0,
                        pointerEvents: solved ? "auto" : "none",
                    }}
                >
                    <div
                        className="absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-700 z-20"
                        style={{ opacity: solved ? 1 : 0 }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <svg className="animate-bounce" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 0 8px rgba(252,212,53,0.8))" }}>
                                <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="#fcd435" />
                            </svg>
                            <span className="text-[0.6rem] tracking-[0.45em] uppercase font-bold text-[#fcd435]"
                                  style={{ textShadow: "0 0 15px rgba(252,212,53,0.5)" }}>
                                Cube Solved
                            </span>
                        </div>
                    </div>
                    <Footer />
                </section>
            </main>
        </div>
    );
}