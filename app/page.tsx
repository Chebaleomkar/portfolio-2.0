import { ClientProjectsSection } from "@/components/ClientProjects";
import { ClientReviewsSection } from "@/components/ClientReviews";
import { ContactMe } from "@/components/ContactMe";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <ClientProjectsSection />
      <ClientReviewsSection />
      <Skills />
      <Projects />
      <ContactMe />
      <Footer />
    </>
  )
}