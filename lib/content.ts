/**
 * Portfolio content — Divyanshu Kashyap (LinkedIn profile)
 * Projects: set `href` when live URLs are ready.
 */

export const site = {
  brand: "Divyanshu Kashyap",
  mark: "DIVYANSHU.DEV",
  role: "Frontend Engineer | React.js | Next.js | TypeScript | Scalable UI Architecture | API Integration | Performance & Accessibility",
  tagline:
    "Building scalable, responsive, and high-performance web applications.",
  location: "Jaipur, Rajasthan",
  email: "kashyapdivyanshu279@gmail.com",
  phone: "9634308605",
  whatsapp: "https://wa.me/919634308605",
  /** Direct download — file lives in public/pdfs */
  resume: "/pdfs/Divyanshu_resume.pdf",
  resumeDownloadName: "Divyanshu_resume.pdf",
  github: "https://github.com/Lucky-Kashyap",
  githubUser: "Lucky-Kashyap",
  linkedin: "https://www.linkedin.com/in/divyanshu-kashyap-b09138171/",
  leetcode: "https://leetcode.com/u/luckykashyap/",
  leetcodeUser: "luckykashyap",
  leetcodeStats: {
    solved: 44,
    acceptance: "53.52%",
    easy: 26,
    medium: 18,
  },
  /**
   * Marketing AI avatar video (muted autoplay + tap unmute).
   * Hero only — About uses a separate craft visual.
   */
  heroAvatarVideo: "/media/hero-avatar.mp4",
  heroAvatarPoster: "/media/hero-avatar-poster.jpg",
  /** Face + upper torso crop — leave room for gesture/hand in frame */
  heroAvatarObjectPosition: "50% 22%",
  /** About section — photoreal AI avatar portrait */
  aboutVisual: "/about/about-ai-avatar.png",
  /** Photo avatar (meta / OG) */
  avatar: "/profile/divyanshu-kashyap-frontend-developer-jaipur.webp",
  heroHeadline: "FRONTEND ENGINEER",
  heroRoles: [
    "FRONTEND ENGINEER",
    "FRONTEND DEVELOPER",
    "REACT.JS DEVELOPER",
    "NEXT.JS DEVELOPER",
    "UI DEVELOPER",
    "WEBSITE DEVELOPER",
    "SEO & PERFORMANCE",
    "WORDPRESS DEVELOPER",
    "AI PRODUCT BUILDER",
  ] as const,
  summary:
    "I build intelligent digital experiences combining high-performance code with striking visual design — React, Next.js, TypeScript, and motion.",
  /** Hire / availability messaging — shared by Contact, Hero, About */
  availability: {
    label: "Available for hire",
    headline: "Open to React.js / Next.js opportunities",
    detail:
      "I'm actively looking for React.js / Next.js opportunities. Response time is typically within 24 hours.",
  },
  connect:
    "Open to React.js / Next.js opportunities — happy to connect with recruiters, founders, and teams building product UI. Typically reply within 24 hours.",
  builtWith: "Built with Next.js & Tailwind CSS",
};

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  /** Short About blurb — keep the section scannable */
  lead: "Frontend Engineer with 2.5+ years shipping React, Next.js, and TypeScript products.",
  headline: "AI-POWERED WEB & INTERACTIVE FRONTEND EXPERIENCES",
  /** One-liner under the headline */
  specialize:
    "Clean interfaces, reusable systems, API-ready UI, and motion that feels intentional.",
  /**
   * Longer narrative — reused in Manifesto / Services (not stacked in About).
   */
  narrative:
    "I specialize in transforming complex business requirements into intuitive digital experiences. From reusable UI architecture to API integration, performance, accessibility, and motion — I ship interfaces that feel fast and look intentional.",
  impact:
    "Enterprise platforms, AI-assisted apps, media tools, and customer-facing products — clarity, speed, and maintainable architecture.",
  passion:
    "Based in Jaipur and available for hire — open to remote React.js / Next.js roles worldwide while deepening full-stack fundamentals.",
  expertise: [
    "React.js & Next.js Development",
    "Angular Development",
    "TypeScript & Modern JavaScript",
    "REST API Integration",
    "UI systems (Tailwind, Shadcn/UI, Material UI)",
    "State Management (Redux Toolkit, React Query)",
    "Performance Optimization & Lighthouse",
    "Accessibility & Responsive Design",
    "AI-assisted product UI (Copilot, v0, Lovable)",
    "SEO tooling, Analytics & link audits",
  ],
  topSkills: [
    "React.js",
    "React 19",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Shadcn/UI",
    "REST API Integration",
    "GSAP ScrollTrigger",
    "React Query",
    "Redux Toolkit",
  ],
  learning: [
    "Backend fundamentals",
    "Node.js & APIs",
    "Databases",
    "Cloud services",
    "AI-powered frontend",
  ],
  technologies: [
    "React.js",
    "React 19",
    "Next.js",
    "Angular 14",
    "TypeScript",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Shadcn/UI",
    "WordPress",
    "Redux Toolkit",
    "React Query",
    "REST API Integration",
    "GSAP",
    "Framer Motion",
    "ChatGPT",
    "GitHub Copilot",
    "Gemini",
    "v0 by Vercel",
    "Lovable",
    "VS Code",
    "Cursor",
    "Postman",
    "Git",
    "GitHub",
    "Bitbucket",
  ],
  stack: {
    Frontend: [
      "React.js",
      "React 19",
      "Next.js",
      "Angular 14",
      "JavaScript",
      "TypeScript",
    ],
    "UI & Styling": [
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
      "Shadcn/UI",
    ],
    "State & Data": [
      "Redux Toolkit",
      "React Query",
      "REST API Integration",
    ],
    "AI Assistants": [
      "ChatGPT",
      "GitHub Copilot",
      "Gemini",
      "v0 by Vercel",
      "Lovable",
    ],
    "Dev Tools": [
      "VS Code",
      "Cursor",
      "Postman",
      "Atom",
      "Sublime Text",
      "Chrome DevTools",
    ],
    "Version Control": ["Git", "GitHub", "Bitbucket"],
  },
  highlightStack: [
    "React.js",
    "React 19",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Shadcn/UI",
    "REST API Integration",
  ],
  stats: [
    { label: "Years Experience", value: 2.5, suffix: "+" },
    { label: "Certifications", value: 3, suffix: "" },
    { label: "LeetCode Solved", value: 44, suffix: "" },
    { label: "Core Technologies", value: 14, suffix: "+" },
  ],
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
    location: "Jaipur, Rajasthan",
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
    image:
      "/certificates/sheryians-front-end-domination-certificate-divyanshu-kashyap.webp",
    note: "Course has covered in depth knowledge of HTML, CSS, Animations, JS, GSAP, Locomotive, Scroll Trigger, Shery.js, Modern web development and Design thinking. Approach, Modern, Design.",
  },
  {
    name: "JavaScript Course With Certification: Unlocking the Power of JavaScript",
    organization: "Scaler Academy",
    issued: "September 2023",
    credentialUrl: "https://moonshot.scaler.com/s/sl/KgaFQPRmcC",
    organizationUrl: "https://www.scaler.com/academy/",
    skills: ["JavaScript"],
    image: "/certificates/scaler-javascript-certificate-divyanshu-kashyap.webp",
    note: "Completed JavaScript Course from Scaler Academy — Certificate of Excellence (70 video tutorials, 9 modules, 8 challenges).",
  },
  {
    name: "Certificate of Completion — 50+ Hour of Web Development",
    organization: "Hindi Tech Tutorials",
    issued: "February 2023",
    credentialId: "HTT1408DK166",
    credentialUrl: "http://hinditechtutorials.com/verify",
    skills: ["Web Development"],
    image:
      "/certificates/hindi-tech-web-development-certificate-divyanshu-kashyap.webp",
    note: "Completed 50+ Hour of Web Development Online Course on Hindi Tech Tutorials.",
  },
];

