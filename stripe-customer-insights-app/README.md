# Customer Insights Dashboard - Stripe App

A comprehensive Stripe App that provides merchants with actionable customer analytics including lifetime value, payment patterns, risk assessment, and subscription health.

**Purpose:** Interview preparation project for Staff PM, Stripe Apps role

---

## What This App Demonstrates

### Platform Capabilities
- UI embedding in Stripe Dashboard (custom viewport)
- Stripe API integration (Customers, Charges, Subscriptions, Payment Intents)
- Permission model (granular read scopes)
- Webhook handling for real-time updates
- Caching strategy for performance

### Product Thinking
- Metric selection (what matters to merchants?)
- Risk scoring algorithm (fraud detection)
- Data visualization design
- Performance optimization (parallel API calls, caching)

### Developer Experience
- Type safety with TypeScript
- Code organization (separation of concerns)
- Educational comments throughout
- Error handling patterns

---

## Features

### 1. Lifetime Value (LTV) Analysis
- Total revenue from customer
- Breakdown: one-time vs subscription vs refunded
- Multi-currency support (simplified)

### 2. Payment Pattern Analysis
- Payment success rate (%)
- Failed vs successful payments
- Average payment amount
- Preferred payment method

### 3. Risk Assessment
- Risk score (0-100)
- Risk factors with severity levels:
  - High payment failure rate
  - Chargeback history
  - New customer with large transaction
  - Velocity checks (rapid transactions)
- Recommendation: low/medium/high risk

### 4. Subscription Health
- Monthly Recurring Revenue (MRR)
- Active vs churned subscriptions
- Next billing date

### 5. Customer Timeline
- First purchase date
- Last purchase date
- Days since last purchase
- Total transactions

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Stripe account (test mode is fine)
- Stripe CLI installed (`brew install stripe/stripe-cli/stripe`)

### Installation

```bash
# 1. Clone/navigate to project
cd stripe-customer-insights-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# Edit .env with your Stripe keys:
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

### Running Locally

```bash
# Terminal 1: Start the app
npm run dev

# Terminal 2: Listen for webhooks (optional, for real-time updates)
stripe listen --forward-to localhost:3000/webhook
```

The app will open in your browser at the Stripe Dashboard customer detail page.

### Testing

```bash
# Run unit tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

---

## Architecture

```
┌─────────────────────────────────────┐
│   Stripe Dashboard (Browser)       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Customer Insights Component  │ │ ← React Component
│  │  (Rendered in iframe)         │ │
│  └───────────────┬───────────────┘ │
│                  │                  │
└──────────────────┼──────────────────┘
                   │
                   │ Stripe UI Extension SDK
                   │
           ┌───────▼───────────┐
           │  App Backend      │ ← This runs on Stripe's infrastructure
           │                   │
           │  API Client       │ ← Fetches data from Stripe APIs
           │  Calculations     │ ← Computes insights
           │  Webhook Handler  │ ← Processes events
           └───────┬───────────┘
                   │
                   │ Stripe API
                   │
           ┌───────▼───────────┐
           │   Stripe APIs     │
           │                   │
           │ - Customers       │
           │ - Charges         │
           │ - Subscriptions   │
           │ - Payment Intents │
           └───────────────────┘
```

### Key Design Decisions

**1. Read-Only Approach**
- Version 1 is read-only (no data modification)
- Simpler permission model, lower risk
- Faster approval in app review process

**2. Client-Side Calculation**
- Insights calculated on demand (not pre-computed)
- Trade-off: Fresh data vs performance
- Mitigated with caching (5 min TTL)

**3. Parallel API Calls**
- Fetch customer, charges, subscriptions in parallel
- Reduces latency from ~1s to ~200ms
- Uses Promise.all for concurrent requests

**4. Pagination Handling**
- Fetches ALL charges/subscriptions for accuracy
- Potential issue: Customer with 100k+ charges
- Production solution: Background job + cached results

**5. Risk Scoring Algorithm**
- Multi-factor approach (payment failures, chargebacks, velocity)
- Weighted scoring system
- Conservative thresholds (better false positive than false negative)

---

## File Structure

