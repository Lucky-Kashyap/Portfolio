/**
 * Portfolio content — Divyanshu Kashyap (LinkedIn profile)
 * Projects: set `href` when live URLs are ready.
 */

export const site = {
  brand: "Divyanshu Kashyap",
  mark: "DIVYANSHU.DEV",
  pronouns: "He/Him",
  role: "Frontend Engineer | React.js | Next.js | TypeScript | Scalable UI Architecture | API Integration | Performance & Accessibility",
  tagline:
    "Building scalable, responsive, and high-performance web applications.",
  location: "Gokul Vatika, Jaipur, Rajasthan",
  address: "Gokul Vatika",
  email: "kashyapdivyanshu279@gmail.com",
  phone: "9634308605",
  phoneLabel: "Work",
  github: "https://github.com/Lucky-Kashyap",
  githubUser: "Lucky-Kashyap",
  linkedin: "https://www.linkedin.com/in/divyanshu-kashyap-b09138171/",
  avatar: "/profile/divyanshu.webp",
  summary:
    "Frontend Engineer with 2.5+ years of experience building scalable, responsive, and high-performance web applications using React.js, Next.js, Angular, TypeScript, and modern frontend technologies.",
  connect:
    "Open to connecting with developers, recruiters, technology leaders, and professionals who share an interest in web engineering, product development, and emerging technologies.",
};

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  lead: "Frontend Engineer with 2.5+ years of experience building scalable, responsive, and high-performance web applications using React.js, Next.js, Angular, TypeScript, and modern frontend technologies.",
  specialize:
    "I specialize in transforming complex business requirements into intuitive, user-friendly digital experiences. My expertise includes developing reusable component architectures, integrating APIs, optimizing application performance, implementing accessibility standards, and delivering responsive interfaces across devices and browsers.",
  impact:
    "Over the years, I have contributed to enterprise platforms, AI-powered applications, media management systems, event management solutions, and customer-facing web products. I enjoy solving real-world problems through clean code, modern architecture, and user-centric design principles.",
  passion:
    "I am passionate about building products that are fast, scalable, accessible, and impactful. Currently, I am expanding my expertise in Full Stack Development, Backend Technologies, Cloud Services, and AI-powered applications to build end-to-end modern web solutions.",
  expertise: [
    "React.js & Next.js Development",
    "Angular Development",
    "TypeScript & Modern JavaScript",
    "REST API Integration",
    "State Management (Redux Toolkit, React Query)",
    "Performance Optimization",
    "Accessibility & Responsive Design",
    "Authentication & Authorization",
    "UI Architecture & Component Design",
    "SEO & Web Performance",
  ],
  topSkills: ["React bits", "GSAP ScrollTrigger", "Web Accessibility"],
  learning: [
    "Full Stack Development",
    "Backend Technologies",
    "Cloud Services",
    "AI-powered Applications",
  ],
  technologies: [
    "React.js",
    "Next.js",
    "Angular",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Redux Toolkit",
    "React Query",
    "GSAP",
    "REST APIs",
    "Git",
    "GitHub",
    "Bitbucket",
    "Jira",
  ],
  stack: {
    Frontend: ["React.js", "Next.js", "Angular", "TypeScript", "JavaScript"],
    "State & Data": ["Redux Toolkit", "React Query", "REST APIs"],
    "Styling & Motion": ["Tailwind CSS", "GSAP"],
    Quality: ["Web Accessibility", "Performance", "SEO"],
    Tools: ["Git", "GitHub", "Bitbucket", "Jira"],
  },
} as const;

export type ExperienceItem = {
  company: string;
  role: string;
  employmentType: string;
  period: string;
  duration: string;
  location: string;
  workMode: string;
  skills?: readonly string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Helios Web Services",
    role: "Associate Software Engineer",
    employmentType: "Full-time",
    period: "Jan 2024 — Present",
    duration: "2 yrs 8 mos",
    location: "Gokul Vatika, Jaipur, Rajasthan",
    workMode: "On-site",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Angular",
      "Tailwind CSS",
      "REST APIs",
      "Performance",
      "Accessibility",
    ],
  },
];

