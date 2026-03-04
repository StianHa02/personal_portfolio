"use client";

import { useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { BentoBox } from "./ui";
import { FaPaperPlane } from "react-icons/fa";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
});

type ToastType = "success" | "error" | "info";

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
    const color: Record<ToastType, string> = {
        success: "rgba(237,233,223,0.65)",
        error:   "rgba(252,100,100,0.65)",
        info:    "rgba(255,255,255,0.4)",
    };
    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 rounded-xl ${cormorant.className}`}
            style={{ background: "#0b0b12", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.5)", color: color[type] }}
        >
            <span className="text-sm font-light tracking-wide">{message}</span>
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
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.55)",
        borderRadius: "0.5rem",
    };

    const inputClass = `w-full p-3 text-sm font-light tracking-wide placeholder:text-white/18
        focus:outline-none transition-colors duration-300 ${cormorant.className}`;

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center">
            <div className="relative w-full max-w-7xl mx-auto px-6 md:px-8 py-24">

                <div className="text-center mb-12">
                    <p className={`text-[0.6rem] tracking-[0.4em] uppercase text-white/30 font-light mb-3 ${cormorant.className}`}>
                        Who I am
                    </p>
                    <h1 className={`text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-[#ede9df] ${cormorant.className}`}>
                        About Me
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

                    {/* About Me — 2 cols */}
                    <BentoBox title="About Me" accent className="lg:col-span-2">
                        <div className={`space-y-4 ${cormorant.className}`}>
                            <p className="text-base font-light leading-relaxed tracking-wide" style={{ color: "rgba(255,255,255,0.42)" }}>
                                Hey! I&apos;m{" "}
                                <span style={{ color: "rgba(237,233,223,0.78)" }}>Stian Gia Huy Ha</span>
                                , a developer who loves turning ideas into working applications.
                            </p>
                            <p className="text-base font-light leading-relaxed tracking-wide" style={{ color: "rgba(255,255,255,0.36)" }}>
                                I build full-stack apps with{" "}
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm"
                                      style={{ color: "rgba(237,233,223,0.58)", background: "rgba(237,233,223,0.05)", border: "1px solid rgba(237,233,223,0.12)" }}>
                                    Next.js
                                </span>
                                , crafting interfaces on the front and working with Node.js and PostgreSQL on the back.
                            </p>
                            <p className="text-base font-light leading-relaxed tracking-wide" style={{ color: "rgba(255,255,255,0.3)" }}>
                                Currently taking a master&apos;s degree in Data Science and looking to collaborate
                                on projects that make a real impact.
                            </p>
                        </div>
                    </BentoBox>

                    {/* Currently Learning */}
                    <BentoBox title="Currently Learning">
                        <ul className="space-y-4">
                            {learning.map(({ name, desc }) => (
                                <li key={name} className="flex items-start gap-3">
                                    <span className="mt-[0.42rem] w-1.5 h-1.5 rounded-full shrink-0"
                                          style={{ background: "rgba(237,233,223,0.3)" }} />
                                    <span className={`text-sm font-light leading-snug tracking-wide ${cormorant.className}`}
                                          style={{ color: "rgba(255,255,255,0.35)" }}>
                                        <span style={{ color: "rgba(255,255,255,0.55)" }}>{name}</span>
                                        <span style={{ color: "rgba(255,255,255,0.2)" }}> — </span>
                                        {desc}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </BentoBox>

                    {/* Contact Form — 2 cols */}
                    <BentoBox title="Contact Me" className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid md:grid-cols-2 gap-3">
                                <input type="text"  name="name"  placeholder="Your name"  required className={inputClass} style={fieldStyle} />
                                <input type="email" name="email" placeholder="Your email" required className={inputClass} style={fieldStyle} />
                            </div>
                            <textarea name="message" placeholder="Your message" rows={4} required
                                      className={`${inputClass} resize-none`} style={fieldStyle} />
                            <input type="hidden" name="subject"   value="New portfolio contact" />
                            <input type="hidden" name="from_name" value="My Portfolio" />

                            <button type="submit"
                                    className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors duration-300 cursor-pointer ${cormorant.className}`}
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.4)" }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.68)")}
                                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                                <FaPaperPlane className="text-xs" />
                                <span className="text-[0.62rem] tracking-[0.3em] uppercase font-light">Send Message</span>
                            </button>
                        </form>
                    </BentoBox>

                    {/* Academic Journey */}
                    <BentoBox title="Academic Journey">
                        <div className="relative pl-5">
                            <div className="absolute left-0 top-1 bottom-0 w-px"
                                 style={{ background: "linear-gradient(to bottom, rgba(237,233,223,0.22), transparent)" }} />
                            <div className="absolute left-[-3px] top-[0.4rem] w-[7px] h-[7px] rounded-full"
                                 style={{ background: "rgba(237,233,223,0.4)", boxShadow: "0 0 8px rgba(237,233,223,0.2)" }} />

                            <h3 className={`font-light text-sm mb-1 tracking-wide ${cormorant.className}`}
                                style={{ color: "rgba(237,233,223,0.68)" }}>
                                Data Science Student @ UiB
                            </h3>
                            <p className={`text-[0.58rem] tracking-[0.3em] uppercase mb-3 font-light ${cormorant.className}`}
                               style={{ color: "rgba(255,255,255,0.25)" }}>
                                2023 — Present
                            </p>
                            <p className={`text-sm font-light leading-relaxed tracking-wide ${cormorant.className}`}
                               style={{ color: "rgba(255,255,255,0.3)" }}>
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