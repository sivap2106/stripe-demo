# Learn Stripe Apps by Building - Interactive Tutorial

**Goal:** Understand Stripe Apps by building progressively from "Hello World" to real features
**Time:** 2-3 hours hands-on
**Approach:** Build → Understand → Interview Connect

---

## 🎯 Learning Philosophy

We'll build **three apps** with increasing complexity:
1. **Hello World** (20 min) - Understand the basics
2. **Customer Badge** (40 min) - Add real Stripe data
3. **Mini Insights** (60 min) - Calculate metrics

Each section includes:
- What we're building
- Step-by-step instructions
- Why it works (concepts)
- Interview talking points

---

## Part 1: Hello World App (20 minutes)

### What We're Building
A simple app that displays "Hello, [customer name]!" on the customer detail page.

### Why This Matters
- Understand the minimal Stripe App structure
- Learn how viewports work
- See the development workflow

---

### Step 1: Install Prerequisites

**Check if you have everything:**

```bash
# 1. Check Node.js (need v18+)
node --version

# 2. Check Stripe CLI
stripe version

# If you don't have Stripe CLI, install it:
# Mac:
brew install stripe/stripe-cli/stripe

# Windows:
# Download from: https://github.com/stripe/stripe-cli/releases

# 3. Login to Stripe
stripe login
```

**What just happened:**
- `stripe login` opens browser and connects CLI to your Stripe account
- This lets CLI create apps and access your test data

**Interview Note:** Easy onboarding is critical for developer platforms. Stripe's one-command login is excellent DX.

---

### Step 2: Install Stripe Apps Plugin

```bash
# Install the plugin
stripe plugin install apps

# Verify version (need 1.5.12+)
stripe apps -v
```

**Concept: Plugins**
Stripe CLI is modular - core CLI handles payments, plugins add functionality like Apps, Terminal, etc.

**Interview Connect:** This is platform extensibility in action! Just like third parties extend Stripe with Apps, Stripe extends their own CLI with plugins.

---

### Step 3: Create Your First App

```bash
# Navigate to where you want the project
cd ~/Documents

# Create the app
stripe apps create hello-world
```

**You'll be prompted for:**

1. **App ID** (e.g., `com.yourname.helloworld`)
   - Must be globally unique (like domain names)
   - Format: reverse domain notation
   - Can't change later!

2. **Display Name** (e.g., "Hello World")
   - Shown in Stripe Dashboard
   - Can change later

**What just happened:**
CLI scaffolded a complete React app with:
- TypeScript setup
- Testing framework (Jest)
- Linting (ESLint)
- Stripe UI components

**Interview Point:** Great platform onboarding means "working app in 1 command." Compare to manually setting up React + TS + tests (30+ minutes).

---

### Step 4: Explore the Generated Files

```bash
cd hello-world
ls -la
```

**Key files:**

```
hello-world/
├── src/
│   └── views/
│       ├── App.tsx          ← Your UI component
│       └── App.test.tsx     ← Tests
├── stripe-app.json          ← App configuration (THE MOST IMPORTANT FILE)
├── package.json             ← Dependencies
├── tsconfig.json            ← TypeScript config
└── .eslintrc.json           ← Linting rules
```

---

### Step 5: Understand stripe-app.json

**Open the file:**
```bash
cat stripe-app.json
```

**You'll see:**
```json
{
  "id": "com.yourname.helloworld",
  "version": "0.0.1",
  "name": "Hello World",
  "icon": "./icon.svg",
  "ui_extension": {
    "views": [
      {
        "viewport": "stripe.dashboard.customer.detail",
        "component": "App"
      }
    ]
  }
}
```

**Let's break this down:**

**1. `id` and `version`**
- Uniquely identifies your app
- Version uses semantic versioning (major.minor.patch)

**2. `ui_extension.views`**
- Where your app appears in Stripe Dashboard
- `viewport` = location (customer detail page)
- `component` = which React component to render

**Available Viewports:**
- `stripe.dashboard.customer.detail` - Customer page
- `stripe.dashboard.customer.list` - Customers list
- `stripe.dashboard.payment.detail` - Payment page
- `stripe.dashboard.invoice.detail` - Invoice page
- Many more!

