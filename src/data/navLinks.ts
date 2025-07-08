export const navLinks = [
  { label: "AI Tools", to: "/resources/all-resources" },
  { label: "AI for Business", to: "/ai-for-business" },
  { label: "Blog", to: "/blog" },
  { label: "Newsletter", to: "/newsletter" },
  { label: "Prompts", to: "/prompts" },
  {
    label: "Resources",
    dropdown: true,
    children: [
      { label: "AI Agents", to: "/resources/ai-agents" },
      { label: "AI Tutorials", to: "/resources/ai-tutorials" },
      { label: "AI Automation", to: "/resources/ai-automation" },
      { label: "AI Innovation", to: "/resources/ai-innovation" },
    ],
  }
]; 