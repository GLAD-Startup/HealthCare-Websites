import { animate, stagger } from 'animejs';

/**
 * Animate numbers counting up (e.g. 0 -> 3500)
 */
export const animateCounter = (
  target: HTMLElement | string,
  endValue: number,
  prefix: string = '',
  suffix: string = '+',
  duration: number = 2000
) => {
  const obj = { value: 0 };
  animate(obj, {
    value: endValue,
    round: 1,
    ease: 'outExpo',
    duration: duration,
    onUpdate: () => {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
      }
    }
  });
};

/**
 * Staggered fade in + slide up entrance animation for elements
 */
export const animateStaggerIn = (
  targets: string | HTMLElement[],
  delayStep: number = 100,
  translateY: number = 30
) => {
  animate(targets, {
    opacity: [0, 1],
    translateY: [translateY, 0],
    ease: 'outCubic',
    duration: 900,
    delay: stagger(delayStep)
  });
};

/**
 * Floating ambient oscillation animation (continuous loop)
 */
export const animateFloatingLoop = (
  target: string | HTMLElement,
  translateYRange: number = 12,
  duration: number = 3500
) => {
  return animate(target, {
    translateY: [-translateYRange / 2, translateYRange / 2],
    rotate: [-1.5, 1.5],
    duration: duration,
    alternate: true,
    loop: true,
    ease: 'inOutSine'
  });
};
