"use client";

import { useState } from "react";
import { BentoBox } from "./ui";
import { FaPaperPlane } from "react-icons/fa";

const inter = { style: { fontFamily: "var(--font-inter), sans-serif" } };
const interObj = { fontFamily: "var(--font-inter), sans-serif" };

type ToastType = "success" | "error" | "info";

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
    const color: Record<ToastType, string> = {
        success: "rgba(110,231,183,0.85)",
        error:   "rgba(252,100,100,0.75)",
        info:    "rgba(255,255,255,0.5)",
    };
    return (
        <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 rounded-xl"
            style={{ ...inter.style, background: "#0b0b12", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.5)", color: color[type] }}
        >
            <span className="text-sm font-normal tracking-wide">{message}</span>
            <button onClick={onClose} className="text-white/20 hover:text-white/50 transition-colors text-[0.6rem]">✕</button>
        </div>
    );
}

/* ── Redesigned contact form field ──────────────────────────────── */
function Field({
                   label,
                   children,
               }: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{
                ...interObj,
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
            }}>
                {label}
            </label>
            {children}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter), sans-serif",
    width: "100%",
    padding: "0.875rem 1.125rem",
    fontSize: "0.875rem",
    fontWeight: 400,
    letterSpacing: "0.01em",
    color: "rgba(255,255,255,0.75)",
    background: "rgba(255,255,255,0.03)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: "0.625rem",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
} as React.CSSProperties;

const focusStyle: React.CSSProperties = {
    borderColor: "rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.055)",
};

/* ─────────────────────────────────────────────────────────────────── */

export default function About() {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [focused, setFocused] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setToast({ message: "Sending...", type: "info" });
        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY as string);
        try {
            const res  = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
            const data: { success: boolean } = await res.json();
            if (data.success) { setToast({ message: "Message sent.", type: "success" }); form.reset(); }
            else               { setToast({ message: "Something went wrong.", type: "error" }); }
        } catch { setToast({ message: "Network error.", type: "error" }); }
    };

    const learning = [
        { name: "Docker",       desc: "Containerization"             },
        { name: "FastAPI",      desc: "API development"              },
        { name: "AWS / Vercel", desc: "Cloud platforms & deployment" },
        { name: "SEO",          desc: "Search engine optimization"   },
    ];

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center">
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-8 py-24">

                {/* Header — 5rem gap to match Projects */}
                <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                    <p style={{ ...interObj, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 500, marginBottom: "0.75rem" }}>
                        Who I am
                    </p>
                    <h1 style={{ ...interObj, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", color: "#ede9df", margin: 0 }}>
                        About Me
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

                    {/* About Me — 2 cols */}
                    <BentoBox title="About Me" accent className="lg:col-span-2">
                        <div className="space-y-4" style={inter.style}>
                            <p className="text-[0.9rem] font-normal leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                                Hey! I&apos;m{" "}
                                <span style={{ color: "rgba(237,233,223,0.9)" }}>Stian Gia Huy Ha</span>
                                , a developer who loves turning ideas into working applications.
                            </p>
                            <p className="text-[0.9rem] font-normal leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                                I build full-stack apps with{" "}
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.8rem]"
                                      style={{ color: "rgba(237,233,223,0.75)", background: "rgba(237,233,223,0.05)", border: "1px solid rgba(237,233,223,0.12)" }}>
                                    Next.js
                                </span>
                                , crafting interfaces on the front and working with Node.js and PostgreSQL on the back.
                            </p>
                            <p className="text-[0.9rem] font-normal leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                                Currently taking a master&apos;s degree in Data Science and looking to collaborate
                                on projects that make a real impact.
                            </p>
                        </div>
                    </BentoBox>

                    {/* Currently Learning */}
                    <BentoBox title="Currently Learning">
                        <ul style={{ ...inter.style, listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {learning.map(({ name, desc }) => (
                                <li key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "0.75rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(237,233,223,0.45)", flexShrink: 0, display: "inline-block" }} />
                                        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>{name}</span>
                                    </div>
                                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textAlign: "right" }}>{desc}</span>
                                </li>
                            ))}
                        </ul>
                    </BentoBox>

                    {/* Contact Form — redesigned, 2 cols */}
                    <BentoBox title="Contact Me" className="lg:col-span-2">
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                            {/* Name + Email row */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <Field label="Name">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        style={{ ...inputStyle, ...(focused === "name" ? focusStyle : {}) }}
                                        onFocus={() => setFocused("name")}
                                        onBlur={() => setFocused(null)}
                                    />
                                </Field>
                                <Field label="Email">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="john@example.com"
                                        required
                                        style={{ ...inputStyle, ...(focused === "email" ? focusStyle : {}) }}
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused(null)}
                                    />
                                </Field>
                            </div>

                            {/* Message */}
                            <Field label="Message">
                                <textarea
                                    name="message"
                                    placeholder="Tell me about your project or idea..."
                                    rows={5}
                                    required
                                    style={{
                                        ...inputStyle,
                                        resize: "none",
                                        ...(focused === "message" ? focusStyle : {}),
                                    }}
                                    onFocus={() => setFocused("message")}
                                    onBlur={() => setFocused(null)}
                                />
                            </Field>

                            <input type="hidden" name="subject"   value="New portfolio contact" />
                            <input type="hidden" name="from_name" value="My Portfolio" />

                            {/* Submit */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginTop: "0.25rem" }}>
                                <p style={{ ...interObj, fontSize: "0.72rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.02em" }}>
                                    I&apos;ll get back to you within 24 hours.
                                </p>
                                <button
                                    type="submit"
                                    style={{
                                        ...interObj,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.6rem",
                                        padding: "0.75rem 1.5rem",
                                        borderRadius: "0.625rem",
                                        fontSize: "0.72rem",
                                        fontWeight: 600,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
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
                                    <FaPaperPlane style={{ fontSize: "0.65rem" }} />
                                    Send Message
                                </button>
                            </div>

                        </form>
                    </BentoBox>

                    {/* Academic Journey */}
                    <BentoBox title="Academic Journey">
                        <div style={inter.style}>
                            <h3 className="font-medium text-[0.95rem] mb-1.5"
                                style={{ color: "rgba(237,233,223,0.9)" }}>
                                Data Science Student @ UiB
                            </h3>
                            <p className="text-[0.7rem] tracking-[0.2em] uppercase mb-4 font-medium"
                               style={{ color: "rgba(255,255,255,0.4)" }}>
                                2023 — Present
                            </p>
                            <p className="text-[0.85rem] font-normal leading-relaxed"
                               style={{ color: "rgba(255,255,255,0.5)" }}>
                                Integrated master&apos;s covering machine learning, mathematics, statistics,
                                software development, and data visualization — including industry internship
                                and master&apos;s thesis.
                            </p>
                        </div>
                    </BentoBox>

                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}