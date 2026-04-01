import { Hero } from "@/components/Hero"
import { Services } from "@/components/Services"
import { Skills } from "@/components/Skills"
import { FeaturedWork } from "@/components/FeaturedWork"
import { StatsSection } from "@/components/StatsSection"
import { Testimonials } from "@/components/Testimonials"

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Skills />
      <FeaturedWork />
      <StatsSection />
      <Testimonials />
    </>
  )
}
