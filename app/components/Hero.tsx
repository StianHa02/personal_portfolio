import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
});

export default function Hero() {
    return (
        <div
            className="relative w-full flex items-end md:items-end justify-start"
            style={{
                minHeight: "100dvh",
                paddingBottom: "clamp(3rem, 8vh, 10rem)",
                paddingLeft: "clamp(1.5rem, 6vw, 9rem)",
                paddingRight: "clamp(1.5rem, 4vw, 4rem)",
            }}
        >
            <div className={`flex flex-col items-start gap-4 md:gap-6 w-full max-w-lg ${cormorant.className}`}>

                <p className="text-[0.65rem] md:text-[0.75rem] tracking-[0.5em] uppercase text-white/80 font-light">
                    Data Science Student &amp; aspiring Full-Stack Developer
                </p>

                <h1 className="text-[clamp(3rem,14vw,8.5rem)] font-light leading-[0.9] tracking-[-0.03em] text-white">
                    Stian Gia<br />Huy Ha
                </h1>

                <p className="text-base md:text-lg font-light text-white/85 max-w-md leading-relaxed tracking-wide mt-2">
                    Showcasing my projects in modern web development.
                </p>

            </div>
        </div>
    );
}