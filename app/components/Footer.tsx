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
        <div className="relative w-full min-h-screen flex flex-col items-start justify-end pb-[11vh] px-8">
            <div className={`flex flex-col items-start gap-6 ${cormorant.className}`}>

                <p className="text-[0.6rem] tracking-[0.4em] uppercase text-white/30 font-light">
                    Get in touch
                </p>

                <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-light leading-none tracking-[-0.02em] text-[#ede9df]">
                    Let&apos;s work<br />together.
                </h1>

                <p className="text-base font-light text-white/40 max-w-sm leading-relaxed tracking-wide">
                    Open to internships, freelance projects, and interesting collaborations.
                </p>

                <div className="flex items-center gap-8 mt-2">
                    {links.map(({ label, href, icon: Icon }) => (
                        <a
                            key={label}
                            href={href}
                            target={href.startsWith("mailto") ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-white/25 hover:text-white/60 transition-colors duration-300"
                        >
                            <Icon className="text-sm" />
                            <span className="text-[0.65rem] tracking-[0.3em] uppercase font-light">
                                {label}
                            </span>
                        </a>
                    ))}
                </div>

                <div className="mt-8 pt-8 w-full flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[0.55rem] tracking-[0.3em] uppercase text-white/15 font-light">
                        © {new Date().getFullYear()} Stian Gia Huy Ha
                    </span>
                    <span className="text-[0.55rem] tracking-[0.3em] uppercase text-white/15 font-light">
                        Bergen, Norway
                    </span>
                </div>

            </div>
        </div>
    );
}