import { useTransform, type MotionValue } from "framer-motion";

/** Scale motion distances for mobile (8–15px) vs desktop (20–30px). */
export function motionDistance(isMobile: boolean, desktop: number): number {
  if (isMobile) return Math.round(desktop * 0.45);
  return desktop;
}

/** Standard section scroll offsets: approaching → passed. */
export const SECTION_APPROACH = ["start end", "end start"] as const;
export const SECTION_DOMINANT = ["start 75%", "end 25%"] as const;
export const HERO_EXIT = ["start start", "end start"] as const;

/** Map 0–1 section progress to a focus band (0.65 → 1 → 0.65). */
export function useFocusBand(progress: MotionValue<number>, peak = 0.5) {
  return useTransform(progress, [0, peak, 1], [0.65, 1, 0.65]);
}

/** Chapter dot brightens when section is dominant (~25–75% progress). */
export function useChapterDot(progress: MotionValue<number>, reduce: boolean | null) {
  const y = useTransform(progress, [0.2, 0.5, 0.8], reduce ? [0, 0, 0] : [0, -4, 0]);
  const opacity = useTransform(progress, [0.2, 0.5, 0.8], reduce ? [1, 1, 1] : [0.55, 1, 0.55]);
  return { y, opacity };
}

/** Staggered scroll reveal for a sub-element (0–1 within section). */
export function useStaggerReveal(
  progress: MotionValue<number>,
  start: number,
  end: number,
  reduce: boolean | null,
  yFrom = 12,
) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], reduce ? [0, 0] : [yFrom, 0]);
  return { opacity, y };
}
