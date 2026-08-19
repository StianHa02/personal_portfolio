"use client";

export default function Footer() {
    return (
        <div className="relative w-full h-full flex flex-col items-start justify-end select-none pb-[clamp(3rem,10vh,10rem)] pl-[clamp(2rem,6vw,9rem)] pr-[clamp(2rem,6vw,4rem)]">
            <div className="flex flex-col items-start gap-8 max-w-2xl font-[family-name:var(--font-playfair)]">

                <h1 className="text-[clamp(3rem,10vw,7rem)] font-bold leading-[0.9] tracking-[-0.02em] text-ink">
                    Let&apos;s work<br />together.
                </h1>

                <p className="text-lg font-light text-ink-soft max-w-sm leading-relaxed tracking-wide">
                    Open to internships, freelance projects, and job opportunities.
                </p>

            </div>
        </div>
    );
}
