export type SkillBubble = {
  id: string;
  label: string;
  /** Simple Icons slug — rendered from CDN */
  icon: string;
  /** Hex without # for simpleicons color */
  color: string;
};

/** Interactive bubble skills — Divyanshu stack */
export const skillBubbles: readonly SkillBubble[] = [
  { id: "html", label: "HTML5", icon: "html5", color: "E34F26" },
  { id: "css", label: "CSS3", icon: "css3", color: "1572B6" },
  { id: "js", label: "JavaScript", icon: "javascript", color: "F7DF1E" },
  { id: "ts", label: "TypeScript", icon: "typescript", color: "3178C6" },
  { id: "react", label: "React", icon: "react", color: "61DAFB" },
  { id: "next", label: "Next.js", icon: "nextdotjs", color: "FFFFFF" },
  { id: "angular", label: "Angular", icon: "angular", color: "DD0031" },
  { id: "tailwind", label: "Tailwind CSS", icon: "tailwindcss", color: "06B6D4" },
  { id: "redux", label: "Redux", icon: "redux", color: "764ABC" },
  { id: "gsap", label: "GSAP", icon: "greensock", color: "88CE02" },
  { id: "framer", label: "Framer", icon: "framer", color: "0055FF" },
  { id: "git", label: "Git", icon: "git", color: "F05032" },
  { id: "github", label: "GitHub", icon: "github", color: "FFFFFF" },
  { id: "nodejs", label: "Node.js", icon: "nodedotjs", color: "5FA04E" },
  { id: "vscode", label: "VS Code", icon: "visualstudiocode", color: "007ACC" },
  { id: "figma", label: "Figma", icon: "figma", color: "F24E1E" },
  { id: "sass", label: "Sass", icon: "sass", color: "CC6699" },
  { id: "bootstrap", label: "Bootstrap", icon: "bootstrap", color: "7952B3" },
  { id: "jira", label: "Jira", icon: "jira", color: "0052CC" },
  { id: "bitbucket", label: "Bitbucket", icon: "bitbucket", color: "0052CC" },
] as const;

export function skillIconUrl(icon: string, color: string) {
  return `https://cdn.simpleicons.org/${icon}/${color}`;
}
