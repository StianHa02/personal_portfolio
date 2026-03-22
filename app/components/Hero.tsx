import { Playfair_Display } from "next/font/google";
import { FaMapLocationDot } from "react-icons/fa6";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function Hero() {
    return (
        <div
            className="relative w-full flex items-end md:items-end justify-start"
            style={{
                minHeight: "100svh",
                paddingBottom: "clamp(3rem, 8vh, 10rem)",
                paddingLeft: "clamp(1.5rem, 6vw, 9rem)",
                paddingRight: "clamp(1.5rem, 4vw, 4rem)",
            }}
        >
            <div className={`flex flex-col items-start gap-4 md:gap-6 w-full max-w-lg ${playfair.className}`}>

                <p className="text-[0.65rem] md:text-[0.75rem] tracking-[0.3em] uppercase text-white/90 font-normal"
                   style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)", marginLeft: "0.2rem" }}>
                    Data Science Student &amp;  <br /> aspiring Full-Stack Developer
                </p>

                <h1 className="text-[clamp(2.5rem,10vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.03em] text-white"
                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
                    Stian Gia<br />Huy Ha
                </h1>

                <p className="text-base md:text-lg font-normal text-white/90 max-w-md leading-relaxed tracking-wide"
                   style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)", marginLeft: "0.2rem" }}>
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <FaMapLocationDot aria-hidden="true" />
                        <span>Bergen, Norway</span>
                    </span>
                </p>

            </div>
        </div>
    );
}