import { about, experience, projects, services, site } from "@/lib/content";

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
    "who is Divyanshu Kashyap",
    "Divyanshu Kashyap portfolio",
    "best Frontend Engineer Jaipur",
    "Angular Developer",
    "UI Architecture",
    "Web Accessibility",
    "Performance Optimization",
    "GSAP Framer Motion",
    "Responsive Web Design",
    "Helios Web Services",
    "AEO frontend portfolio",
    "SEO Next.js developer India",
  ],
  ogImage: "/divyanshu-kashyap-frontend-engineer-portfolio-og.webp",
  profileImage: site.avatar,
  locale: "en_IN",
  themeColor: "#03060b",
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
    answer: `${site.availability.detail} ${about.passion}`,
  },
  {
    id: "contact",
    question: "Where are you based, and how can I contact you?",
    answer: `I am based in Jaipur, Rajasthan. Email ${site.email}, call +91 ${site.phone}, or reach me on GitHub, LinkedIn, and LeetCode.`,
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
    "@id": `${siteUrl}/#person`,
    name: site.brand,
    alternateName: ["Lucky Kashyap", site.mark],
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
    worksFor: {
      "@type": "Organization",
      name: experience[0]?.company ?? "Helios Web Services",
    },
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
      "SEO",
      "Answer Engine Optimization",
    ],
    knowsLanguage: ["English", "Hindi"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: `${site.brand} Portfolio`,
    url: siteUrl,
    description: seo.description,
    inLanguage: ["en", "hi"],
    publisher: { "@id": `${siteUrl}/#person` },
    about: { "@id": `${siteUrl}/#person` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/#faq`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: seo.title,
    description: seo.description,
    dateModified: new Date().toISOString().slice(0, 10),
    mainEntity: { "@id": `${siteUrl}/#person` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#hero-heading", "#about-heading", "#faq-heading"],
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faqpage`,
    url: `${siteUrl}/#faq`,
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

export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#services`,
    name: "Frontend engineering services",
    itemListElement: services.map((s, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        provider: { "@id": `${siteUrl}/#person` },
        areaServed: "Worldwide",
        serviceType: "Frontend Development",
      },
    })),
  };
}

export function projectsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#projects`,
    name: "Selected frontend projects by Divyanshu Kashyap",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: p.title,
        description: p.description,
        url: p.href,
        image: `${siteUrl}${p.image}`,
        keywords: p.tags.join(", "),
        author: { "@id": `${siteUrl}/#person` },
      },
    })),
  };
}

/** All graphs for <script type="application/ld+json"> injection */
export function allJsonLdGraphs() {
  return [
    personJsonLd(),
    websiteJsonLd(),
    profilePageJsonLd(),
    faqJsonLd(),
    servicesJsonLd(),
    projectsJsonLd(),
  ];
}
