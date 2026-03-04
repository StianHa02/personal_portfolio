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
            style={{
                position: "fixed",
                bottom: "2.5rem",
                right: "2.5rem",
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                padding: "1.25rem 1.75rem",
                minWidth: "340px",
                background: "#0f0f18",
                border: `1px solid rgba(255,255,255,0.09)`,
                borderLeft: `3px solid ${accent.bar}`,
                borderRadius: "1rem",
                boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${accent.glow}`,
                fontFamily: "var(--font-inter), sans-serif",
                animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}
        >
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
            `}</style>

            {/* Accent icon */}
            <span style={{ fontSize: "1rem", color: accent.bar, flexShrink: 0, lineHeight: 1 }}>
                {accent.icon}
            </span>

            {/* Message */}
            <span style={{
                fontSize: "0.9rem",
                fontWeight: 400,
                letterSpacing: "0.01em",
                color: "rgba(255,255,255,0.82)",
                flex: 1,
                lineHeight: 1.5,
            }}>
                {message}
            </span>

            {/* Close */}
            <button
                onClick={onClose}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.25)",
                    fontSize: "0.75rem",
                    lineHeight: 1,
                    padding: "0.25rem",
                    flexShrink: 0,
                    transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >
                ✕
            </button>
        </div>
    );
}