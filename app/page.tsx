import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { TimeLine } from "@/components/TimeLine";
export default function Home() {
  return (
    <>
    <Header />
      <Hero />
      <Skills />
      <Projects />
      <TimeLine />
      <Footer />
    </>
  )
}