**Interview Connect:** Viewports are the "extension points" of the platform. More viewports = more flexibility, but also more complexity for developers. How do you balance?

---

### Step 6: Look at the Default App.tsx

**Open:** `src/views/App.tsx`

```typescript
import { ContextView } from "@stripe/ui-extension-sdk/ui";
import { useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <ContextView title="Hello World">
      <Button onPress={() => setCount(count + 1)}>
        Count: {count}
      </Button>
    </ContextView>
  );
};

export default App;
```

**Key concepts:**

**1. Import from `@stripe/ui-extension-sdk/ui`**
- Stripe provides pre-built UI components
- They match Dashboard design system
- Auto-handle theming (light/dark mode)

**2. `ContextView` wrapper**
- Required container for all Stripe Apps
- Provides title bar
- Handles layout

**3. Standard React patterns**
- `useState` hook works normally
- Component lifecycle works normally
- It's just React!

---

### Step 7: Run Your App

```bash
# Start development server
stripe apps start
```

**You'll see:**
```
Ready! Press Enter to open in browser
```

**Press Enter** - browser opens to Stripe Dashboard

**Click "Continue"** to enable app preview mode

**Important:** Navigate to a customer detail page:
1. Go to Customers in sidebar
2. Click any customer (or create test customer)
3. Scroll down - you'll see "Hello World" section!

**What's happening:**
1. CLI bundles your app (TypeScript → JavaScript)
2. Uploads bundle to Stripe's servers
3. Stripe embeds it in Dashboard via iframe
4. Your app runs in sandbox for security

---

### Step 8: Make Your First Change

**Edit `src/views/App.tsx`:**

```typescript
import { ContextView, Banner } from "@stripe/ui-extension-sdk/ui";
import { useCustomerId } from "@stripe/ui-extension-sdk/context";

const App = () => {
  // Get customer ID from Stripe Dashboard context
  const customerId = useCustomerId();

  return (
    <ContextView title="Hello World">
      <Banner
        type="default"
        title="Welcome!"
        description={`You're viewing customer: ${customerId}`}
      />
    </ContextView>
  );
};

export default App;
```

**Save the file** - watch the Dashboard auto-refresh!

**New concepts:**

**1. `useCustomerId()` hook**
- Reads context from Stripe Dashboard
- Knows which customer page you're on
- Available automatically (no API call needed)

**2. `Banner` component**
- Pre-built Stripe UI component
- Types: default, info, warning, critical, success
- Consistent styling

**Interview Point:** The SDK provides context hooks (`useCustomerId`, `useEnvironment`, etc.) so apps can be context-aware. This is a key platform pattern.

---

### Step 9: Add Customer Name (First API Call!)

**Update `App.tsx`:**

```typescript
import { ContextView, Banner, Box, Spinner } from "@stripe/ui-extension-sdk/ui";
import { useCustomerId } from "@stripe/ui-extension-sdk/context";
import { useState, useEffect } from "react";
import Stripe from "stripe";

// Initialize Stripe (in real app, this would be in backend)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18",
});

const App = () => {
  const customerId = useCustomerId();
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const customer = await stripe.customers.retrieve(customerId);

        // Type guard (customer might be deleted)
        if (customer.deleted) {
          setCustomerName("Deleted Customer");
        } else {
          setCustomerName(customer.name || customer.email || "Unknown");
        }
      } catch (error) {
        console.error("Failed to fetch customer:", error);
        setCustomerName("Error loading");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, [customerId]);

  if (loading) {
    return (
      <ContextView title="Hello World">
        <Box padding="medium">
          <Spinner size="large" />
        </Box>
      </ContextView>
    );
  }

  return (
    <ContextView title="Hello World">
      <Banner
        type="success"
        title={`Hello, ${customerName}! 👋`}
        description={`Customer ID: ${customerId}`}
      />
    </ContextView>
  );
};

