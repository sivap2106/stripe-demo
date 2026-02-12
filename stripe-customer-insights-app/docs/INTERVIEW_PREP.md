# Stripe Apps & Extensibility Platform - Interview Preparation Guide

## 🎯 Role Overview
**Position:** Staff Product Manager, Stripe Apps and Extensibility Platform
**Key Focus:** Enable third-party developers to extend Stripe Dashboard with custom functionality

---

## 📚 Core Concepts to Master

### 1. Stripe Apps Architecture

**What is a Stripe App?**
A Stripe App is a third-party extension that runs within the Stripe Dashboard, enabling:
- **Custom UI Components** embedded directly in Stripe's interface
- **API Access** to read/write Stripe data (with permission grants)
- **Webhook Integration** for real-time event handling
- **External Data Sync** between Stripe and third-party services

**Key Components:**
```
stripe-app.json         → App manifest (permissions, viewports, metadata)
src/views/             → React components rendered in Dashboard
src/api/               → Backend logic (API calls, data processing)
Webhooks               → Real-time event handlers
```

**Architecture Pattern:**
```
Stripe Dashboard
    ↓ (embeds via iframe with SDK)
Your App UI Component
    ↓ (calls via SDK)
Stripe UI Extension SDK
    ↓ (proxies securely)
Stripe APIs
```

---

### 2. Platform Extensibility Concepts

**🔑 Interview Talking Point:**
"A great extensibility platform balances three tensions:
1. **Developer Freedom** vs **User Safety** - How much can apps do without compromising security?
2. **Performance** vs **Flexibility** - Rich features vs fast load times
3. **Discoverability** vs **Quality** - Easy to find apps vs maintaining high standards"

**Viewports (Embedding Points):**
Your app declares where it appears in Stripe Dashboard:
- `stripe.dashboard.customer.detail` - Customer detail page
- `stripe.dashboard.payment.detail` - Payment detail page
- `stripe.dashboard.invoice.list` - Invoice list view
- `stripe.dashboard.subscription.detail` - Subscription page

**PM Insight:** Choosing the right viewport is a product decision. Too many options overwhelm developers; too few limit creativity.

---

### 3. Permissions Model

**Granular Permissions (OAuth-style):**
Each app requests specific capabilities:
```json
{
  "permission": "customer_read",
  "purpose": "Display customer lifetime value analytics"
}
```

**Why This Matters:**
- Users trust apps that request only what they need
- Clear purposes help users make informed decisions
- Audit trails for compliance (GDPR, PCI)

**🔑 Interview Question:** "How would you design a permission system that's both secure and developer-friendly?"

**Sample Answer:**
"I'd start with principle of least privilege - apps get minimal access by default. But I'd also provide:
1. **Permission bundles** for common use cases (e.g., 'analytics_read' includes customers, charges, subscriptions)
2. **Testing sandbox** where devs can experiment without real data
3. **Permission justification UI** that shows users exactly why each permission is needed
4. **Progressive permissions** - request more as app evolves, not all upfront"

---

### 4. Developer Experience (DX) - Critical for PM Role

**Friction Points in Platform Development:**

**Onboarding:**
- Time from signup to "Hello World": Should be < 10 minutes
- Documentation: Must have working examples, not just API reference
- Local development: `stripe apps start` should work immediately

**Iteration Speed:**
- Hot reload during development
- Fast deployment pipeline (< 2 minutes from code to live)
- Instant rollback if something breaks

**Debugging:**
- Clear error messages (not "500 Internal Server Error")
- Logs accessible from dashboard
- Sandbox environment for testing

**🔑 Interview Exercise:**
"Walk me through how you'd reduce time-to-first-app from 30 minutes to 10 minutes."

**Sample Approach:**
1. **Audit current funnel** - Where do developers drop off?
2. **Identify bottlenecks** - API key setup? Package installation? First deploy?
3. **Simplify authentication** - Pre-configured test mode keys
4. **Provide templates** - `stripe apps create --template=dashboard-widget`
5. **Inline tutorials** - Code comments explain each line
6. **Measure & iterate** - Track actual time-to-first-app weekly

---

### 5. Stripe APIs You Should Know

For this Customer Insights app, you'll use:

**Customer API:**
```typescript
// Fetch customer with payment methods and subscriptions
const customer = await stripe.customers.retrieve('cus_xxx', {
  expand: ['subscriptions', 'default_source']
});
```

**Charges API (for transaction history):**
```typescript
const charges = await stripe.charges.list({
  customer: 'cus_xxx',
  limit: 100
});
```

**Payment Intents API (modern payment flow):**
```typescript
const paymentIntents = await stripe.paymentIntents.list({
  customer: 'cus_xxx'
});
```

**Subscriptions API:**
```typescript
const subscriptions = await stripe.subscriptions.list({
  customer: 'cus_xxx',
  status: 'all'
});
```