export const education = {
  institution: "Raja Balwant Singh Management Technical Campus, Agra",
  degree: "MCA (Integrated)",
  field: "Computer Knowledge",
  period: "2018 — 2023",
  skills: ["Web Development", "JavaScript", "Responsive Design"],
} as const;

export type Certification = {
  name: string;
  organization: string;
  organizationUrl?: string;
  issued: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: readonly string[];
  image?: string;
  note?: string;
};

export const certifications: Certification[] = [
  {
    name: "Front-End Domination",
    organization: "Sheryians Coding School",
    issued: "November 2023",
    credentialId: "6315c7d5",
    credentialUrl: "https://sheryians.com/certificate/verify/6315c7d5",
    skills: [
      "GSAP",
      "Tailwind CSS",
      "JavaScript",
      "React JS",
      "Scroll Trigger",
    ],
    image: "/certificates/front-end-domination.webp",
    note: "Course has covered in depth knowledge of HTML, CSS, Animations, JS, GSAP, Locomotive, Scroll Trigger, Shery.js, Modern web development and Design thinking. Approach, Modern, Design.",
  },
  {
    name: "JavaScript Course With Certification: Unlocking the Power of JavaScript",
    organization: "Scaler Academy",
    issued: "September 2023",
    credentialUrl: "https://moonshot.scaler.com/s/sl/KgaFQPRmcC",
    organizationUrl: "https://www.scaler.com/academy/",
    skills: ["JavaScript"],
    image: "/certificates/javascript-scaler.webp",
    note: "Completed JavaScript Course from Scaler Academy — Certificate of Excellence (70 video tutorials, 9 modules, 8 challenges).",
  },
  {
    name: "Certificate of Completion — 50+ Hour of Web Development",
    organization: "Hindi Tech Tutorials",
    issued: "February 2023",
    credentialId: "HTT1408DK166",
    credentialUrl: "http://hinditechtutorials.com/verify",
    skills: ["Web Development"],
    image: "/certificates/hindi-tech-web-development.webp",
    note: "Completed 50+ Hour of Web Development Online Course on Hindi Tech Tutorials.",
  },
];

export const services = [
  {
    title: "React & Next.js Development",
    description:
      "Scalable React and Next.js applications with TypeScript, reusable components, and clean architecture.",
  },
  {
    title: "UI Architecture",
    description:
      "Component systems and scalable UI patterns that stay consistent, accessible, and easy to extend.",
  },
  {
    title: "API Integration",
    description:
      "REST API integration with robust state management using Redux Toolkit and React Query.",
  },
  {
    title: "Performance & Accessibility",
    description:
      "Faster loads, WCAG-minded interfaces, responsive layouts, and SEO-ready frontend delivery.",
  },
  {
    title: "Motion & Interaction",
    description:
      "Purposeful UI motion with GSAP and ScrollTrigger for premium, high-clarity experiences.",
  },
] as const;

export type Project = {
  title: string;
  description: string;
  tags: string[];
  /** Cover image under /public */
  image: string;
  /** Set to live URL when ready; empty string = coming soon */
  href: string;
};

export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "Placeholder featured project. Share the live URL and I’ll wire it in.",
    tags: ["React", "Next.js"],
    image: "/projects/project-one.webp",
    href: "",
  },
  {
    title: "Project Two",
    description:
      "Placeholder featured project. Share the live URL and I’ll wire it in.",
    tags: ["TypeScript", "UI"],
    image: "/projects/project-two.webp",
    href: "",
  },
  {
    title: "Project Three",
    description:
      "Placeholder featured project. Share the live URL and I’ll wire it in.",
    tags: ["GSAP", "Frontend"],
    image: "/projects/project-three.webp",
    href: "",
  },
];
