# Interview Prep: Product Manager, Payments Intelligence
## Stripe — Payments Team

**Role Level:** PM (8+ years exp required) — same salary band as the Staff Apps role ($214K–$321K)
**Team:** Payments Intelligence organization
**Location:** SF HQ, NYC, Seattle, Chicago, or Remote US

---

## Part 1: What This Role Actually Is

This is fundamentally different from the Apps & Extensibility role. Here's the contrast:

| Dimension | Apps & Extensibility (Staff PM) | Payments Intelligence (PM) |
|---|---|---|
| **Core problem** | How do developers extend Stripe? | How does Stripe squeeze maximum value out of every transaction? |
| **User** | Third-party developers | Stripe merchants (businesses) |
| **Success metric** | Developer adoption, apps published | Authorization rate ↑, fraud ↓, cost ↓ |
| **Technical surface** | React/TypeScript SDK, iframe sandbox, app manifest | ML models, real-time inference, card network protocols |
| **Team composition** | Engineers + design | Engineers + **data scientists** (key distinction) |
| **Revenue impact** | Indirect (ecosystem value) | Direct (every basis point = millions of $) |
| **Products owned** | Stripe Apps, Scripts, Workflows | Radar, Authorization Boost, Smart Disputes, Enhanced Issuer Network |

**Why this matters for your positioning:** The Apps role rewards platform thinking and developer empathy. This role rewards **analytical horsepower, business acumen, and ML product intuition**. You need a different narrative.

---

## Part 2: The Payments Intelligence Suite — What You're Owning

The Payments Intelligence Suite is Stripe's AI-powered product bundle that optimizes the entire payments lifecycle. Announced at Sessions 2025, it includes:

### 2.1 Radar (Fraud Prevention) — The Flagship

**What it does:** ML-powered fraud detection that evaluates every payment in real time.

**How it works:**
- Scans 1,000+ signals per transaction in under 100ms
- Trains on data from millions of businesses processing $1.4T+/year
- 92% chance any given card has been seen before on the Stripe network
- Assigns risk score (0–99) to every payment; auto-blocks high-risk

**Key metrics:**
- Reduces fraud by 38% on average
- Card testing down 80% on Stripe (vs. industry-wide increase)
- Now covers ACH and SEPA (launched April 2025) — 42% SEPA fraud reduction, 20% ACH fraud reduction
- 40% increase in non-card payment volume on Stripe in the last year

**Product tiers:**
- **Radar (default):** Built into every Stripe account, no setup required
- **Radar for Fraud Teams:** Custom rules engine, backtesting, AI-powered Radar Assistant (natural language → rules), advanced analytics, manual review workflows
- **Radar for Platforms (public preview):** Protects against fraudulent connected accounts, trained on 14,000+ platforms

**Recent innovations (2025):**
- Dynamic risk thresholds that auto-adjust during fraud attacks
- Multihead model with 30%+ fraud reduction on eligible transactions via adaptive 3DS
- Radar risk scores available for non-Stripe-processed transactions (multiprocessor support)
- Radar Assistant: AI translates natural language into rule syntax + backtesting
- Smart Refunds: Proactive refund recommendations based on dispute likelihood
- Support for additional payment methods (Klarna, with Affirm, Bacs, Cash App coming)

### 2.2 Authorization Boost — The Revenue Optimizer

**What it does:** AI-powered suite that increases payment acceptance rates and reduces costs.

**Components:**
- **Adaptive Acceptance:** Identifies and retries false declines in real time, optimizes authorization requests based on issuer preferences. Recovers 20% of false declines on average.
- **Network Tokens:** Substitute for card numbers; stay current automatically. More secure, higher acceptance.
- **Card Account Updater:** Refreshes expired/reissued card data in real time to prevent payment failures.
- **Decline Prevention & Excessive Retry Prevention:** Reduces network costs by avoiding costly unnecessary retries.

**Key metrics:**
- 2.2% average increase in acceptance rates
- Up to 2.8% reduction in card processing costs (for IC+ pricing)
- Twilio SendGrid: +2% conversion increase
- Make: 4.7% revenue uptick over 3 years; $1.2M recovered via Smart Retries

**Why it matters:** False declines cost US online retailers an estimated $81 billion in lost sales annually. Even a 1% auth rate improvement = millions for large merchants.

### 2.3 Enhanced Issuer Network

**What it does:** Shares Stripe Radar fraud scores with card issuers (Capital One, Discover, etc.) so they can make better authorization decisions.

