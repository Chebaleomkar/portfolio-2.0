
// import { useTheme } from 'next-themes'

import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { TimeLine } from "@/components/TimeLine";


export default function Home() {
  // const { theme, setTheme } = useTheme('light')

  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <TimeLine />
      <Footer />
    </>
  )
}