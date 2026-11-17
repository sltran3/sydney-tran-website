// all the words on the site live here
// anything in [brackets] still needs real info before publishing!

export const info = {
  name: "Sydney Tran",
  email: "sltran3@illinois.edu",
  linkedin: "#", // TODO: real LinkedIn URL
  github: "#", // TODO: real GitHub URL
  resume: "#", // TODO: add /resume.pdf to public/ and link it here
  place: "Product design — Champaign, IL", // TODO: confirm
  status: "Open to Summer 2027 product design internships", // TODO: confirm
};

export const about = [
  "I'm a designer who loves building things just as much as imagining them. I'm studying Computer Science and Advertising at UIUC, where I've found myself drawn to the space between technology, creativity, and human behavior. I love figuring out how things work, but even more, how to make them feel intuitive, thoughtful, and a little unexpected.",
  "My experiences have taken me from building AI-powered tools for medical billing to developing automation systems at Amazon Lab126 and accelerating research at Stanford. Working across engineering and design has taught me to think beyond how something looks. I care about the decisions underneath an interface and how those decisions affect the people using it.",
  "I like starting with a problem, exploring possibilities, and turning the most promising ideas into something real. My process is a mix of research, experimentation, and building in code. I'm especially interested in thoughtful tools that make complex tasks feel simple, and I'm looking for product design opportunities for Summer 2027.",
];

// only list skills a project can back up
export const skills = [
  "Product design",
  "Design engineering",
  "Figma",
  "Code prototyping",
  "Design systems",
  "AI-assisted tools",
  "User research",
];

// 8 hero tiles (4:5, ~680x840). drop images in public/img/tiles/ and set img
export const tiles = [
  { id: "01", name: "Life Dashboard", img: "", bg: "#F2D0D5", x: 5, y: 130, w: 150, r: -6, z: 2 },
  { id: "02", name: "Life Dashboard detail", img: "", bg: "#F8F5F1", x: 16, y: 560, w: 120, r: 4, z: 6 },
  { id: "03", name: "ARG Billing", img: "", bg: "#B9CFDA", x: 80, y: 120, w: 150, r: 5, z: 2 },
  { id: "04", name: "TabLite", img: "", bg: "#D7CADC", x: 86, y: 520, w: 120, r: -4, z: 6 },
  { id: "05", name: "Jellyflow", img: "", bg: "#B9CFDA", x: 3, y: 400, w: 110, r: 3, z: 4 },
  { id: "06", name: "Research Methods AI", img: "", bg: "#F8F5F1", x: 70, y: 600, w: 120, r: -3, z: 4 },
  { id: "07", name: "Figma artifact", img: "", bg: "#D7CADC", x: 27, y: 120, w: 104, r: 6, z: 1 },
  { id: "08", name: "Craft / sketch", img: "", bg: "#F2D0D5", x: 64, y: 110, w: 104, r: -5, z: 1 },
];

// 3 big featured projects (16:9 image, ~2880x1620)
export const features = [
  {
    slug: "life-dashboard",
    name: "Life Dashboard",
    h1: "Your day,",
    h2: "in one place.",
    meta: "Personal productivity · Independent · [timeline — confirm]",
    design: "Unify daily planning and habits into one calm view.",
    build: "A working, interactive desktop dashboard. [who uses it — confirm]",
    img: "",
    bg: "#EDE6EF",
  },
  {
    slug: "arg-billing",
    name: "ARG Billing",
    h1: "Sensitive documents,",
    h2: "handled thoughtfully.",
    meta: "AI document processing · Technical lead · [team / dates — confirm]",
    design: "Make processing status and privacy visible at every step.",
    build: "Led local PDF validation and extraction. [users — confirm]",
    img: "",
    bg: "#F8F1EA",
  },
  {
    slug: "tablite",
    name: "TabLite",
    h1: "Less friction,",
    h2: "more flow.",
    meta: "Product experience · [role / team / dates — confirm]",
    design: "[Key design decision — confirm your part]",
    build: "[What you personally built vs. the team]",
    img: "",
    bg: "#E4ECF0",
  },
];

