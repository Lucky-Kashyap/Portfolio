import { site } from "@/lib/content";

/** Update when production domain is final */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://divyanshu.dev";

export const seo = {
  title: `${site.brand} | Frontend Engineer — React.js, Next.js, TypeScript`,
  titleTemplate: `%s | ${site.brand}`,
  description:
    "Frontend Engineer in Jaipur with 2.5+ years experience in React.js, Next.js, Angular, and TypeScript. Scalable UI, API integration, performance, and accessibility.",
  keywords: [
    "Divyanshu Kashyap",
    "Frontend Engineer",
    "React.js Developer",
    "Next.js Developer",
    "TypeScript",
    "Angular",
    "UI Architecture",
    "Web Accessibility",
    "Performance Optimization",
    "Jaipur Frontend Developer",
    "Helios Web Services",
  ],
  ogImage: "/divyanshu-kashyap-frontend-engineer-portfolio-og.webp",
  locale: "en_IN",
} as const;

export const faqs = [
  {
    question: "What kind of frontend work do you specialize in?",
    answer:
      "I specialize in scalable React.js and Next.js applications with TypeScript — reusable UI architecture, REST API integration, performance optimization, accessibility, and responsive interfaces across devices and browsers.",
  },
  {
    question: "Which technologies do you use day to day?",
    answer:
      "React.js, Next.js, Angular, TypeScript, JavaScript, Tailwind CSS, Redux Toolkit, React Query, GSAP, Framer Motion, REST APIs, Git, GitHub, Bitbucket, and Jira.",
  },
  {
    question: "How much experience do you have?",
    answer:
      "I have 2.5+ years of frontend engineering experience, currently working as an Associate Software Engineer at Helios Web Services in Jaipur (full-time, on-site) since January 2024.",
  },
  {
    question: "Are you open to new opportunities or collaborations?",
    answer:
      "Yes. I am open to connecting with developers, recruiters, and technology leaders interested in web engineering, product development, and emerging technologies including AI-powered applications.",
  },
  {
    question: "Where are you based, and how can I contact you?",
    answer: `I am based in Gokul Vatika, Jaipur, Rajasthan. Email ${site.email}, call +91 ${site.phone}, or reach me on GitHub (${site.github}), LinkedIn (${site.linkedin}), and LeetCode (${site.leetcode}).`,
  },
  {
    question: "Do you practice problem solving / DSA?",
    answer: `Yes. I practice on LeetCode (@${site.leetcodeUser}) with ${site.leetcodeStats.solved}+ problems solved across Easy (${site.leetcodeStats.easy}) and Medium (${site.leetcodeStats.medium}), mainly in C++ and JavaScript.`,
  },
  {
    question: "Do you focus on performance and accessibility?",
    answer:
      "Yes. Performance optimization, Core Web Vitals awareness (LCP, CLS, INP), SEO-friendly markup, and web accessibility are part of how I ship production interfaces.",
  },
] as const;

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.brand,
    url: siteUrl,
    image: `${siteUrl}${seo.ogImage}`,
    jobTitle: "Frontend Engineer",
    description: seo.description,
    email: `mailto:${site.email}`,
    telephone: `+91${site.phone}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gokul Vatika, Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    sameAs: [site.github, site.linkedin, site.leetcode].filter(Boolean),
    knowsAbout: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Angular",
      "Web Accessibility",
      "Performance Optimization",
      "UI Architecture",
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
