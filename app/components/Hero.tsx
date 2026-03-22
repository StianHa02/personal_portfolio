import { Cormorant_Garamond } from "next/font/google";
import { FaMapLocationDot } from "react-icons/fa6";


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

                <p className="text-[0.65rem] md:text-[0.75rem] tracking-[0.5em] uppercase text-white/90 font-normal"
                   style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                    Data Science Student &amp;  <br /> aspiring Full-Stack Developer
                </p>

                <h1 className="text-[clamp(3rem,14vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-white"
                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
                    Stian Gia<br />Huy Ha
                </h1>

                <p className="text-base md:text-lg font-normal text-white/90 max-w-md leading-relaxed tracking-wide mt-2"
                   style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <FaMapLocationDot aria-hidden="true" />
                        <span>Bergen, Norway</span>
                    </span>
                </p>

            </div>
        </div>
    );
}