# Your Complete Learning Roadmap - Stripe Apps Interview Prep

**Goal:** Master Stripe Apps concepts and ace your Staff PM interview
**Timeline:** 1-2 weeks (flexible based on your pace)
**Approach:** Learn by doing, then practice explaining

---

## 📅 Suggested Schedule

### Week 1: Hands-On Building (8-10 hours)

**Day 1-2: Environment Setup & Hello World (2-3 hours)**
- [ ] Install Stripe CLI and Node.js
- [ ] Follow [LEARN_BY_BUILDING.md](./docs/LEARN_BY_BUILDING.md) Part 1
- [ ] Build your first "Hello World" app
- [ ] Understand viewports and context hooks
- [ ] Deploy and see it in Dashboard

**Day 3-4: Build Customer Badge App (3-4 hours)**
- [ ] Follow Part 2 of LEARN_BY_BUILDING.md
- [ ] Implement parallel API calls
- [ ] Handle pagination
- [ ] Add business logic (customer categorization)
- [ ] Understand performance considerations

**Day 5-6: Build Mini Insights App (3-4 hours)**
- [ ] Follow Part 3 of LEARN_BY_BUILDING.md
- [ ] Create type definitions
- [ ] Separate business logic from UI
- [ ] Calculate real metrics (LTV, success rate, risk)
- [ ] Add caching for performance

**Day 7: Review Full Customer Insights App (2-3 hours)**
- [ ] Read through complete app code
- [ ] Understand advanced patterns (webhooks, etc.)
- [ ] Note product decisions and trade-offs
- [ ] Compare mini version to full version

---

### Week 2: Deep Dive & Interview Prep (6-8 hours)

**Day 1-2: Study Core Concepts (3-4 hours)**
- [ ] Read [INTERVIEW_PREP.md](./docs/INTERVIEW_PREP.md) sections 1-7
- [ ] Focus on: Architecture, Permissions, DX, Metrics
- [ ] Take notes on key talking points
- [ ] Think about how you'd explain each concept

**Day 3-4: Product Thinking & Strategy (2-3 hours)**
- [ ] Read INTERVIEW_PREP.md sections 8-12
- [ ] Study competitive landscape (Shopify, Salesforce)
- [ ] Read [DEVELOPER_EXPERIENCE.md](./docs/DEVELOPER_EXPERIENCE.md)
- [ ] Form opinions on prioritization

**Day 5: Practice Demo & Questions (2-3 hours)**
- [ ] Prepare demo script using your apps
- [ ] Practice answering common questions
- [ ] Prepare questions for your interviewers
- [ ] Do mock interview with friend/colleague

**Day 6-7: Final Prep (1-2 hours)**
- [ ] Review [QUICK_START.md](./docs/QUICK_START.md) checklist
- [ ] Refresh key concepts
- [ ] Test screen sharing setup
- [ ] Get good sleep before interview!

---

## 📚 Documentation Map

Here's what each document is for:

### 1. **LEARNING_ROADMAP.md** (This file) ← You are here
**Purpose:** Your guide through the learning journey
**When to use:** Start here, reference throughout

### 2. **LEARN_BY_BUILDING.md**
**Purpose:** Hands-on tutorial (Hello World → Mini Insights)
**Time:** 3-4 hours
**When to use:** First week, building phase

### 3. **INTERVIEW_PREP.md**
**Purpose:** Comprehensive interview guide (17 sections)
**Time:** 4-5 hours to read thoroughly
**When to use:** Week 2, after building experience

### 4. **QUICK_START.md**
**Purpose:** 30-minute speed run through key concepts
**Time:** 30 minutes
**When to use:** Final prep before interview

### 5. **DEVELOPER_EXPERIENCE.md**
**Purpose:** DX improvements and product thinking
**Time:** 1 hour
**When to use:** When preparing for "How would you improve?" questions

### 6. **README.md**
**Purpose:** Technical overview of Customer Insights app
**Time:** 30 minutes
**When to use:** Reference when demoing your app

---

## 🎯 Learning Objectives

By the end of this roadmap, you should be able to:

