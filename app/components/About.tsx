"use client";

import React, { useState } from "react";
import { BentoBox, Toast, buttonGhost, buttonPrimary, chipInline, inputField, sectionHeading, sectionInner } from "./ui";
import { FaPaperPlane, FaGithub, FaLinkedin, FaEnvelope, FaCube } from "react-icons/fa";
import Image from "next/image";

type ToastType = "success" | "error" | "info";

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
        <div className={`${sectionInner} max-w-6xl`}>
                <div className="text-center mb-10">
                    <h1 className={sectionHeading}>
                        About Me
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 gap-5">

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
                                    <span className={chipInline}>
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
                                            className={buttonGhost}
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
                    <div className="flex flex-col gap-5">

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
                                <div className="flex flex-col gap-1.5">
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
                            {/* Labels are real elements rather than placeholders: a
                                placeholder is not an accessible name, and it disappears
                                the moment someone starts typing. `sr-only` keeps the
                                compact look while screen readers still get them. */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <div>
                                        <label htmlFor="contact-name" className="sr-only">Name (required)</label>
                                        <input
                                            id="contact-name" type="text" name="name" placeholder="Name" required
                                            autoComplete="name"
                                            className={inputField}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="sr-only">Email (required)</label>
                                        <input
                                            id="contact-email" type="email" name="email" placeholder="Email" required
                                            autoComplete="email"
                                            className={inputField}
                                        />
                                    </div>
                                </div>
                                <label htmlFor="contact-message" className="sr-only">Your message (required)</label>
                                <textarea
                                    id="contact-message" name="message" placeholder="Your message..." rows={2} required
                                    className={`${inputField} resize-none`}
                                />
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-[0.75rem] font-medium tracking-[0.02em] text-ink-faint">
                                        All fields required. I&apos;ll get back to you within 24 hours.
                                    </p>
                                    <button
                                        type="submit"
                                        className={`shrink-0 ${buttonPrimary}`}
                                    >
                                        <FaPaperPlane className="text-[0.75rem]" />
                                        Send
                                    </button>
                                </div>
                            </form>
                        </BentoBox>
                    </div>

                </div>

                {/* Fixed-position overlay — placed last so it is not inside the grid. */}
                {toast && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} duration={4000} />
                )}
        </div>
    );
}
