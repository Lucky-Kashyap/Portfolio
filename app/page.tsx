import { About, Experience } from "@/components/sections/About";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <Hero />
      <About />
      <Experience />
      <Certifications />
      <Services />
      <Projects />
      <Faq />
      <Contact />
      <Footer />
    </main>
  );
}
