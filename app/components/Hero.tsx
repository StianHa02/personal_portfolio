import { FaMapLocationDot } from "react-icons/fa6";
import { displayHeading, edgeInset } from "./ui";

export default function Hero() {
    return (
        // Height comes from the <section> in page.tsx, which is a flex container —
        // this box stretches to it. Declaring the height again here put two
        // different viewport units (100lvh vs 100vh) on nested boxes.
        <div className={`relative w-full flex items-end justify-start select-none ${edgeInset}`}>
            <div className="flex flex-col items-start gap-6 w-full max-w-lg font-[family-name:var(--font-playfair)]">

                <p className="text-[0.75rem] tracking-[0.3em] uppercase text-ink-soft font-medium [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                    Full-Stack Developer &middot; <br /> Data Science MSc
                </p>

                <h1 className={`${displayHeading} [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]`}>
                    Stian Gia<br />Huy Ha
                </h1>

                <p className="text-base md:text-lg font-normal text-ink-soft max-w-md leading-relaxed tracking-wide [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <FaMapLocationDot aria-hidden="true" />
                        <span>Bergen, Norway</span>
                    </span>
                </p>

            </div>
        </div>
    );
}
