"use client";

import { useState } from "react";
import { BentoBox, Toast } from "./ui";
import { FaPaperPlane } from "react-icons/fa";
import Image from "next/image";

type ToastType = "success" | "error" | "info";

const inter = { fontFamily: "var(--font-inter), sans-serif" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{
                ...inter,
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase" as const,
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
};

const focusStyle: React.CSSProperties = {
    borderColor: "rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.055)",
};

export default function About() {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [focused, setFocused] = useState<string | null>(null);
    const [avatarSrc, setAvatarSrc] = useState<string>("/images/avatar.jpg");

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
        <div className="relative w-full min-h-screen flex items-center justify-center">
            <div
                className="relative w-full max-w-7xl mx-auto"
                style={{
                    paddingTop: "clamp(5rem, 20dvh, 12rem)",
                    paddingBottom: "clamp(4rem, 8dvh, 6rem)",
                    paddingLeft: "clamp(1.5rem, 5vw, 2rem)",
                    paddingRight: "clamp(1.5rem, 5vw, 2rem)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                    <h1 style={{ ...inter, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", color: "#ede9df", margin: 0 }}>
                        About Me
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

                    {/* About Me — 2 cols */}
                    <BentoBox className="lg:col-span-2 hover:!translate-y-0">
                        {/* Responsive: stacks on mobile, side-by-side on md+ */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
                            {/* Round avatar — fills height on desktop, fixed size on mobile */}
                            <div
                                className="shrink-0 rounded-full overflow-hidden border-2 self-center"
                                style={{
                                    width: "clamp(80px, 18vw, 160px)",
                                    height: "clamp(80px, 18vw, 160px)",
                                    borderColor: "rgba(255,255,255,0.15)",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                                    setAvatarSrc("/images/avatar2.jpg");
                                    const el = e.currentTarget as HTMLDivElement;
                                    el.style.borderColor = "rgba(255,255,255,0.4)";
                                    el.style.boxShadow = "0 0 20px rgba(255,255,255,0.1)";
                                }}
                                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                    setAvatarSrc("/images/avatar.jpg");
                                    const el = e.currentTarget as HTMLDivElement;
                                    el.style.borderColor = "rgba(255,255,255,0.15)";
                                    el.style.boxShadow = "none";
                                }}
                            >
                                <Image
                                    key={avatarSrc}
                                    src={avatarSrc}
                                    alt="Stian"
                                    width={160}
                                    height={160}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                                />
                                <Image
                                    src="/images/avatar2.jpg"
                                    alt=""
                                    width={160}
                                    height={160}
                                    style={{ display: "none" }}
                                    priority
                                />
                            </div>

                            {/* Text — centered on mobile, left-aligned and vertically centered on desktop */}
                            <div className="flex flex-col justify-center gap-1.5 text-center md:text-left" style={{ ...inter }}>
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
                                <span className="wave-trigger" style={{ fontSize: "1.9rem", fontWeight: 600, letterSpacing: "-0.02em", color: "rgba(237,233,223,0.95)", lineHeight: 1.1, marginBottom: "0.5rem", display: "block" }}>
                                    Hey, I&apos;m Stian <span className="wave-emoji">👋</span>
                                </span>
                                <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(255,255,255,0.6)", margin: 0 }}>
                                    A student and developer who loves turning ideas into polished applications.
                                </p>
                                <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                                    I build full-stack apps with{" "}
                                    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.1rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.8rem", color: "rgba(237,233,223,0.75)", background: "rgba(237,233,223,0.05)", border: "1px solid rgba(237,233,223,0.12)" }}>
                                        Next.js
                                    </span>
                                    , designing interfaces on the front and working with Node.js and PostgreSQL on the back.
                                </p>
                                <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                                    Currently taking a master&apos;s degree in Data Science at UiB and looking to collaborate on projects that make a real impact.
                                </p>
                            </div>
                        </div>
                    </BentoBox>

                    {/* Academic Journey — 1 col */}
                    <BentoBox title="Academic Journey" className="hover:!translate-y-0">
                        <div style={{ ...inter, width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                                    <h3 style={{ fontSize: "0.95rem", fontWeight: 500, color: "rgba(237,233,223,0.9)", margin: 0 }}>
                                        M.Sc. Data Science
                                    </h3>
                                    <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.35)", flexShrink: 0, marginLeft: "0.75rem" }}>
                                        2023 — Now
                                    </span>
                                </div>
                                <p style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                                    University of Bergen (UiB)
                                </p>
                            </div>
                            <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                                Integrated Master’s (Sivilingeniør) specializing in medical data science.
                                Focusing on bridging the gap between data science and healthcare through machine learning and statistical modeling of clinical data.
                            </p>
                        </div>
                    </BentoBox>

                    {/* Contact Form — full 3 cols */}
                    <BentoBox title="Contact Me" className="lg:col-span-3 hover:!translate-y-0">
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <Field label="Name">
                                    <input
                                        type="text" name="name" placeholder="John Doe" required
                                        style={{ ...inputStyle, ...(focused === "name" ? focusStyle : {}) }}
                                        onFocus={() => setFocused("name")}
                                        onBlur={() => setFocused(null)}
                                    />
                                </Field>
                                <Field label="Email">
                                    <input
                                        type="email" name="email" placeholder="john@example.com" required
                                        style={{ ...inputStyle, ...(focused === "email" ? focusStyle : {}) }}
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused(null)}
                                    />
                                </Field>
                            </div>
                            <Field label="Message">
                                <textarea
                                    name="message" placeholder="Tell me about your project or idea..." rows={3} required
                                    style={{ ...inputStyle, resize: "none", ...(focused === "message" ? focusStyle : {}) }}
                                    onFocus={() => setFocused("message")}
                                    onBlur={() => setFocused(null)}
                                />
                            </Field>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginTop: "0.25rem" }}>
                                <p style={{ ...inter, fontSize: "0.72rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.02em", margin: 0 }}>
                                    I&apos;ll get back to you within 24 hours.
                                </p>
                                <button
                                    type="submit"
                                    style={{
                                        ...inter,
                                        display: "flex", alignItems: "center", gap: "0.6rem",
                                        padding: "0.75rem 1.5rem",
                                        borderRadius: "0.625rem",
                                        fontSize: "0.72rem", fontWeight: 600,
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
                                    <FaPaperPlane style={{ fontSize: "0.65rem" }} />
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </BentoBox>

                </div>
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} duration={4000} />
            )}
        </div>
    );
}