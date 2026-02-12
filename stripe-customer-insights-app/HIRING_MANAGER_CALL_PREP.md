# Hiring Manager Call Prep
## Staff PM — Stripe Apps & Extensibility Platform

**Call Type:** Hiring Manager Screen (30-45 min)
**Intel from James Beswick (Stripe DevRel Lead):**
- They want **"technically strong PMs"**
- Hiring manager will **read the first few lines of your resume** and decide
- James was previously a Developer Advocacy leader at AWS → you share AWS background

---

## Part 1: What This Call Actually Is

A hiring manager screen is NOT a full interview. It's a **"should I invest 5 hours of my team's time on this person?"** decision. The hiring manager is evaluating three things in 30-45 minutes:

1. **Signal from the resume top lines** → Does this person have the right background?
2. **Technical depth** → Can they go deep when I push, or is it surface-level?
3. **Platform instinct** → Do they think like someone who's built for developers?

The HM will likely spend 5 min on intro, 20-25 min probing your experience, 5-10 min on your questions. Every answer should demonstrate you are **technically hands-on, not a "strategy slide" PM**.

---

## Part 2: Your Resume Top Lines — What the HM Will See and What to Expand On

Your summary bullets (which we optimized) are:

> **Bullet 1:** "12+ years…developer platforms, extensibility frameworks, and application ecosystems—with hands-on experience defining how developers build, deploy, and debug on large-scale infrastructure"

> **Bullet 2:** "Proven track record at AWS building extensibility platforms and partner ecosystems (e.g., Amazon EventBridge SaaS integrations with Stripe, Datadog, Adobe)…"

> **Bullet 3:** "…personally test-driving features, writing technical documentation, and prototyping solutions before shipping"

**The HM will almost certainly open with:** "Tell me about yourself" or "Walk me through your background"

### Your 90-Second Opener (Rehearse This)

*"I've spent 12 years as a PM building developer platforms, most recently at AWS where I worked on event-driven infrastructure — EventBridge, Keyspaces, and serverless data services. The work most relevant to this role is probably the EventBridge SaaS partner integrations. I was the PM who designed the extensibility framework that lets third-party SaaS providers — including Stripe, actually — publish events natively into customers' AWS environments. That meant defining the partner onboarding APIs, event schema contracts, and the developer experience for 50+ SaaS partners.*

*What drew me to this role is that Stripe Apps is solving the same fundamental problem from the other side — how do you make a platform extensible so third-party developers can build on top of it, while keeping the experience great for end users? I've done that at AWS scale, and I've done it specifically with Stripe as one of my integration partners. I also come from a 0-to-1 background — I built a managed security product line from scratch at a startup, and more recently prototyped an LLM-powered rule engine using Claude. I like getting my hands dirty."*

### Why This Works
- **Drops "Stripe" in the first 30 seconds** — the EventBridge connection
- **Demonstrates technical specificity** — not "I managed a team," but "I designed schema contracts"
- **Hits "hands are filthy"** — prototyping with Claude, getting dirty
- **Shows platform thinking** — "extensibility framework," "partner onboarding APIs"
- **Natural bridge to the role** — "same problem from the other side"

---

## Part 3: Questions the HM Will Ask — and Technically Grounded Answers

### Q1: "Why Stripe? Why this role?"

**DON'T say:** Generic stuff about Stripe's mission or "growing the GDP of the internet."

**DO say:**

*"Two reasons — one specific, one strategic.*

*The specific one: I was the PM for EventBridge's SaaS partner integrations, and Stripe was one of our launch partners. I worked on the framework that powers Stripe's event destinations into EventBridge today. So I've literally been on the partner side of Stripe's extensibility story. Now I want to build the platform side.*

*The strategic one: Stripe just announced Scripts and Workflows at Sessions 2025, which means Apps is evolving from 'embed UI in the Dashboard' to becoming the packaging and distribution layer for multiple extensibility primitives — UI extensions, remote functions, scripts, workflows. That's a much bigger platform problem, and it's exactly the kind of 'how do you version, package, and ship multiple extension types through a single developer experience' challenge I find compelling. It reminds me of what we faced at AWS when EventBridge went from a single event bus to supporting SaaS integrations, API destinations, and pipes — each was a different extensibility primitive that needed a coherent developer experience."*

### Q2: "Tell me about your experience with extensibility platforms or app platforms"

This is the money question. Go deep on EventBridge.

