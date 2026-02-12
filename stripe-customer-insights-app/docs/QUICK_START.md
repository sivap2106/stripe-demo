# Quick Start Guide - Interview Prep

**Time to complete:** 30-60 minutes
**Goal:** Understand Stripe Apps architecture and key interview topics

---

## Step 1: Understand the App (15 min)

### What It Does
Displays customer analytics in Stripe Dashboard:
- Lifetime Value (LTV)
- Payment success rate
- Risk score
- Subscription health

### How It Works
1. **Embedded in Dashboard** - Appears on customer detail page
2. **Fetches Stripe data** - Calls Customers, Charges, Subscriptions APIs
3. **Calculates insights** - Runs business logic to compute metrics
4. **Displays results** - Renders UI using Stripe's component library

### Key Files to Review
1. [`stripe-app.json`](../stripe-app.json) - App manifest (permissions, viewports)
2. [`src/views/CustomerInsights.tsx`](../src/views/CustomerInsights.tsx) - Main UI component
3. [`src/api/stripeClient.ts`](../src/api/stripeClient.ts) - API integration
4. [`src/utils/calculations.ts`](../src/utils/calculations.ts) - Business logic

---

## Step 2: Read the Interview Prep Guide (20 min)

Open [`docs/INTERVIEW_PREP.md`](./INTERVIEW_PREP.md) and focus on:

### Must-Read Sections
1. **Core Concepts** (pages 1-4)
   - Stripe Apps architecture
   - Platform extensibility
   - Permissions model

2. **Developer Experience** (page 4)
   - Onboarding friction
   - Iteration speed
   - Debugging

3. **Metrics & Success Criteria** (page 7)
   - How to measure platform health
   - Developer adoption metrics

4. **Common Interview Questions** (page 15)
   - Prioritization framework
   - Trade-off discussions

### Skim These (read if time allows)
- Stripe APIs (page 5) - You can learn as you go
- Webhooks (page 6) - Important but not critical for first conversation
- Competitive Landscape (page 10) - Good context

---

## Step 3: Explore the Code (15 min)

### Reading Path

**1. Start with Types** (`src/types/index.ts`)
- Understand the data structures
- See what insights we calculate
- Note the educational comments

**2. Business Logic** (`src/utils/calculations.ts`)
- How do we calculate LTV?
- What makes a customer "risky"?
- Note the product decisions

**3. API Integration** (`src/api/stripeClient.ts`)
- How do we fetch data from Stripe?
- Why parallel requests?
- How does caching work?

**4. UI Component** (`src/views/CustomerInsights.tsx`)
- How is data displayed?
- What's the UX for loading/error states?
- How does Stripe's SDK work?

### Questions to Ask Yourself
- Why these metrics and not others?
- What trade-offs were made?
- How would you improve this?
- What's missing for a production app?

---

## Step 4: Prepare Talking Points (10 min)

### Demo Script

**If you show this app in the interview:**

"I built a customer insights dashboard to understand Stripe Apps hands-on. Let me walk you through the key concepts..."

**[Show stripe-app.json]**
"This is the app manifest. It defines:
- Permissions: What Stripe data can we access?
- Viewports: Where does it appear in the Dashboard?
- Webhooks: Which events trigger updates?"

**[Show calculations.ts]**
"The business logic calculates:
- LTV from all charges and subscriptions
- Risk score based on payment failures, chargebacks, velocity
- Subscription MRR

Key decision: I chose conservative risk thresholds - better to flag a legitimate customer than miss fraud."

**[Show stripeClient.ts]**
"API integration uses Promise.all for parallel requests - reduces latency from ~1s to ~200ms. There's a caching layer with 5-minute TTL, invalidated by webhooks."

**[Show CustomerInsights.tsx]**
"UI uses Stripe's component library for consistency with the Dashboard. It handles loading states, errors, and displays metrics in scannable cards."

### Product Thinking Points

**On Metric Selection:**
"I focused on LTV, payment patterns, and risk because these drive merchant actions:
- High LTV → VIP treatment, retention focus
- Low success rate → Fix payment method
- High risk → Review for fraud

Other metrics I considered but deprioritized for v1:
- Cohort analysis (complex)
- Predictive churn (requires ML)
- Time-series trends (requires charting library)"

**On Developer Experience:**
"While building, I hit several friction points:
1. Setup took 30 min (env vars, API keys)
2. No mock data for testing
3. Error messages weren't actionable
4. Type definitions had gaps

I documented these in [DEVELOPER_EXPERIENCE.md](./DEVELOPER_EXPERIENCE.md) with proposed solutions."

**On Platform Strategy:**
"Stripe Apps enables third-party innovation. The platform's job is:
1. Make it easy to build (DX)
2. Make it safe to run (security, permissions)
3. Make it discoverable (marketplace)
4. Make it profitable (monetization, eventually)

