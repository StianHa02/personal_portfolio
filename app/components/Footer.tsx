"use client";

import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function Footer() {
    return (
        <div className="relative w-full flex flex-col items-start justify-end select-none"
             style={{ height: "100%", paddingBottom: "clamp(3rem, 10vh, 10rem)", paddingLeft: "clamp(2rem, 6vw, 9rem)", paddingRight: "clamp(2rem, 6vw, 4rem)" }}>
            <div className={`flex flex-col items-start gap-8 max-w-2xl ${playfair.className}`}>

                <h1 className="text-[clamp(3rem,10vw,7rem)] font-bold leading-[0.9] tracking-[-0.02em] text-white">
                    Let&apos;s work<br />together.
                </h1>

                <p className="text-lg font-light text-white/80 max-w-sm leading-relaxed tracking-wide">
                    Open to internships, freelance projects, and job opportunities.
                </p>

            </div>
        </div>
    );
}
