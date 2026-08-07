import { about, site } from "@/lib/content";

/** Update when production domain is final */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://divyanshu.dev";

export const seo = {
  title: `${site.brand} | Frontend Engineer Jaipur — React.js, Next.js, TypeScript`,
  titleTemplate: `%s | ${site.brand}`,
  description:
    "Looking to hire a Frontend Engineer? Divyanshu Kashyap builds high-performance React.js and Next.js interfaces, motion-rich UI, and accessible web experiences from Jaipur — open to remote opportunities.",
  keywords: [
    "Divyanshu Kashyap",
    "Frontend Engineer Jaipur",
    "React.js Developer Jaipur",
    "Next.js Developer",
    "TypeScript Frontend Developer",
    "hire Frontend Engineer Jaipur",
    "hire React developer Jaipur",
    "Angular Developer",
    "UI Architecture",
    "Web Accessibility",
    "Performance Optimization",
    "GSAP Framer Motion",
    "Responsive Web Design",
    "Helios Web Services",
  ],
  ogImage: "/divyanshu-kashyap-frontend-engineer-portfolio-og.webp",
  profileImage: "/profile/divyanshu-kashyap-frontend-developer-jaipur.webp",
  locale: "en_IN",
  themeColor: "#09090b",
} as const;

export const faqs = [
  {
    id: "specialize",
    question: "What kind of frontend work do you specialize in?",
    answer: `${about.specialize} ${about.narrative}`,
  },
  {
    id: "stack",
    question: "Which technologies do you use day to day?",
    answer:
      "React.js, Next.js, Angular, TypeScript, JavaScript, Tailwind CSS, Bootstrap, WordPress, Redux Toolkit, React Query, GSAP, Framer Motion, Locomotive Scroll, Shery.js, Lighthouse, Google Analytics, Google Search Console, Screaming Frog / SEO Spider link audits, REST APIs, Git, GitHub, Bitbucket, and Jira.",
  },
  {
    id: "experience",
    question: "How much experience do you have?",
    answer:
      "I have 2.5+ years of frontend engineering experience, currently working as an Associate Software Engineer at Helios Web Services in Jaipur (full-time, on-site) since January 2024.",
  },
  {
    id: "opportunities",
    question: "Are you open to new opportunities or collaborations?",
    answer: about.passion,
  },
  {
    id: "contact",
    question: "Where are you based, and how can I contact you?",
    answer: `I am based in Gokul Vatika, Jaipur, Rajasthan. Email ${site.email}, call +91 ${site.phone}, or reach me on GitHub, LinkedIn, and LeetCode.`,
  },
  {
    id: "leetcode",
    question: "Do you practice problem solving / DSA?",
    answer: `Yes. I practice on LeetCode (@${site.leetcodeUser}) with ${site.leetcodeStats.solved}+ problems solved across Easy (${site.leetcodeStats.easy}) and Medium (${site.leetcodeStats.medium}), mainly in C++ and JavaScript.`,
  },
  {
    id: "performance",
    question: "Do you focus on performance and SEO?",
    answer:
      "Yes. I use Lighthouse and Core Web Vitals to guide performance work, and SEO tooling like Google Search Console, Google Analytics, Screaming Frog / SEO Spider, and broken or dead link checks to keep sites crawlable and healthy — including WordPress-friendly frontend SEO hygiene.",
  },
] as const;

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.brand,
    url: siteUrl,
    image: `${siteUrl}${seo.profileImage}`,
    jobTitle: "Frontend Engineer",
    description:
      "Results-driven Frontend Engineer specializing in React.js, Next.js, and TypeScript. Building scalable, performant, and accessible web interfaces with modern UI architecture and motion.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    email: site.email,
    telephone: `+91-${site.phone}`,
    sameAs: [site.github, site.linkedin, site.leetcode].filter(Boolean),
    knowsAbout: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Angular",
      "Tailwind CSS",
      "Bootstrap",
      "WordPress",
      "GSAP",
      "Framer Motion",
      "Locomotive Scroll",
      "Shery.js",
      "Lighthouse",
      "Google Analytics",
      "Google Search Console",
      "Screaming Frog",
      "Web Accessibility",
      "Performance Optimization",
      "UI Architecture",
      "Frontend Development",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.brand} Portfolio`,
    url: siteUrl,
    description: seo.description,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: site.brand,
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
