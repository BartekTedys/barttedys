'use client'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Demo from '@/components/Demo'
import ModelInfo from '@/components/ModelInfo'
import About from '@/components/About'
import OtherWork from '@/components/OtherWork'
import Contact from '@/components/Contact'
import dynamic from 'next/dynamic'

const MapDemo = dynamic(() => import('@/components/MapDemo'), { ssr: false })

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ width: '100%' }}>
        <Hero />
        <Demo />
        <MapDemo />
        <ModelInfo />
        <About />
        <OtherWork />
        <Contact />
      </main>
    </>
  )
}