**How it works:**
- Radar fraud scores sent via encrypted pathway to issuers
- Issuers incorporate scores into their own authorization tools
- Capital One uses their "Enhanced Decisioning Data API" to ingest Radar scores

**Key metrics:**
- 8% average reduction in fraud
- 1–2% authorization rate uplift on eligible volume
- No additional integration work required for Stripe merchants

### 2.4 Smart Disputes — The Newest Product

**What it does:** AI-powered automated dispute evidence compilation and submission.

**How it works:**
- AI rules engine analyzes incoming disputes
- Extracts evidence from Stripe internal data, transaction data, cardholder data
- Tailors evidence packets to the dispute reason code
- Auto-submits before deadline if merchant doesn't act
- Only charges 30% success fee on wins (no fee on losses)

**Key considerations:**
- Waives the new $15 dispute counter fee when used
- Industry-wide dispute costs: ~$55 billion/year
- Controversy: Some merchants criticize the 30% success fee; third-party providers compete here
- Strategic play: Stripe monetizing its data advantage in a new way

### 2.5 The Payments Foundation Model — The Technical Moat

**What it is:** An industry-first foundation model trained on tens of billions of transactions.

**How it works:**
- Self-supervised learning approach
- Distills each payment into a single, versatile embedding
- Captures hundreds of subtle signals beyond obvious ones (bank, ZIP code, etc.)
- Embeddings used for real-time predictions across multiple products (fraud, auth optimization, disputes)

**Why this matters for the PM role:** This is the shared infrastructure that powers ALL the products above. The PM needs to understand how to productize ML model improvements — knowing when to invest in the foundation model vs. task-specific models, how to measure model performance, and how to translate model improvements into customer-facing value.

---

## Part 3: Why You're a Strong Fit — Your Narrative

### Your Bridge Points

| Your Experience | Payments Intelligence Analog |
|---|---|
| **EventBridge event processing at scale** | Real-time ML inference on billions of transactions |
| **SaaS partner integrations (50+ partners)** | Enhanced Issuer Network partnerships (Capital One, Discover) |
| **Event schema registry & contracts** | Authorization message formatting (ISO 8583), network token protocols |
| **LLM-powered rule engine prototype (Claude)** | Radar Assistant (natural language → fraud rules) |
| **CDC/streaming data pipelines** | Real-time payment data flowing into ML models |
| **Managed security product (0→1 at startup)** | Fraud prevention = security product for merchants |
| **Customer-facing PM experience** | "Comfortable in front of customers" (required) |

### Your 90-Second Opener (Payments Intelligence Version)

*"I've spent 12 years as a PM building data-intensive infrastructure products, most recently at AWS where I worked on event-driven systems processing billions of events in real time. Two aspects of my background map directly to this role:*

*First, at AWS I built the EventBridge SaaS partner integration framework — the system that lets 50+ SaaS providers, including Stripe, route events into customer environments. That required designing for real-time decisioning at massive scale, partner onboarding APIs, and trust/security models between parties — all of which are core to how Payments Intelligence works with issuers and card networks.*

*Second, I recently prototyped an LLM-powered rule engine using Claude that translates natural language into policy rules — which is essentially what Radar Assistant does for fraud rules. I understand the product challenge of making ML accessible to non-technical users.*

*What excites me about this role is the direct revenue impact. At AWS, I drove 500% revenue growth on my products, but the connection between product decisions and business outcomes was indirect. Here, every basis point of authorization rate improvement, every percentage of fraud reduction, translates directly to merchant revenue. I want to build products where the value is that measurable and that immediate."*

### Why Stripe? Why This Role?

*"Three reasons:*

*First, the data moat. The Payments Foundation Model is an industry first because no one else has Stripe's scale — $1.4 trillion in annual volume, millions of businesses, 92% card recognition rate. As a PM, I want to build products where the data advantage compounds over time, and this is the clearest example in fintech.*

*Second, the product surface is expanding at exactly the right moment. Radar went from cards-only to ACH and SEPA this year, Authorization Boost just bundled multiple optimizations into a single product, Smart Disputes is brand new. This is a team that's shipping fast and the scope is growing — that's the kind of environment where a PM can have maximum impact.*

*Third, the tension between automation and control is fascinating. Merchants want Stripe to 'just handle it' (Smart Disputes auto-submitting), but they also want granular control (Radar custom rules). Getting that balance right is the kind of product problem I find most compelling."*

---

## Part 4: Key Interview Questions & Technically Grounded Answers

### Q1: "How would you think about improving authorization rates?"

