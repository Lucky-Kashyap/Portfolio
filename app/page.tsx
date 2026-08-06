import { About, Experience } from "@/components/sections/About";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Certifications />
      <Services />
      <Manifesto />
      <Projects />
      <Faq />
      <Contact />
      <Footer />
    </main>
  );
}
