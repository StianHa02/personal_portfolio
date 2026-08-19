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
        // iOS Safari changes `innerHeight` as the URL bar collapses and expands. Reading
        // it per scroll tick makes `maxScroll` — and so `sp` — jump while the bar moves,
        // which the cube then animates. Hold the height still and only refresh it on a
        // width change, i.e. a real rotation or window resize.
        let viewportH = window.innerHeight;
        let viewportW = window.innerWidth;
        const onResize = () => {
            if (window.innerWidth === viewportW) return;
            viewportW = window.innerWidth;
            viewportH = window.innerHeight;
        };

        let last = -1;
        const measure = () => {
            const footerEl = document.getElementById("footer");
            if (!footerEl) return;

            const footerTop = footerEl.offsetTop;
            if (footerTop <= 0) { setSp(0); return; }

            // Use the smaller of footerTop and max possible scroll so sp can always reach 1
            const maxScroll = document.documentElement.scrollHeight - viewportH;
            const raw = window.scrollY / Math.min(footerTop, Math.max(maxScroll, 1));
            const next = Math.min(Math.max(raw, 0), 1);
            // Below this the cube's own frame loop ignores the change anyway, so a
            // re-render of the whole page would buy nothing.
            if (Math.abs(next - last) < 0.0005) return;
            last = next;
            setSp(next);
        };

        // Coalesce to one measurement per frame — scroll fires far more often than that,
        // and each uncoalesced call re-rendered the entire page tree.
        let ticking = false;
        const fn = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => { ticking = false; measure(); });
        };

        window.addEventListener("scroll", fn, { passive: true });
        window.addEventListener("resize", onResize);
        measure();
        const timeout = setTimeout(measure, 100);
        return () => {
            window.removeEventListener("scroll", fn);
            window.removeEventListener("resize", onResize);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        let current = NAV_SECTIONS[0].id;
        const measure = () => {
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
            // Only re-render when the section actually changes — this ran five
            // getBoundingClientRect calls and a setState on every scroll event.
            if (best === current) return;
            current = best;
            setActive(best);
        };

        let ticking = false;
        const fn = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => { ticking = false; measure(); });
        };

        window.addEventListener("scroll", fn, { passive: true });
        measure();
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
    // Layers can only be turned in the hero. In the footer the cube is the payoff —
    // draggable to look at, but not re-scrambleable.
    const cubeTurnable = activeSection === "hero";

    return (
        <div className="relative bg-[#0e0e16]">
            <CubeRenderer sp={sp} opacity={cubeOpacity} logoSrc="/favicon.ico" interactionEnabled={cubeInteractive} turnsEnabled={cubeTurnable} />


            <RightDotNav
                sections={NAV_SECTIONS.map(s => s.id === "footer" ? { ...s, label: solved ? "Solved!" : s.label } : s)}
                activeSection={activeSection}
                solved={solved}
                onNavigate={scrollTo}
            />

            {/* Scroll indicator — fixed to bottom of viewport, fades out on scroll */}
            <div
                className="fixed bottom-8 left-1/2 z-50 hidden -translate-x-1/2 flex-col items-center gap-2 pointer-events-none transition-opacity duration-[400ms] ease-[ease] md:flex"
                style={{
                    opacity: sp < 0.015 ? 1 : 0,
                }}
            >
                <span className="text-[0.7rem] tracking-[0.35em] uppercase font-semibold text-[#fcd435] [text-shadow:0_0_14px_rgba(252,212,53,0.5)]">
                    Scroll to solve
                </span>
                <svg
                    className="animate-bounce [filter:drop-shadow(0_0_6px_rgba(252,212,53,0.6))]"
                    width="20" height="20" viewBox="0 0 24 24" fill="none"
                >
                    <path d="M7 10l5 5 5-5" stroke="#fcd435" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <main className="relative z-10">
                <section id="hero" className="w-full min-h-[100lvh]">
                    <Hero />
                </section>

                <section id="projects" className="w-full min-h-[100lvh] flex items-center justify-center">
                    <Projects />
                </section>

                <section id="skills" className="w-full min-h-[100lvh] flex items-center justify-center">
                    <Skills />
                </section>

                <section id="about" className="w-full min-h-[100lvh] flex items-center justify-center">
                    <About />
                </section>

                <section
                    id="footer"
                    className="relative w-full h-[100lvh] transition-all duration-1000 ease-out overflow-hidden"
                    style={{
                        opacity:       solved ? 1 : 0,
                        pointerEvents: solved ? "auto" : "none",
                    }}
                >
                    <div
                        className="absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-700 z-20"
                        style={{ opacity: solved ? 1 : 0 }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <svg className="animate-bounce [filter:drop-shadow(0_0_8px_rgba(252,212,53,0.8))]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="#fcd435" />
                            </svg>
                            <span className="text-[0.6rem] tracking-[0.45em] uppercase font-bold text-[#fcd435] [text-shadow:0_0_15px_rgba(252,212,53,0.5)]">
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
