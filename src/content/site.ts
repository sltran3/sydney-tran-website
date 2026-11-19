// all the words on the site live here
// anything in [brackets] still needs real info before publishing!

export const info = {
  name: "Sydney Tran",
  email: "sltran3@illinois.edu",
  linkedin: "https://www.linkedin.com/in/sydney-tran-931404237", // full address (with https://), or the browser treats it as a page on this site
  github: "https://github.com/sltran3", // TODO: real GitHub URL
  resume: "#", // TODO: add /resume.pdf to public/ and link it here
  place: "Champaign, IL", // TODO: confirm
  status: "", // TODO: confirm
};

// [[n|words]] marks words the about sketch highlights once its pen finishes sketch n (1-6). keep these when editing the text,
// or the highlights disappear; the brackets never show on the page
export const about = [
  "I'm a designer who loves building things just as much as imagining them. I'm studying Computer Science and Advertising at UIUC, where I've found myself drawn to the space between technology, creativity, and human behavior. I love [[1|figuring out how things work]], but even more, how to make them feel intuitive, thoughtful, and a little unexpected.",
  "My experiences have taken me from [[4|building AI-powered tools for medical billing]] to [[2|developing automation systems at Amazon Lab126]] and [[3|accelerating research at Stanford]]. Working across engineering and design has taught me to think beyond how something looks. I care about the decisions underneath an interface and how those decisions affect the people using it.",
  "I like starting with a problem, exploring possibilities, and [[6|turning the most promising ideas into something real]]. My process is a mix of research, experimentation, and [[5|building in code]]. I'm especially interested in thoughtful tools that make complex tasks feel simple.",
];

// only list skills a project can back up
export const skills = [
  "Product design",
  "Design engineering",
  "UX + interaction design",
  "Frontend engineering",
  "Full-stack development",
  "Figma to production",
  "Design systems",
  "Prototyping in code",
  "AI-powered tools",
  "User research",
];