*"I'd frame it as three layers of optimization, each with different investment profiles:*

*Layer 1 — Pre-authorization optimization: Before the payment even hits the issuer, are we sending the best possible authorization request? This means network token provisioning, card account updates, optimal message formatting per issuer, and SCA exemption requests where available. These are infrastructure investments that compound over time.*

*Layer 2 — Intelligent retry: When a payment gets declined, can we distinguish a genuine decline from a false one? Adaptive Acceptance does this — analyzing the decline reason, network signals, and historical patterns to decide whether and how to retry. The key product decision is latency: retries need to happen before the customer sees a failure, so you're talking sub-second decisioning.*

*Layer 3 — Issuer collaboration: The Enhanced Issuer Network approach of sharing Radar fraud scores with issuers. This is powerful because it attacks the root cause — issuers decline legitimate transactions because they lack context. Giving them Radar's signal improves their models directly. The product challenge is expanding partnerships beyond Capital One and Discover to more issuers globally.*

*I'd prioritize by measuring the gap — what's our authorization rate vs. the theoretical maximum per issuer per card type? The biggest gaps tell you where to invest."*

### Q2: "How would you balance fraud prevention against false declines?"

*"This is the fundamental tension in payments intelligence — it's a precision-recall tradeoff with direct dollar consequences on both sides.*

*Over-blocking (high precision, low recall): You catch more fraud, but you also block legitimate customers. Each false decline is lost revenue plus damaged customer experience. US retailers lose an estimated $81 billion annually to false declines — far more than actual fraud losses.*

*Under-blocking (low precision, high recall): You let more legitimate payments through, but you also let through more fraud. This means chargebacks, monitoring program risk, and merchant trust erosion.*

*How I'd approach it: First, I'd make sure we're measuring both sides — not just fraud rate, but also false decline rate. Many teams optimize for one without measuring the other. Second, I'd segment by risk tolerance. A luxury goods retailer has different risk appetite than a digital subscription service. The product should let merchants choose their position on this tradeoff — which is exactly what Radar for Fraud Teams' custom rules enable. Third, I'd invest in the middle ground: adaptive 3DS. Instead of a binary block/allow, you can add a friction step (3DS authentication) that shifts liability without losing the customer entirely. The new multihead model with 30%+ fraud reduction on eligible transactions through adaptive 3DS is the right approach.*

*The Payments Foundation Model is the long-term answer — better embeddings mean you can separate fraud from legitimate transactions more precisely, which improves both sides simultaneously."*

### Q3: "How would you measure success for the Payments Intelligence Suite?"

*"I'd organize metrics into three tiers:*

*Tier 1 — Direct customer value (leading indicators):*
- Authorization rate uplift (by merchant, segment, card type, geography)
- Fraud rate reduction (basis points)
- False decline rate (the underappreciated metric)
- Dispute win rate (Smart Disputes)
- Cost savings (network fees, interchange optimization)

*Tier 2 — Product adoption and engagement:*
- Authorization Boost adoption rate among eligible merchants
- Radar for Fraud Teams upgrade rate
- Smart Disputes enrollment and auto-submission rate
- Custom rules created per merchant (Radar)
- Radar Assistant usage (natural language queries)

*Tier 3 — Business impact (lagging indicators):*
- Revenue from Payments Intelligence products (Radar fees, Auth Boost fees, Smart Disputes success fees)
- Merchant retention correlated with PI product usage
- Competitive win rate in deals where auth rate / fraud is a differentiator
- Enhanced Issuer Network partner count and volume covered

*The North Star: I'd argue it's 'incremental merchant revenue attributable to Payments Intelligence.' It combines auth rate improvement + fraud reduction + cost savings into a single dollar figure merchants can see in their dashboard. That's the number that sells and retains."*

### Q4: "Tell me about a time you worked with data scientists / ML teams"

Use your EventBridge / real-time processing experience, but tailor it:

*"At AWS, I worked closely with the team building the event pattern matching and anomaly detection for EventBridge. The ML challenge was similar to what Payments Intelligence faces — real-time inference at massive scale with extremely tight latency budgets.*

*The key lesson I learned about PM-ing ML products: you can't spec ML products the way you spec deterministic features. Instead of 'when X happens, do Y,' you're defining performance targets — 'reduce false positives by 20% without increasing false negatives.' I learned to define success metrics upfront, set up A/B testing infrastructure, and work with data scientists to understand where model improvements would have the highest business impact vs. where feature engineering or rule-based approaches were sufficient.*

