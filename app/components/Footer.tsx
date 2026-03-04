"use client";

import { Cormorant_Garamond } from "next/font/google";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
});

const links = [
    { label: "GitHub",   href: "https://github.com/StianHa02",          icon: FaGithub   },
    { label: "LinkedIn", href: "https://linkedin.com/in/stianha",        icon: FaLinkedin },
    { label: "Email",    href: "mailto:hello@stianha.com",               icon: FaEnvelope },
];

export default function Footer() {
    return (
        <div className="relative w-full min-h-screen flex flex-col items-start justify-end"
             style={{ paddingBottom: "10rem", paddingLeft: "clamp(2rem, 6vw, 9rem)", paddingRight: "4rem" }}>
            <div className={`flex flex-col items-start gap-8 max-w-2xl ${cormorant.className}`}>

                <p className="text-[0.7rem] tracking-[0.4em] uppercase text-white/70 font-light">
                    Get in touch
                </p>

                <h1 className="text-[clamp(3rem,10vw,7rem)] font-light leading-[0.9] tracking-[-0.02em] text-white">
                    Let&apos;s work<br />together.
                </h1>

                <p className="text-lg font-light text-white/80 max-w-sm leading-relaxed tracking-wide">
                    Open to internships, freelance projects, and interesting collaborations.
                </p>

                <div className="flex items-center gap-10 mt-4">
                    {links.map(({ label, href, icon: Icon }) => (
                        <a
                            key={label}
                            href={href}
                            target={href.startsWith("mailto") ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-white/60 hover:text-white/90 transition-colors duration-300"
                        >
                            <Icon className="text-base" />
                            <span className="text-[0.7rem] tracking-[0.3em] uppercase font-light">
                                {label}
                            </span>
                        </a>
                    ))}
                </div>

                <div className="mt-12 pt-8 w-full flex items-center gap-12" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                    <span className="text-[0.6rem] tracking-[0.3em] uppercase text-white/50 font-light">
                        © {new Date().getFullYear()} Stian Gia Huy Ha
                    </span>
                    <span className="text-[0.6rem] tracking-[0.3em] uppercase text-white/50 font-light">
                        Bergen, Norway
                    </span>
                </div>
            </div>
        </div>
    );
}