```
stripe-customer-insights-app/
├── src/
│   ├── views/
│   │   └── CustomerInsights.tsx      # Main UI component
│   ├── api/
│   │   ├── stripeClient.ts           # Stripe API integration
│   │   └── webhooks.ts               # Webhook handlers
│   ├── utils/
│   │   └── calculations.ts           # Business logic
│   └── types/
│       └── index.ts                  # TypeScript definitions
├── docs/
│   ├── INTERVIEW_PREP.md             # Comprehensive interview guide
│   └── DEVELOPER_EXPERIENCE.md       # DX improvements
├── public/
│   └── icon.svg                      # App icon
├── stripe-app.json                   # App manifest
├── package.json
├── tsconfig.json
└── README.md
```

---

## Interview Talking Points

### When Demoing This App

**Architecture:**
"This app demonstrates core Stripe Apps patterns:
1. **Embedded UI** - Appears natively in customer detail page
2. **API orchestration** - Aggregates data from 4+ Stripe APIs
3. **Real-time updates** - Webhooks invalidate cache when data changes
4. **Performance** - Parallel requests + caching reduce latency"

**Product Decisions:**
"I made several trade-offs:
1. **Read-only v1** - Faster to build, easier to approve, less risk
2. **On-demand calculation** - Always fresh data, but requires caching
3. **Comprehensive metrics** - LTV, patterns, risk, subscriptions vs simple revenue counter
4. **Conservative risk scoring** - Better to flag legitimate customer than miss fraud"

**Developer Experience Insights:**
"While building, I noticed friction points:
1. **Setup** - Required 4 environment variables, could be auto-configured
2. **Type safety** - Stripe SDK types are good but could be more specific
3. **Testing** - No easy way to mock Stripe API for unit tests
4. **Debugging** - Error messages could be more actionable"

### Technical Deep Dives

**Q: "How would you scale this to 1M customers?"**

A: "Current approach (fetch all charges) doesn't scale. I'd:
1. **Pre-compute insights** - Background job calculates nightly, stores in DB
2. **Incremental updates** - Webhooks update specific metrics, not full recalc
3. **Sampling** - For customers with 10k+ charges, sample recent 1000
4. **Query optimization** - Use Stripe's `created[gte]` filter to fetch recent data only
5. **Caching layer** - Redis with 1hr TTL for frequently accessed customers"

**Q: "How would you add fraud detection?"**

A: "I'd extend the risk assessment with:
1. **External data** - IP geolocation, device fingerprinting
2. **ML model** - Train on historical fraud patterns
3. **Network analysis** - Detect rings of connected fraudulent accounts
4. **Real-time scoring** - Score at payment time, not after-the-fact
5. **Merchant feedback loop** - Let merchants flag false positives/negatives"

**Q: "What metrics would you track for this app?"**

A: "Platform health metrics:
1. **Adoption** - Installs per week, active users
2. **Engagement** - Daily active users, views per customer
3. **Performance** - p50/p95/p99 load time, error rate
4. **User satisfaction** - NPS, feature requests, uninstall rate

App-specific metrics:
1. **Insight accuracy** - Do merchants find the insights valuable?
2. **Action rate** - Do they take action based on risk scores?
3. **Revenue impact** - Does it help merchants reduce churn/fraud?"

---

## Next Steps (Future Enhancements)

### Phase 2: Advanced Features
- Cohort analysis (customer segments)
- Predictive churn modeling
- Custom metric builder
- Export to CSV/Excel
- Trend visualization (charts, graphs)

### Phase 3: Write Capabilities
- Add notes/tags to customers
- Create custom alerts
- Trigger email campaigns
- Adjust subscription pricing

### Phase 4: Integration
- CRM sync (Salesforce, HubSpot)
- Analytics platforms (Segment, Mixpanel)
- Communication tools (Intercom, Zendesk)

---

## Learning Resources

### Stripe Documentation
- [Stripe Apps Overview](https://stripe.com/docs/stripe-apps)
- [UI Extension SDK](https://stripe.com/docs/stripe-apps/reference/ui-extension-sdk)
- [Stripe API Reference](https://stripe.com/docs/api)

### Community
- [Stripe Discord](https://discord.gg/stripe)
- [GitHub Discussions](https://github.com/stripe/stripe-apps)

---

## License

MIT (for educational purposes)

---

## Questions?

This project is designed to help you prepare for a Staff PM interview at Stripe. As you work through it, consider:

1. **Why these metrics?** What other customer insights would be valuable?
2. **How would you prioritize?** If you could only ship 3 metrics in v1, which ones?
3. **What's missing?** What features would make this a must-have app for merchants?
4. **How would you position this?** What's the pitch to get merchants to install?

Good luck with your interview! 🚀