*I'd bring that same approach here — for example, when evaluating whether to invest in improving the Payments Foundation Model vs. building better Radar custom rules, the answer depends on whether the value is in the long tail (model improvement) or in specific, known fraud patterns (rules). The PM's job is to make that tradeoff explicit and data-driven."*

### Q5: "How would you think about pricing for these products?"

*"The Payments Intelligence Suite has an interesting pricing architecture that I'd want to evolve thoughtfully:*

*Current state:*
- Radar: Per-screened-transaction fee (waived for standard pricing), Radar for Fraud Teams is a premium tier
- Authorization Boost: 0.08% per successful online card transaction (for custom pricing merchants)
- Smart Disputes: 30% success fee on wins, no fee on losses
- Enhanced Issuer Network: No additional fee to merchants (funded by issuer partnerships?)

*The strategic question: The suite approach bundles optimization products that individually justify their cost. Authorization Boost at 0.08% is trivial compared to the 2.2% auth rate uplift it delivers. Smart Disputes' 30% success fee is aggressive but aligned — you only pay when you win.*

*What I'd explore: usage-based pricing that scales with value delivered. Show merchants a dashboard that says 'Payments Intelligence recovered $X for you this month' and the fee feels like a no-brainer. The risk is if merchants feel nickel-and-dimed across too many line items — the suite packaging mitigates this.*

*The competitive angle: This is a moat builder. Merchants who see measurable auth rate improvement and fraud reduction from Stripe's intelligence products are extremely unlikely to switch processors. The intelligence suite increases switching costs without requiring lock-in contracts."*

### Q6: "How would you prioritize across the suite — Radar vs. Auth Boost vs. Smart Disputes?"

*"I'd prioritize by revenue impact per engineering hour, segmented by merchant need:*

*For most merchants: Authorization Boost delivers the clearest, most universal value. Every merchant benefits from higher auth rates. It's also the least controversial — there's no tradeoff with fraud. I'd invest heavily here, especially in expanding to more geographies and more issuer partnerships.*

*For fraud-heavy verticals (e-commerce, digital goods, travel): Radar improvements are critical. The expansion to ACH/SEPA and additional payment methods is the right call because non-card fraud is a growing vector. The Radar for Platforms play is also high-leverage — protecting against account-level fraud is a different problem than transaction fraud and the 14,000+ platform dataset is a competitive advantage.*

*For scale merchants with dispute volume: Smart Disputes is high-impact but earlier in its lifecycle. I'd focus on improving win rates and expanding evidence sources before optimizing pricing or go-to-market. The 30% fee controversy suggests we need better value communication.*

*The meta-priority: The Payments Foundation Model itself. Improvements to the foundation model compound across all products. If I had to make a single investment, I'd argue for model infrastructure — a 1% improvement in the foundation model translates to measurable gains across Radar, Auth Boost, and Smart Disputes simultaneously."*

---

## Part 5: Domain Knowledge You Need to Nail

### The Payment Authorization Flow

```
Customer clicks "Pay"
    ↓
Merchant's integration sends payment to Stripe
    ↓
Stripe Radar evaluates fraud risk (100ms)
    → Block if high risk
    → Request 3DS if medium risk
    → Allow if low risk
    ↓
Stripe formats authorization message (ISO 8583)
    → Network tokens substituted if available
    → Issuer-optimized formatting applied
    ↓
Card network routes to issuing bank
    → Enhanced Issuer Network: Radar score shared with issuer
    ↓
Issuer approves or declines
    ↓
If declined → Adaptive Acceptance evaluates retry
    → Was it a false decline? Retry with different parameters
    → Was it insufficient funds? Smart Retries for subscriptions
    ↓
Response returned to merchant → customer sees result
```

### Key Terminology

- **Authorization rate:** % of submitted payments approved by issuer
- **False decline:** Legitimate payment incorrectly rejected
- **Chargeback / Dispute:** Cardholder challenges a charge through their bank
- **TC40 / SAFE reports:** Fraud notifications from Visa and Mastercard
- **Interchange:** Fee paid by merchant's bank to cardholder's bank per transaction
- **IC+ pricing:** Interchange-plus pricing (transparent cost structure for large merchants)
- **Network token:** Card network-issued credential substituting for PAN (primary account number)
- **3D Secure (3DS):** Additional authentication step (shifts fraud liability to issuer)
- **SCA:** Strong Customer Authentication (European regulatory requirement)
- **ISO 8583:** Standard message format for financial transactions
- **CNP:** Card-not-present (online transactions — higher fraud risk)
- **Dispute rate:** Disputes / transactions — card brands monitor this; too high = monitoring programs with fines
- **Basis point (bp):** 0.01% — the unit everyone uses in payments