### Technical Understanding
- [ ] Explain Stripe Apps architecture (viewports, SDK, permissions)
- [ ] Build a simple Stripe App from scratch
- [ ] Make Stripe API calls and handle responses
- [ ] Implement pagination for large datasets
- [ ] Add caching for performance
- [ ] Handle webhooks for real-time updates
- [ ] Use TypeScript for type safety

### Product Thinking
- [ ] Justify metric selection (why LTV? why risk score?)
- [ ] Explain trade-offs (read vs write, fresh vs cached)
- [ ] Discuss platform extensibility concepts
- [ ] Identify DX friction points
- [ ] Propose solutions with impact/effort analysis
- [ ] Understand platform success metrics

### Interview Readiness
- [ ] Demo an app you built
- [ ] Answer "How would you improve X?"
- [ ] Discuss prioritization frameworks
- [ ] Compare Stripe Apps to competitors
- [ ] Ask insightful questions about the role
- [ ] Speak confidently about platform strategy

---

## 🎬 How to Demo Your Work

### Setup (Do this before interview)
1. **Have apps ready:**
   - Hello World running locally
   - Customer Badge or Mini Insights ready to show
   - Full Customer Insights code open in editor

2. **Test screen sharing:**
   - Practice sharing terminal + browser + IDE
   - Ensure everything loads quickly
   - Have backup screenshots if tech fails

3. **Prepare talking points:**
   - 2-minute overview of what you built
   - 3 specific technical decisions to discuss
   - 2-3 DX improvements you identified

### Demo Script (3-5 minutes)

**Opening (30 sec):**
"To prepare for this role, I built three Stripe Apps hands-on. Let me show you what I learned..."

**Show Code (2 min):**
1. **stripe-app.json** - "This defines where the app appears and what permissions it needs"
2. **App.tsx** - "Here's the UI component using Stripe's SDK"
3. **calculations.ts** - "I separated business logic for testability"

**Run Live (1-2 min):**
1. Start app: `stripe apps start`
2. Navigate to customer page
3. Show app in Dashboard
4. Point out loading state, data display

**Product Discussion (1 min):**
"Key decisions I made:
- Read-only for v1 (simpler permissions)
- Caching with 5-min TTL (performance vs freshness)
- Conservative risk thresholds (better false positive than miss fraud)"

**Transition:**
"Building this helped me identify DX improvements..." (segue to DX doc)

---

## 💡 Study Tips

### For Visual Learners
- Draw architecture diagrams
- Sketch data flow (API → logic → UI)
- Create mind maps of concepts

