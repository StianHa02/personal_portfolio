"use client";

import { displayHeading, edgeInset } from "./ui";

export default function Footer() {
    return (
        <div className={`relative w-full h-full flex flex-col items-start justify-end select-none ${edgeInset}`}>
            <div className="flex flex-col items-start gap-6 max-w-2xl font-[family-name:var(--font-playfair)]">

                <h1 className={displayHeading}>
                    Let&apos;s work<br />together.
                </h1>

                <p className="text-lg font-light text-ink-soft max-w-sm leading-relaxed tracking-wide">
                    Open to internships, freelance projects, and job opportunities.
                </p>

            </div>
        </div>
    );
}
