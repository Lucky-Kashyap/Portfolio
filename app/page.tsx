import dynamic from "next/dynamic";
import { About, Experience } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { AvatarSectionBridge } from "@/components/avatar/AvatarSectionBridge";
import { Footer } from "@/components/layout/Footer";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";

const Skills = dynamic(
  () =>
    import("@/components/sections/Skills").then((m) => m.Skills),
  { loading: () => <SectionSkeleton label="Loading skills" /> },
);
const Certifications = dynamic(
  () =>
    import("@/components/sections/Certifications").then(
      (m) => m.Certifications,
    ),
  { loading: () => <SectionSkeleton label="Loading certifications" /> },
);
const Manifesto = dynamic(
  () =>
    import("@/components/sections/Manifesto").then((m) => m.Manifesto),
  { loading: () => <SectionSkeleton label="Loading manifesto" /> },
);
const Projects = dynamic(
  () =>
    import("@/components/sections/Projects").then((m) => m.Projects),
  { loading: () => <SectionSkeleton label="Loading projects" /> },
);
const Faq = dynamic(
  () => import("@/components/sections/Faq").then((m) => m.Faq),
  { loading: () => <SectionSkeleton label="Loading FAQ" /> },
);
const Contact = dynamic(
  () =>
    import("@/components/sections/Contact").then((m) => m.Contact),
  { loading: () => <SectionSkeleton label="Loading contact" /> },
);

export default function Home() {
  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <AvatarSectionBridge>
        <Hero />
        <About />
      </AvatarSectionBridge>
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
