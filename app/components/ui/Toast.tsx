import { useEffect } from "react";
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaXmark } from "react-icons/fa6";

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

    // The only place a hue still carries meaning: success/error/info is
    // functional signalling, not decoration.
    const accent = {
        success: { bar: "#6ee7b7", Icon: FaCircleCheck,       glow: "rgba(110,231,183,0.10)" },
        error:   { bar: "#f87171", Icon: FaCircleExclamation, glow: "rgba(248,113,113,0.10)" },
        info:    { bar: "#93c5fd", Icon: FaCircleInfo,        glow: "rgba(147,197,253,0.10)" },
    }[type];
    const { Icon } = accent;

    return (
        <div
            className="fixed bottom-10 right-10 z-50 flex min-w-[340px] items-center gap-5 rounded-lg border border-l-[3px] border-line-mid bg-overlay py-5 px-7 [animation:slide-up_0.3s_cubic-bezier(0.16,1,0.3,1)]"
            style={{
                borderLeftColor: accent.bar,
                boxShadow: `var(--shadow-overlay), 0 0 20px ${accent.glow}`,
            }}
        >
            {/* Accent icon */}
            <Icon className="text-base shrink-0" style={{ color: accent.bar }} />

            {/* Message */}
            <span className="flex-1 text-[0.9rem] font-normal tracking-[0.01em] leading-[1.5] text-ink-soft">
                {message}
            </span>

            {/* Close */}
            <button
                onClick={onClose}
                className="shrink-0 cursor-pointer border-0 bg-transparent p-1 text-sm leading-none text-ink-faint transition-colors duration-200 hover:text-ink-soft"
                aria-label="Dismiss"
            >
                <FaXmark />
            </button>
        </div>
    );
}
