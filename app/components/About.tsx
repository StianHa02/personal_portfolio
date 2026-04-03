"use client";

import React, { useState } from "react";
import { BentoBox, Toast } from "./ui";
import { FaPaperPlane, FaGithub, FaLinkedin, FaEnvelope, FaCube } from "react-icons/fa";
import Image from "next/image";

type ToastType = "success" | "error" | "info";

const inter = { fontFamily: "var(--font-inter), sans-serif" };

const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter), sans-serif",
    width: "100%",
    padding: "0.65rem 0.875rem",
    fontSize: "0.8rem",
    fontWeight: 400,
    letterSpacing: "0.01em",
    color: "rgba(255,255,255,0.75)",
    background: "rgba(255,255,255,0.03)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: "0.5rem",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
};

const focusStyle: React.CSSProperties = {
    borderColor: "rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.055)",
};

export default function About() {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [focused, setFocused] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setToast({ message: "Sending...", type: "info" });
        const form = e.currentTarget;
        const data = new FormData(form);
        const payload = {
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
            name:    data.get("name"),
            email:   data.get("email"),
            message: data.get("message"),
            subject: "New portfolio contact",
            from_name: "My Portfolio",
        };
        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(payload),
            });
            const json: { success: boolean; message?: string } = await res.json();
            if (json.success) {
                setToast({ message: "Message sent!", type: "success" });
                form.reset();
            } else {
                setToast({ message: json.message ?? "Something went wrong.", type: "error" });
            }
        } catch {
            setToast({ message: "Network error — please try again.", type: "error" });
        }
    };

    return (
        <div className="relative w-full min-h-screen flex items-start justify-center">
            <div
                className="relative w-full max-w-6xl mx-auto"
                style={{
                    paddingTop: "clamp(2rem, 5dvh, 3.5rem)",
                    paddingBottom: "clamp(4rem, 8dvh, 6rem)",
                    paddingLeft: "clamp(1.5rem, 5vw, 2rem)",
                    paddingRight: "clamp(1.5rem, 5vw, 2rem)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h1 style={{ ...inter, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", color: "#ede9df", margin: 0 }}>
                        About Me
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-5">

                    {/* Left — About Me card */}
                    <BentoBox className="hover:translate-y-0!">
                        <div className="flex flex-col gap-6">
                            {/* Avatar + name */}
                            <div className="flex flex-col items-center md:flex-row md:items-center gap-4 md:gap-6">
                                    <div
                                        className="relative shrink-0 rounded-full overflow-hidden border-2"
                                        style={{
                                            width: 160,
                                            height: 160,
                                            borderColor: "rgba(255,255,255,0.15)",
                                            cursor: "pointer",
                                            transition: "border-color 0.2s",
                                        }}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                    {/* Default Avatar */}
                                    <Image
                                        src="/images/avatar.jpg"
                                        alt="Stian"
                                        width={160}
                                        height={160}
                                        priority
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            objectPosition: "center top",
                                            opacity: isHovered ? 0 : 1,
                                            transition: "opacity 0.2s ease-in-out",
                                        }}
                                    />
                                    {/* Hover Avatar */}
                                    <Image
                                        src="/images/avatar2.jpg"
                                        alt="Stian Hover"
                                        width={160}
                                        height={160}
                                        priority
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            objectPosition: "center top",
                                            opacity: isHovered ? 1 : 0,
                                            transition: "opacity 0.2s ease-in-out",
                                        }}
                                    />
                                </div>
                                <div className="text-center md:text-left" style={{ ...inter }}>
                                    <style>{`
                                        @keyframes wave {
                                            0%   { transform: rotate(0deg);   }
                                            15%  { transform: rotate(18deg);  }
                                            30%  { transform: rotate(-10deg); }
                                            45%  { transform: rotate(16deg);  }
                                            60%  { transform: rotate(-6deg);  }
                                            75%  { transform: rotate(10deg);  }
                                            100% { transform: rotate(0deg);   }
                                        }
                                        .wave-emoji { display: inline-block; transform-origin: 70% 70%; }
                                        .wave-trigger:hover .wave-emoji { animation: wave 0.9s ease; }
                                    `}</style>
                                    <span className="wave-trigger" style={{ fontSize: "2.25rem", fontWeight: 600, letterSpacing: "-0.02em", color: "rgba(237,233,223,0.95)", lineHeight: 1.15, display: "block" }}>
                                        Hey, I&apos;m Stian <span className="wave-emoji">👋</span>
                                    </span>
                                    <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", margin: "0.5rem 0 0" }}>
                                        Student &amp; Developer · Bergen, Norway
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="flex flex-col gap-2 text-center md:text-left" style={{ ...inter }}>
                                <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(255,255,255,0.6)", margin: 0 }}>
                                    A student and developer who loves turning ideas into applications.
                                </p>
                                <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                                    I build full-stack apps with{" "}
                                    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.1rem 0.45rem", borderRadius: "0.35rem", fontSize: "0.78rem", color: "rgba(237,233,223,0.75)", background: "rgba(237,233,223,0.05)", border: "1px solid rgba(237,233,223,0.12)" }}>
                                        Next.js
                                    </span>
                                    , designing interfaces on the front and working with Supabase on the back.
                                </p>
                                <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                                    Currently taking a master&apos;s degree in Data Science at UiB and looking to collaborate on projects that make a real impact.
                                </p>
                            </div>

                            {/* Social links */}
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem", flex: 1, display: "flex", alignItems: "center" }}>
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    {[
                                        { label: "GitHub",   href: "https://github.com/StianHa02",          icon: FaGithub   },
                                        { label: "LinkedIn", href: "https://www.linkedin.com/in/stian-gia-huy-ha/", icon: FaLinkedin },
                                        { label: "Email",    href: "mailto:Stianha02@hotmail.com",           icon: FaEnvelope },
                                        { label: "WCA",      href: "https://www.worldcubeassociation.org/persons/2018HAST01", icon: FaCube },
                                    ].map(({ label, href, icon: Icon }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target={href.startsWith("mailto") ? undefined : "_blank"}
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2.5 cursor-pointer"
                                            style={{
                                                ...inter,
                                                fontSize: "0.78rem",
                                                letterSpacing: "0.12em",
                                                textTransform: "uppercase",
                                                fontWeight: 500,
                                                color: "rgba(255,255,255,0.45)",
                                                textDecoration: "none",
                                                transition: "color 0.2s, background 0.2s, border-color 0.2s",
                                                padding: "0.7rem 1rem",
                                                borderRadius: "0.5rem",
                                                background: "rgba(255,255,255,0.03)",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                                                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                                                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                                            }}
                                        >
                                            <Icon style={{ fontSize: "1rem" }} />
                                            {label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </BentoBox>

                    {/* Right column — Academic Journey + Contact */}
                    <div className="flex flex-col gap-4 md:gap-5">

                        {/* Academic Journey */}
                        <BentoBox title="Academic Journey" className="hover:translate-y-0!">
                            <div style={{ ...inter, width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <div>
                                    <h3 style={{ fontSize: "0.95rem", fontWeight: 500, color: "rgba(237,233,223,0.9)", margin: 0, marginBottom: "0.25rem" }}>
                                        M.Sc. Data Science
                                    </h3>
                                    <p style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                                        University of Bergen (UiB)
                                    </p>
                                </div>
                                {/* Progress bar */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                    <div style={{ position: "relative", width: "100%", height: 4, borderRadius: 9999, background: "rgba(100,160,255,0.08)" }}>
                                        <div style={{
                                            width: `${Math.min(Math.max(((new Date().getFullYear() - 2023) / (2028 - 2023)) * 100, 0), 100)}%`,
                                            height: "100%",
                                            borderRadius: 9999,
                                            background: "linear-gradient(90deg, rgba(80,140,255,0.25), rgba(100,170,255,0.5))",
                                        }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "0.6rem", letterSpacing: "0.12em", fontWeight: 500, color: "rgba(100,160,255,0.5)" }}>2023</span>
                                        <span style={{ fontSize: "0.6rem", letterSpacing: "0.12em", fontWeight: 500, color: "rgba(100,160,255,0.25)" }}>2028</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.82rem", lineHeight: 1.6, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                                    Integrated Master&apos;s (Sivilingeniør) specializing in medical data science.
                                    Focusing on bridging the gap between data science and healthcare through machine learning and statistical modeling of clinical data.
                                </p>
                            </div>
                        </BentoBox>

                        {/* Contact — compact */}
                        <BentoBox title="Contact Me" className="hover:translate-y-0!">
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "0.625rem" }}>
                                    <input
                                        type="text" name="name" placeholder="Name" required
                                        style={{ ...inputStyle, ...(focused === "name" ? focusStyle : {}) }}
                                        onFocus={() => setFocused("name")}
                                        onBlur={() => setFocused(null)}
                                    />
                                    <input
                                        type="email" name="email" placeholder="Email" required
                                        style={{ ...inputStyle, ...(focused === "email" ? focusStyle : {}) }}
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused(null)}
                                    />
                                </div>
                                <textarea
                                    name="message" placeholder="Your message..." rows={2} required
                                    style={{ ...inputStyle, resize: "none", ...(focused === "message" ? focusStyle : {}) }}
                                    onFocus={() => setFocused("message")}
                                    onBlur={() => setFocused(null)}
                                />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                                    <p style={{ ...inter, fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.02em", margin: 0 }}>
                                        I&apos;ll get back to you within 24 hours.
                                    </p>
                                    <button
                                        type="submit"
                                        style={{
                                            ...inter,
                                            display: "flex", alignItems: "center", gap: "0.5rem",
                                            padding: "0.55rem 1.25rem",
                                            borderRadius: "0.5rem",
                                            fontSize: "0.68rem", fontWeight: 600,
                                            letterSpacing: "0.1em", textTransform: "uppercase",
                                            cursor: "pointer",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                            background: "rgba(255,255,255,0.05)",
                                            color: "rgba(255,255,255,0.65)",
                                            transition: "all 0.2s ease",
                                            flexShrink: 0,
                                        }}
                                        onMouseEnter={e => {
                                            const el = e.currentTarget;
                                            el.style.background = "rgba(255,255,255,0.1)";
                                            el.style.borderColor = "rgba(255,255,255,0.25)";
                                            el.style.color = "rgba(255,255,255,0.9)";
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget;
                                            el.style.background = "rgba(255,255,255,0.05)";
                                            el.style.borderColor = "rgba(255,255,255,0.12)";
                                            el.style.color = "rgba(255,255,255,0.65)";
                                        }}
                                    >
                                        <FaPaperPlane style={{ fontSize: "0.6rem" }} />
                                        Send
                                    </button>
                                </div>
                            </form>
                        </BentoBox>
                    </div>

                </div>
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} duration={4000} />
            )}
        </div>
    );
}
