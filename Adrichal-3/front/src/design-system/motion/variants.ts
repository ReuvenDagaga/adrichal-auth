import type { Variants, Easing } from 'framer-motion'

// Easing curves - typed as tuples for Framer Motion
export const easeOutExpo: Easing = [0.22, 1, 0.36, 1]
export const easeInOutExpo: Easing = [0.87, 0, 0.13, 1]

// Fade variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo }
  },
  exit: { opacity: 0, y: -20 },
}

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo }
  },
  exit: { opacity: 0, y: 20 },
}

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeOutExpo }
  },
  exit: { opacity: 0, x: 50 },
}

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeOutExpo }
  },
  exit: { opacity: 0, x: -50 },
}

// Scale variants
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo }
  },
  exit: { opacity: 0, scale: 0.95 },
}

// Stagger container
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// Stagger items
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo }
  },
}

export const staggerItemScale: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo }
  },
}

// Slide variants for page transitions
export const slideInFromRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: easeInOutExpo }
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: 0.4, ease: easeInOutExpo }
  },
}

export const slideInFromBottom: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: easeInOutExpo }
  },
  exit: {
    y: '-50%',
    opacity: 0,
    transition: { duration: 0.4, ease: easeInOutExpo }
  },
}

// Button hover animation
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
}

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
}

// Image reveal
export const imageReveal: Variants = {
  initial: {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0
  },
  animate: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 1, ease: easeInOutExpo }
  },
}

// Line draw animation
export const drawLine: Variants = {
  initial: { scaleX: 0, originX: 0 },
  animate: {
    scaleX: 1,
    transition: { duration: 0.8, ease: easeOutExpo }
  },
}

// Text character animation
export const textReveal: Variants = {
  initial: { y: '100%' },
  animate: {
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo }
  },
}

// Floating animation
export const float = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}

// Pulse glow
export const pulseGlow = {
  boxShadow: [
    '0 0 0 0 rgba(212, 175, 55, 0.4)',
    '0 0 0 20px rgba(212, 175, 55, 0)',
    '0 0 0 0 rgba(212, 175, 55, 0)'
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}