export const services = [
  {
    id: "react-next",
    title: "React & Next.js Development",
    description:
      "Scalable apps with TypeScript, reusable components, and clean architecture.",
    outcome: "Ship-ready product UI",
  },
  {
    id: "ui-architecture",
    title: "UI Architecture",
    description:
      "Component systems that stay consistent, accessible, and easy to extend.",
    outcome: "Design-system friendly",
  },
  {
    id: "api",
    title: "API Integration",
    description:
      "REST wiring with Redux Toolkit and React Query for resilient client state.",
    outcome: "Reliable data flows",
  },
  {
    id: "performance",
    title: "Performance & Lighthouse",
    description:
      "Core Web Vitals, lean bundles, and stronger production scores.",
    outcome: "Faster experiences",
  },
  {
    id: "motion",
    title: "Motion & Interaction",
    description:
      "GSAP, ScrollTrigger, Locomotive Scroll, and Shery.js — motion with purpose.",
    outcome: "Memorable interfaces",
  },
  {
    id: "seo",
    title: "SEO & Analytics",
    description:
      "Search Console, Analytics, Screaming Frog, and link health — including WordPress.",
    outcome: "Discoverable & healthy",
  },
] as const;

export type Project = {
  title: string;
  description: string;
  tags: string[];
  /** Cover image under /public */
  image: string;
  /** SEO-focused alt for the cover / primary screenshot */
  imageAlt: string;
  /** Primary link (live demo or GitHub) */
  href: string;
  /** Optional secondary GitHub repo link when href is a live demo */
  githubHref?: string;
  /** Optional GitHub social proof */
  stars?: number;
  forks?: number;
  ctaLabel?: string;
};

