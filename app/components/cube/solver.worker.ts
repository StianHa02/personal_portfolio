/**
 * Kociemba two-phase solver, kept off the main thread.
 *
 * The first call builds its lookup tables and takes about a second; every call
 * after that is ~30ms. Running here means that one-off cost never lands on a
 * frame, and the caller can fall back to inverting its own move history while the
 * worker is still warming up.
 */
import { solve, initialize } from "cube-solver";

type Request = { id: number; scramble: string };
type Response = { id: number; solution: string | null };

// Build the lookup tables now rather than on the first real request.
try { initialize("kociemba"); } catch { /* warmup is best-effort */ }

self.onmessage = (e: MessageEvent<Request>) => {
    const { id, scramble } = e.data;
    let solution: string | null = null;
    try {
        // An already-solved cube has an empty scramble, which the solver rejects.
        solution = scramble.trim() ? solve(scramble, "kociemba") : "";
    } catch {
        solution = null;
    }
    (self as unknown as Worker).postMessage({ id, solution } satisfies Response);
};