export default App;
```

**Save and watch it update!**

**What we learned:**

**1. Async data fetching**
- Use React's `useEffect` hook
- Handle loading states
- Handle errors gracefully

**2. Stripe API calls**
- `stripe.customers.retrieve()` gets customer data
- Returns full customer object
- Need to handle `deleted` case (type safety!)

**3. UX patterns**
- Show spinner while loading
- Update once data arrives
- Clear error handling

**Interview Connect:** "Loading states matter. Users tolerate 2-3 second loads if they see progress. Show spinner → build trust."

---

### 🎉 Congratulations!

You've built your first Stripe App that:
- Embeds in Dashboard
- Reads context (customer ID)
- Calls Stripe API
- Displays data

**Key takeaways:**
1. Apps are React components
2. Viewports define where they appear
3. SDK provides context hooks and UI components
4. Standard API calls work with proper authentication

---

## Part 2: Customer Badge App (40 minutes)

### What We're Building
An app that shows a colored badge based on customer status:
- 🟢 Green: Has active subscription
- 🟡 Yellow: Has made purchases but no subscription
- 🔴 Red: No purchases yet

### Why This Matters
- Multiple API calls
- Data aggregation logic
- Conditional UI
- Performance considerations

---

### Step 1: Create New App

```bash
cd ~/Documents
stripe apps create customer-badge
cd customer-badge
```

---

### Step 2: Plan the Logic

**To determine customer status, we need:**

1. **Check subscriptions**
   - `stripe.subscriptions.list({ customer: id })`
   - If active subscription exists → Green

2. **Check charges**
   - `stripe.charges.list({ customer: id })`
   - If charges exist → Yellow

3. **Otherwise** → Red (new customer)

**Interview Point:** "Before writing code, I map out data dependencies. What API calls do I need? Can they run in parallel? What's the critical path?"

---

### Step 3: Create the App

**Replace `src/views/App.tsx`:**

```typescript
import {
  ContextView,
  Badge,
  Box,
  Heading,
  Inline,
  Spinner,
  Text,
} from "@stripe/ui-extension-sdk/ui";
import { useCustomerId } from "@stripe/ui-extension-sdk/context";
import { useState, useEffect } from "react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18",
});

// Define customer status types
type CustomerStatus = "vip" | "active" | "new" | "unknown";

interface StatusInfo {
  status: CustomerStatus;
  label: string;
  color: "positive" | "warning" | "default";
  description: string;
}

const App = () => {
  const customerId = useCustomerId();
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function analyzeCustomer() {
      try {
        // Fetch subscriptions and charges in parallel
        const [subscriptions, charges] = await Promise.all([
          stripe.subscriptions.list({
            customer: customerId,
            status: "active",
            limit: 1, // We only need to know if ANY exist
          }),
          stripe.charges.list({
            customer: customerId,
            limit: 1,
          }),
        ]);

        let info: StatusInfo;

        // Determine status
        if (subscriptions.data.length > 0) {
          info = {
            status: "vip",
            label: "VIP Customer",
            color: "positive",
            description: "Has active subscription",
          };
        } else if (charges.data.length > 0) {
          info = {
            status: "active",
            label: "Active Customer",
            color: "warning",
            description: "Has purchase history",
          };
        } else {
          info = {
            status: "new",
            label: "New Customer",
            color: "default",
            description: "No purchases yet",
          };
        }

        setStatusInfo(info);
      } catch (error) {
        console.error("Failed to analyze customer:", error);
        setStatusInfo({
          status: "unknown",
          label: "Unknown",
          color: "default",
          description: "Error loading status",
        });
      } finally {
        setLoading(false);
      }
    }

    analyzeCustomer();
  }, [customerId]);

  if (loading) {
    return (
      <ContextView title="Customer Status">
        <Box padding="large">
          <Inline alignment="center">
            <Spinner />
            <Text>Analyzing customer...</Text>
          </Inline>
        </Box>
      </ContextView>
    );
  }

  if (!statusInfo) {
    return <ContextView title="Customer Status">No data available</ContextView>;
  }

  return (
    <ContextView title="Customer Status">
      <Box padding="large">
        <Inline alignment="center">
          <Badge type={statusInfo.color} size="large">
            {statusInfo.label}
          </Badge>
        </Inline>

        <Box marginTop="medium">
          <Text>{statusInfo.description}</Text>
        </Box>
      </Box>
    </ContextView>
  );
};

