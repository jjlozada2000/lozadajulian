import React, { useEffect } from 'react'
import SideNav from '../components/ui/SideNav'
import HeroSection from './HeroSection'
import ProjectsSection from './ProjectsSection'
import AboutSection from './AboutSection'
import InterestsSection from './InterestsSection'
import ContactSection from './ContactSection'
import CanvasSection from './CanvasSection'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function MainPage() {
  useScrollReveal()

  return (
    <>
      <SideNav />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <InterestsSection />
      <ContactSection />
      <CanvasSection />
    </>
  )
}