Balancing these creates tension: More freedom = more risk. Stricter review = slower innovation."

---

## Step 5: Review DX Improvements (10 min)

Open [`docs/DEVELOPER_EXPERIENCE.md`](./DEVELOPER_EXPERIENCE.md)

### Key Insights
1. **Setup friction** - Propose auto-configured environment
2. **Testing gaps** - Propose mock utilities and test harness
3. **Documentation** - Propose recipe-based examples
4. **Deployment** - Propose pre-flight checker and beta mode

### Interview Angle
"As a PM, I focus on reducing friction. Here are the top 3 DX improvements I'd prioritize:
1. **Auto-setup** (saves 20 min) - One command to working app
2. **Testing tools** (enables TDD) - Pre-built mocks and fixtures
3. **Recipe docs** (40% faster implementation) - Real-world examples, not toy cases

I'd validate with user research first, then prototype the highest-impact items."

---

## Step 6: Practice Interview Questions (Ongoing)

### Warm-Up Questions

**Q: Tell me about this project.**

A: "I built a Stripe App to prepare for this role. It's a customer insights dashboard that calculates LTV, payment patterns, risk scores, and subscription health. Building it gave me hands-on experience with Stripe's APIs, the Apps platform, and common product trade-offs like read-only vs write permissions, on-demand vs pre-computed metrics, and security vs flexibility."

**Q: What was the hardest part?**

A: "Risk scoring was interesting - I had to balance false positives vs false negatives. Too strict and you flag legitimate customers (poor UX). Too lenient and fraud slips through (merchant loses money). I used a multi-factor approach with conservative thresholds, but in production, you'd want to train an ML model on historical fraud patterns."

**Q: How would you improve this app?**

A: "Three ways:
1. **Predictive churn** - Use ML to forecast which customers will churn in next 30 days
2. **Actionability** - Add 'Send win-back email' or 'Flag for review' buttons
3. **Customization** - Let merchants define their own metrics and thresholds

But I'd validate demand first with user research - no point building features merchants won't use."

### Deep Dive Questions

**Q: How would you scale this to millions of customers?**

A: [See INTERVIEW_PREP.md page 14]

**Q: What metrics would you track for this app?**

A: [See INTERVIEW_PREP.md page 7]

**Q: How would you prioritize new features?**

A: [See INTERVIEW_PREP.md page 8]

---

## Step 7: Questions for Your Interviewers

### About the Role
1. "What's the biggest unsolved problem in Stripe Apps right now?"
2. "How do you balance merchant needs vs developer needs?"
3. "What does success look like for this role in the first 6 months?"

### About the Team
4. "How does the Apps team collaborate with other Stripe product teams?"
5. "What's your developer community like - how engaged are they?"
6. "How do you gather feedback from app developers?"

### About Strategy
7. "What's the vision for Stripe Apps in 3 years?"
8. "How do you think about build vs enable - which features should Stripe build vs enable partners to build?"
9. "What can Stripe Apps learn from platforms like Shopify or Salesforce?"

---

## Cheat Sheet: Key Talking Points

**Stripe Apps Architecture:**
- UI components embedded in Dashboard via iframe
- Secure API access through permission grants
- Webhook-driven real-time updates
- Stripe UI Extension SDK for consistent design

**Platform Thinking:**
- Enable innovation > build everything ourselves
- Developer freedom vs user safety
- Discoverability vs quality bar
- Performance vs flexibility

**Developer Experience:**
- Time-to-first-app is critical metric
- Testing must be easy (mocks, fixtures, harness)
- Error messages should be actionable
- Documentation needs real-world examples

**Metrics for Platform Success:**
- Active developers building apps
- Apps published per month
- App install/retention rate
- Developer NPS

**Product Prioritization:**
- Impact × Effort matrix
- User research validation
- Business alignment
- Start with quick wins

---

## Final Prep Checklist

Before your interview:

- [ ] Read core concepts in INTERVIEW_PREP.md
- [ ] Review all code files with comments
- [ ] Understand key product decisions (why read-only? why these metrics?)
- [ ] Prepare demo talking points
- [ ] Read DX improvements document
- [ ] Practice answering "Tell me about this project"
- [ ] Prepare 5-7 questions for interviewers
- [ ] Review Stripe's company values
- [ ] Test screen sharing (if remote interview)
- [ ] Get a good night's sleep!

---

## Good Luck! 🚀

Remember:
- **Show curiosity** - Ask thoughtful questions
- **Demonstrate empathy** - Understand developer pain points
- **Think strategically** - Platform vs point solutions
- **Be authentic** - It's okay to say "I don't know, but here's how I'd find out"

You've got this!