*"At AWS, I owned the extensibility layer for Amazon EventBridge's SaaS partner program. The core problem was: how do we let 50+ SaaS providers — companies like Stripe, Datadog, Adobe, MongoDB — publish events into customers' AWS environments without each integration being a custom snowflake?*

*I had to design three things:*

*First, the **partner onboarding APIs** — a self-service flow where a SaaS provider could register their event source, define their event schemas, and configure how events would be routed. This is directly analogous to how Stripe Apps has an app manifest and permission model.*

*Second, the **event schema contracts** — we built a schema registry so that consumers could discover what events a partner emits and what the payload looks like. This was crucial for developer experience — without it, developers were guessing at event shapes and writing fragile parsers.*

*Third, the **developer experience for consumers** — when a Stripe event lands in a customer's EventBridge bus, what does the developer workflow look like? We had to make it easy to filter events, route to targets, and debug when things went wrong. I personally test-drove every integration end-to-end before we shipped it.*

*The result was 50+ SaaS partners onboarded, and it became one of EventBridge's key differentiators vs. competing event services."*

### Q3: "How would you approach defining how developers debug extension runtime errors?" (Pulled directly from JD)

This is a technically specific question from the job description. Show you've thought about it.

*"So this is interesting because Stripe Apps now has multiple extension types — UI extensions in a sandboxed iframe, remote functions calling out to third-party APIs, and soon scripts running TypeScript in an isolated execution environment. Each has different failure modes.*

*For UI extensions, the debugging challenge is the iframe sandbox boundary. Errors in the app don't bubble up to the Dashboard's dev tools cleanly. I'd want to invest in a dedicated dev panel — similar to React DevTools but for Stripe Apps — that shows the component tree, API calls the app is making, permission checks, and any errors, all in one place.*

*For remote functions, the challenge is latency and failure at the network boundary. If a tax app's remote function times out during checkout, that's a critical path failure. I'd want structured error codes that distinguish between 'your function returned an error,' 'your function timed out,' and 'Stripe couldn't reach your endpoint' — because the developer's remediation is different for each.*

*For scripts, since they run inside Stripe's infrastructure, the debugging story needs to include execution logs, input/output tracing, and a way to replay a script run with the same inputs. Think of it like CloudWatch Logs for Lambda — you need to see what happened, with what data, and why it failed.*

*I'd prioritize by blast radius: scripts and remote functions are on the critical payment path, so debugging there prevents revenue loss. UI extension debugging improves developer velocity but isn't blocking merchant transactions."*

### Q4: "How would you think about packaging and versioning extensions within Stripe Apps?" (Also from JD)

*"This is a problem I've thought about because EventBridge faced something similar — we had multiple integration types (SaaS sources, API destinations, Pipes) and needed a coherent way to version and ship them.*

*For Stripe Apps, the challenge is that an app might bundle a UI extension, a remote function, AND a script. These have different lifecycles — a UI change is low-risk and fast to review, but a script change that modifies billing logic is high-risk and needs careful validation.*

*I'd approach it in layers:*

*First, **the app manifest is the unit of packaging** — the stripe-app.json should declare all extension types the app uses, their entry points, and their permission requirements. Think of it like a package.json but for extensibility primitives.*

*Second, **versioning should be semantic but extension-aware** — a UI-only change is a minor version, a script change that modifies billing behavior is a major version. The review process should be gated differently based on what changed.*

*Third, **rollback needs to be atomic** — if you roll back an app, all its extensions roll back together. Partial rollback (new UI, old script) would create inconsistent states.*

*The key insight from my EventBridge experience is: don't let the packaging model become the bottleneck. If developers have to wait a week for review every time they change a button color because the same package also contains a script, they'll stop building. You need to decouple review stringency from the packaging unit."*

### Q5: "Tell me about a time you had to make a difficult prioritization decision"

Use a real AWS story. Make it technical.

*"When I joined the EventBridge team, the partner integration pipeline had a backlog of 30+ SaaS providers waiting to onboard. The engineering team wanted to build a self-service onboarding portal. Partnerships wanted to manually white-glove each integration to get marquee logos. I had to decide: build the portal (3 months) or keep doing manual onboarding?*

*I dug into the data. Each manual onboarding took 2-3 weeks of engineering time and produced a bespoke integration. The self-service portal would take 3 months but then reduce onboarding to days. However, the manual approach had produced higher-quality integrations because engineers were catching partner-side bugs during the process.*

