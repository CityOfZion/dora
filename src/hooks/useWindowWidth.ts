import { useState, useEffect } from 'react'
export default function useWindowWidth(): number {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = (): void => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return width
}
