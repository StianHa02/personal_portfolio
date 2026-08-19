"use client";

import React, { useState } from "react";
import { BentoBox, Toast } from "./ui";
import { FaPaperPlane, FaGithub, FaLinkedin, FaEnvelope, FaCube } from "react-icons/fa";
import Image from "next/image";

type ToastType = "success" | "error" | "info";

const inputClassName = "w-full box-border rounded-sm border border-line bg-inset py-[0.65rem] px-[0.875rem] text-[0.8rem] font-normal tracking-[0.01em] text-ink-soft outline-none transition-[border-color,background] duration-200 focus:border-line-strong focus:bg-accent";

export default function About() {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
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
            <div className="relative w-full max-w-6xl mx-auto pt-[clamp(2rem,5dvh,3.5rem)] pb-[clamp(4rem,8dvh,6rem)] px-[clamp(1.5rem,5vw,2rem)]">
                <div className="text-center mb-10">
                    <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-ink">
                        About Me
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-5">

                    {/* Left — About Me card */}
                    <BentoBox>
                        <div className="flex flex-col gap-6">
                            {/* Avatar + name */}
                            <div className="flex flex-col items-center md:flex-row md:items-center gap-4 md:gap-6">
                                    <div
                                        data-avatar
                                        className="relative w-40 h-40 shrink-0 cursor-pointer rounded-full overflow-hidden border-2 border-line-mid transition-colors duration-200"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                    {/* Default Avatar */}
                                    <Image
                                        src="/images/avatar.jpg"
                                        alt="Stian"
                                        width={160}
                                        height={160}
                                        className="absolute top-0 left-0 w-full h-full object-cover object-top transition-opacity duration-200 ease-in-out"
                                        style={{ opacity: isHovered ? 0 : 1 }}
                                    />
                                    {/* Hover Avatar */}
                                    <Image
                                        src="/images/avatar2.jpg"
                                        alt="Stian Hover"
                                        width={160}
                                        height={160}
                                        className="absolute top-0 left-0 w-full h-full object-cover object-top transition-opacity duration-200 ease-in-out"
                                        style={{ opacity: isHovered ? 1 : 0 }}
                                    />
                                </div>
                                <div className="text-center md:text-left">
                                    <span className="group block text-4xl font-semibold tracking-[-0.02em] text-ink leading-[1.15]">
                                        Hey, I&apos;m Stian <span className="inline-block origin-[70%_70%] group-hover:[animation:wave_0.9s_ease]">👋</span>
                                    </span>
                                    <p className="mt-2 text-base text-ink-faint">
                                        Student &amp; Developer · Bergen, Norway
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="flex flex-col gap-2 text-center md:text-left">
                                <p className="text-[0.85rem] leading-[1.75] text-ink-soft">
                                    A student and developer who loves turning ideas into applications.
                                </p>
                                <p className="text-[0.85rem] leading-[1.75] text-ink-dim">
                                    I build full-stack apps with{" "}
                                    <span className="inline-flex items-center rounded-sm border border-line-mid bg-inset py-[0.1rem] px-[0.45rem] text-[0.78rem] text-ink-soft">
                                        Next.js
                                    </span>
                                    , designing interfaces on the front and working with Supabase on the back.
                                </p>
                                <p className="text-[0.85rem] leading-[1.75] text-ink-dim">
                                    Currently taking a master&apos;s degree in Data Science at UiB and looking to collaborate on projects that make a real impact.
                                </p>
                            </div>

                            {/* Social links */}
                            <div className="flex flex-1 items-center border-t border-line pt-5">
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
                                            className="flex cursor-pointer items-center justify-center gap-2.5 rounded-sm border border-line bg-transparent py-[0.7rem] px-4 text-[0.78rem] font-medium tracking-[0.12em] uppercase no-underline text-ink-dim transition-[color,background,border-color] duration-200 hover:border-line-mid hover:bg-inset hover:text-ink-soft"
                                        >
                                            <Icon className="text-base" />
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
                        <BentoBox title="Academic Journey">
                            <div className="flex w-full flex-col gap-3">
                                <div>
                                    <h3 className="mb-1 text-[0.95rem] font-medium text-ink">
                                        M.Sc. Data Science
                                    </h3>
                                    <p className="text-[0.78rem] font-medium text-ink-faint">
                                        University of Bergen (UiB)
                                    </p>
                                </div>
                                {/* Progress bar */}
                                <div className="flex flex-col gap-[0.3rem]">
                                    <div className="relative w-full h-1 rounded-full bg-inset">
                                        <div className="h-full rounded-full bg-[rgba(237,233,223,0.38)]" style={{
                                            width: `${Math.min(Math.max(((new Date().getFullYear() - 2023) / (2028 - 2023)) * 100, 0), 100)}%`,
                                        }} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[0.75rem] tracking-[0.12em] font-medium text-ink-faint">2023</span>
                                        <span className="text-[0.75rem] tracking-[0.12em] font-medium text-ink-faint">2028</span>
                                    </div>
                                </div>
                                <p className="text-[0.82rem] leading-[1.75] text-ink-dim">
                                    Integrated Master&apos;s (Sivilingeniør) specializing in medical data science.
                                    Focusing on bridging the gap between data science and healthcare through machine learning and statistical modeling of clinical data.
                                </p>
                            </div>
                        </BentoBox>

                        {/* Contact — compact */}
                        <BentoBox title="Contact Me">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <input
                                        type="text" name="name" placeholder="Name" required
                                        className={inputClassName}
                                    />
                                    <input
                                        type="email" name="email" placeholder="Email" required
                                        className={inputClassName}
                                    />
                                </div>
                                <textarea
                                    name="message" placeholder="Your message..." rows={2} required
                                    className={`${inputClassName} resize-none`}
                                />
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-[0.75rem] font-medium tracking-[0.02em] text-ink-faint">
                                        I&apos;ll get back to you within 24 hours.
                                    </p>
                                    <button
                                        type="submit"
                                        className="flex shrink-0 cursor-pointer items-center gap-2 rounded-sm border border-accent-line bg-accent py-[0.55rem] px-5 text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-ink transition-all duration-200 ease-[ease] hover:border-line-strong hover:bg-accent-hover"
                                    >
                                        <FaPaperPlane className="text-[0.75rem]" />
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