*My decision was a hybrid: I invested 6 weeks building a 'semi-self-service' onboarding flow — partners could register and submit their event schemas through a CLI tool, but we kept a human review step for the schema contract validation. This cut onboarding time from 3 weeks to 5 days while maintaining quality.*

*The result: we went from 15 to 50+ partners in about 6 months, and the schema quality was actually better because partners were forced to think about their schemas upfront rather than having our engineers figure it out for them."*

### Q6: "How do you stay close to the developer experience?"

This is the "hands are filthy" probe. Be concrete.

*"Three ways. First, I build things myself. To prepare for this conversation, I actually built a Stripe App — a customer insights dashboard using the UI Extension SDK, Stripe APIs, and TypeScript. I hit real friction points: setup took 30 minutes because of environment variable configuration, the type definitions for expandable fields don't enforce at compile time whether you've actually expanded them, and there's no easy way to mock the Stripe API for testing. I documented 12 specific DX improvements.*

*Second, at AWS, I personally test-drove every EventBridge partner integration end-to-end before we shipped it. I'd set up the integration, trigger events, write consumers, and break things deliberately. If I couldn't get it working in 30 minutes, we didn't ship it.*

*Third, I write and edit documentation. For the Keyspaces migration project, I didn't just define requirements — I rewrote the migration guide after going through it myself and finding three steps that were either wrong or confusing. If a PM hasn't used their own product, they can't make good prioritization decisions."*

### Q7: "What's your understanding of where Stripe Apps is headed?"

Show you've done your homework on the latest announcements.

*"Based on what was announced at Sessions 2025, I think Stripe Apps is at an inflection point. It started as a way to embed third-party UI in the Dashboard. But with Scripts, Workflows, Remote Functions, and the MCP server, it's becoming the platform layer for all of Stripe's extensibility.*

*Michelle Bu said in the developer keynote that Stripe is investing in a 'composable platform' — more extension points, richer runtimes, and the ability for developers to mix and match. That's a huge scope expansion for the Apps PM. You're no longer just managing a UI embedding framework — you're defining how all these extensibility primitives get packaged, versioned, distributed, and debugged through a single developer experience.*

*The MCP server is particularly interesting to me because it's the AI-native extensibility layer — agents can now make Stripe API calls, which means the 'developer' building on Stripe might increasingly be an LLM, not a human. That changes what 'developer experience' means.*

*If I were in this role, the near-term focus would be on making the multi-extension packaging story coherent — how does a single Stripe App bundle a UI, a script, and a workflow? — and the medium-term bet would be on making Apps the distribution mechanism for AI-powered extensions."*

---

## Part 4: Questions You Should Ask the HM

These questions signal technical depth and platform thinking. Pick 3-4 depending on how the conversation flows.

### About the Technical Landscape
1. *"With Scripts running TypeScript in an isolated execution environment, how are you thinking about the security boundary? Is the isolation model closer to V8 isolates like Cloudflare Workers, or container-based like Lambda?"*

2. *"The JD mentions defining how developers debug extension runtime errors — is there an observability story for extensions today, or is that greenfield?"*

3. *"How does the app review process work currently for apps that bundle multiple extension types? Is that a solved problem or part of this role's scope?"*

### About the Product Strategy
4. *"Stripe Workflows seems like it could compete with some third-party apps that automate Stripe actions. How do you think about the tension between platform features and the app ecosystem?"*

5. *"James Beswick mentioned the team wants technically strong PMs. What does 'technically strong' look like in practice for this role? Are PMs reviewing PRs, writing design docs, prototyping?"*

### About the Team
6. *"How does the Apps PM team interact with the engineering teams building the different extension runtimes (Scripts, Workflows, Remote Functions)? Is the PM owning the platform experience across all of them, or are there separate PMs per primitive?"*

7. *"What's the biggest open question the team is grappling with right now?"*

---

## Part 5: Traps to Avoid

**Trap 1: Going too broad/strategic too early.**
The HM wants to see if you can go deep on technical details. Don't lead with "Apps creates network effects and flywheel dynamics." Lead with how the iframe sandbox model works and what debugging looks like.

**Trap 2: Sounding like you memorized Stripe's docs.**
Don't recite architecture. Instead, reference specific things you noticed while building: *"When I was building my app, I noticed that..."* This proves you've done the work.

**Trap 3: Not connecting AWS experience to Stripe.**
Every AWS story should end with a bridge to what you'd do at Stripe. Don't just say "I did X at AWS." Say "I did X at AWS, and the analogous challenge at Stripe Apps is Y."

