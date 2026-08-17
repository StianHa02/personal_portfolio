"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CubeRenderer2D from "./CubeRenderer2D";

// three.js is heavy and browser-only — keep it out of the entry bundle and off the server.
const CubeGL = dynamic(() => import("./cube/CubeGL"), { ssr: false });

function hasWebGL(): boolean {
    try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
        return false;
    }
}

export default function CubeRenderer(props: {
    sp: number;
    opacity?: number;
    logoSrc?: string;
    interactionEnabled?: boolean;
    turnsEnabled?: boolean;
}) {
    // `null` until we've checked — render the 2D cube meanwhile so there's never a blank hero.
    const [webgl, setWebgl] = useState<boolean | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWebgl(hasWebGL());
    }, []);

    return webgl ? <CubeGL {...props} /> : <CubeRenderer2D {...props} />;
}
