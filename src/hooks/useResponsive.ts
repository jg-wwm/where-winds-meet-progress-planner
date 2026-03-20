import { useEffect, useState } from 'react'

const getWidth = () => {
  if (typeof window === 'undefined') {
    return 1280
  }

  return window.innerWidth
}

export const useResponsive = () => {
  const [width, setWidth] = useState(getWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(getWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    width,
    isPhone: width < 768,
    isTablet: width < 1100,
    isDesktop: width >= 1100,
  }
}