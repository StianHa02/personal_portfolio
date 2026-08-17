"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
    type Vec3, type FaceKey, type Axis, type Piece, type FaceMove, type Playback,
    FACE_COLORS, N6, rot, applyMove, resolveScroll, cubeScale,
    buildSolved, buildPlayback, PB_SCRAMBLE, applyFaceMoves,
    invertSequence, simplify, moveToFaceMove, keyframeIndex, formatMoves, parseMoves,
    centreTwist, isSolved,
} from "./state";

/* ── Geometry constants ────────────────────────────────────────────────── */

/*
 * Proportions measured off GAN 12 product photography. The tiles are the moulded
 * faces of the pieces, not decals stuck on a black body: they are close to square
 * with only a light corner rounding (~10% of the tile), the seams between them are
 * hairlines, and the cube's outer edges are near enough sharp that the silhouette
 * reads as straight. Colour therefore runs right out to the outline, with the dark
 * body visible only as thin shadow between tiles.
 */
const CUBIE_SIZE = 0.99;
const CUBIE_RADIUS = 0.04;      // barely chamfered — the GAN silhouette is crisp
/**
 * Must not exceed the cubie's flat area (CUBIE_SIZE - 2*CUBIE_RADIUS = 0.91).
 * A wider tile overhangs the rounded edge and its coloured side pokes out beside
 * the neighbouring face, which reads as colours bleeding into each other.
 */
const STICKER_SIZE = 0.90;
const STICKER_THICK = 0.024;
const STICKER_RADIUS = 0.10;    // ~11% of the tile, not a squircle
/**
 * Tessellation. The corner radius is small and the cube is a background element, so
 * this stays low deliberately — the tiles are the bulk of the triangle count and
 * finer curves are invisible at this size.
 */
const STICKER_SEGMENTS = 2;
const STICKER_DOME = 0.004;     // all but flat; just enough to break a dead highlight
/** How far a tile stands proud of the cubie surface. Barely. */
const STICKER_PROUD = 0.0015;

/**
 * A longer lens than the 2D renderer's implicit distance-6 pinhole. Framing is
 * preserved (fov is solved from it below); only the perspective flattens, which
 * is what stops the cube bulging.
 */
const GL_CAMERA_DISTANCE = 15;

const AXIS_VEC: Record<Axis, THREE.Vector3> = {
    X: new THREE.Vector3(1, 0, 0),
    Y: new THREE.Vector3(0, 1, 0),
    Z: new THREE.Vector3(0, 0, 1),
};
const AXIS_INDEX: Record<Axis, 0 | 1 | 2> = { X: 0, Y: 1, Z: 2 };
const AXES: Axis[] = ["X", "Y", "Z"];

const TURN_DEADZONE_PX = 7;
const SNAP_DURATION = 0.16;   // seconds to settle onto the nearest 90°
const BASE_TILT = -0.38;      // the 2D renderer's fixed downward tilt
const SPIN_SPEED = 0.22;      // rad/s, matches the 2D renderer
const SPIN_HOME = 0.5;        // the turntable angle the cube starts at on load
const ORBIT_SPEED = 0.005;    // radians of cube rotation per pixel dragged

/**
 * Trackball axes, in world space.
 *
 * The camera sits at -Z looking toward +Z with +Y up, so its right vector is world
 * -X: world +X renders on the *left* of the screen. Working the front face through
 * that: rotating about +Y sends the near face toward screen-right (drag right), and
 * rotating about -X tips the top toward the viewer (drag down).
 */
const YAW_AXIS = new THREE.Vector3(0, 1, 0);
const PITCH_AXIS = new THREE.Vector3(-1, 0, 0);

const CLICK_SLOP_PX = 5;      // below this a drag counts as a click
const RESET_DURATION = 0.45;  // seconds to ease back to the default orientation
/**
 * Layers rotate faster than the pointer. Tracking 1:1 means ~240px of drag per
 * quarter turn, which feels like dragging through treacle; 1.8 puts a face turn at
 * roughly the width of one tile.
 */
const TURN_GAIN = 1.8;
/** Past this much of a quarter turn, releasing commits it rather than snapping back. */
const TURN_COMMIT = 0.42;     // radians, ~24°

