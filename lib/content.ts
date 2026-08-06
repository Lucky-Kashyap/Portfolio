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
  location: "Jaipur, Rajasthan, India",
  address: "Kalindi Vihar",
  email: "kashyapdivyanshu279@gmail.com",
  phone: "9634308605",
  phoneLabel: "Work",
  github: "https://github.com/lucky-kashyap",
  githubUser: "lucky-kashyap",
  linkedin: "https://www.linkedin.com/in/divyanshu-kashyap-b09138171/",
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
    location: "Jaipur, Rajasthan, India",
    workMode: "On-site",
    skills: [
      "Cascading Style Sheets (CSS)",
      "React JS",
      "JavaScript",
      "HTML5",
      "Tailwind CSS",
      "Bootstrap",
      "Next.js",
      "Git",
      "Chart.js",
      "Angular Material",
      "Prime flex",
      "Ai Emergent",
      "Google Stitch",
      "Bitbucket",
      "Figma (Software)",
      "GreenSock Animation Platform (GSAP)",
      "Responsive Web Design",
      "React bits",
      "Search Engine Optimization (SEO)",
      "Prompt Engineering",
      "TypeScript",
      "REST APIs",
      "Redux.js",
      "Front-End Development",
      "Optimizing Performance",
      "Web Accessibility",
      "Application Programming Interfaces (API)",
      "React Router",
      "Angular",
      "PrimeNG",
      "Locomotive Scroll",
      "GSAP ScrollTrigger",
      "Framer Motion",
      "User Interface Design",
    ],
  },
  {
    company: "Vestige Marketing Pvt. Ltd.",
    role: "Intern",
    employmentType: "Internship",
    period: "Feb 2023 — Apr 2023",
    duration: "3 mos",
    location: "New Delhi",
    workMode: "On-site",
  },
];

export const education = {
  institution: "Raja Balwant Singh Management Technical Campus, Agra",
  degree: "MCA (Integrated)",
  field: "Computer Knowledge",
  period: "2018 — 2023",
  skills: [
    "Responsive Web Design",
    "Node.js",
    "Web Applications",
    "Web Development",
    "Redux.js",
    "Git",
    "Tailwind CSS",
    "JavaScript eXtension (JSX)",
    "MongoDB",
  ],
} as const;

export type Certification = {
  name: string;
  organization: string;
  issued: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: readonly string[];
  image?: string;
  note?: string;
};

export const certifications: Certification[] = [
  {
    name: "JavaScript Youtube Course",
    organization: "KGCoding by Prashant Sir",
    issued: "November 2023",
    credentialId: "EKKOAJLT",
    credentialUrl:
      "https://www.kgcoding.in/verify-certificate?serialno=EKKOAJLT",
    skills: ["JavaScript"],
    note: "Gained new certification in JavaScript by passing the exam (scored above 70%).",
  },
  {
    name: "CSS Youtube Course",
    organization: "KGCoding by Prashant Sir",
    issued: "November 2023",
    credentialId: "5SHXMFLS",
    credentialUrl:
      "https://www.kgcoding.in/verify-certificate?serialno=5SHXMFLS",
    skills: ["Cascading Style Sheets (CSS)"],
    image: "/certificates/css-youtube-course.webp",
    note: "Achieved certification by completing all questions and scoring above 70%.",
  },
  {
    name: "JavaScript Course With Certification: Unlocking the Power of JavaScript",
    organization: "Scaler Topics",
    issued: "September 2023",
    credentialUrl:
      "https://moonshot.scaler.com/s/sl/KgaFQPRmcC",
    skills: ["JavaScript"],
    image: "/certificates/javascript-scaler.webp",
    note: "Completed JavaScript Course from Scaler Topics — Certificate of Excellence (70 video tutorials, 9 modules, 8 challenges).",
  },
  {
    name: "Front-End Domination",
    organization: "Sheryians Coding School",
    issued: "November 2023",
    credentialId: "6315c7d5",
    credentialUrl: "https://sheryians.com/certificate/verify/6315c7d5",
    skills: [
      "GreenSock Animation Platform (GSAP)",
      "Tailwind CSS",
      "CSS",
      "Animations",
      "Locomotive",
      "JavaScript",
      "HTML",
      "React JS",
      "Scroll Trigger",
    ],
    image: "/certificates/front-end-domination.webp",
    note: "Course has covered in depth knowledge of HTML, CSS, Animations, JS, GSAP, Locomotive, Scroll Trigger, Shery.js, Modern web development and Design thinking. Approach, Modern, Design.",
  },
  {
    name: "React and Redux Certification Test - Youtube Course",
    organization: "KGCoding by Prashant Sir",
    issued: "November 2023",
    credentialId: "WEQMR7SM",
    credentialUrl:
      "https://www.kgcoding.in/verify-certificate?serialno=WEQMR7SM",
    skills: ["React", "Redux"],
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
  /** Set to live URL when ready; empty string = coming soon */
  href: string;
};

export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "Placeholder featured project. Share the live URL and I’ll wire it in.",
    tags: ["React", "Next.js"],
    href: "",
  },
  {
    title: "Project Two",
    description:
      "Placeholder featured project. Share the live URL and I’ll wire it in.",
    tags: ["TypeScript", "UI"],
    href: "",
  },
  {
    title: "Project Three",
    description:
      "Placeholder featured project. Share the live URL and I’ll wire it in.",
    tags: ["GSAP", "Frontend"],
    href: "",
  },
];
