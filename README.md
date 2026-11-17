# Sydney Tran — Somewhere Between Sky & Screen

My product design portfolio. Pink skies, liquid chrome lettering, and real project work.

Built with Next.js, React, TypeScript, Tailwind CSS and Motion.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things are

```
src/
  content/site.ts        <- ALL the words + image paths. edit this first
  app/page.tsx           <- home page (6 chapters)
  app/work/[slug]/       <- case study pages (/work/life-dashboard, /work/arg-billing, /work/tablite)
  components/
    Nav.tsx              <- fixed header
    Hero.tsx             <- 01 The Sky: chrome name + 8 draggable tiles
    Studio.tsx           <- 02 The Studio: about + skill marquee
    Work.tsx             <- 03 Selected Work: 3 featured + 2 tools
    Behind.tsx           <- 04 Behind the Work: case study list
    Lab.tsx              <- 05 The Laboratory: craft gallery
    Contact.tsx          <- 06 Say Hello
    DecisionView.tsx     <- Design / Build switch used in case studies
public/img/              <- sky, clouds, chrome wordmark (put new images here)
```

Anything in `[brackets]` on the site still needs real info. Don't publish placeholders, made-up numbers or unconfirmed claims.

## Content checklist

### 1. Basics
- [x] Email: sltran3@illinois.edu
- [ ] LinkedIn and GitHub links (`info` in site.ts)
- [ ] Résumé PDF, one page, product design slant (put at `public/resume.pdf`)
- [ ] Confirm location line: "Product design — Champaign, IL"
- [ ] Confirm availability line: "Open to Summer 2027 product design internships"

### 2. Hero tile wall (8 images, 4:5, ~680 × 840)
Put them in `public/img/tiles/` and set `img` in `tiles`. Crop tight on a detail.
- [ ] 01 Life Dashboard, full screen
- [ ] 02 Life Dashboard, close-up detail
- [ ] 03 ARG Billing (anonymized / rebuilt mockup)
- [ ] 04 TabLite
- [ ] 05 Jellyflow
- [ ] 06 Research Methods AI
- [ ] 07 Figma artifact (component sheet or flow map)
- [ ] 08 Craft or sketch (optional: photo of me or my workspace)

### 3. Intro (3 paragraphs, ~50–60 words each)
- [ ] Rewrite the drafts in `about` in my own voice

### 4. Skill marquee (6–8 phrases)
- [ ] Confirm the `skills` list. Only keep what a project backs up

### 5. Featured projects (ARG Billing, Life Dashboard, TabLite)
For each: outcome headline (plain first half, italic second), category line, role / team / time, one Design sentence, one Build sentence, 16:9 image (~2880 × 1620).

### 6. More tools (Jellyflow, Research Methods AI)
For each: outcome headline, Design + Build sentence, 4:3 image (~1600 × 1200).

### 7. Case studies (Life Dashboard, then ARG Billing, then TabLite)
- [ ] Header facts: role, timeline, tools, number of users
- [ ] Story: the problem (with one real moment it hurt) + one-sentence goal
- [ ] 4 decisions, each with: title, Design view, what I dropped, Build view, a Figma frame + a code / recording visual (8 images per study)
- [ ] Ending: what changed (real numbers or honest qualitative), what I'd change
- ARG Billing: fake data only, no client names. Focus on privacy in the UI and leading the team.
- TabLite: be clear what I did vs. the team.

### 8. Craft (4–8 pieces, 4:5)
- [ ] Chrome wordmark process (5 variants)
- [ ] 2–3 visual experiments (posters, 3D, type)
- [ ] 1–2 UI explorations
- [ ] One-line caption each

### 9. Proof for product design roles
- [ ] Figma: wireframes, flows, components inside case studies
- [ ] Coding agents: mention Cursor or Claude Code in at least one Build view
- [ ] Design system: small `/system` page or one case study section
- [ ] Optional essay: "What rebuilding my Notion dashboard taught me about tools"

## Put it on GitHub

```bash
# make an empty repo on github.com first (no README), then:
git remote add origin https://github.com/<your-username>/sydney-portfolio.git
git push -u origin main
```

Deploying: import the repo on vercel.com and it just works.
