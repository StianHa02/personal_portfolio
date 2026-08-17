// Verifies the cube move notation and the Kociemba solve pipeline end to end.
//   node scripts/solver-check.mjs [iterations]
// Transpiles state.ts on the fly so it runs without a build step.
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const Cube = require("cube-solver");

const ROOT = new URL("../app/components/cube/", import.meta.url);
const outDir = mkdtempSync(join(tmpdir(), "cube-check-"));
writeFileSync(
    join(outDir, "state.mjs"),
    ts.transpileModule(readFileSync(new URL("state.ts", ROOT), "utf8"), {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText,
);
const S = await import(pathToFileURL(join(outDir, "state.mjs")).href);

let failures = 0;
const fail = (m) => { console.error("  ✗ " + m); failures++; };
const ok = (m) => console.log("  ✓ " + m);
function check(cond, pass, no) { if (cond) ok(pass); else fail(no ?? pass); }

/* ── Notation ─────────────────────────────────────────────────────────── */
console.log("\nNotation identities");
for (const f of ["U", "D", "R", "L", "F", "B"]) {
    const s = S.applyFaceMoves(S.buildSolved(), S.parseMoves(`${f} ${f} ${f} ${f}`));
    isOk(s, `${f} x4 = identity`);
}
function isOk(state, label) { check(S.isSolved(state), label); }

{
    let s = S.buildSolved();
    for (let i = 0; i < 6; i++) s = S.applyFaceMoves(s, S.parseMoves("R U R' U'"));
    isOk(s, "(R U R' U') x6 = identity");
}
{
    const s = S.applyFaceMoves(S.buildSolved(), S.parseMoves("R"));
    check(!S.isSolved(s), "single R leaves the cube unsolved", "single R did nothing");
}
{
    const scr = S.randomScramble(30);
    isOk(S.applyFaceMoves(S.applyFaceMoves(S.buildSolved(), scr), S.invertSequence(scr)),
        "scramble + inverse = identity");
}

/* ── Simplifier ───────────────────────────────────────────────────────── */
console.log("\nSimplifier");
for (const [input, want] of [
    ["R R", "R2"], ["R R'", ""], ["R2 R2", ""], ["R U U' R'", ""], ["R R R", "R'"], ["U D", "U D"],
]) {
    const got = S.formatMoves(S.simplify(S.parseMoves(input)));
    check(got === want, `"${input}" -> "${got}"`, `"${input}" -> "${got}", want "${want}"`);
}

/* ── Kociemba pipeline ────────────────────────────────────────────────── */
const N = Number(process.argv[2] ?? 2000);
console.log(`\nKociemba pipeline — ${N} random scrambles`);

let unsolved = 0, total = 0, worst = 0, overTurned = 0;
const t0 = performance.now();
for (let i = 0; i < N; i++) {
    const scramble = S.simplify(S.randomScramble(20));
    const base = S.applyFaceMoves(S.buildSolved(), scramble);
    const solution = S.simplify(S.parseMoves(Cube.solve(S.formatMoves(scramble), "kociemba")));
    const pb = S.buildPlayback(base, solution);

    if (!S.isSolved(pb.keyframes[pb.keyframes.length - 1])) unsolved++;
    // Every animated turn must be a quarter or half turn; 270° reads as three moves.
    for (const m of pb.moves) if (Math.abs(m.angle) > Math.PI + 1e-9) overTurned++;
    // Positions must stay on the integer lattice throughout.
    for (const kf of pb.keyframes) {
        for (const p of kf) for (const c of p.pos) {
            if (!Number.isInteger(c) || c < -1 || c > 1) { unsolved++; break; }
        }
    }
    total += pb.moves.length;
    worst = Math.max(worst, pb.moves.length);
}
const ms = performance.now() - t0;

console.log(`  mean ${(total / N).toFixed(1)} moves, max ${worst}`);
console.log(`  ${(ms / N).toFixed(2)} ms/solve  (${ms.toFixed(0)} ms total)`);
check(unsolved === 0, `all ${N} playbacks end solved, all positions on the lattice`, `${unsolved}/${N} bad`);
check(overTurned === 0, "no turn exceeds 180°", `${overTurned} turns animate the long way round`);

/* ── The opening scramble (easter egg) ────────────────────────────────── */
console.log("\nOpening scramble");
{
    const scramble = S.simplify(S.parseMoves(S.PB_SCRAMBLE));
    const base = S.applyFaceMoves(S.buildSolved(), scramble);
    check(scramble.length === 20, `parses to ${scramble.length} moves`);
    check(!S.isSolved(base), "actually scrambles the cube");

    const sol = S.simplify(S.parseMoves(Cube.solve(S.formatMoves(scramble), "kociemba")));
    const pb = S.buildPlayback(base, sol);
    check(S.isSolved(pb.keyframes[pb.keyframes.length - 1]),
        `Kociemba solves it in ${pb.moves.length} moves`);

    const inv = S.buildPlayback(base, S.simplify(S.invertSequence(scramble)));
    check(S.isSolved(inv.keyframes[inv.keyframes.length - 1]),
        `inverse-history fallback also solves it (${inv.moves.length} moves)`);
}

/* ── Already-solved edge case ─────────────────────────────────────────── */
// A hand-solved cube can have a move history that is *equivalent* to identity
// without being empty. Inverting that would scramble the cube just to solve it
// again, so CubeGL checks isSolved() rather than trusting the history length.
console.log("\nAlready-solved cube");
{
    // Six sexy moves: returns to solved, and simplify cannot collapse it.
    const history = [];
    for (let i = 0; i < 6; i++) history.push(...S.parseMoves("R U R' U'"));
    const held = S.applyFaceMoves(S.buildSolved(), history);

    check(S.isSolved(held), "(R U R' U') x6 leaves the cube solved");
    check(S.simplify(history).length > 0,
        `history is non-empty despite being identity (${S.simplify(history).length} moves) — ` +
        "so length alone cannot be the test");

    // What the renderer must do: no moves at all, so scrolling animates nothing.
    const pb = S.buildPlayback(held, []);
    check(pb.moves.length === 0, "empty playback has no moves");
    const at0 = S.resolveScroll(pb, 0);
    const at1 = S.resolveScroll(pb, 1);
    check(!at0.move && !at1.move, "no move is in flight at either end of the scroll");
    check(at0.pieces === at1.pieces, "the cube is identical at sp=0 and sp=1");
}

/* ── Inverse-history fallback (used until the worker warms up) ─────────── */
console.log("\nInverse-history fallback");
{
    let bad = 0, len = 0;
    for (let i = 0; i < 200; i++) {
        const h = S.simplify(S.randomScramble(20));
        const pb = S.buildPlayback(S.applyFaceMoves(S.buildSolved(), h), S.simplify(S.invertSequence(h)));
        if (!S.isSolved(pb.keyframes[pb.keyframes.length - 1])) bad++;
        len += pb.moves.length;
    }
    check(bad === 0, `always solves (mean ${(len / 200).toFixed(1)} moves)`, `${bad}/200 failed`);
}

console.log(failures === 0 ? "\nPASS\n" : `\nFAIL — ${failures} problem(s)\n`);
process.exit(failures === 0 ? 0 : 1);