**Trap 4: Being vague about "hands are filthy."**
Don't say "I like to get hands-on." Say "I built a Stripe App, I found 12 DX issues, here are the top 3." Specificity is the signal.

**Trap 5: Not knowing the latest announcements.**
Your existing prep docs don't cover Scripts, Workflows, MCP, or the Sessions 2025 announcements. The HM will know instantly if you're working off outdated understanding. The role is about the **future** of Apps (multi-extension platform), not just the current state (UI embedding).

---

## Part 6: Key Facts to Have Loaded (Quick Reference)

### Stripe Apps — Current State
- UI extensions run in sandboxed iframe in Dashboard
- React + TypeScript + Stripe UI Toolkit (no arbitrary HTML)
- Viewports define where app appears (customer.detail, payment.detail, etc.)
- Permissions are granular, OAuth-style (customer_read, charge_read, etc.)
- App manifest: stripe-app.json
- Dev workflow: `stripe apps start` → local dev server → CLI handles bundling/upload

### Stripe Apps — Where It's Going (Sessions 2025)
- **Scripts:** TypeScript subset running inside Stripe (customize billing logic, proration, invoice HTML)
- **Workflows:** No-code visual builder, 600+ API actions, event-triggered automation
- **Remote Functions:** Third-party API callouts from within Stripe (e.g., Avalara for tax)
- **MCP Server:** AI agents can make Stripe API calls natively
- **Composable Platform:** Michelle Bu's vision — more extension points, richer runtimes, mix-and-match
- **Apps = the packaging layer** for all these extension types

### Your AWS → Stripe Bridge Points
| AWS Experience | Stripe Apps Analog |
|---|---|
| EventBridge SaaS partner framework | Apps partner/developer ecosystem |
| Event schema registry | App manifest + permissions model |
| Partner onboarding APIs | Developer onboarding / app review |
| CDC integration as extensibility primitive | Scripts as extensibility primitive |
| CloudWatch for debugging event flow | Extension runtime error debugging |
| Lambda isolation model | Scripts isolated TypeScript execution |

### Numbers to Drop Naturally
- 50+ SaaS partners onboarded to EventBridge
- 500% revenue growth on your AWS products
- Stripe processes $1.4T/year (Sessions 2025)
- 300,000+ businesses use Stripe Billing
- EventBridge SaaS integration with Stripe is live today (docs.stripe.com/event-destinations/eventbridge)

---

## Part 7: Call Simulation — Full Flow

**[0-5 min] Intro**
HM: "Thanks for chatting. Tell me about yourself."
→ Use the 90-second opener from Part 2

**[5-15 min] Resume Deep Dive**
HM will pick 1-2 resume bullets and push hard:
- "Tell me more about the EventBridge partner integrations"
→ Use Q2 answer — go deep on the three things you designed
- "What do you mean by 'personally test-driving features'?"
→ Use Q6 answer — Stripe App you built, 12 DX issues, doc rewrites

**[15-30 min] Role-Specific Probing**
HM will test whether you understand the actual job:
- "How would you approach [specific problem from JD]?"
→ Use Q3 (debugging) or Q4 (packaging/versioning) answers
- "What do you know about where we're headed?"
→ Use Q7 answer — Sessions 2025, composable platform, Scripts/Workflows

**[30-40 min] Your Questions**
→ Ask 3-4 from Part 4, prioritizing the technical ones

**[40-45 min] Close**
HM: "Any final thoughts?"
→ *"I want to reiterate — I built the extensibility framework that Stripe uses today to publish events into AWS. I understand this problem space from the partner side, and I'm excited to solve it from the platform side. I've also already built on your platform to understand the developer experience firsthand. I think the multi-extension packaging challenge is one of the most interesting platform problems in developer tools right now, and I'd love to work on it."*

---

## Part 8: Day-Of Checklist

- [ ] Re-read this document (20 min)
- [ ] Rehearse the 90-second opener out loud (3x)
- [ ] Have your Stripe App code open in an IDE (in case they ask to see it)
- [ ] Have these browser tabs ready:
  - https://docs.stripe.com/event-destinations/eventbridge (YOUR integration)
  - https://docs.stripe.com/stripe-apps (current Apps docs)
  - https://docs.stripe.com/billing/scripts (Scripts — new primitive)
  - https://stripe.com/sessions/2025/developer-keynote (Michelle Bu's talk)
- [ ] Have this doc open for quick reference during the call
- [ ] Water, notebook, quiet room, camera on