type Turn = { axis: Axis; layer: number; angle: number };

/** A live layer drag, once the rotation axis has been decided. */
type DragTurn = {
    kind: "turn";
    axis: Axis;
    layer: number;
    /** Screen-space direction (unit) that a positive rotation moves the grabbed point. */
    dir: THREE.Vector2;
    /** Pixels of screen travel per radian of rotation, at the grabbed point. */
    pxPerRad: number;
    angle: number;
};

/** A drag that started on a sticker but hasn't picked an axis yet. */
type DragPending = {
    kind: "pending";
    pieceIndex: number;
    normal: Vec3;      // face normal in cube space, snapped to an axis
    point: THREE.Vector3;  // grabbed point, in cube-group local space
};

type DragOrbit = { kind: "orbit" };

type Drag = DragPending | DragTurn | DragOrbit;

/* ── Helpers ───────────────────────────────────────────────────────────── */

const coordAlong = (pos: Vec3, axis: Axis) => pos[AXIS_INDEX[axis]];

/** Snaps an arbitrary direction to the nearest signed unit axis. */
function snapToAxis(v: THREE.Vector3): Vec3 {
    const a: Vec3 = [v.x, v.y, v.z];
    let bi = 0;
    for (let i = 1; i < 3; i++) if (Math.abs(a[i]) > Math.abs(a[bi])) bi = i;
    const out: Vec3 = [0, 0, 0];
    out[bi] = a[bi] >= 0 ? 1 : -1;
    return out;
}

