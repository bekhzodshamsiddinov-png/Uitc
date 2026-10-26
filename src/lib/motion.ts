import { createContext, useContext } from 'react'

/**
 * True while rendering static HTML at build time, and for the first page a
 * visitor opens on top of that HTML. Entrance animations are skipped then, so
 * crawlers see visible text and the prerendered page does not blink.
 */
export const MotionOff = createContext(false)
export const useMotionOff = () => useContext(MotionOff)