### Numbers to Have Loaded

- Stripe processes **$1.4T+/year** in payments
- **92%** chance a card has been seen before on the Stripe network
- Radar reduces fraud by **38%** on average
- Card testing down **80%** on Stripe
- Authorization Boost: **2.2%** average auth rate improvement
- Auth Boost cost reduction: up to **2.8%** lower processing costs
- False declines cost US retailers **$81B** annually
- Industry dispute costs: **$55B**/year
- Non-card payment volume up **40%** on Stripe in last year
- ACH fraud reduction: **20%**, SEPA fraud reduction: **42%** with Radar
- Enhanced Issuer Network: **8%** fraud reduction, **1–2%** auth uplift
- Radar evaluates **1,000+ signals** per transaction in **<100ms**

---

## Part 6: Competitive Landscape

### Fraud Prevention

| Competitor | Approach | Stripe's Edge |
|---|---|---|
| **Forter** | Standalone fraud decisioning | Stripe has payment flow data Forter can't access |
| **Signifyd** | Guaranteed fraud protection | Shifts liability, but merchants pay premium |
| **Kount (Equifax)** | Identity-based fraud detection | Stripe has richer transaction data |
| **Sift** | Digital trust & safety platform | Broader scope but less payments depth |

**Stripe's moat:** Integrated into the payment flow = access to checkout behavior, card-on-file history, network-level signals. Standalone fraud vendors only see what merchants share.

### Authorization Optimization

| Competitor | Approach | Stripe's Edge |
|---|---|---|
| **Adyen** | Revenue Accelerate (similar retry logic) | Comparable, but Stripe has more data from SMB long tail |
| **Checkout.com** | Intelligent retries | Smaller network, less issuer data |
| **Spreedly** | Payment orchestration across processors | Orchestration, not optimization — different value prop |

**Stripe's moat:** The Payments Foundation Model. Self-supervised learning on $1.4T of payments creates embeddings no competitor can replicate without the same scale.

### Dispute Management

