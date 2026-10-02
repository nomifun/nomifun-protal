// A single scroll clock drives the entrance, rail and navigation. The card
// geometry stays at 80vh (desktop) / 90vw (mobile).
export const WORK_MOTION = Object.freeze({
  entryStart: 0.04,
  entryEnd: 0.24,
  revealStart: 0.18,
  revealEnd: 0.3,
  railStart: 0.3,
  railEnd: 0.91,
  railEdge: 0.12,
  firstStop: 0.27,
  stepCount: 5,
});

const clamp = (value) => Math.max(0, Math.min(1, value));
const between = (value, start, end) => clamp((value - start) / (end - start));

// Zero velocity and acceleration at both boundaries, including reverse scroll.
export function smoothWorkEntrance(value) {
  const progress = clamp(value);
  return progress ** 3 * (progress * (progress * 6 - 15) + 10);
}

// Ease only the start and end of the horizontal journey. Its middle keeps a
// steady velocity instead of stopping abruptly at each card boundary.
export function workRailTravel(value) {
  const progress = clamp(value);
  const edge = WORK_MOTION.railEdge;
  const normalizer = 1 - edge;
  if (progress < edge) {
    const local = progress / edge;
    return (edge * (local ** 3 - local ** 4 / 2)) / normalizer;
  }
  if (progress > 1 - edge) return 1 - workRailTravel(1 - progress);
  return (progress - edge / 2) / normalizer;
}

function railTimeForTravel(travel) {
  if (travel <= 0) return 0;
  if (travel >= 1) return 1;
  let low = 0;
  let high = 1;
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const middle = (low + high) / 2;
    if (workRailTravel(middle) < travel) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

export const WORK_STEP_STOPS = Object.freeze(
  Array.from({ length: WORK_MOTION.stepCount }, (_, index) =>
    index === 0
      ? WORK_MOTION.firstStop
      : WORK_MOTION.railStart +
        railTimeForTravel(index / (WORK_MOTION.stepCount - 1)) *
          (WORK_MOTION.railEnd - WORK_MOTION.railStart),
  ),
);

export function getWorkMotionState(progress, { width, height, cardWidth }) {
  const entrance = smoothWorkEntrance(
    between(progress, WORK_MOTION.entryStart, WORK_MOTION.entryEnd),
  );
  const reveal = smoothWorkEntrance(
    between(progress, WORK_MOTION.revealStart, WORK_MOTION.revealEnd),
  );
  const travel = workRailTravel(
    between(progress, WORK_MOTION.railStart, WORK_MOTION.railEnd),
  );
  const underlay = smoothWorkEntrance(between(progress, 0.1, 0.26));
  const center = (width - cardWidth) / 2;

  return {
    firstX: width * 0.45 * (1 - entrance),
    firstY: height * 0.7 * (1 - entrance),
    firstScale: 0.62 + 0.38 * entrance,
    firstRotation: 6 * (1 - entrance),
    railX: center - cardWidth * (WORK_MOTION.stepCount - 1) * travel,
    followingX: (Math.max(0, center) + 24) * (1 - reveal),
    underlayOpacity: 1 - underlay,
    underlayScale: 1 - underlay * 0.08,
    step: Math.round(travel * (WORK_MOTION.stepCount - 1)),
  };
}
