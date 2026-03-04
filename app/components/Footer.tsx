"use client";

import { Cormorant_Garamond } from "next/font/google";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
});

const links = [
    { label: "GitHub",   href: "https://github.com/StianHa02",          icon: FaGithub   },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/stian-gia-huy-ha/",        icon: FaLinkedin },
    { label: "Email",    href: "mailto:Stianha02@hotmail.com",               icon: FaEnvelope },
];

export default function Footer() {
    return (
        <div className="relative w-full flex flex-col items-start justify-end"
             style={{ height: "100%", paddingBottom: "10rem", paddingLeft: "clamp(2rem, 6vw, 9rem)", paddingRight: "4rem" }}>
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


            </div>
        </div>
    );
}