export default App;
```

**Run it:**
```bash
stripe apps start
```

Navigate to different customers - see how badge changes!

---

### What We Learned

**1. Parallel API Calls**
```typescript
const [subscriptions, charges] = await Promise.all([...]);
```
- Faster than sequential (200ms vs 400ms)
- Use when calls are independent
- Interview point: "How would you optimize?"

**2. Limit Parameter**
```typescript
limit: 1  // We only check existence, not count
```
- Don't fetch 100 items if you only need to know if ANY exist
- Performance optimization
- Reduces API cost/latency

**3. Type Safety**
```typescript
type CustomerStatus = "vip" | "active" | "new" | "unknown";
```
- TypeScript prevents typos
- Self-documenting code
- Catches errors at compile time

**4. Status Logic**
```typescript
if (subscriptions) → VIP
else if (charges) → Active
else → New
```
- Clear business rules
- Easy to modify
- Interview: "How would you categorize customers differently?"

---

### Step 4: Add More Detail

**Let's show specific numbers. Update the component:**

```typescript
// Add this interface
interface CustomerMetrics {
  activeSubscriptions: number;
  totalCharges: number;
  totalRevenue: number;
}

// Update useEffect to calculate metrics
const [metrics, setMetrics] = useState<CustomerMetrics | null>(null);

// In analyzeCustomer():
const [subscriptions, chargesPage1] = await Promise.all([...]);

// Calculate total revenue
let totalRevenue = 0;
const allCharges = chargesPage1.data;

// Fetch all charges (with pagination)
let hasMore = chargesPage1.has_more;
let startingAfter = allCharges[allCharges.length - 1]?.id;

while (hasMore) {
  const nextPage = await stripe.charges.list({
    customer: customerId,
    starting_after: startingAfter,
    limit: 100,
  });

  allCharges.push(...nextPage.data);
  hasMore = nextPage.has_more;
  if (nextPage.data.length > 0) {
    startingAfter = nextPage.data[nextPage.data.length - 1].id;
  }
}

// Calculate revenue (successful charges only)
allCharges.forEach((charge) => {
  if (charge.status === "succeeded") {
    totalRevenue += charge.amount;
  }
});

setMetrics({
  activeSubscriptions: subscriptions.data.length,
  totalCharges: allCharges.length,
  totalRevenue: totalRevenue / 100, // Convert cents to dollars
});

// In render, add metrics display:
{metrics && (
  <Box marginTop="medium">
    <Text>Active Subscriptions: {metrics.activeSubscriptions}</Text>
    <Text>Total Purchases: {metrics.totalCharges}</Text>
    <Text>Total Revenue: ${metrics.totalRevenue.toFixed(2)}</Text>
  </Box>
)}
```

---

### What We Learned

**1. Pagination**
```typescript
while (hasMore) {
  // Fetch next page
}
```
- Stripe returns max 100 items per request
- Must loop for more
- Interview: "How would you handle 10,000 charges?" (Answer: Cache, background jobs)

**2. Data Transformation**
```typescript
totalRevenue += charge.amount;
// Later: totalRevenue / 100
```
- Stripe amounts are in cents (avoid floating point errors)
- Convert for display only

**3. Filtering**
```typescript
if (charge.status === "succeeded")
```
- Only count successful charges
- Ignore failed, refunded, etc.

---

### 🎉 Part 2 Complete!

You now understand:
- Multiple API calls in parallel
- Pagination handling
- Data aggregation
- Conditional UI based on business logic

---

## Part 3: Mini Customer Insights (60 minutes)

### What We're Building
A simplified version of the full Customer Insights app with:
- Lifetime Value calculation
- Payment success rate
- Simple risk indicator

### Why This Matters
- Real-world business logic
- Metric calculations
- Product thinking (what metrics matter?)
- Interview talking points

---

### Step 1: Create the App

```bash
cd ~/Documents
stripe apps create mini-insights
cd mini-insights
```

---

### Step 2: Create Types File

**Create: `src/types.ts`**

```typescript
export interface CustomerInsights {
  lifetimeValue: number;
  currency: string;
  paymentSuccessRate: number;
  totalPayments: number;
  riskLevel: "low" | "medium" | "high";
}
```

**Why types matter:**
- Self-documenting code
- IDE autocomplete
- Catches bugs early
- Interview: "Strong typing improves DX"

---

### Step 3: Create Calculations File

**Create: `src/calculations.ts`**

```typescript
import Stripe from "stripe";
import { CustomerInsights } from "./types";

