import React, { useState, useEffect } from 'react'
import HeroPage from './pages/HeroPage'
import ProjectsPage from './pages/ProjectsPage'
import AboutPage from './pages/AboutPage'
import InterestsPage from './pages/InterestsPage'
import ContactPage from './pages/ContactPage'
import CanvasPage from './pages/CanvasPage'
import OceanScroll from './components/scenes/OceanScroll'
import PhotographyPage from './pages/photography/PhotographyPage'
import './styles/globals.css'

// Simple client-side routing without React Router
// /photography → PhotographyPage
// everything else → main portfolio
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

  if (path === '/photography') {
    return <PhotographyPage />
  }

  return (
    <>
      <HeroPage />
      <OceanScroll>
        <ProjectsPage />
        <AboutPage />
        <InterestsPage />
        <ContactPage />
        <CanvasPage />
      </OceanScroll>
    </>
  )
}