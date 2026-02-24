import { useState, useEffect } from 'react'

export function useScrollDepth(): number {
  const [depth, setDepth] = useState(0)

  useEffect(() => {
    let rafId: number

    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight
        setDepth(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return depth
}