export default function CubeGL({
    sp,
    opacity = 1,
    logoSrc,
    interactionEnabled = false,
    turnsEnabled = false,
}: {
    sp: number;
    opacity?: number;
    logoSrc?: string;
    /** Any interaction at all — dragging the background rotates the cube. */
    interactionEnabled?: boolean;
    /** Whether layers may be turned. False in the footer, where the cube is solved
     *  and should stay that way; it can still be rotated to look at. */
    turnsEnabled?: boolean;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const spRef = useRef(sp);
    const interactionRef = useRef(interactionEnabled);
    const turnsRef = useRef(turnsEnabled);

    useEffect(() => { spRef.current = sp; }, [sp]);
    useEffect(() => { interactionRef.current = interactionEnabled; }, [interactionEnabled]);
    useEffect(() => { turnsRef.current = turnsEnabled; }, [turnsEnabled]);

    useEffect(() => {
        if (!canvasRef.current) return;
        // Declared non-nullable so the hoisted helpers below don't lose the narrowing.
        const canvas: HTMLCanvasElement = canvasRef.current;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Touch devices get the original experience: it spins and the scroll solves it,
        // but the cube itself is not grabbable.
        // Deliberately NOT a `(pointer: coarse)` media query: some Android and
        // stylus-equipped devices report a fine pointer, which let touches through.
        // Gating each event on its own pointerType is exact — touch and pen never
        // drive the cube, a real mouse always does.
        const isMouse = (e: PointerEvent) => e.pointerType === "mouse";

        /* ── Renderer ── */
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
        // Transparent, so the page's own #0e0e16 shows through untouched. Clearing to
        // DARK instead would send the background through tone mapping and lift it to grey.
        renderer.setClearColor(0x000000, 0);
        // Neutral holds saturation far better than ACES, which is what kept the
        // brand colours looking washed out.
        renderer.toneMapping = THREE.NeutralToneMapping;
        renderer.toneMappingExposure = 1.0;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        // The 2D renderer is a pinhole camera sitting at -Z (its `6/(6+z)` divide
        // makes larger z *farther*), so match that side to keep depth and tilt identical.
        camera.position.set(0, 0, -GL_CAMERA_DISTANCE);
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);

        /* ── Lighting ── */
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = envRT.texture;
        // RoomEnvironment's ceiling panel is bright enough to wash every upward-facing
        // panel toward white; keep it as a soft sheen only.
        // Kept very low. RoomEnvironment's ceiling sits directly above the cube, and
        // white bounce added to a saturated tile is exactly what turns the up-facing
        // reds into salmon. It is here for the clear-coat highlight, not for lighting.
        scene.environmentIntensity = 0.07;

        const key = new THREE.DirectionalLight(0xffffff, 1.5);
        key.position.set(-5, 4.5, -8);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xbcd0ff, 0.32);
        fill.position.set(5, -2, 4);
        scene.add(fill);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        /* ── Materials (shared across all 27 cubies) ── */
        // Near-black so the seams between panels read as shadow, the way the gaps on a
        // stickerless cube do.
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x0b0b0f, roughness: 0.75, metalness: 0.0,
        });
        const stickerMats: Record<FaceKey, THREE.MeshPhysicalMaterial> = {} as never;
        (Object.keys(FACE_COLORS) as FaceKey[]).forEach((k) => {
            const c = new THREE.Color(FACE_COLORS[k]);
            // GAN's UV-coated finish: a hard clear-coat over vivid plastic, so a
            // tighter specular than the frosted version but still non-metallic.
            stickerMats[k] = new THREE.MeshPhysicalMaterial({
                color: c, roughness: 0.34, metalness: 0.0,
                clearcoat: 0.7, clearcoatRoughness: 0.22,
            });
        });
        let logoMat: THREE.MeshStandardMaterial | null = null;
        let logoTex: THREE.Texture | null = null;

        /* ── Geometry (shared) ── */
        // 2 segments is plenty for a 0.04 chamfer that is mostly hidden behind tiles.
        const bodyGeo = new RoundedBoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE, 2, CUBIE_RADIUS);

        // Panel: an extruded squircle, then bulged along +Z so it catches a soft
        // gradient the way a moulded GAN panel does instead of reading as a flat plate.
        // RoundedBoxGeometry is no use here — it clamps its radius to half the smallest
        // dimension, so a 0.02-thick tile could never get more than a 0.01 corner.
        const stickerGeo = (() => {
            const h = STICKER_SIZE / 2;
            const r = Math.min(STICKER_RADIUS, h * 0.98);
            const s = new THREE.Shape();
            s.moveTo(-h + r, -h);
            s.lineTo(h - r, -h);
            s.quadraticCurveTo(h, -h, h, -h + r);
            s.lineTo(h, h - r);
            s.quadraticCurveTo(h, h, h - r, h);
            s.lineTo(-h + r, h);
            s.quadraticCurveTo(-h, h, -h, h - r);
            s.lineTo(-h, -h + r);
            s.quadraticCurveTo(-h, -h, -h + r, -h);

            const g = new THREE.ExtrudeGeometry(s, {
                depth: STICKER_THICK * 0.5,
                bevelEnabled: true,
                bevelThickness: STICKER_THICK * 0.35,
                bevelSize: STICKER_THICK * 0.7,
                bevelSegments: 1,
                curveSegments: STICKER_SEGMENTS * 3,
            });
            g.center();
            return g;
        })();

        // Derive the mount depth from the geometry itself (extrude depth + bevels)
        // rather than a hand-kept constant, so the tile always sits flush.
        stickerGeo.computeBoundingBox();
        const stickerHalfDepth = stickerGeo.boundingBox!.max.z;
        const STICKER_OFFSET = CUBIE_SIZE / 2 + STICKER_PROUD - stickerHalfDepth;
        {
            const pos = stickerGeo.attributes.position;
            const half = STICKER_SIZE / 2;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
                if (z <= 0) continue;                    // only the outward face domes
                const r = Math.min(1, Math.hypot(x, y) / half);
                pos.setZ(i, z + STICKER_DOME * (1 - r * r));
            }
            pos.needsUpdate = true;
            stickerGeo.computeVertexNormals();
        }

        /* ── Scene graph: 27 cubie groups, index-aligned with the piece array ── */
        const cubeGroup = new THREE.Group();
        scene.add(cubeGroup);

        const cubies: THREE.Group[] = [];
        const stickerMeshes: THREE.Mesh[][] = [];   // [pieceIndex][slot]
        const pickables: THREE.Object3D[] = [];

        for (let i = 0; i < 27; i++) {
            const g = new THREE.Group();
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.userData.pieceIndex = i;
            g.add(body);
            pickables.push(body);

            const slots: THREE.Mesh[] = [];
            for (let slot = 0; slot < 6; slot++) {
                const n = N6[slot];
                const m = new THREE.Mesh(stickerGeo, stickerMats.W);
                m.position.set(n[0] * STICKER_OFFSET, n[1] * STICKER_OFFSET, n[2] * STICKER_OFFSET);
                m.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 0, 1),
                    new THREE.Vector3(n[0], n[1], n[2]),
                );
                m.visible = false;
                m.userData.pieceIndex = i;
                g.add(m);
                slots.push(m);
                pickables.push(m);
            }
            stickerMeshes.push(slots);
            cubies.push(g);
            cubeGroup.add(g);
        }


        /* ── Logo texture on the centre of the white (top) face ── */
        // A GAN centre cap: the panel keeps its own colour and the logo sits on a
        // round badge on top of it. Drawn as a separate transparent decal — putting
        // the texture straight on the panel material discards its alpha and renders
        // the whole tile black.
        const logoGeo = new THREE.CircleGeometry(STICKER_SIZE * 0.30, 48);
        const logoDecal = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(
            logoGeo,
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
        );
        logoDecal.visible = false;
        logoDecal.renderOrder = 1;

        // The white centre keeps its array index for the life of the cube (applyMove
        // maps in place), so the badge can just ride along with that cubie.
        {
            const centre = buildSolved().findIndex(
                (p) => p.stickers.filter(Boolean).length === 1 && p.stickers[2] === 'W',
            );
            logoDecal.position.set(0, STICKER_OFFSET + STICKER_THICK / 2 + STICKER_DOME, 0);
            // YXZ so the twist (y) composes on top of the face-up tilt (x) rather
            // than being consumed by it.
            logoDecal.rotation.order = "YXZ";
            logoDecal.rotation.set(-Math.PI / 2, 0, 0);
            cubies[centre].add(logoDecal);
        }

        if (logoSrc) {
            new THREE.TextureLoader().load(logoSrc, (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
                logoTex = tex;
                logoMat = new THREE.MeshStandardMaterial({
                    map: tex,
                    transparent: true,
                    alphaTest: 0.05,
                    roughness: 0.5,
                    metalness: 0.0,
                    depthWrite: false,
                    polygonOffset: true,
                    polygonOffsetFactor: -2,
                });
                logoDecal.material.dispose();
                logoDecal.material = logoMat;
                logoDecal.visible = true;
            });
        }

        /* ── State ── */

        /**
         * `history` is always the exact move sequence from a solved cube to `held`, so
         * inverting it is a guaranteed — if not minimal — solution. The worker returns
         * the near-optimal one (~20 moves) and we swap it in when it arrives, which
         * keeps the cube solvable from the very first frame without ever blocking.
         */
        let history: FaceMove[] = simplify(parseMoves(PB_SCRAMBLE));
        let held: Piece[] = applyFaceMoves(buildSolved(), history);
        /**
         * The white centre's accumulated twist, tracked separately from `history`
         * because that list gets simplified and cleared. A centre's spin is not part
         * of "solved", so it must survive those resets or the logo would snap.
         */
        let heldTwist = centreTwist(history);
        let playback: Playback = buildPlayback(held, simplify(invertSequence(history)));

        let worker: Worker | null = null;
        let requestId = 0;
        try {
            worker = new Worker(new URL("./solver.worker.ts", import.meta.url));
            worker.onmessage = (e: MessageEvent<{ id: number; solution: string | null }>) => {
                // Ignore stale replies — the user may have turned again since asking.
                if (e.data.id !== requestId || !e.data.solution) return;
                try {
                    const next = simplify(parseMoves(e.data.solution));
                    // Kociemba is near-optimal, not optimal: on a short scramble simply
                    // undoing the moves can be shorter. Keep whichever is.
                    if (next.length < playback.solution.length) {
                        playback = buildPlayback(held, next);
                        stickersDirty = true;
                    }
                } catch { /* keep the inverse-history playback */ }
            };
        } catch { /* no worker: inverse history is still correct */ }

        function rebuildPlayback() {
            // If the user has already solved it by hand there is nothing to play: scroll
            // should leave the cube alone. This has to be an explicit check, because a
            // history can be *equivalent* to identity without being empty (six sexy
            // moves, say) and `simplify` only cancels adjacent turns of the same face —
            // inverting that would scramble the cube just to solve it again.
            if (isSolved(held)) {
                history = [];
                requestId++;              // invalidate any solve still in flight
                playback = buildPlayback(held, []);
                stickersDirty = true;
                return;
            }
            // Usable immediately; refined to the shorter solve when the worker answers.
            playback = buildPlayback(held, simplify(invertSequence(history)));
            stickersDirty = true;
            if (worker) worker.postMessage({ id: ++requestId, scramble: formatMoves(history) });
        }

        // Ask for the optimal solve of the opening scramble too.
        if (worker) worker.postMessage({ id: ++requestId, scramble: formatMoves(history) });

        let pieces: Piece[] = playback.keyframes[0];
        let mode: "scroll" | "manual" = "scroll";
        let stickersDirty = true;
        let lastPieces: Piece[] | null = null;

        // Spin runs on load, stops the moment the user grabs the cube, and starts
        // again as soon as they scroll.
        let spinning = true;
        let spin = SPIN_HOME;
        let lastSp = spRef.current;

        let drag: Drag | null = null;
        const dragStart = new THREE.Vector2();
        /** Pointer position at the previous move, for incremental trackball deltas. */
        const dragLast = new THREE.Vector2();
        /**
         * Accumulated free rotation from background drags. A quaternion rather than
         * Euler angles so the cube can be turned all the way over in any direction
         * without hitting gimbal lock or needing a tilt clamp.
         */
        const userQuat = new THREE.Quaternion();
        const qDelta = new THREE.Quaternion();
        const qSpin = new THREE.Quaternion();
        const qTilt = new THREE.Quaternion().setFromAxisAngle(AXIS_VEC.X, BASE_TILT);
        const qIdentity = new THREE.Quaternion();
        /** Set while a background click eases the cube back to its default framing. */
        let resetting: { from: THREE.Quaternion; spinFrom: number; spinTo: number; t: number } | null = null;
        /** Set while a released turn eases onto its 90° snap. */
        let settling: { turn: Turn; from: number; to: number; t: number } | null = null;

        /** Repaints sticker colours/visibility from the current piece array. */
        function syncStickers() {
            for (let i = 0; i < pieces.length; i++) {
                const p = pieces[i];
                for (let slot = 0; slot < 6; slot++) {
                    const key = p.stickers[slot];
                    const m = stickerMeshes[i][slot];
                    if (!key) { m.visible = false; continue; }
                    m.visible = true;
                    m.material = stickerMats[key];
                }
            }
        }

        /** Positions/orients all 27 cubies for the given state plus an in-flight turn. */
        function syncCubies(turn: Turn | null) {
            for (let i = 0; i < pieces.length; i++) {
                const p = pieces[i];
                const g = cubies[i];
                if (turn && Math.round(coordAlong(p.pos, turn.axis)) === turn.layer) {
                    const np = rot(p.pos, turn.axis, turn.angle);
                    g.position.set(np[0], np[1], np[2]);
                    g.quaternion.setFromAxisAngle(AXIS_VEC[turn.axis], turn.angle);
                } else {
                    g.position.set(p.pos[0], p.pos[1], p.pos[2]);
                    g.quaternion.identity();
                }
            }
        }

        /* ── Post-processing ── */
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        // High threshold so only genuine highlights bloom — a lower one blows the whole
        // white face out when the solve lands.
        const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.0, 0.7, 0.9);
        composer.addPass(bloom);
        composer.addPass(new OutputPass());

        /* ── Sizing ── */
        function resize() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            renderer.setPixelRatio(dpr);
            renderer.setSize(w, h, false);
            composer.setPixelRatio(dpr);
            composer.setSize(w, h);
            bloom.setSize(w, h);

            canvas.style.width = w + "px";
            canvas.style.height = h + "px";

            // Reproduce the 2D renderer's framing exactly: it drew `sc` pixels per cube
            // unit through a pinhole at distance CAMERA_DISTANCE, so the visible half-height
            // in cube units is (h/2)/sc and the vertical fov follows from that.
            const sc = cubeScale(w, h);
            const halfH = (h / 2) / sc;
            camera.fov = 2 * Math.atan(halfH / GL_CAMERA_DISTANCE) * (180 / Math.PI);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();

        /* ── Picking ── */
        const raycaster = new THREE.Raycaster();
        const ndc = new THREE.Vector2();

        function pick(clientX: number, clientY: number) {
            ndc.x = (clientX / window.innerWidth) * 2 - 1;
            ndc.y = -(clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(ndc, camera);
            const hits = raycaster.intersectObjects(pickables, false);
            return hits.length ? hits[0] : null;
        }

        /** Projects a cube-space point to screen pixels. */
        function toScreen(v: THREE.Vector3): THREE.Vector2 {
            const p = v.clone().applyMatrix4(cubeGroup.matrixWorld).project(camera);
            return new THREE.Vector2(
                (p.x + 1) / 2 * window.innerWidth,
                (1 - p.y) / 2 * window.innerHeight,
            );
        }

        /**
         * Decides which layer the drag is turning. The face normal rules out one axis;
         * of the remaining two, we pick whichever produces screen motion best aligned
         * with the drag, and calibrate pixels-per-radian off the same projection so the
         * rotation direction can never come out inverted.
         */
        function resolveTurn(pending: DragPending, dx: number, dy: number): DragTurn | null {
            const dragVec = new THREE.Vector2(dx, dy);
            const normalAxis = AXES[pending.normal.findIndex((c) => c !== 0)];
            const origin = toScreen(pending.point);
            const DELTA = 0.05;

            let best: DragTurn | null = null;
            let bestScore = 0;

            for (const axis of AXES) {
                if (axis === normalAxis) continue;   // can't spin about the face you grabbed
                // Skip middle slices: they move the centres, which the solver treats as
                // fixed. Grabbing a face centre leaves no valid axis, and the caller
                // turns that drag into a whole-cube orbit instead.
                if (Math.round(coordAlong(pieces[pending.pieceIndex].pos, axis)) === 0) continue;
                const rotated = rot(
                    [pending.point.x, pending.point.y, pending.point.z],
                    axis, DELTA,
                );
                const moved = toScreen(new THREE.Vector3(rotated[0], rotated[1], rotated[2]));
                const screenDelta = moved.clone().sub(origin);
                const len = screenDelta.length();
                if (len < 1e-6) continue;

                const dir = screenDelta.clone().divideScalar(len);
                const score = Math.abs(dragVec.dot(dir));
                if (score > bestScore) {
                    bestScore = score;
                    best = {
                        kind: "turn",
                        axis,
                        layer: Math.round(coordAlong(pieces[pending.pieceIndex].pos, axis)),
                        dir,
                        pxPerRad: len / DELTA,
                        angle: 0,
                    };
                }
            }
            return best;
        }

        function commitTurn(turn: Turn) {
            const snapped = Math.round(turn.angle / (Math.PI / 2)) * (Math.PI / 2);
            if (snapped === 0) return;
            held = applyMove(held, turn.axis, turn.layer, snapped);
            const fm = moveToFaceMove(turn.axis, turn.layer, snapped);
            if (fm) { history.push(fm); heldTwist += centreTwist([fm]); }
            history = simplify(history);
            pieces = held;
            rebuildPlayback();
        }

        /* ── Pointer handling ── */
        /** Don't hijack pointerdowns aimed at real UI sitting above the canvas. */
        function overInteractiveUI(e: PointerEvent) {
            const t = e.target as Element | null;
            return !!t?.closest?.('a, button, input, textarea, select, [role="button"]');
        }

        function onPointerDown(e: PointerEvent) {
            if (!isMouse(e) || !interactionRef.current || settling) return;
            if (e.button !== 0 || overInteractiveUI(e)) return;
            dragStart.set(e.clientX, e.clientY);
            dragLast.set(e.clientX, e.clientY);
            spinning = false;               // hold still while the user works on it

            // In the footer the cube is the trophy: rotate to admire, don't re-scramble.
            const hit = turnsRef.current ? pick(e.clientX, e.clientY) : null;
            if (hit && hit.face) {
                const pieceIndex = hit.object.userData.pieceIndex as number;
                // Face normal → cube-group space, then snapped to the nearest axis.
                const nWorld = hit.face.normal.clone()
                    .applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld));
                const nLocal = nWorld.applyQuaternion(cubeGroup.getWorldQuaternion(new THREE.Quaternion()).invert());
                const point = cubeGroup.worldToLocal(hit.point.clone());

                drag = { kind: "pending", pieceIndex, normal: snapToAxis(nLocal), point };
                if (mode === "scroll") {
                    // Take ownership of whatever the scroll animation was showing. The
                    // history of that keyframe is the scramble plus however much of the
                    // solve has already played, which keeps `history` exact.
                    const ki = keyframeIndex(playback, spRef.current);
                    const played = playback.solution.slice(0, ki);
                    held = playback.keyframes[ki];
                    history = simplify([...history, ...played]);
                    heldTwist += centreTwist(played);
                    pieces = held;
                    mode = "manual";
                    stickersDirty = true;
                }
            } else {
                drag = { kind: "orbit" };
            }
        }

        function onPointerMove(e: PointerEvent) {
            if (!drag || !isMouse(e)) return;
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;

            if (drag.kind === "orbit") {
                // Trackball: accumulate incremental world-space rotations and keep them.
                const ddx = e.clientX - dragLast.x;
                const ddy = e.clientY - dragLast.y;
                dragLast.set(e.clientX, e.clientY);
                userQuat.premultiply(qDelta.setFromAxisAngle(PITCH_AXIS, ddy * ORBIT_SPEED));
                userQuat.premultiply(qDelta.setFromAxisAngle(YAW_AXIS, ddx * ORBIT_SPEED));
                return;
            }
            if (drag.kind === "pending") {
                if (Math.hypot(dx, dy) < TURN_DEADZONE_PX) return;
                const resolved = resolveTurn(drag, dx, dy);
                if (!resolved) {
                    // A face centre: no outer layer to turn, so orbit the whole cube.
                    drag = { kind: "orbit" };
                    return;
                }
                drag = resolved;
            }
            if (drag.kind === "turn") {
                drag.angle = new THREE.Vector2(dx, dy).dot(drag.dir) / drag.pxPerRad * TURN_GAIN;
            }
        }

        function onPointerUp(e: PointerEvent) {
            // A click on the background — as opposed to a drag — puts the cube back to
            // how it looks on a fresh load: default framing, spinning again. Clicking
            // the cube itself leaves it stopped, and so does deliberately dragging the
            // background to an angle.
            if (drag?.kind === "orbit" &&
                Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y) < CLICK_SLOP_PX) {
                const TAU = Math.PI * 2;
                resetting = {
                    from: userQuat.clone(),
                    spinFrom: spin,
                    // Nearest angle equivalent to the starting one, so it unwinds the
                    // short way instead of spinning back through everything.
                    spinTo: SPIN_HOME + TAU * Math.round((spin - SPIN_HOME) / TAU),
                    t: 0,
                };
                spinning = true;
            }
            if (drag?.kind === "turn") {
                const turn: Turn = { axis: drag.axis, layer: drag.layer, angle: drag.angle };
                // Commit a quarter turn once the drag is past TURN_COMMIT of one, rather
                // than requiring it to get more than halfway.
                const q = Math.PI / 2;
                const whole = Math.trunc(turn.angle / q);
                const rem = turn.angle - whole * q;
                const to = (whole + (Math.abs(rem) > TURN_COMMIT ? Math.sign(rem) : 0)) * q;
                settling = { turn, from: turn.angle, to, t: 0 };
            }
            drag = null;
        }

        /* ── Frame loop ── */
        let raf: number | null = null;
        let last: number | null = null;

        function frame(ts: number) {
            raf = requestAnimationFrame(frame);
            if (document.hidden) { last = null; return; }
            const dt = last === null ? 0 : Math.min((ts - last) / 1000, 0.1);
            last = ts;

            // Scrolling restarts the spin and hands the cube back to the solve, which
            // is built from whatever state the user left it in.
            if (Math.abs(spRef.current - lastSp) > 0.0005) {
                lastSp = spRef.current;
                if (!drag) {
                    spinning = true;
                    if (mode === "manual" && !settling) { mode = "scroll"; stickersDirty = true; }
                }
            }
            // Easing the drag rotation back on its own would leave the turntable angle
            // wherever it happened to freeze, so "recentre" would land somewhere
            // different every time. Bring the spin home too, by the short way round.
            if (resetting) {
                resetting.t = Math.min(resetting.t + dt / RESET_DURATION, 1);
                const eased = 1 - Math.pow(1 - resetting.t, 3);
                userQuat.slerpQuaternions(resetting.from, qIdentity, eased);
                spin = resetting.spinFrom + (resetting.spinTo - resetting.spinFrom) * eased;
                if (resetting.t >= 1) resetting = null;
            } else if (spinning && !reducedMotion) {
                spin += dt * SPIN_SPEED;
            }

            let turn: Turn | null = null;

            if (settling) {
                settling.t = Math.min(settling.t + dt / SNAP_DURATION, 1);
                const e = 1 - Math.pow(1 - settling.t, 3);
                const angle = settling.from + (settling.to - settling.from) * e;
                turn = { ...settling.turn, angle };
                if (settling.t >= 1) {
                    commitTurn({ ...settling.turn, angle: settling.to });
                    settling = null;
                    turn = null;
                }
            } else if (mode === "manual") {
                if (drag?.kind === "turn") turn = { axis: drag.axis, layer: drag.layer, angle: drag.angle };
            } else {
                const s = resolveScroll(playback, spRef.current);
                if (s.pieces !== lastPieces) { pieces = s.pieces; stickersDirty = true; }
                if (s.move) turn = { ...s.move, angle: s.move.angle * s.t };
            }
            lastPieces = mode === "scroll" ? pieces : null;

            if (stickersDirty) { syncStickers(); stickersDirty = false; }
            syncCubies(turn);

            // The centre's own twist is invisible to piece state, so drive the badge
            // from the moves that have actually been completed. Any U turn still in
            // flight is already carried by the cubie group this decal hangs off.
            logoDecal.rotation.y = mode === "manual"
                ? heldTwist
                : heldTwist + centreTwist(playback.solution.slice(0, keyframeIndex(playback, spRef.current)));

            // spin, then the fixed tilt, then whatever the user has dragged.
            qSpin.setFromAxisAngle(AXIS_VEC.Y, spin);
            cubeGroup.quaternion.copy(userQuat).multiply(qTilt).multiply(qSpin);

            // Bloom only pays for itself as the cube lands on solved.
            const solveGlow = Math.max(0, (spRef.current - 0.9) / 0.1);
            bloom.strength = solveGlow * 0.28;
            bloom.enabled = solveGlow > 0.01;

            // Bloom is only on near the solve. The rest of the time, going through the
            // composer costs a full offscreen render plus a fullscreen blit for nothing,
            // so draw straight to the canvas instead.
            if (bloom.enabled) composer.render();
            else renderer.render(scene, camera);
        }

        /* ── Wiring ── */
        window.addEventListener("resize", resize);
        // On window, not the canvas: `main` is `relative z-10` over a `z-0` fixed
        // canvas, so it swallows every pointer event before the canvas ever sees one.
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);

        const onContextLost = (e: Event) => { e.preventDefault(); if (raf !== null) cancelAnimationFrame(raf); raf = null; };
        const onContextRestored = () => { last = null; if (raf === null) raf = requestAnimationFrame(frame); };
        canvas.addEventListener("webglcontextlost", onContextLost);
        canvas.addEventListener("webglcontextrestored", onContextRestored);

        raf = requestAnimationFrame(frame);

        return () => {
            if (raf !== null) cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);
            canvas.removeEventListener("webglcontextlost", onContextLost);
            canvas.removeEventListener("webglcontextrestored", onContextRestored);

            worker?.terminate();
            bodyGeo.dispose();
            stickerGeo.dispose();
            logoGeo.dispose();
            bodyMat.dispose();
            Object.values(stickerMats).forEach((m) => m.dispose());
            logoMat?.dispose();
            logoTex?.dispose();
            envRT.dispose();
            pmrem.dispose();
            composer.dispose();
            renderer.dispose();
        };
    }, [logoSrc]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 z-0 block transition-opacity duration-[600ms] ease-[ease]"
            style={{ opacity }}
        />
    );
}