export function calculateInsights(
  charges: Stripe.Charge[]
): CustomerInsights {
  // Calculate LTV
  const successfulCharges = charges.filter((c) => c.status === "succeeded");
  const lifetimeValue = successfulCharges.reduce(
    (sum, charge) => sum + charge.amount,
    0
  ) / 100;

  const currency = charges[0]?.currency || "usd";

  // Calculate success rate
  const totalPayments = charges.length;
  const successfulPayments = successfulCharges.length;
  const paymentSuccessRate =
    totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;

  // Determine risk level
  let riskLevel: "low" | "medium" | "high";
  if (paymentSuccessRate >= 90) {
    riskLevel = "low";
  } else if (paymentSuccessRate >= 70) {
    riskLevel = "medium";
  } else {
    riskLevel = "high";
  }

  return {
    lifetimeValue,
    currency,
    paymentSuccessRate,
    totalPayments,
    riskLevel,
  };
}
```

**What we did:**
- Separated business logic from UI
- Pure function (same input = same output)
- Easy to test
- Interview: "Separation of concerns improves maintainability"

---

### Step 4: Create the UI

**Replace `src/views/App.tsx`:**

```typescript
import {
  ContextView,
  Box,
  Card,
  Badge,
  Divider,
  Heading,
  Inline,
  Spinner,
  Text,
} from "@stripe/ui-extension-sdk/ui";
import { useCustomerId } from "@stripe/ui-extension-sdk/context";
import { useState, useEffect } from "react";
import Stripe from "stripe";
import { CustomerInsights } from "../types";
import { calculateInsights } from "../calculations";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18",
});

const App = () => {
  const customerId = useCustomerId();
  const [insights, setInsights] = useState<CustomerInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all charges (with pagination)
        const charges: Stripe.Charge[] = [];
        let hasMore = true;
        let startingAfter: string | undefined;

        while (hasMore) {
          const response = await stripe.charges.list({
            customer: customerId,
            limit: 100,
            starting_after: startingAfter,
          });

          charges.push(...response.data);
          hasMore = response.has_more;
          if (response.data.length > 0) {
            startingAfter = response.data[response.data.length - 1].id;
          }
        }

        // Calculate insights
        const calculatedInsights = calculateInsights(charges);
        setInsights(calculatedInsights);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [customerId]);

  if (loading) {
    return (
      <ContextView title="Customer Insights">
        <Box padding="large">
          <Inline alignment="center">
            <Spinner size="large" />
            <Text>Loading insights...</Text>
          </Inline>
        </Box>
      </ContextView>
    );
  }

  if (!insights) {
    return (
      <ContextView title="Customer Insights">
        <Box padding="large">
          <Text>No data available</Text>
        </Box>
      </ContextView>
    );
  }

  // Determine badge color for risk
  const riskBadgeType =
    insights.riskLevel === "low"
      ? "positive"
      : insights.riskLevel === "medium"
      ? "warning"
      : "negative";

  return (
    <ContextView title="Customer Insights">
      <Box padding="large">
        {/* Lifetime Value Card */}
        <Card>
          <Box padding="medium">
            <Heading level={3}>Lifetime Value</Heading>
            <Box marginTop="small">
              <Text size="xlarge" weight="bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: insights.currency.toUpperCase(),
                }).format(insights.lifetimeValue)}
              </Text>
            </Box>
          </Box>
        </Card>

        <Divider />

        {/* Payment Success Rate Card */}
        <Card>
          <Box padding="medium">
            <Heading level={3}>Payment Success Rate</Heading>
            <Box marginTop="small">
              <Text size="xlarge" weight="bold">
                {insights.paymentSuccessRate.toFixed(1)}%
              </Text>
              <Text color="subdued">
                {insights.totalPayments} total payments
              </Text>
            </Box>
          </Box>
        </Card>

        <Divider />

        {/* Risk Level Card */}
        <Card>
          <Box padding="medium">
            <Heading level={3}>Risk Assessment</Heading>
            <Box marginTop="small">
              <Inline alignment="center">
                <Badge type={riskBadgeType} size="large">
                  {insights.riskLevel.toUpperCase()} RISK
                </Badge>
              </Inline>
            </Box>
          </Box>
        </Card>
      </Box>
    </ContextView>
  );
};