// 2 smaller tools (4:3 image, ~1600x1200)
export const tools = [
  { name: "Jellyflow", h1: "Make studying feel", h2: "like a little adventure.", design: "[Design sentence]", build: "[Build sentence]", img: "", bg: "#B9CFDA" },
  { name: "Research Methods AI", h1: "From questions", h2: "to clearer research.", design: "[Design sentence]", build: "[Build sentence — confirm functionality]", img: "", bg: "#F2D0D5" },
];

// case studies (order matters: Life Dashboard, ARG Billing, TabLite)
// each decision gets a Design view + a Build view
export type Decision = {
  title: string;
  design: string; // what you chose and why
  dropped: string; // what you considered and dropped
  build: string; // how you built it
  designImg: string; // Figma frame
  buildImg: string; // code / recording / demo
};

export type Study = {
  slug: string;
  name: string;
  outcome: string;
  role: string;
  time: string;
  tools: string;
  users: string;
  problem: string[];
  goal: string;
  decisions: Decision[];
  changed: string;
  reflect: string;
};

const todo = (title: string): Decision => ({
  title,
  design: "[What you chose and why]",
  dropped: "[What you considered and dropped]",
  build: "[How you built it — mention Cursor / Claude Code if you used them]",
  designImg: "",
  buildImg: "",
});

export const studies: Study[] = [
  {
    slug: "life-dashboard",
    name: "Life Dashboard",
    outcome: "Your day, in one place.",
    role: "[confirm]",
    time: "[confirm]",
    tools: "[confirm]",
    users: "[number, or unmeasured]",
    problem: ["[The problem, with one real moment where it hurt]", "[Why other tools didn't fix it]"],
    goal: "[One sentence goal]",
    decisions: [todo("Find the essentials"), todo("Create visual hierarchy"), todo("Design reusable widgets"), todo("Make it personal")],
    changed: "[Real numbers, or honest qualitative results]",
    reflect: "[One honest reflection]",
  },
  {
    slug: "arg-billing",
    name: "ARG Billing",
    outcome: "Sensitive documents, handled thoughtfully.",
    role: "[confirm]",
    time: "[confirm]",
    tools: "[confirm]",
    users: "[number, or unmeasured]",
    // reminder: fake data only, no client names
    problem: ["[The problem]", "[Why it mattered]"],
    goal: "[One sentence goal]",
    decisions: [todo("Make privacy visible"), todo("Explain processing states"), todo("Handle errors clearly"), todo("Balance automation and control")],
    changed: "[Results]",
    reflect: "[One honest reflection]",
  },
  {
    slug: "tablite",
    name: "TabLite",
    outcome: "Less friction, more flow.",
    role: "[your part vs. the team]",
    time: "[confirm]",
    tools: "[confirm]",
    users: "[number, or unmeasured]",
    problem: ["[The problem]", "[Why it mattered]"],
    goal: "[One sentence goal]",
    decisions: [todo("Identify the main friction"), todo("Simplify the primary flow"), todo("Establish consistent patterns"), todo("Refine feedback and interactions")],
    changed: "[Results]",
    reflect: "[One honest reflection]",
  },
];

// craft gallery (4:5 images)
export const craft = [
  { title: "Liquid Signature", cap: "Five chrome lighting tests", img: "/img/wordmark.webp", bg: "#D7CADC" },
  { title: "Somewhere in the Sky", cap: "Editorial poster experiments", img: "", bg: "#F2D0D5" },
  { title: "Objects in Bloom", cap: "Glass / 3D explorations", img: "", bg: "#D7CADC" },
  { title: "Interfaces in Progress", cap: "App redesigns + components", img: "", bg: "#B9CFDA" },
];
