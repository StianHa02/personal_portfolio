import { useEffect } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
    duration?: number;
}

export default function Toast({
                                  message,
                                  type = "info",
                                  onClose,
                                  duration = 5000,
                              }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const accent = {
        success: { bar: "#6ee7b7", icon: "✦", glow: "rgba(110,231,183,0.15)" },
        error:   { bar: "#f87171", icon: "✕", glow: "rgba(248,113,113,0.15)" },
        info:    { bar: "#93c5fd", icon: "●", glow: "rgba(147,197,253,0.15)" },
    }[type];

    return (
        <div
            className="fixed bottom-10 right-10 z-50 flex min-w-[340px] items-center gap-5 rounded-2xl border border-l-[3px] border-white/[0.09] bg-[#0f0f18] py-5 px-7 [font-family:var(--font-inter),sans-serif] [animation:slide-up_0.3s_cubic-bezier(0.16,1,0.3,1)]"
            style={{
                borderLeftColor: accent.bar,
                boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${accent.glow}`,
            }}
        >
            {/* Accent icon */}
            <span className="text-base shrink-0 leading-none" style={{ color: accent.bar }}>
                {accent.icon}
            </span>

            {/* Message */}
            <span className="flex-1 text-[0.9rem] font-normal tracking-[0.01em] leading-[1.5] text-white/[0.82]">
                {message}
            </span>

            {/* Close */}
            <button
                onClick={onClose}
                className="shrink-0 cursor-pointer border-0 bg-transparent p-1 text-xs leading-none text-white/25 transition-colors duration-200 hover:text-white/60"
            >
                ✕
            </button>
        </div>
    );
}
