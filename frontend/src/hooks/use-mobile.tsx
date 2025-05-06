import * as React from "react"

// Default mobile breakpoint (matches tailwind's md breakpoint)
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately
    checkIsMobile()
    
    // Listen for resize events
    window.addEventListener("resize", checkIsMobile)
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Return true/false based on screen size
  return !!isMobile
}
