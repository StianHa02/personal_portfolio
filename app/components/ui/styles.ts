/**
 * Shared class strings.
 *
 * These exist because the same element kept getting rebuilt from scratch in
 * each component, drifting a fraction of a rem each time — three chip variants
 * with three different paddings, two dividers with two different pads. A
 * pattern that appears more than once lives here, and every value sits on
 * Tailwind's 4px scale or on an --inset-* token from globals.css.
 */

/* ── Layout ──────────────────────────────────────────────────── */

/** Inner container for Projects / Skills / About. Pair with a max-w-* class. */
export const sectionInner =
    "relative w-full mx-auto pt-[var(--inset-section-t)] pb-[var(--inset-section-b)] px-[var(--inset-section-x)]";

/** The bottom-left frame Hero and Footer share. */
export const edgeInset =
    "pb-[var(--inset-edge-b)] pl-[var(--inset-edge-l)] pr-[var(--inset-edge-r)]";

/* ── Type ────────────────────────────────────────────────────── */

/** Section titles: Projects, Skills, About. */
export const sectionHeading =
    "text-[clamp(2rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-ink";

/**
 * Hero and Footer headlines. The -ml corrects Playfair's left side bearing so
 * the headline optically aligns with the copy above and below it — in em, so
 * it tracks the clamp instead of drifting at every breakpoint.
 */
export const displayHeading =
    "text-[clamp(2.5rem,10vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.03em] text-ink -ml-[0.03em]";

/** Small tracked label — card titles in BentoBox, Skills categories, scroll cue. */
export const eyebrow =
    "text-[0.75rem] tracking-[0.35em] uppercase font-medium text-ink-faint";

/* ── Chips & badges ──────────────────────────────────────────── */

/** Tech-stack chips, and the inline chip in the About bio. */
export const chip =
    "rounded-sm border border-line bg-inset py-1 px-2.5 text-[0.75rem] font-medium tracking-[0.04em] text-ink-faint";

/**
 * Same chip sitting inside running prose. Deliberately tighter than `chip` —
 * at the standalone padding it out-measures the line box and the paragraph
 * visibly steps around it.
 */
export const chipInline =
    "inline-flex items-center rounded-sm border border-line-mid bg-inset py-0.5 px-2 text-[0.78rem] text-ink-soft";

/** The context badge on a project card: Freelance, Internship, Hackathon… */
export const badge =
    "shrink-0 whitespace-nowrap rounded-sm border border-line py-1 px-2.5 text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-ink-faint";

/**
 * Competition win. The only place a hue is spent on a card — signal is the
 * cube's yellow, and two of six projects carry it, so it stays scarce.
 *
 * The plate is opaque page-dark rather than a tint of the signal: this rides on
 * top of a project screenshot, and a translucent one vanished against the pale
 * ones. Dark backing means the yellow reads the same over every image.
 */
export const badgeWin =
    "shrink-0 whitespace-nowrap rounded-sm border border-signal/50 bg-page/90 py-1 px-2.5 text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-signal backdrop-blur-sm";

/* ── Controls ────────────────────────────────────────────────── */

/** Filled: Live Demo, Send. */
export const buttonPrimary =
    "flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-accent-line bg-accent py-2.5 px-4 text-[0.75rem] font-semibold tracking-[0.1em] uppercase no-underline text-ink transition-[background,border-color,color] duration-200 hover:border-line-strong hover:bg-accent-hover";

/** Outlined: Source, social links. */
export const buttonGhost =
    "flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-line bg-transparent py-2.5 px-4 text-[0.75rem] font-semibold tracking-[0.1em] uppercase no-underline text-ink-dim transition-[background,border-color,color] duration-200 hover:border-line-mid hover:bg-inset hover:text-ink-soft";

export const inputField =
    "w-full box-border rounded-sm border border-line bg-inset py-2.5 px-4 text-[0.8rem] font-normal tracking-[0.01em] text-ink-soft outline-none transition-[border-color,background] duration-200 focus:border-line-strong focus:bg-accent";
