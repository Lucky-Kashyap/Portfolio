export type SkillBubble = {
  id: string;
  label: string;
  /** Simple Icons slug — rendered from CDN */
  icon: string;
  /** Hex without # for simpleicons color */
  color: string;
  /** Optional full URL when Simple Icons slug is unavailable */
  iconUrl?: string;
};

/** Interactive bubble skills — Divyanshu stack (icons via Simple Icons CDN) */
export const skillBubbles: readonly SkillBubble[] = [
  // Languages
  { id: "html", label: "HTML5", icon: "html5", color: "E34F26" },
  { id: "css", label: "CSS3", icon: "css3", color: "1572B6" },
  { id: "js", label: "JavaScript", icon: "javascript", color: "F7DF1E" },
  { id: "ts", label: "TypeScript", icon: "typescript", color: "3178C6" },
  { id: "sass", label: "Sass", icon: "sass", color: "CC6699" },
  { id: "cpp", label: "C++", icon: "cplusplus", color: "00599C" },
  { id: "java", label: "Java", icon: "openjdk", color: "437291" },

  // Frameworks & UI
  { id: "react", label: "React.js", icon: "react", color: "61DAFB" },
  { id: "react19", label: "React 19", icon: "react", color: "61DAFB" },
  { id: "next", label: "Next.js", icon: "nextdotjs", color: "FFFFFF" },
  { id: "angular", label: "Angular 14", icon: "angular", color: "DD0031" },
  { id: "tailwind", label: "Tailwind CSS", icon: "tailwindcss", color: "06B6D4" },
  { id: "bootstrap", label: "Bootstrap", icon: "bootstrap", color: "7952B3" },
  { id: "wordpress", label: "WordPress", icon: "wordpress", color: "21759B" },
  { id: "mui", label: "Material UI", icon: "mui", color: "007FFF" },
  { id: "shadcn", label: "Shadcn/UI", icon: "shadcnui", color: "FFFFFF" },
  { id: "radix", label: "Radix", icon: "radixui", color: "FFFFFF" },

  // State & data
  { id: "redux", label: "Redux", icon: "redux", color: "764ABC" },
  { id: "reactquery", label: "React Query", icon: "reactquery", color: "FF4154" },
  { id: "graphql", label: "GraphQL", icon: "graphql", color: "E10098" },
  { id: "axios", label: "Axios", icon: "axios", color: "5A29E4" },

  // Motion & 3D
  { id: "gsap", label: "GSAP", icon: "greensock", color: "88CE02" },
  { id: "framer", label: "Framer", icon: "framer", color: "0055FF" },
  { id: "three", label: "Three.js", icon: "threedotjs", color: "FFFFFF" },
  { id: "r3f", label: "React Three Fiber", icon: "react", color: "049EF4" },

  // Backend / learning
  { id: "node", label: "Node.js", icon: "nodedotjs", color: "5FA04E" },
  { id: "express", label: "Express", icon: "express", color: "FFFFFF" },
  { id: "mysql", label: "MySQL", icon: "mysql", color: "4479A1" },
  { id: "mongodb", label: "MongoDB", icon: "mongodb", color: "47A248" },
  { id: "rest", label: "REST API", icon: "postman", color: "FF6C37" },
  { id: "postman", label: "Postman", icon: "postman", color: "FF6C37" },

  // AI assistants
  { id: "chatgpt", label: "ChatGPT", icon: "openai", color: "412991" },
  { id: "copilot", label: "GitHub Copilot", icon: "githubcopilot", color: "FFFFFF" },
  { id: "gemini", label: "Gemini", icon: "googlegemini", color: "8E75B2" },
  {
    id: "v0",
    label: "v0 by Vercel",
    icon: "vercel",
    color: "FFFFFF",
  },
  { id: "lovable", label: "Lovable", icon: "lovable", color: "FF5C5C" },

  // Tooling
  { id: "git", label: "Git", icon: "git", color: "F05032" },
  { id: "github", label: "GitHub", icon: "github", color: "FFFFFF" },
  { id: "bitbucket", label: "Bitbucket", icon: "bitbucket", color: "0052CC" },
  { id: "npm", label: "npm", icon: "npm", color: "CB3837" },
  { id: "pnpm", label: "pnpm", icon: "pnpm", color: "F69220" },
  { id: "vite", label: "Vite", icon: "vite", color: "646CFF" },
  { id: "webpack", label: "Webpack", icon: "webpack", color: "8DD6F9" },
  { id: "eslint", label: "ESLint", icon: "eslint", color: "4B32C3" },
  { id: "prettier", label: "Prettier", icon: "prettier", color: "F7B93E" },
  { id: "babel", label: "Babel", icon: "babel", color: "F9DC3E" },

  // Editors & QA
  { id: "figma", label: "Figma", icon: "figma", color: "F24E1E" },
  { id: "vscode", label: "VS Code", icon: "visualstudiocode", color: "007ACC" },
  { id: "cursor", label: "Cursor", icon: "cursor", color: "FFFFFF" },
  { id: "atom", label: "Atom", icon: "atom", color: "66595C" },
  { id: "sublime", label: "Sublime Text", icon: "sublimetext", color: "FF9800" },
  { id: "chrome", label: "Chrome DevTools", icon: "googlechrome", color: "4285F4" },
  { id: "lighthouse", label: "Lighthouse", icon: "lighthouse", color: "F44B21" },
  { id: "analytics", label: "Analytics", icon: "googleanalytics", color: "E37400" },
  { id: "searchconsole", label: "Search Console", icon: "googlesearchconsole", color: "458CF5" },
  { id: "jira", label: "Jira", icon: "jira", color: "0052CC" },
  { id: "notion", label: "Notion", icon: "notion", color: "FFFFFF" },

  // Deploy / cloud
  { id: "vercel", label: "Vercel", icon: "vercel", color: "FFFFFF" },
  { id: "netlify", label: "Netlify", icon: "netlify", color: "00C7B7" },
  { id: "cloudflare", label: "Cloudflare", icon: "cloudflare", color: "F38020" },
  { id: "docker", label: "Docker", icon: "docker", color: "2496ED" },
  {
    id: "aws",
    label: "AWS",
    icon: "amazonwebservices",
    color: "FF9900",
    // Simple Icons removed AWS trademarks — Devicon SVG instead
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
  { id: "firebase", label: "Firebase", icon: "firebase", color: "FFCA28" },
  { id: "supabase", label: "Supabase", icon: "supabase", color: "3FCF8E" },
  { id: "prisma", label: "Prisma", icon: "prisma", color: "FFFFFF" },
  { id: "jest", label: "Jest", icon: "jest", color: "C21325" },
  { id: "cypress", label: "Cypress", icon: "cypress", color: "69D3A7" },
  { id: "storybook", label: "Storybook", icon: "storybook", color: "FF4785" },
  { id: "astro", label: "Astro", icon: "astro", color: "FFFFFF" },
] as const;

export function skillIconUrl(skill: Pick<SkillBubble, "icon" | "color" | "iconUrl">) {
  if (skill.iconUrl) return skill.iconUrl;
  return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${skill.icon}.svg`;
}

/** Colored Simple Icons CDN URL (for DOM <img> tags). */
export function skillIconColorUrl(
  skill: Pick<SkillBubble, "icon" | "color" | "iconUrl">,
) {
  if (skill.iconUrl) return skill.iconUrl;
  const color =
    skill.color.toUpperCase() === "FFFFFF" ? "E2E8F0" : skill.color;
  return `https://cdn.simpleicons.org/${skill.icon}/${color}`;
}
