import React, { useState, useEffect } from 'react'
import MainPage from './pages/MainPage'
import PhotographyPage from './pages/photography/PhotographyPage'

function useRoute() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])
  return path
}

export function navigate(to: string) {
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export default function App() {
  const path = useRoute()
  if (path === '/photography') return <PhotographyPage />
  return <MainPage />
}
