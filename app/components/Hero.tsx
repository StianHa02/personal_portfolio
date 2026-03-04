import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
});

export default function Hero() {
    return (
        <div className="relative h-screen w-full flex items-end justify-start pb-[11vh] px-8">
            <div className={`flex flex-col items-start gap-4 ${cormorant.className}`}>

                <p className="text-[0.6rem] tracking-[0.4em] uppercase text-white/30 font-light">
                    Data Science Student &amp; Full-Stack Developer
                </p>

                <h1 className="text-[clamp(3rem,10vw,7rem)] font-light leading-none tracking-[-0.02em] text-[#ede9df]">
                    Stian Gia<br />Huy Ha.
                </h1>

                <p className="text-base font-light text-white/40 max-w-sm leading-relaxed tracking-wide">
                    Showcasing my projects in modern web development.
                </p>


            </div>
        </div>
    );
}