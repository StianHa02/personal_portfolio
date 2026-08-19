import { FaMapLocationDot } from "react-icons/fa6";

export default function Hero() {
    return (
        <div
            className="relative w-full min-h-[100lvh] flex items-end justify-start select-none pb-[clamp(6rem,15vh,10rem)] pl-[clamp(1.5rem,6vw,9rem)] pr-[clamp(1.5rem,4vw,4rem)] md:items-end"
        >
            <div className="flex flex-col items-start gap-4 md:gap-6 w-full max-w-lg font-[family-name:var(--font-playfair)]">

                <p className="ml-[0.2rem] text-[0.75rem] tracking-[0.3em] uppercase text-ink-soft font-medium [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                    Data Science Student &amp;  <br /> aspiring Full-Stack Developer
                </p>

                <h1 className="text-[clamp(2.5rem,10vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.03em] text-ink [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
                    Stian Gia<br />Huy Ha
                </h1>

                <p className="ml-[0.2rem] text-base md:text-lg font-normal text-ink-soft max-w-md leading-relaxed tracking-wide [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <FaMapLocationDot aria-hidden="true" />
                        <span>Bergen, Norway</span>
                    </span>
                </p>

            </div>
        </div>
    );
}