### For Hands-On Learners
- Type out code examples (don't just read)
- Modify apps and break things on purpose
- Experiment with different Stripe APIs

### For Discussion-Oriented Learners
- Explain concepts to a friend
- Record yourself answering questions
- Join Stripe Discord and ask questions

---

## 🎤 Practice Interview Questions

### Technical Questions

**Q: How does a Stripe App work technically?**
**A:** "A Stripe App is a React component that runs in an iframe within the Stripe Dashboard. The UI Extension SDK provides context hooks like `useCustomerId()` to read Dashboard state, and UI components that match Stripe's design system. Apps make backend API calls to fetch data, calculate insights, and render results. The whole thing is sandboxed for security."

**Q: How do you handle pagination in Stripe APIs?**
**A:** "Stripe returns max 100 items per request. I use a while loop checking `has_more`, passing `starting_after` with the last item's ID to get the next page. For performance, I only fetch what I need - if checking existence, I use `limit: 1` instead of fetching everything."

**Q: Walk me through your risk scoring algorithm.**
**A:** "I use a multi-factor approach: payment failure rate, chargeback count, new customer with large transaction, and velocity checks. Each factor adds points based on severity. Score >50 = high risk. I chose conservative thresholds - better to flag legitimate customer than miss fraud. In production, you'd train an ML model on historical fraud patterns."

### Product Questions

**Q: Why did you choose these metrics (LTV, payment pattern, risk)?**
**A:** "These drive merchant actions. High LTV customers get VIP treatment. Low payment success rate means fix payment method. High risk triggers fraud review. Other metrics like cohort analysis are interesting but don't drive immediate action, so I deprioritized for v1."

**Q: How would you prioritize new features for Stripe Apps?**
**A:** "I'd use an impact × effort matrix validated with user research:
1. Talk to developers - where do they get stuck?
2. Analyze data - where's the drop-off in funnel?
3. High-impact, low-effort wins go first (seed data, recipe docs)
4. Strategic bets need PM sponsorship (interactive playground)
I'd allocate 70% planned roadmap, 30% developer feedback."

**Q: How would you measure success of Stripe Apps?**
**A:** "Leading indicators: Active developers, time-to-first-app, app publish rate
Lagging indicators: Apps in marketplace, install rate, developer NPS
The North Star is active developers building - if they're engaged, they'll build great apps that drive merchant value."

### Behavioral Questions

**Q: Tell me about a time you identified a problem others missed.**
**A:** "While building my Stripe App, I noticed setup took 30 minutes because of environment variable configuration. Most tutorials gloss over this, but for new developers, it's a huge friction point. I proposed auto-configured environments in my DX doc - one command to working app. This pattern applies to any developer platform."

**Q: How do you handle disagreement with engineering?**
**A:** "I'd first understand their constraints - is it technical complexity, time, or something else? Then find data: Is this actually a user pain point? How many users affected? Could we do a smaller version? If it's critical for users but expensive to build, I'd propose phased rollout: MVP for 10% of users, measure impact, then full build if validated."

---

## 🚨 Common Pitfalls to Avoid

### During Building
- ❌ Don't skip the basics - understand Hello World before jumping to complex features
- ❌ Don't copy-paste without understanding - type it out, break it, fix it
- ❌ Don't ignore errors - read them carefully, they teach you

### During Interview
- ❌ Don't memorize answers - understand concepts, speak naturally
- ❌ Don't oversell - "I built a simple app" is honest and shows humility
- ❌ Don't only criticize - balance "what could improve" with "what works well"
- ❌ Don't forget to ask questions - curiosity is key for PM role

### In Demo
- ❌ Don't show code without explaining why
- ❌ Don't get lost in technical details - tie to product impact
- ❌ Don't assume they know Stripe Apps - explain as you go

---

## 📈 Progress Tracking

Use this checklist to track your progress:

### Building Phase (Week 1)
- [ ] Hello World app working
- [ ] Customer Badge app working
- [ ] Mini Insights app working
- [ ] Full Customer Insights code reviewed
- [ ] Can explain architecture verbally
- [ ] Can demo an app confidently

### Learning Phase (Week 2)
- [ ] Read INTERVIEW_PREP.md fully
- [ ] Read DEVELOPER_EXPERIENCE.md
- [ ] Understand all 17 sections
- [ ] Can explain platform concepts
- [ ] Have 3 DX improvements ready to discuss
- [ ] Have 5-7 questions for interviewers

### Practice Phase
- [ ] Practice demo script 3+ times
- [ ] Answer 10 practice questions
- [ ] Mock interview completed
- [ ] Screen sharing tested
- [ ] Backup materials ready

---

## 🎁 Bonus: Interview Day Checklist

### Morning Of
- [ ] Review QUICK_START.md (30 min)
- [ ] Test Zoom/Meet screen sharing
- [ ] Have apps running and ready to demo
- [ ] Have questions written down
- [ ] Eat a good meal, stay hydrated

### During Interview
- [ ] Listen carefully to questions
- [ ] Think before answering (pause is okay!)
- [ ] Use specific examples from your apps
- [ ] Ask clarifying questions if needed
- [ ] Show genuine curiosity about the role

### After Interview
- [ ] Send thank-you note within 24 hours
- [ ] Reference specific discussion points
- [ ] Reiterate excitement about role
- [ ] Don't stress - you prepared well!

---

## 🌟 You've Got This!

Remember:
- **You built real Stripe Apps** - That's more than most candidates
- **You identified real DX improvements** - Shows product thinking
- **You understand the platform deeply** - Technical credibility
- **You're prepared** - Just be yourself and show your work

The fact that you took initiative to build something instead of just reading about it shows exactly the mindset Stripe wants in a Staff PM.

Good luck! 🚀

---

## 📞 Questions or Stuck?

If you hit blockers while learning:
1. Check Stripe's official docs
2. Try Stripe's Discord community
3. Look at example apps on GitHub
4. Ask me - I'm here to help!

**Remember:** Getting stuck is part of learning. Every friction point you encounter is material for your "DX improvements" discussion in the interview!