export default App;
```

**Run it:**
```bash
stripe apps start
```

---

### What We Built

**Architecture:**
```
App.tsx (UI)
   ↓ fetches data
Stripe API
   ↓ passes to
calculations.ts (logic)
   ↓ returns
CustomerInsights (types.ts)
   ↓ renders
UI components
```

**Key patterns:**
1. **Separation of concerns** - UI / Logic / Types
2. **Pure functions** - calculateInsights is testable
3. **Type safety** - Interfaces document data shape
4. **Progressive enhancement** - Start simple, add complexity

---

### Step 5: Add Caching (Performance)

**Interview Question Alert:** "How would you improve performance?"

**Add caching:**

```typescript
// At top of file
const cache = new Map<string, { insights: CustomerInsights; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// In useEffect:
async function fetchData() {
  // Check cache first
  const cached = cache.get(customerId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    setInsights(cached.insights);
    setLoading(false);
    return;
  }

  // ... fetch from API ...

  // Store in cache
  cache.set(customerId, {
    insights: calculatedInsights,
    timestamp: Date.now(),
  });
}
```

**Interview talking points:**
- "Caching reduces API calls by 80%+"
- "5-minute TTL balances freshness vs performance"
- "Could invalidate on webhooks for real-time updates"
- "Trade-off: Memory usage vs speed"

---

## 🎓 Key Learnings Summary

### Technical Skills
✅ Stripe CLI and app creation
✅ stripe-app.json configuration
✅ Viewports and UI extensions
✅ Context hooks (`useCustomerId`)
✅ Stripe API calls
✅ Pagination handling
✅ Data aggregation
✅ TypeScript types
✅ Caching strategies

### Product Thinking
✅ What metrics matter to merchants?
✅ How to categorize customers?
✅ Risk assessment logic
✅ Performance optimization
✅ UX for loading states

### Interview Preparation
✅ Platform extensibility concepts
✅ DX friction points
✅ Trade-off discussions
✅ Metric selection rationale
✅ Scaling strategies

---

## 🎯 Connect to Interview

### When They Ask: "Have you built with our platform?"

**Answer:**
"Yes! I built three Stripe Apps to understand the platform hands-on:

1. **Hello World** - Learned viewports, context hooks, and the SDK
2. **Customer Badge** - Practiced parallel API calls and pagination
3. **Mini Insights** - Calculated real metrics like LTV and risk scores

Building these gave me insights into developer experience - like how the one-command setup (`stripe apps create`) makes onboarding frictionless, and how pagination can be tricky for developers who haven't dealt with it before."

### When They Ask: "What did you learn about our DX?"

**Answer:**
"Three things stood out:

**Excellent:**
- CLI scaffolding gets you to 'Hello World' in 2 minutes
- Context hooks are intuitive - `useCustomerId()` just works
- UI components match Dashboard perfectly

**Could improve:**
- No built-in test fixtures (had to create test customers manually)
- Pagination boilerplate is repetitive (could provide helper)
- Error messages when permissions are wrong aren't specific

I documented 12 friction points with proposed solutions in my project."

---

## Next Steps

1. **Build the full Customer Insights app** using what you learned
2. **Add a webhook handler** for real-time updates
3. **Write tests** for calculation logic
4. **Deploy to test mode** and share with a friend
5. **Read the interview prep guide** with new understanding

---

## Resources

**Official Documentation:**
- [Getting Started with Stripe Apps](https://docs.stripe.com/stripe-apps/create-app)
- [How Stripe Apps Work](https://docs.stripe.com/stripe-apps/how-stripe-apps-work)
- [UI Extension SDK Reference](https://docs.stripe.com/stripe-apps/reference/ui-extension-sdk)

**Your Project:**
- Full Customer Insights app code
- Interview Prep guide
- Developer Experience improvements
- Quick Start guide

---

You now have hands-on experience building Stripe Apps! Practice explaining what you built and why you made specific decisions. That's exactly what they'll want to hear in the interview.

Good luck! 🚀