| Competitor | Approach | Stripe's Edge |
|---|---|---|
| **Chargeflow** | Fully managed chargeback recovery | Integrates with CRM/external data (Stripe doesn't) |
| **Chargeback Gurus** | Expert-managed disputes | Human-reviewed, higher win rates on complex cases |
| **Verifi/Ethoca** | Dispute prevention networks | Stripe partners with both for early resolution |

**Smart Disputes vulnerability:** The 30% success fee is controversial. Third-party providers argue they have better win rates on complex disputes because they integrate external data. The PM needs to close this gap — either by expanding evidence sources or by winning on volume (auto-handling makes sense for most disputes, manual for high-value ones).

---

## Part 7: Questions to Ask Your Interviewers

### About the Product

1. *"How does the team think about the tradeoff between investing in the Payments Foundation Model vs. task-specific model improvements for Radar, Auth Boost, etc.?"*

2. *"What's the biggest gap in Smart Disputes today — is it win rates, evidence sourcing, merchant trust, or something else?"*

3. *"How do you think about expanding the Payments Intelligence Suite to non-card payment methods beyond ACH and SEPA?"*

### About the Team & Operating Model

4. *"How does the PM/data science partnership work day-to-day? Is the PM defining model performance targets, or are data scientists driving the roadmap based on model improvements they see?"*

5. *"The JD mentions both infrastructure/platform systems and user-facing business impact. How much of the PM's time is spent on each?"*

6. *"What does the customer feedback loop look like — are PMs talking directly to merchants about auth rates and fraud, or is that mediated through sales and support?"*

### About Strategy

7. *"Stripe Orchestration (managing multiple payment processors) seems like it could affect the Payments Intelligence value prop — if merchants split volume, Stripe has less data. How does the team think about that tension?"*

8. *"The Enhanced Issuer Network is US-focused today. What's the path to making it work with European and APAC issuers?"*

---

## Part 8: How This Role Differs from Apps & Extensibility — Adjusting Your Prep

### What carries over from your Apps prep:
- Stripe business model knowledge (BUSINESS_STRATEGY_PREP.md is still relevant)
- General PM frameworks (prioritization, user research, metrics)
- Understanding of Stripe's API philosophy
- Your startup/0-to-1 experience narrative

### What you need to ADD:
- **ML product intuition** — how to PM products where the "feature" is a model improvement
- **Payments domain knowledge** — authorization flow, decline codes, interchange, 3DS, network tokens
- **Quantitative storytelling** — this role is all about basis points and dollar impact; practice speaking in numbers
- **Business acumen emphasis** — the JD explicitly calls this out; show you understand how payments economics work
- **Customer/partner-facing comfort** — this role is customer-facing; prepare stories about navigating customer conversations

### What you should DE-EMPHASIZE:
- Developer experience / DX friction (less relevant here)
- Platform extensibility concepts (not what this team does)
- The Stripe App you built (mention briefly as Stripe context, but don't lead with it)
- Apps architecture details (iframe, viewports, SDK — not relevant)

---

## Part 9: Your Background Gaps & How to Address Them

### Potential concern: "Do you have payments domain experience?"

**Your answer:**
*"I haven't been in payments processing specifically, but the underlying technical and product challenges are ones I've solved at AWS scale. Real-time decisioning at billions of events? That's EventBridge. ML-powered risk scoring? I prototyped an LLM rule engine. Partner data sharing for better outcomes? That's exactly what the SaaS partner framework does — sharing signals across organizational boundaries to improve decisions. The payments domain knowledge is learnable in weeks; the ability to PM real-time ML products at scale is what takes years to develop."*

### Potential concern: "This is a PM role, not Staff PM — are you overqualified?"

**Your answer:**
*"I see this as the right scope for impact. The Payments Intelligence Suite is one of Stripe's most direct revenue drivers. I'd rather own a high-impact product area at the right level than have a bigger title with less direct customer impact. And frankly, if I can drive measurable improvements in auth rates and fraud reduction, the level takes care of itself."*

---

## Part 10: Day-Of Checklist

- [ ] Re-read this document (30 min)
- [ ] Review BUSINESS_STRATEGY_PREP.md — business model sections still relevant
- [ ] Have these tabs ready:
  - https://stripe.com/radar (Radar product page)
  - https://stripe.com/authorization-boost (Auth Boost)
  - https://stripe.com/payments/ai (Payments Intelligence Suite overview)
  - https://stripe.com/blog/using-ai-optimize-payments-performance-payments-intelligence-suite (the key blog post)
  - https://stripe.com/radar/fraud-teams (Radar for Fraud Teams)
  - https://docs.stripe.com/disputes/smart-disputes (Smart Disputes)
- [ ] Practice your 90-second opener 3x out loud
- [ ] Practice the "Why Stripe? Why this role?" answer
- [ ] Be ready to talk in **numbers**: basis points, percentages, dollar impact
- [ ] Prepare 2 specific stories about working with ML/data science teams
- [ ] Prepare 1 story about navigating a customer conversation

---

## Appendix: The Full Payments Intelligence Product Map

```
PAYMENTS INTELLIGENCE SUITE
│
├── FRAUD PREVENTION
│   ├── Radar (default, built into all Stripe accounts)
│   ├── Radar for Fraud Teams (premium: custom rules, backtesting, analytics)
│   ├── Radar for Platforms (preview: account-level fraud for platforms)
│   ├── Radar Assistant (AI: natural language → fraud rules)
│   └── Radar for additional payment methods (ACH, SEPA, Klarna, etc.)
│
├── AUTHORIZATION OPTIMIZATION
│   ├── Authorization Boost (bundled product)
│   │   ├── Adaptive Acceptance (retry false declines)
│   │   ├── Network Tokens (substitute for PANs)
│   │   ├── Card Account Updater (real-time card refresh)
│   │   ├── Decline Prevention (reduce costly declines)
│   │   └── Excessive Retry Prevention (reduce network costs)
│   ├── Enhanced Issuer Network (share Radar scores with issuers)
│   ├── Smart Retries (subscription dunning optimization)
│   └── Authentication Optimization (3DS / SCA management)
│
├── DISPUTE MANAGEMENT
│   ├── Smart Disputes (AI evidence compilation & submission)
│   ├── Smart Refunds (proactive refund recommendations)
│   ├── Dispute Prevention (Verifi & Ethoca integration)
│   └── Dispute Deflection (transaction details to cardholders)
│
├── ANALYTICS & INTELLIGENCE
│   ├── Payments Analytics (auth rates, disputes, recommendations)
│   ├── AI-powered Benchmarking (compare vs. similar businesses)
│   └── Network Cost Insights (IC+ cost optimization)
│
└── FOUNDATION
    └── Payments Foundation Model (self-supervised, trained on 10B+ transactions)
```
