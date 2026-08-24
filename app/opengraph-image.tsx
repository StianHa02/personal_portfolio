import { ImageResponse } from "next/og";

export const alt = "Stian Gia Huy Ha — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card that renders when the site is pasted into LinkedIn, Slack, or a job
 * application. Drawn from the page's own tokens (globals.css) so the preview
 * and the site read as one thing.
 *
 * Deliberately no custom font: loading Playfair here means a network fetch at
 * build time that can fail the deploy. The satori default carries this fine at
 * card sizes.
 */
export default function Image() {
    const page = "#0e0e14";
    const ink = "#ede9df";
    const inkDim = "rgba(237, 233, 223, 0.64)";
    const inkFaint = "rgba(237, 233, 223, 0.50)";
    const line = "rgba(237, 233, 223, 0.12)";
    const signal = "#fcd435";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    background: page,
                    padding: "72px 80px",
                }}
            >
                {/* One scarce hit of the cube's yellow, same as the site. */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        fontSize: 22,
                        letterSpacing: 6,
                        textTransform: "uppercase",
                        color: signal,
                        fontWeight: 600,
                    }}
                >
                    Full-Stack Developer
                </div>

                <div
                    style={{
                        display: "flex",
                        fontSize: 104,
                        fontWeight: 700,
                        color: ink,
                        letterSpacing: -3,
                        lineHeight: 1.05,
                        marginTop: 20,
                    }}
                >
                    Stian Gia Huy Ha
                </div>

                <div style={{ display: "flex", fontSize: 30, color: inkDim, marginTop: 18 }}>
                    Next.js · TypeScript · Supabase · AWS
                </div>

                <div
                    style={{
                        display: "flex",
                        marginTop: 40,
                        paddingTop: 28,
                        borderTop: `1px solid ${line}`,
                        fontSize: 24,
                        color: inkFaint,
                    }}
                >
                    Data Science MSc at UiB · Bergen, Norway · stianha.com
                </div>
            </div>
        ),
        { ...size },
    );
}
