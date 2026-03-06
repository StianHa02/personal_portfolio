"use client";

import { useEffect, useRef, useState } from "react";
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
    { id: "footer",   label: "Contact"  },
];

const SNAP_THRESHOLD = 20;

export default function Home() {
    const [sp, setSp]                = useState(0);
    const [activeSection, setActive] = useState("hero");

    useEffect(() => {
        const fn = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (max <= 0) { setSp(0); return; }

            const raw = window.scrollY / max;

            // Snap to exactly 1 when within SNAP_THRESHOLD px of the bottom,
            // so fast scrolling always triggers the solved state.
            const atBottom = window.scrollY >= max - SNAP_THRESHOLD;
            setSp(atBottom ? 1 : Math.min(Math.max(raw, 0), 1));
        };
        window.addEventListener("scroll", fn, { passive: true });
        fn();
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => {
        const fn = () => {
            // Find whichever section's centre is closest to the viewport centre.
            // Works reliably on mobile where sections are taller than 100dvh.
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

    const solved = sp >= 0.97;
    const hasSnapped = useRef(false);

    // Once solved, snap scroll position to the true bottom exactly once,
    // so no leftover scroll distance remains after the snap threshold kicked in early.
    // Using a ref prevents this from re-firing and hijacking subsequent navigation.
    useEffect(() => {
        if (!solved || hasSnapped.current) return;
        hasSnapped.current = true;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY < max) {
            window.scrollTo({ top: max, behavior: "smooth" });
        }
    }, [solved]);

    // Dim the cube as soon as the user starts scrolling (works on mobile immediately).
    // Restore to full when back at hero (sp ≈ 0) or when the cube is solved.
    const cubeOpacity = solved ? 1 : sp < 0.015 ? 1 : 0.18;

    return (
        <div className="relative bg-[#0e0e16]">
            <CubeRenderer sp={sp} opacity={cubeOpacity} logoSrc="/favicon.ico" />


            <RightDotNav sections={NAV_SECTIONS} activeSection={activeSection} solved={solved} onNavigate={scrollTo} />

            <main className="relative z-10">
                <section id="hero" className="w-full" style={{ minHeight: "100dvh" }}>
                    <div
                        className="absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-700 z-20 text-center"
                        style={{ opacity: solved ? 1 : 1 }}
                    >
                        <span className="text-[0.6rem] tracking-[0.45em] uppercase font-bold text-[#fcd435] ">
                            Scroll down to solve the cube
                        </span>
                    </div>
                    <Hero />
                </section>

                <section id="projects" className="w-full flex items-center justify-center" style={{ minHeight: "100dvh" }}>
                    <Projects />
                </section>

                <section id="skills" className="w-full flex items-center justify-center" style={{ minHeight: "100dvh" }}>
                    <Skills />
                </section>

                <section id="about" className="w-full flex items-center justify-center" style={{ minHeight: "100dvh" }}>
                    <About />
                </section>

                <section
                    id="footer"
                    className="relative w-full transition-all duration-1000 ease-out overflow-hidden"
                    style={{
                        height: "100dvh",
                        opacity:       solved ? 1 : 0,
                        pointerEvents: solved ? "auto" : "none",
                        transform:     solved ? "translateY(0px)" : "translateY(48px)",
                    }}
                >
                    <div
                        className="absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-700 z-20"
                        style={{ opacity: solved ? 1 : 0 }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xl animate-bounce" style={{ filter: "drop-shadow(0 0 8px rgba(252,212,53,0.8))" }}>
                                ✨
                            </span>
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