**🔑 Interview Insight:**
"Stripe's API design philosophy:
- Resource-oriented (customers, charges, subscriptions)
- Predictable patterns (list, retrieve, create, update, delete)
- Expandable sub-resources (avoid multiple requests)
- Idempotency keys (safe retries)
- Versioning (API changes don't break apps)"

---

### 6. Webhooks & Real-Time Updates

**Why Webhooks Matter:**
Instead of polling "Did something change?", Stripe pushes events to you.

**Common Events:**
```json
{
  "type": "customer.updated",
  "data": {
    "object": { /* customer object */ }
  }
}
```

**PM Challenge:**
- **Reliability:** What if webhook delivery fails?
- **Ordering:** Events may arrive out of order
- **Security:** How to verify webhooks are from Stripe?

**🔑 Interview Discussion:**
"How would you design a webhook system that handles 1M events/day reliably?"

**Key Points:**
1. **Retries with exponential backoff** - Don't give up after one failure
2. **Signature verification** - Prevent spoofed events
3. **Idempotent handlers** - Same event processed twice = same result
4. **Dead letter queue** - Capture failed events for manual review
5. **Rate limiting** - Protect developers from webhook storms

---

### 7. Metrics & Success Criteria

**Platform Health Metrics:**

**Developer Adoption:**
- New app registrations per month
- Active developers (committed code in last 30 days)
- App publish rate (how many apps go from dev → production)

**Developer Satisfaction:**
- Time to first successful API call
- Documentation search success rate
- Support ticket volume / sentiment
- NPS (Net Promoter Score) for platform

**End User Impact:**
- Apps installed per merchant
- App retention (uninstall rate)
- Feature usage within apps
- Revenue impact (do apps increase GMV?)

**🔑 Interview Question:** "What's the single most important metric for a platform?"

**Sample Answer:**
"Active developers building on the platform. It's a leading indicator:
- If developers are engaged, they'll build great apps
- Great apps attract more users
- More users attract more developers (flywheel effect)

But I'd also track a health metric: Developer Churn Rate. If developers start building but abandon the platform, that signals DX problems we must fix immediately."

---

### 8. Product Strategy & Roadmap

**Platform Evolution:**

**Phase 1: Foundation (Where Stripe Apps is now)**
- Stable SDK for UI extensions
- Basic permission system
- Dashboard embedding in key viewports

**Phase 2: Growth (Next 12-18 months)**
- App marketplace with discovery
- Improved testing/staging environments
- More viewport options (settings, home dashboard)
- Performance monitoring for apps

**Phase 3: Maturity (2-3 years)**
- White-label app capabilities (merchants can build internal tools)
- Multi-product apps (span across Stripe products)
- Advanced analytics for app developers
- Monetization options (paid apps)

**🔑 Interview Discussion:**
"If you could only ship 3 features in the next 6 months, what would they be and why?"

**Sample Prioritization Framework:**
1. **Impact × Effort Matrix:**
   - High impact, low effort = Ship immediately
   - High impact, high effort = Strategic initiative (phased approach)
   - Low impact, low effort = Batch with other small wins
   - Low impact, high effort = Deprioritize

2. **User Research:**
   - What are top developer pain points? (survey, interviews)
   - Where do developers get stuck? (analytics, support tickets)
   - What features do they request most? (feature voting)

3. **Alignment with Business Goals:**
   - Does it increase developer adoption?
   - Does it improve app quality/merchant trust?
   - Does it unlock new use cases?

---

### 9. Technical Challenges & Trade-offs

**Security:**
- **Challenge:** Apps run in iframe with access to sensitive data
- **Solution:** Content Security Policy, sandboxing, permission scopes
- **Trade-off:** Security restrictions limit what apps can do (e.g., no arbitrary network requests)

**Performance:**
- **Challenge:** Apps can slow down Stripe Dashboard
- **Solution:** Lazy loading, size limits, performance monitoring
- **Trade-off:** Developers want rich features; users want fast loading

**Versioning:**
- **Challenge:** API changes can break existing apps
- **Solution:** API versioning, deprecation timeline, migration guides
- **Trade-off:** Long deprecation windows slow platform evolution

**🔑 Interview Scenario:**
"A popular app is using an API endpoint we need to deprecate. How do you handle this?"

**Sample Approach:**
1. **Assess impact:** How many apps/users affected?
2. **Communicate early:** 6-12 months notice
3. **Provide migration path:** New API endpoint + code examples
4. **Offer support:** Office hours, migration tooling
5. **Incentivize migration:** Highlight benefits of new API
6. **Monitor progress:** Track migration rate weekly
7. **Final deprecation:** Only after >95% migrated or sufficient time passed

---

### 10. Competitive Landscape

**Other Platforms to Study:**

**Shopify Apps:**
- Mature app ecosystem (8,000+ apps)
- App store with revenue sharing
- Strong vetting process for quality

**Salesforce AppExchange:**
- Enterprise-focused apps
- Complex permission model
- Deep integration with Salesforce data

**Slack Apps:**
- Conversational UI pattern
- Real-time interactions via webhooks
- Simple OAuth flow

**GitHub Apps:**
- Fine-grained permissions
- Webhook-driven
- Strong security model

**🔑 Interview Question:** "What can Stripe Apps learn from Shopify's app ecosystem?"

**Key Learnings:**
1. **App Review Process:** Shopify reviews every app before listing - ensures quality
2. **Revenue Share:** 20% for first $1M, then free - aligns incentives
3. **App Challenges:** Themed coding competitions to drive innovation
4. **Partner Program:** Dedicated support for high-performing app developers

---

### 11. Customer Empathy & User Research

**PM Superpower: Talk to Users Daily**

**Developer Personas:**

**1. Solopreneur SaaS Builder:**
- Building a vertical SaaS (e.g., subscription box software)
- Wants quick integration, minimal code
- Values: Speed, simplicity, documentation

**2. Agency Developer:**
- Building custom solutions for clients
- Needs flexibility, white-labeling
- Values: Customization, support, examples

**3. Enterprise Integration Engineer:**
- Connecting Stripe to internal systems (ERP, CRM)
- Requires: Security, compliance, SLAs
- Values: Reliability, security docs, enterprise support

**Research Methods:**
- **User interviews** (15-30 min, weekly)
- **Prototype testing** (show mockups, get feedback)
- **Analytics** (where do developers get stuck?)
- **Community engagement** (Discord, forums, Twitter)

**🔑 Interview Example:**
"Describe a time you changed your roadmap based on user research."

**STAR Format:**
- **Situation:** Planned to build X feature
- **Task:** Needed to validate with users first
- **Action:** Conducted 20 interviews, found Y pain point instead
- **Result:** Shipped Y first, 3x adoption vs projected for X

---

### 12. Cross-Functional Collaboration

**Key Partners:**

**Engineering:**
- Translate requirements to technical specs
- Understand technical constraints/trade-offs
- Review PRs for API design coherence

**Design:**
- Ensure apps feel native to Stripe Dashboard
- Create UI component library for developers
- Design app submission/review flow

**Legal/Compliance:**
- Permission model meets GDPR/PCI requirements
- Terms of service for app developers
- Data handling policies

**Marketing/DevRel:**
- Launch strategy for new platform features
- Developer content (blog posts, tutorials)
- Conference presence (Stripe Sessions)

**Sales/Partnerships:**
- Identify key partners to build strategic apps
- Co-marketing opportunities
- Integration partnerships

---

### 13. Interview Day Strategy

**Questions You Should Ask:**

**About the Role:**
1. "What's the biggest unsolved problem in Stripe Apps today?"
2. "How do you measure success for this platform?"
3. "What's the vision for Stripe Apps in 3 years?"

**About the Team:**
4. "How does the Apps team interact with other Stripe product teams?"
5. "What's your developer community like? How engaged are they?"

**About Challenges:**
6. "What's the most controversial decision you've made recently?"
7. "How do you balance platform stability vs new features?"

**About Culture:**
8. "How does Stripe approach build vs buy for internal tools?"
9. "What does 'user-first' mean for a developer platform?"

**Reverse Interview Topics:**
- **Technical depth:** Show you understand API design, webhooks, security
- **PM fundamentals:** Prioritization, roadmapping, metrics
- **Platform thinking:** Ecosystem effects, third-party innovation
- **Customer obsession:** Developer experience, friction reduction

---

### 14. Hands-On Demo Talking Points

**For Your Customer Insights App:**

**Architecture:**
"This app demonstrates core Stripe Apps capabilities:
1. **Viewport embedding** - Appears on customer detail page
2. **API integration** - Fetches customer, charges, subscriptions
3. **Data processing** - Calculates LTV, payment success rate
4. **UI components** - Built with Stripe's UI Extension SDK
5. **Performance** - Lazy loads data, caches calculations"

**Developer Experience:**
"Building this app, I noticed several DX opportunities:
1. **Setup friction** - Required 4 environment variables (could be auto-configured)
2. **Type safety** - SDK types could be more specific (e.g., Customer type)
3. **Testing** - No easy way to mock Stripe API for unit tests
4. **Documentation** - Examples focus on simple cases, not real-world complexity"

**Product Decisions:**
"I made these trade-offs:
1. **Read-only vs Write** - Chose read-only for v1 (simpler permissions, lower risk)
2. **Real-time vs Cached** - Cache LTV calculations (performance over freshness)
3. **Scope** - Focus on 3 metrics (LTV, payment pattern, risk) vs 10+ metrics (depth over breadth)"

---

### 15. Common Interview Questions & Answers

**Q: "How would you prioritize between fixing bugs vs building new features?"**

A: "I use a framework:
1. **Severity assessment** - Is it blocking developers? Affecting end users?
2. **Scope** - How many users impacted?
3. **Workaround availability** - Can they unblock themselves?
4. **Strategic value** - Does the new feature unlock a new segment?

For a P0 bug (platform down, developers can't work), I'd halt all feature work. For a minor bug affecting 1% of users with a workaround, I'd batch it with next sprint. The key is transparent communication - tell affected users what we're doing and when."

**Q: "Design an app marketplace for Stripe."**

A: "I'd start with these principles:
1. **Discoverability** - Search, categories, featured apps, personalized recommendations
2. **Trust** - Reviews, ratings, 'Built by Stripe Partner' badge, security audits
3. **Try before buy** - Free trials, sandbox testing, demo accounts
4. **Monetization** - Free apps, one-time purchase, subscriptions, usage-based
5. **Analytics** - Show developers install trends, user feedback, performance metrics

First iteration: Simple listing page with search and categories. Measure: Search success rate, install conversion. Iterate based on data."

**Q: "How do you balance merchant needs vs developer needs?"**

A: "Both are customers, but they have different needs:
- **Merchants** want: Reliable apps, clear value, easy setup, good support
- **Developers** want: Flexible APIs, good docs, fast iteration, fair monetization

The platform's job is to align incentives:
1. **Quality bar** - App review process protects merchants, but clear guidelines help developers
2. **Performance standards** - Fast apps benefit both parties
3. **Feedback loops** - Merchant reviews help developers improve
4. **Revenue sharing** - Developers earn more when merchants get value

When there's tension (e.g., strict app review slows developers), I'd prototype faster review for low-risk changes, thorough review for sensitive permissions."

---

### 16. Take-Home Exercise Prep

**Possible Prompts:**

**Prompt 1: "Design a new feature for Stripe Apps"**
- Choose: App analytics dashboard for developers
- Wireframe key screens
- Define success metrics
- Estimate engineering effort

**Prompt 2: "Analyze this app concept and provide go/no-go recommendation"**
- Market sizing
- Competitive analysis
- Technical feasibility
- Resource requirements
- Expected adoption

**Prompt 3: "Write a PRD for improving app developer onboarding"**
- Current state analysis
- User research findings
- Proposed solution
- Success criteria
- Phased rollout plan

---

### 17. Day-Of Execution Tips

**Presentation Structure (if applicable):**
1. **Problem statement** (1 min) - What user pain are you solving?
2. **Solution overview** (2 min) - High-level approach
3. **Demo** (3-5 min) - Show working prototype
4. **Technical architecture** (2 min) - How it works under the hood
5. **Product decisions** (2 min) - Trade-offs you made
6. **Next steps** (1 min) - What you'd build next

**Whiteboard Tips:**
- Draw architecture diagrams clearly (boxes, arrows, labels)
- Use frameworks (2x2 matrix, funnel, flywheel)
- Think out loud - show your thought process
- Ask clarifying questions before diving in

**Behavioral Questions:**
- Use STAR format (Situation, Task, Action, Result)
- Quantify impact ("Increased developer adoption 40%")
- Show learning ("Here's what I'd do differently")
- Demonstrate collaboration ("Partnered with eng/design/marketing")

---

## 🚀 Final Prep Checklist

- [ ] Build the Customer Insights app (hands-on understanding)
- [ ] Read Stripe API documentation (Customers, Charges, Subscriptions)
- [ ] Study Stripe Apps docs (UI Extension SDK, permissions, viewports)
- [ ] Research competitive platforms (Shopify, Salesforce, Slack)
- [ ] Prepare 3 product case studies from your experience
- [ ] Practice whiteboarding platform architecture
- [ ] Review Stripe's company values and culture
- [ ] Prepare thoughtful questions for your interviewers
- [ ] Test your app demo (screen share, walk through code)
- [ ] Get sleep, eat well, show up confident!

---

## 📚 Resources

**Official Documentation:**
- [Stripe Apps Overview](https://stripe.com/docs/stripe-apps)
- [UI Extension SDK Reference](https://stripe.com/docs/stripe-apps/reference/ui-extension-sdk)
- [Stripe API Documentation](https://stripe.com/docs/api)

**Learning Resources:**
- Stripe Apps examples on GitHub
- Stripe Sessions conference talks
- Developer community discussions

**Books:**
- "The Lean Product Playbook" - Dan Olsen
- "Inspired" - Marty Cagan
- "Platform Revolution" - Parker, Van Alstyne, Choudary

---

Good luck! Remember: Show curiosity, ask great questions, and demonstrate deep empathy for developers. You've got this! 🎉