export const projects: Project[] = [
  {
    title: "Front-End Domination",
    description:
      "Open-source learning hub from Sheryians Coding School’s Front-End Domination course — HTML, CSS, JavaScript fundamentals, responsive UI, GSAP + ScrollTrigger + Locomotive animations, and React (Hooks, Router, Context). 128★ on GitHub.",
    tags: ["JavaScript", "HTML", "CSS", "React", "GSAP", "ScrollTrigger"],
    image:
      "/projects/front-end-domination-javascript-react-gsap-sheryians.webp",
    imageAlt:
      "Front-End Domination open-source course hub by Divyanshu Kashyap — JavaScript, React, GSAP, and ScrollTrigger projects from Sheryians Coding School",
    href: "https://github.com/Lucky-Kashyap/Front-End-Domination-Create-Anything-with-Code",
    stars: 128,
    forks: 66,
    ctaLabel: "View on GitHub",
  },
  {
    title: "React Registration Form",
    description:
      "Practice project: a clean React registration UI with a live results table. Explored connecting forms to a simple server and MySQL while learning backend basics — frontend-first, with backend pieces as a learning exercise.",
    tags: ["React", "Forms", "CRUD UI", "Learning"],
    image: "/projects/react-mysql-registration-form-fullstack.webp",
    imageAlt:
      "React registration form practice project by Divyanshu Kashyap — form UI and results table screenshot",
    href: "https://github.com/Lucky-Kashyap/full-stack-web-dev/tree/main/front%20end/React%20JS/projects/registration-form",
    ctaLabel: "View on GitHub",
  },
  {
    title: "Angular Mini E-commerce",
    description:
      "Mini e-commerce app in Angular 14 with routing (Home, Products, Product Details, Login, Register), mock Products API, add/remove cart with live total pricing, empty-cart state, and category filters (All, Fashion, Jewelery, Electronics). Clean UI — more features in progress.",
    tags: ["Angular 14", "TypeScript", "Cart", "Filters", "Routing", "API"],
    image:
      "/projects/angular-ecommerce/angular-ecommerce-products-category-filters.webp",
    imageAlt:
      "Angular 14 mini e-commerce products page with category filters by Divyanshu Kashyap",
    href: "https://github.com/Lucky-Kashyap/Learning-Angular-JS",
    ctaLabel: "View on GitHub",
  },
  {
    title: "Paytm Clone — Tailwind CSS",
    description:
      "Paytm homepage UI clone built with Tailwind CSS utility classes only (no custom CSS) — hero, consumer & booking service strips, wallet/UPI blocks, financial products, and business sections. Rapid utility-first layout practice.",
    tags: ["Tailwind CSS", "HTML", "UI Clone", "Responsive"],
    image: "/projects/paytm-clone/paytm-homepage-tailwind-css-ui-clone.webp",
    imageAlt:
      "Paytm homepage UI clone built with Tailwind CSS by Divyanshu Kashyap — wallet, UPI, and services sections",
    href: "https://github.com/Lucky-Kashyap/full-stack-web-dev/tree/main/front%20end/Tailwind%20Project/Paytm",
    ctaLabel: "View on GitHub",
  },
  {
    title: "Modern Landing Page — Shery.js",
    description:
      "Stunning modern landing page with HTML, CSS, and JavaScript, animated with Shery.js image effects — gooey bubble hover morphs, click-to-cycle images, and debug/config-driven animation properties. Built while learning at Sheryians Coding School (design inspiration: Harsh Sharma).",
    tags: ["Shery.js", "HTML", "CSS", "JavaScript", "Animation"],
    image: "/projects/shery-landing/sheryjs-modern-landing-page-animation.webp",
    imageAlt:
      "Modern landing page with Shery.js gooey image hover animations by Divyanshu Kashyap",
    href: "https://github.com/Lucky-Kashyap/full-stack-web-dev/tree/main/front%20end/CSS/modern%20landing%20page%20shery%20js",
    ctaLabel: "View on GitHub",
  },
  {
    title: "Web Cam Photo Gallery",
    description:
      "Vanilla JS webcam gallery with live MediaStream feed, Canvas capture, MediaRecorder video, image/video filters, download & delete, and IndexedDB persistence for blobs. Responsive UI — live on Netlify.",
    tags: ["Vanilla JS", "MediaRecorder", "Canvas", "IndexedDB", "Web APIs"],
    image: "/projects/webcam-gallery/vanilla-js-webcam-photo-gallery-app.webp",
    imageAlt:
      "Vanilla JavaScript webcam photo gallery app with MediaRecorder and IndexedDB by Divyanshu Kashyap",
    href: "https://photo-gallery-web.netlify.app/",
    githubHref:
      "https://github.com/Lucky-Kashyap/Javascript_Projects/tree/master/Web%20Cam",
    ctaLabel: "Live Demo",
  },
  {
    title: "Expense Tracker",
    description:
      "Vanilla JS expense tracker — add transactions, maintain history, recalculate balance, delete items from an array of objects, and persist everything with localStorage. Mobile-friendly UI.",
    tags: ["Vanilla JS", "localStorage", "DOM", "CRUD"],
    image: "/projects/expense-tracker/vanilla-js-expense-tracker-app.webp",
    imageAlt:
      "Vanilla JavaScript expense tracker with localStorage transaction history by Divyanshu Kashyap",
    href: "https://transaction-track.netlify.app/",
    githubHref:
      "https://github.com/Lucky-Kashyap/Javascript_Projects/tree/master/Expense%20Tracker%20Assignment",
    ctaLabel: "Live Demo",
  },
  {
    title: "Jira Ticket Management Clone",
    description:
      "Vanilla JS ticket board inspired by Jira — generate tickets via modal, assign priority colors (default grey), filter by color, remove tickets, lock/unlock for editing, and persist everything with localStorage. Responsive layout.",
    tags: ["Vanilla JS", "localStorage", "DOM", "Modal", "CRUD"],
    image: "/projects/jira-clone/vanilla-js-jira-ticket-management-clone.webp",
    imageAlt:
      "Vanilla JavaScript Jira-style ticket management board with priority filters by Divyanshu Kashyap",
    href: "https://jira-ticket-management-tool.netlify.app/",
    githubHref:
      "https://github.com/Lucky-Kashyap/Javascript_Projects/tree/master/JIRA_TICKET_CLONE",
    ctaLabel: "Live Demo",
  },
  {
    title: "Premier Model Homepage",
    description:
      "Modern fashion-agency desktop homepage in HTML & CSS — bold editorial typography, model carousel, asymmetric photo grid, updates list, and CSS-animated scrolling imagery. Inspired by a Behance UX layout; built during Sheryians Front-End Domination.",
    tags: ["HTML", "CSS", "UI Design", "Animation", "Landing Page"],
    image:
      "/projects/premier-homepage/premier-model-agency-homepage-html-css.webp",
    imageAlt:
      "Premier model agency editorial homepage built with HTML and CSS by Divyanshu Kashyap",
    href: "https://github.com/Lucky-Kashyap/Front-End-Domination-Create-Anything-with-Code",
    ctaLabel: "View on GitHub",
  },
  {
    title: "Feliciano Restaurant Homepage",
    description:
      "Desktop restaurant homepage in HTML & CSS — hero, about + stats, catering services, menu grid, chef team, reservation form, blog cards, and footer. Inspired by the Colorlib Feliciano template; rebuilt from scratch for layout practice.",
    tags: ["HTML", "CSS", "UI Design", "Landing Page", "Restaurant"],
    image: "/projects/feliciano/feliciano-restaurant-homepage-html-css.webp",
    imageAlt:
      "Feliciano restaurant homepage with menu, chefs, and reservation UI in HTML and CSS by Divyanshu Kashyap",
    href: "https://github.com/Lucky-Kashyap/full-stack-web-dev/tree/main/front%20end/CSS/Feliciano%20css%20project",
    ctaLabel: "View on GitHub",
  },
];