// 3 big featured projects (16:9 image, ~2880x1620)
export const features = [
  {
    slug: "life-dashboard",
    name: "Life Dashboard",
    video: "/videos/carousel/sydney-dashboard-billboard.mp4",
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
    name: "Clearline",
    video: "/videos/carousel/clearline-portfolio.mp4",
    h1: "Sensitive documents,",
    h2: "handled thoughtfully.",
    meta: "Healthcare technology · Technical Lead · 2026",
    design: "Make processing status and privacy visible at every step.",
    build: "Led local PDF validation and extraction. [users — confirm]",
    img: "",
    bg: "#F8F1EA",
  },
  {
    slug: "tablite",
    name: "TabLite",
    archived: true, // hidden from Selected Work (kept here so it's easy to bring back: delete this line)
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
  { name: "Jellyflow", href: "/work/jellyflow", video: "/videos/carousel/jellyflow-portfolio-reel.mp4", h1: "Make studying feel", h2: "like a little adventure.", design: "[Design sentence]", build: "[Build sentence]", img: "", bg: "#B9CFDA" },
  { name: "Research Methods AI", archived: true, h1: "From questions", h2: "to clearer research.", design: "[Design sentence]", build: "[Build sentence — confirm functionality]", img: "", bg: "#F2D0D5" },
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
  archived?: boolean; // hidden from Selected Work and the "Next" links (the page still works by its address)
  name: string;
  video?: string; // a film shown at the top of the case study, in place of the hero image
  outcome: string;
  role: string;
  time: string;
  tools: string;
  users: string;
  type?: string;
  client?: string;
  team?: string;
  description?: string;
  technical?: { heading: string; paragraphs: string[] };
  overview?: { heading: string; paragraphs: string[] };
  problemHeading?: string;
  concept?: { heading: string; paragraphs: string[] };
  changedHeading?: string;
  reflectHeading?: string;
  blankImages?: boolean;
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
    video: "/videos/carousel/sydney-dashboard-billboard.mp4", // the top-of-page film
    name: "Personal Productivity Dashboard",
    outcome: "Making productivity feel a little more personal.",
    role: "Product Designer & Developer",
    type: "Personal Project · UI/UX Design & Frontend Development",
    time: "2026",
    tools: "Figma",
    users: "Personal use",
    overview: {
      heading: "A workspace that makes me want to be productive.",
      paragraphs: [
        "I created a personal productivity dashboard to bring all the tools I use for studying and staying organized into one place.",
        "I wanted something that could help me manage my day without feeling like another boring productivity app. A lot of the tools I was using worked well individually, but I didn't like having to switch between different websites just to keep track of everything.",
        "I also wanted to experiment with making a workspace that felt more personal, where the design itself could make studying feel a little more enjoyable."
      ]
    },
    problemHeading: "Too many tools, not enough organization.",
    problem: [
      "I found myself using different apps for planning my day, tracking habits, and studying. Even though each tool served its purpose, switching between them made it harder to see everything I needed in one place.",
      "I wanted to create a dashboard where I could quickly check what I needed to do and access my study tools without constantly opening new tabs.",
      "My goal wasn't to create another complicated productivity system. I wanted something simple enough that I would actually use it every day."
    ],
    goal: "How might I bring my everyday productivity tools into one workspace while making the experience feel more enjoyable?",
    concept: {
      heading: "A little study café on my screen.",
      paragraphs: [
        "I liked the idea of creating a digital workspace that felt like sitting in a cozy café.",
        "Instead of using a typical minimal dashboard with plain cards and a white background, I wanted to design something that felt warm and inviting while still being functional.",
        "I went with a soft pink and brown color palette, illustrated objects, and a desktop-inspired layout.",
        "I wanted the dashboard to feel like my own little space, where I could open it up and immediately get into the mood to study."
      ]
    },
    decisions: [
      {
        title: "01. Figuring out what I actually needed",
        design: "I started by thinking about the tools I used most often and what information I wanted to see when I opened my dashboard.\n\nI didn't want to overcrowd the page with features I wouldn't use, so I focused on bringing my everyday study tools together in a way that made sense.",
        build: "One of the main things I wanted was to be able to see my daily tasks and habits without having to navigate through different pages.\n\nI experimented with different widget arrangements to figure out which information should be the most visible and which tools could take up less space.",
        dropped: "",
        designImg: "/img/dashboard/01-full-dashboard.webp",
        buildImg: "/img/dashboard/01-full-dashboard.webp"
      },
      {
        title: "02. Finding the right visual direction",
        design: "One of my biggest goals was making the dashboard feel different from a typical productivity app.\n\nI experimented with a cozy café concept, using soft colors and illustrated elements to make the interface feel more like a personal workspace.",
        build: "I tried different backgrounds and decorative assets, but some of the earlier designs felt too busy or didn't fit together.\n\nI ended up simplifying the illustrations and adjusting the color palette so the design still had personality without distracting from the actual tools.",
        dropped: "",
        designImg: "/img/dashboard/02-visual-direction.webp",
        buildImg: "/img/dashboard/02-visual-direction.webp"
      },
      {
        title: "03. Organizing the dashboard",
        design: "Once I had a visual direction, I worked on arranging the different widgets so the dashboard felt organized.\n\nI wanted the most important information to be easy to find without everything competing for attention.",
        build: "I experimented with different layouts and adjusted the sizing and placement of each section to create a better visual hierarchy.\n\nOne of the things I focused on was making the widgets feel like they belonged in the same interface instead of looking like separate apps placed next to each other.",
        dropped: "",
        designImg: "/img/dashboard/03-widget-layout.webp",
        buildImg: "/img/dashboard/03-widget-layout.webp"
      },
      {
        title: "04. Making habit tracking more visual",
        design: "I wanted habit tracking to be something I could understand at a glance rather than having to read through a list every day.\n\nI explored a calendar-style habit tracker where I could see my progress over time.",
        build: "This made the feature feel more connected to the rest of the dashboard and gave me a clearer way to look at my consistency.\n\nI also wanted the interaction to feel simple enough that updating a habit wouldn't become another task on its own.",
        dropped: "",
        designImg: "/img/dashboard/04-habit-tracker.webp",
        buildImg: "/img/dashboard/04-habit-tracker.webp"
      },
      {
        title: "05. Bringing the design to life",
        design: "After experimenting with the layouts in Figma, I worked on translating the design into a functional web interface.\n\nOne challenge was balancing the decorative elements with the actual dashboard components. Some illustrations looked good on their own but took up too much space or made the layout feel crowded.",
        build: "I kept adjusting the placement of the widgets and the surrounding artwork until the design felt more cohesive.\n\nI wanted the final interface to keep the feeling of a cozy workspace while still being practical to navigate.",
        dropped: "",
        designImg: "/img/dashboard/05-syllabus-import.webp",
        buildImg: "/img/dashboard/05-syllabus-import.webp"
      }
    ],
    changedHeading: "Everything in one little workspace.",
    changed: "The final dashboard brings my daily planning and study tools together in a workspace designed around how I like to stay organized.\n\nIt combines functional widgets with a more personal visual style, making the experience feel less like managing another to-do list and more like opening a space I actually enjoy using.\n\nWhat started as a way to organize my own study routine also became an opportunity to explore how much the visual design of a tool can affect the experience of using it.",
    reflectHeading: "What I learned.",
    reflect: "I learned that a workspace can feel personal and still be simple to use. Simplifying the illustrations and layout helped the tools I use most stand out. Next, I'd use the dashboard in my daily routine to see which widgets I rely on and where customization would help.",
    blankImages: true
  },
  {
    slug: "arg-billing",
    video: "/videos/carousel/clearline-portfolio.mp4", // the top-of-page film
    name: "Clearline",
    outcome: "Making complex medical billing workflows feel simple.",
    description: "A healthcare document processing tool designed to make reviewing patient information easier.",
    client: "ARG Billing",
    role: "Technical Lead · Product Design & Software Engineering",
    type: "Client Project · Healthcare Technology",
    team: "5 Engineers",
    time: "2026",
    tools: "",
    users: "Billing staff",
    overview: {
      heading: "Bringing clarity to medical billing.",
      paragraphs: [
        "Clearline is a product concept I developed for ARG Billing, a medical billing client our team worked with to improve the process of extracting and reviewing patient information from PDFs.",
        "The project started with an AI-assisted document processing system, but I wanted to think beyond the technical functionality and explore how we could make the experience easier for billing staff.",
        "I developed Clearline as a more cohesive product direction, focusing on how staff would navigate patient records and complete their daily tasks.",
        "As the technical lead, I helped guide the engineering team while also working on the product's interface and overall workflow."
      ]
    },
    problemHeading: "Automated extraction doesn't mean automated work.",
    problem: [
      "Medical billing involves reviewing a lot of patient information, and even after a system extracts the data, staff still need to check whether everything is correct.",
      "The original interface displayed the extracted information, but it wasn't designed around how billing staff actually moved through their work.",
      "Patient records took up a lot of space, important information was difficult to find, and there wasn't a clear way to track what had already been reviewed.",
      "I wanted the product to make the entire process easier, not just the extraction step."
    ],
    goal: "How might we turn automated document extraction into a more intuitive workflow for the people reviewing the results?",
    concept: {
      heading: "Introducing Clearline.",
      paragraphs: [
        "I developed Clearline as the concept brand for the redesigned medical billing tool.",
        "I wanted the name and visual direction to reflect what the product was meant to do: make a complicated process feel clearer and more manageable.",
        "Instead of designing a typical healthcare dashboard with large cards and unnecessary statistics, I wanted the interface to feel like a practical workspace.",
        "The visual direction uses a more structured layout with restrained colors and clear status indicators, so the information that needs attention stands out.",
        "The goal was to create a product that felt professional and simple enough for staff to use throughout the day."
      ]
    },
    decisions: [
      {
        title: "01. Making patient records easier to navigate",
        design: "The original interface displayed each patient in a large card with multiple fields visible at once.\n\nI felt like this made it harder to quickly find information, especially when working through a large batch of patients.",
        build: "For Clearline, I explored a more compact layout where patients appeared in collapsible rows, with their most important details visible without needing to open each record.\n\nI also designed a search feature that would let staff find a patient by name, member ID, or date of birth.\n\nI wanted users to be able to find the exact record they needed instead of scrolling through the entire page.",
        dropped: "",
        designImg: "/img/clearline/01-batch-overview.webp",
        buildImg: "/img/clearline/01-batch-overview.webp"
      },
      {
        title: "02. Simplifying copy and paste",
        design: "One part of the client's workflow involved transferring patient information from our tool into Availity to check insurance eligibility.\n\nSince staff still needed to enter certain information manually, I wanted to make this process as easy as possible.",
        build: "I designed copy-to-clipboard buttons beside individual patient fields so users could quickly copy information into Availity.\n\nI also simplified how the fields were displayed, replacing the larger boxed layout with more compact rows.\n\nThis was one of the smaller features I worked on, but I liked how it addressed a task the client would have to repeat for almost every patient.",
        dropped: "",
        designImg: "/img/clearline/02-copy-into-availity.webp",
        buildImg: "/img/clearline/02-copy-into-availity.webp"
      },
      {
        title: "03. Making PDF review more intuitive",
        design: "Another important part of the workflow was making sure staff could easily verify the information extracted from the original document.\n\nIn the earlier interface, the extracted fields weren't connected to their locations in the PDF, so users had to look through the document themselves.",
        build: "I explored a side-by-side layout where staff could review the extracted information while keeping the original PDF visible.\n\nI also wanted to include zoom controls so users could look more closely at smaller text without leaving the review screen.\n\nFor individual fields, I explored linking the extracted values to the relevant locations in the document.\n\nThe goal was to make checking a value feel like one continuous interaction rather than switching back and forth between different views.",
        dropped: "",
        designImg: "/img/clearline/03-pdf-side-by-side.webp",
        buildImg: "/img/clearline/03-pdf-side-by-side.webp"
      },
      {
        title: "04. Helping staff keep track of their work",
        design: "I wanted Clearline to make it obvious which patients had already been reviewed and which ones still needed attention.\n\nFor the eligibility workflow, I redesigned the patient list around a more straightforward review process.",
        build: "Instead of keeping every patient expanded, users could open one record, copy the information they needed, and save the eligibility result.\n\nThe completed patient would then move into a separate Done section, and the next unchecked record could be opened.\n\nI also explored making low-confidence and missing fields stand out during PDF review, while keeping high-confidence information visually quieter.\n\nI wanted the interface to guide users toward what needed their attention without making everything look equally urgent.",
        dropped: "",
        designImg: "/img/clearline/04-needs-review.webp",
        buildImg: "/img/clearline/04-needs-review.webp"
      },
      {
        title: "05. Connecting the workflow through Clearline",
        design: "As I worked on the individual screens, I started thinking about how staff would navigate the product from the moment they opened it.\n\nThe original tool opened directly into a batch of records, without a clear starting point or a way to return to previous work.",
        build: "For Clearline, I explored a home screen where users could upload a new PDF batch, reopen previous batches, and resume an unfinished review.\n\nI developed different layout concepts to compare how the information could be organized.\n\nI leaned toward a work-queue layout because it made better use of the available space and allowed users to see more records at once.\n\nI wanted the product to feel like one connected workspace instead of a collection of separate pages.",
        dropped: "",
        designImg: "/img/clearline/05-home-screen.webp",
        buildImg: "/img/clearline/05-home-screen.webp"
      }
    ],
    technical: {
      heading: "Building the system behind the experience.",
      paragraphs: [
        "Alongside developing the Clearline concept, I served as the technical lead for the ARG Billing engineering team.",
        "We worked on a local AI-assisted pipeline that could validate medical PDFs and extract relevant patient information for review.",
        "Since the documents contained sensitive healthcare information, we needed to keep processing within the client's environment.",
        "This meant thinking carefully about how data moved through the system and making sure patient information wasn't being sent to an external AI service.",
        "I also helped coordinate development tasks and worked with engineers to resolve technical challenges throughout the project.",
        "Working on both the technical system and the product design helped me understand how the interface needed to support what the backend could actually do."
      ]
    },
    changedHeading: "From extracted data to a more complete product experience.",
    changed: "Clearline brought together the workflow improvements I wanted to introduce to the original medical billing tool.\n\nThe redesign focused on making everyday tasks easier, especially finding patient records and reviewing information against the original PDFs.\n\nI also wanted the overall product to feel more consistent, with clearer navigation and fewer unnecessary interactions.\n\nRather than adding features just to make the tool look more complete, I focused on the parts of the client's workflow where a better interface could make the biggest difference.",
    reflectHeading: "What I learned.",
    reflect: "Leading Clearline taught me to design around how billing staff already work. Even with automated extraction, staff still had to find records and copy information between tools. Focusing on those repeated tasks helped me balance what would make their work easier with what our team could build.",
    blankImages: true
  },
  {
    slug: "tablite",
    archived: true, // hidden from Selected Work (delete this line to bring it back)
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

// the "Next" link at the bottom of each case study walks through these in order (same order as the carousel),
// then loops back to the start. Jellyflow has its own page, so it's listed here by hand
export const caseStudyOrder: { href: string; name: string }[] = [
  ...studies.filter((s) => !s.archived).map((s) => ({ href: `/work/${s.slug}`, name: s.name })),
  { href: "/work/jellyflow", name: "Jellyflow" },
];
export function nextCaseStudy(href: string) {
  const i = caseStudyOrder.findIndex((s) => s.href === href);
  return caseStudyOrder[(i + 1) % caseStudyOrder.length]; // an archived page (not in the list) points to the first
}

// craft gallery (4:5 images)
export const craft = [
  { title: "Liquid Signature", cap: "Five chrome lighting tests", img: "/img/wordmark.webp", bg: "#D7CADC" },
  { title: "Somewhere in the Sky", cap: "Editorial poster experiments", img: "", bg: "#F2D0D5" },
  { title: "Objects in Bloom", cap: "Glass / 3D explorations", img: "", bg: "#D7CADC" },
  { title: "Interfaces in Progress", cap: "App redesigns + components", img: "", bg: "#B9CFDA" },
];

export const tech = [
  { group: "Design", items: ["Figma", "UI/UX Design", "Prototyping", "Wireframing", "Design Systems", "User Research"] },
  { group: "Frontend", items: ["React", "Next.js", "JavaScript", "TypeScript", "HTML/CSS", "Tailwind CSS"] },
  { group: "Backend & Systems", items: ["Python", "C++", "Java", "FastAPI", "REST APIs", "AWS", "Docker"] },
  { group: "3D & Motion", items: ["Three.js", "WebGL", "GLSL Shaders", "GLTF/GLB Models", "Motion for React", "Scroll-Driven Animation"] },
  { group: "AI & Agentic Dev", items: ["MCP Servers", "Claude Skills & Plugins", "Cursor", "PyTorch", "Claude API", "OpenAI API", "FLORA", "Nano Banana"] },
];

// about: the altitude climb. sky = above the horizon (how I think), screen = below it (what I've built)
export const altitude = [
  { alt: 0, label: "Ground", sky: "Bringing design and engineering together. ", screen: "Computer Science & Advertising @ UIUC" },
  { alt: 1000, label: "1,000 ft", sky: "Understanding the systems behind what we build.", screen: "Researcher → Stanford School of Medicine" },
  { alt: 10000, label: "10,000 ft", sky: "Turning complex systems into simple solutions.", screen: "Software Engineer Intern → Amazon" },
  { alt: 35000, label: "Cruising", sky: "	Designing around real people and their needs.", screen: "Technical Software Lead → Revamp Consulting, ARG Billing" },
  // { alt: 45000, label: "Above the clouds", sky: "About Me", screen: "open to product design roles" },
];
