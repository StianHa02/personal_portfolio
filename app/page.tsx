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
    { id: "footer",   label: "Contact"  },
];

export default function Home() {
    const [sp, setSp]                = useState(0);
    const [activeSection, setActive] = useState("hero");

    useEffect(() => {
        const fn = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setSp(max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0);
        };
        window.addEventListener("scroll", fn, { passive: true });
        fn(); // run once on mount
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { threshold: 0.3 }
        );
        NAV_SECTIONS.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        if (id === "footer") {
            // Scroll to absolute bottom so sp reaches 1.0 and cube is fully solved
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const solved = sp > 0.92;

    // Dim the cube on content sections (projects, skills, about)
    const isMiddleSection = activeSection === "projects" || activeSection === "skills" || activeSection === "about";
    const cubeOpacity = isMiddleSection ? 0.18 : 1;

    return (
        <div className="relative bg-[#0e0e16]">
            <CubeRenderer sp={Math.min(sp, 1)} opacity={cubeOpacity} />

            <RightDotNav sections={NAV_SECTIONS} activeSection={activeSection} solved={solved} onNavigate={scrollTo} />

            <main className="relative z-10">
                <section id="hero" className="w-full min-h-screen">
                    <div
                        className="absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-700 z-20"
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
                    className="relative w-full min-h-screen transition-all duration-1000 ease-out"
                    style={{
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
                            {/* The Festive Emoji with a glow */}
                            <span className="text-xl animate-bounce" style={{ filter: "drop-shadow(0 0 8px rgba(252,212,53,0.8))" }}>
            ✨
        </span>

                            {/* The Text */}
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