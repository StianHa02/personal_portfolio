"use client";

import { useState } from "react";
import { BentoBox } from "./ui";
import { FaPaperPlane } from "react-icons/fa";

const inter = { style: { fontFamily: "var(--font-inter), sans-serif" } };

type ToastType = "success" | "error" | "info";

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
    const color: Record<ToastType, string> = {
        success: "rgba(237,233,223,0.65)",
        error:   "rgba(252,100,100,0.65)",
        info:    "rgba(255,255,255,0.4)",
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

export default function About() {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

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

    const fieldStyle: React.CSSProperties = {
        fontFamily: "var(--font-inter), sans-serif",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.7)",
        borderRadius: "0.5rem",
    };

    const inputClass = `w-full px-5 py-3.5 text-[0.85rem] font-normal tracking-wide placeholder:text-white/20
        focus:outline-none focus:border-white/20 transition-colors duration-300`;

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center">
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-8 py-24">

                <div className="text-center mb-16">
                    <p className="text-[0.65rem] tracking-[0.35em] uppercase text-white/50 font-medium mb-3"
                       style={inter.style}>
                        Who I am
                    </p>
                    <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-[#ede9df]"
                        style={inter.style}>
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
                        <ul className="space-y-5" style={inter.style}>
                            {learning.map(({ name, desc }) => (
                                <li key={name} className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full shrink-0"
                                          style={{ background: "rgba(237,233,223,0.45)" }} />
                                    <span className="text-[0.85rem] font-normal leading-snug"
                                          style={{ color: "rgba(255,255,255,0.55)" }}>
                                        <span style={{ color: "rgba(255,255,255,0.8)" }}>{name}</span>
                                        <span style={{ color: "rgba(255,255,255,0.25)" }}> — </span>
                                        {desc}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </BentoBox>

                    {/* Contact Form — 2 cols */}
                    <BentoBox title="Contact Me" className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[0.65rem] tracking-[0.2em] uppercase font-medium"
                                           style={{ ...inter.style, color: "rgba(255,255,255,0.35)" }}>Name</label>
                                    <input type="text" name="name" placeholder="John Doe" required
                                           className={inputClass} style={fieldStyle} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[0.65rem] tracking-[0.2em] uppercase font-medium"
                                           style={{ ...inter.style, color: "rgba(255,255,255,0.35)" }}>Email</label>
                                    <input type="email" name="email" placeholder="john@example.com" required
                                           className={inputClass} style={fieldStyle} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.65rem] tracking-[0.2em] uppercase font-medium"
                                       style={{ ...inter.style, color: "rgba(255,255,255,0.35)" }}>Message</label>
                                <textarea name="message" placeholder="Tell me about your project or idea..." rows={5} required
                                          className={`${inputClass} resize-none`} style={fieldStyle} />
                            </div>
                            <input type="hidden" name="subject"   value="New portfolio contact" />
                            <input type="hidden" name="from_name" value="My Portfolio" />

                            <button type="submit"
                                    className="self-start flex items-center gap-3 rounded-xl transition-all duration-300 cursor-pointer"
                                    style={{
                                        ...inter.style,
                                        padding: "0.75rem 1.75rem",
                                        background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        color: "rgba(255,255,255,0.6)",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                                    }}>
                                <FaPaperPlane className="text-xs" />
                                <span className="text-[0.75rem] tracking-[0.1em] uppercase font-medium">Send Message</span>
                            </button>
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