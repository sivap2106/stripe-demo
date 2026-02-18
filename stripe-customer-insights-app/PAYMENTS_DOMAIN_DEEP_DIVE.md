# Payments Domain Deep Dive
## The Knowledge Foundation for Stripe Payments Intelligence PM

**Purpose:** Build genuine domain fluency, not memorized talking points
**Time to study:** 3–4 hours (take notes, draw diagrams)
**Approach:** Understand the system end-to-end, then learn where Stripe adds value at each step

---

## Chapter 1: The Players — Who's Involved in Every Card Payment

There are exactly **five parties** in every card transaction. Learn these cold.

```
┌──────────────┐                                    ┌──────────────┐
│  CARDHOLDER   │                                    │   MERCHANT   │
│  (Customer)   │                                    │  (Business)  │
└──────┬───────┘                                    └──────┬───────┘
       │                                                   │
       │ has card from                                     │ has account with
       ▼                                                   ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    ISSUER     │◄───────►│ CARD NETWORK │◄───────►│   ACQUIRER   │
│ (Customer's   │         │ (Visa, MC,   │         │ (Merchant's  │
│  bank)        │         │  Amex, etc.) │         │  bank)       │
└──────────────┘         └──────────────┘         └──────────────┘
```

### 1. Cardholder (Customer)
The person paying. They have a card issued by their bank.

### 2. Merchant (Business)
The business accepting payment. They have a merchant account with an acquirer.

### 3. Issuer (Issuing Bank)
The customer's bank. Chase, Bank of America, Capital One, etc.
- Issues credit/debit cards to consumers
- Decides whether to **approve or decline** each transaction
- Bears the risk if the cardholder defaults
- Handles chargebacks from their cardholders
- **This is who Stripe's Enhanced Issuer Network shares Radar scores with**

### 4. Acquirer (Acquiring Bank)
The merchant's bank. Processes payments on the merchant's behalf.
- Provides merchant accounts
- Routes transactions to card networks
- Deposits settled funds into merchant accounts
- Bears risk if merchant goes bankrupt mid-chargeback
- **Stripe acts as both processor AND acquirer for most merchants**

### 5. Card Network (Scheme)
Visa, Mastercard, American Express, Discover.
- Connects issuers and acquirers
- Sets the rules (interchange rates, dispute procedures, compliance)
- Routes authorization messages between parties
- Does NOT hold funds — they're the railroad, not the train
- **Stripe has direct connections to six major global networks**

### Key Insight for Interviews
> "Stripe is unique because it consolidates multiple roles. For most merchants, Stripe is the payment gateway, the processor, AND the acquirer. This vertical integration means Stripe sees data at every layer — checkout behavior, authorization messages, network responses, settlement — which is why the Payments Foundation Model has a data advantage no standalone fraud vendor can match."

---

## Chapter 2: The Authorization Flow — What Happens When a Customer Clicks "Pay"

This is the most important thing to understand. Every product in the Payments Intelligence Suite intervenes at a specific point in this flow.

### Step-by-Step (with Stripe's interventions marked)

```
STEP 1: Customer clicks "Pay" on merchant's website
         │
         ▼
STEP 2: Payment data hits Stripe's servers
         │
         ├──► [STRIPE: Radar evaluates fraud risk — 1,000+ signals, <100ms]
         │    Decision: BLOCK / REQUEST 3DS / ALLOW
         │
         ▼
STEP 3: Stripe formats the authorization request
         │
         ├──► [STRIPE: Authorization Boost optimizes the message]
         │    - Substitutes network token for PAN if beneficial
         │    - Formats fields per issuer preferences
         │    - Applies issuer-specific optimizations
         │
         ▼
STEP 4: Message sent to card network (Visa/MC)
         │
         ├──► [STRIPE: Enhanced Issuer Network — Radar score shared with issuer]
         │
         ▼
STEP 5: Card network routes to issuing bank
         │
         ▼
STEP 6: Issuer evaluates the transaction
         │
         ├── Checks: Sufficient funds? Card valid? Fraud risk?
         │   Uses: Their own models + Radar score (if EIN partner)
         │
         ├── Decision: APPROVE → sends approval code
         │
         └── Decision: DECLINE → sends decline code (e.g., 05, 51, 65)
                │
                ▼
STEP 7: Response flows back through network → acquirer → Stripe
         │
         ├── If APPROVED → Stripe returns success to merchant
         │
         └── If DECLINED:
              │
              ├──► [STRIPE: Adaptive Acceptance evaluates retry]
              │    - Was this a false decline? What kind?
              │    - Should we retry with different parameters?
              │    - Should we use network token instead of PAN (or vice versa)?
              │
              ├── If retry succeeds → customer never sees the decline
              └── If retry fails → decline returned to merchant
                   │
                   └── For subscriptions:
                        ├──► [STRIPE: Smart Retries — retry later at optimal time]
                        └──► [STRIPE: Card Account Updater — refresh card details]
```

### The Authorization Message (ISO 8583)

Every authorization request is encoded in **ISO 8583** format — an international standard for financial transaction messages. You don't need to know the byte-level format, but you should know what data it carries:

**What's in an authorization request:**
- Card number (PAN) or network token
- Expiration date
- Transaction amount and currency
- Merchant category code (MCC) — what type of business
- Merchant name and location
- CVV/CVC (if collected)
- AVS data (billing address for verification)
- 3DS authentication results (if performed)
- Device/browser fingerprint data
- **Stripe enriches this with additional data points the issuer can use**

**What's in the response:**
- Approve or decline decision
- Authorization code (if approved)
- Decline code (if declined) — see Chapter 4
- AVS result (address match Y/N)
- CVV result (match Y/N)

### The Two Phases: Authorization vs. Settlement

**Authorization (real-time, ~1-2 seconds):**
- "Does this cardholder have the funds and is this legit?"
- Places a HOLD on the cardholder's account
- No money actually moves yet

**Settlement (batch, typically next business day):**
- Merchant "captures" the authorized amount
- Acquirer submits batch of captures to card network
- Network calculates net positions
- Issuer transfers funds to acquirer
- Acquirer deposits into merchant account
- **Interchange fees are deducted during settlement**

### Key Insight for Interviews
> "The authorization decision happens in about 1-2 seconds, and the issuer has limited information to work with. That's why Stripe's interventions are so valuable — Radar sees checkout behavior the issuer can't, Enhanced Issuer Network shares that intelligence with the issuer, and Adaptive Acceptance can recover false declines before the customer ever sees them. Each intervention targets a different bottleneck in this flow."

---

## Chapter 3: The Economics — How Money Moves and Who Gets Paid

### Interchange: The Core of Payments Economics

When a customer pays $100 with a credit card:

```
Customer pays:     $100.00
                      │
Issuer keeps:      $  1.80  ← INTERCHANGE (set by card network)
Network keeps:     $  0.13  ← NETWORK ASSESSMENT FEE
Acquirer keeps:    $  0.07  ← ACQUIRER MARKUP
                      │
                   ────────
Stripe keeps:      $  2.90 + $0.30 = $3.20 total  (standard pricing)
                      │
                   Of that $3.20:
                   $1.80 goes to issuer (interchange)
                   $0.13 goes to card network
                   ~$1.27 is Stripe's gross margin
                      │
Merchant receives: $ 96.80
```

### Interchange Varies Wildly

Interchange is NOT a fixed number. It varies by:

| Factor | Lower Interchange | Higher Interchange |
|---|---|---|
| **Card type** | Debit card (~0.5%) | Premium rewards credit (~2.5%) |
| **Transaction type** | Card-present / in-person | Card-not-present / online (CNP) |
| **Merchant category** | Grocery, utility | Travel, entertainment |
| **Card brand** | Regulated debit (Durbin) | Corporate/commercial cards |
| **Data quality** | Full AVS + CVV match | Missing verification data |
| **Authentication** | 3DS authenticated | No authentication |

**Why this matters for the PM role:** Authorization Boost's cost optimization features help merchants on **IC+ (interchange-plus) pricing** reduce their effective interchange by improving data quality, using network tokens (which qualify for lower rates), and preventing excessive retries (which incur network fees).

### Stripe's Two Pricing Models

**1. Blended Pricing (most merchants):**
- 2.9% + $0.30 per transaction
- Simple, predictable
- Stripe absorbs interchange variability

**2. IC+ (Interchange Plus) Pricing (large/enterprise merchants):**
- Interchange (pass-through) + Stripe markup
- More transparent, potentially cheaper at scale
- Merchant sees actual interchange costs
- **Authorization Boost's cost optimization is most valuable here**

### Key Insight for Interviews
> "Every basis point matters at scale. If a merchant processes $1 billion/year, a 1 basis point (0.01%) improvement in authorization rate = $100,000 in recovered revenue. A 1 basis point reduction in interchange costs = $100,000 in savings. The Payments Intelligence Suite works on both levers simultaneously — more revenue captured AND lower cost per transaction."

---

## Chapter 4: Decline Codes — Why Payments Fail

When an issuer declines a transaction, they send a **two-digit code** explaining why. These are critical to understand because Adaptive Acceptance uses them to decide whether and how to retry.

### Hard Declines vs. Soft Declines

**Hard Declines — DO NOT RETRY (permanent problem)**

| Code | Name | Meaning | What to Do |
|---|---|---|---|
| 04 | Pick up card | Suspected fraud, card reported | Do not retry. Ever. |
| 07 | Pick up card (fraud) | Confirmed fraud | Do not retry |
| 14 | Invalid card number | Card number doesn't exist | Ask customer for correct details |
| 15 | No such issuer | Card network can't find issuer | Card is invalid |
| 41 | Lost card | Reported lost | Do not retry |
| 43 | Stolen card | Reported stolen | Do not retry |
| 54 | Expired card | Past expiration date | Card Account Updater may help |
| R0 | Stop recurring | Cardholder requested stop | Cancel subscription |
| R1 | Revocation of auth | Cardholder revoked permission | Cancel subscription |

**Soft Declines — RETRY MAY SUCCEED (temporary problem)**

| Code | Name | Meaning | What to Do |
|---|---|---|---|
| 05 | Do not honor | GENERIC — issuer won't say why | Most common code (~30% of declines). May be retryable. |
| 51 | Insufficient funds | Not enough money right now | Retry later (after payday) |
| 61 | Exceeds limit | Over daily/transaction limit | Retry with lower amount or later |
| 65 | Exceeds frequency | Too many transactions today | Wait and retry |
| 70 | Contact card issuer | Issuer wants to talk to customer | Ask customer to call their bank |
| 91 | Issuer unavailable | Bank's system is down | Retry in a few minutes |
| 96 | System malfunction | Processing error | Retry immediately |

**The "Do Not Honor" Problem (Code 05)**
This is the single most important decline code to understand. It accounts for roughly 30% of all declines, and it's essentially the issuer saying "no" without explaining why. The actual reason could be:
- Insufficient funds (but they used 05 instead of 51)
- Fraud suspicion (but not confirmed)
- Velocity limits
- Geographic restrictions
- Internal bank policy
- The issuer's own models flagged it

**Why this matters for Payments Intelligence:** Because 05 is so ambiguous, Adaptive Acceptance has to use Stripe's own signals (not the decline code) to decide if a retry is worthwhile. This is where the Payments Foundation Model's embeddings are most valuable — they can predict the *actual* reason behind a generic 05 decline.

### Authentication-Related Declines

| Code | Name | Meaning |
|---|---|---|
| — | `authentication_required` | Issuer wants 3DS authentication |
| — | `card_not_supported` | Card doesn't support 3DS |

**Stripe's Adaptive 3DS** handles these intelligently: if the initial transaction is declined with an authentication request, Stripe can automatically trigger a 3DS flow rather than returning a hard failure to the customer.

### Retry Rules & Risks

Card networks have strict rules about retries:
- **Visa:** Max 15 retry attempts within 30 days
- **Mastercard:** Max 35 retry attempts within 30 days
- **Exceeding limits → fines** up to $15,000+ per violation

This is why **Excessive Retry Prevention** is part of Authorization Boost — Stripe prevents merchants from accidentally incurring network fines while still maximizing legitimate retry opportunities.

### Key Insight for Interviews
> "The decline code taxonomy reveals why ML is essential for authorization optimization. About 30% of declines are the generic 'do not honor' — the issuer gives no signal about why. Stripe's advantage is that we can look at thousands of features beyond the decline code to predict whether a retry will succeed: the card's history on the network, the merchant's typical patterns, the time of day, device fingerprint, and more. No standalone retry tool can match that because they don't have the data."

---

## Chapter 5: 3D Secure — The Authentication Layer

### What Is 3D Secure?

3DS is an **authentication protocol** that adds a verification step to online payments. The customer proves they're the legitimate cardholder by:
- Entering a one-time password (OTP) sent to their phone
- Completing a biometric check (fingerprint, face ID)
- Answering a security question
- Or — in the "frictionless" flow — being silently authenticated based on background signals

The "3D" refers to three domains: **issuer domain, acquirer domain, interoperability domain** (the network).

### 3DS Versions

**3DS 1.0 (legacy, being phased out):**
- Pop-up window redirects to issuer's site
- Clunky, high cart abandonment (up to 20-30% drop-off)
- Not mobile-friendly

**3DS 2.0 (current standard):**
- Native in-app/in-browser authentication
- "Frictionless" flow possible (no customer action needed)
- 10x more data shared with issuer for risk assessment
- Mobile-optimized
- Visa research: 85% faster checkout, 75% reduction in cart abandonment vs. 3DS 1.0

### Two Authentication Flows

**Frictionless Flow (best case — no customer friction):**
```
Customer clicks Pay
    → Stripe sends 3DS authentication request with rich data
    → Issuer's risk engine evaluates data
    → Risk is LOW → Issuer silently approves
    → Customer never sees authentication step
    → Liability still shifts to issuer
```

**Challenge Flow (customer must act):**
```
Customer clicks Pay
    → Stripe sends 3DS authentication request
    → Issuer's risk engine evaluates data
    → Risk is ELEVATED → Issuer requests challenge
    → Customer sees: OTP prompt / biometric / security question
    → Customer authenticates successfully
    → Liability shifts to issuer
```

### The Liability Shift — Why 3DS Matters Economically

Without 3DS: Merchant is liable for fraud chargebacks.
With successful 3DS: **Issuer is liable** for fraud chargebacks.

This is a massive financial incentive:
- Merchant no longer pays for fraudulent transactions
- Issuer takes on the risk (but they authenticated the cardholder, so they're confident)
- Even if fraud occurs, the merchant is protected

### SCA (Strong Customer Authentication) — European Regulation

**PSD2's SCA mandate** requires two-factor authentication for electronic payments in the EU/EEA. The two factors must come from different categories:
- **Knowledge:** Password, PIN, security question
- **Possession:** Phone (OTP), card, hardware token
- **Inherence:** Fingerprint, face recognition, voice

**SCA Exemptions** (where 3DS can be skipped):
- **Low-value transactions:** Under €30 (up to cumulative limits)
- **Low-risk transactions (TRA):** Based on fraud rates — if the acquirer/PSP maintains low fraud, they can request exemptions
- **Trusted beneficiaries:** Customer has allow-listed the merchant
- **Recurring payments:** After the first authenticated payment, subsequent charges can skip SCA
- **Merchant-initiated transactions:** Charges initiated by the merchant (not cardholder)

**Stripe automatically manages SCA exemption requests** — requesting exemptions where eligible to reduce friction while maintaining compliance.

### The 3DS Product Tension

This is a key product decision the Payments Intelligence PM thinks about constantly:

**More 3DS = Less Fraud + Liability Shift**
But also: **More 3DS = More Checkout Friction = Lower Conversion**

The optimal strategy is **risk-based 3DS** (which is exactly what Stripe's Adaptive 3DS does):
- Low-risk transactions → Skip 3DS → Maximum conversion
- Medium-risk → Request 3DS → Shift liability, catch fraud
- High-risk → Block outright → Prevent fraud

Stripe's multihead model + Adaptive 3DS achieves **30%+ fraud reduction on eligible transactions** by applying 3DS only where needed.

### Key Insight for Interviews
> "3DS is a perfect example of the optimization tension in payments intelligence. It's not a binary 'on or off' decision — it's a continuum. Apply 3DS to everything and you kill conversion. Apply it to nothing and you eat fraud losses. The PM's job is to build the product that finds the optimal point for each merchant's risk tolerance, and that's fundamentally an ML problem — predicting which transactions are risky enough to warrant the authentication friction but not risky enough to block outright."

---

## Chapter 6: Network Tokens — The Modern Card Credential

### The Problem with PANs (Primary Account Numbers)

A PAN is the 16-digit card number embossed on your physical card. Problems:
- When a card is **reissued** (lost, expired, upgraded), the PAN changes
- Merchant's stored PAN is now **stale** → subscription payment fails → customer churns
- PANs can be **stolen** in data breaches
- PANs carry **no context** about the merchant-cardholder relationship

### What Network Tokens Solve

A **network token** is a card network-issued credential that:
- **Substitutes for the PAN** in transaction processing
- **Auto-updates** when the underlying card changes (new number, new expiry)
- Is **merchant-specific** — a token issued for Merchant A can't be used at Merchant B
- Provides **cryptographic verification** for each transaction
- Often qualifies for **lower interchange rates** (networks incentivize token usage)

### How They Work

```
1. Customer saves card at checkout
2. Stripe requests a network token from Visa/MC
3. Network provisions token tied to: this card + this merchant
4. Stripe stores token (not PAN) in its vault

When charging later:
5. Stripe decides: Use token or PAN? (AI-powered decision)
6. If token: Transaction includes cryptographic proof
7. Issuer sees: "This is a known, authenticated relationship"
8. Result: Higher approval rate + lower fraud risk
```

### Why Stripe's Approach Is Smart

Stripe maintains **both** the PAN and the network token in its vault, and uses AI to decide which to send for each transaction. Some issuers approve tokens at higher rates; others still prefer PANs. Stripe's models learn per-issuer preferences and optimize accordingly.

**Card Account Updater** complements this: when a card is reissued, Stripe gets real-time updates from the network and refreshes the stored credentials — so the merchant's subscription charge succeeds even though the customer got a new card.

### Impact Numbers
- Network tokens are now available for Visa and Mastercard across NA, EMEA, APAC, and LATAM
- Combined with Card Account Updater, these features prevent millions of dollars in failed subscription payments

### Key Insight for Interviews
> "Network tokens represent a shift from 'dumb credentials' to 'smart credentials' in payments. The token carries information about the cardholder-merchant relationship, auto-updates when cards change, and provides cryptographic proof of authenticity. For a subscription business, this is the difference between involuntary churn and retained revenue. Stripe's edge is maintaining both tokens and PANs and using ML to pick the optimal credential for each transaction — which is a product decision that compounds across billions of transactions."

---

## Chapter 7: Disputes and Chargebacks — The Post-Transaction Battleground

### The Dispute Lifecycle

```
Day 0:    Customer calls their bank: "I didn't make this purchase"
Day 1-3:  Issuer files a dispute with the card network
          → Network notifies acquirer → acquirer notifies Stripe → Stripe notifies merchant
          → Funds are IMMEDIATELY debited from merchant's account (provisional credit to customer)
Day 1-21: Merchant has window to submit evidence (varies by network)
          → [STRIPE: Smart Disputes auto-compiles evidence]
Day 21-75: Issuer reviews evidence, makes decision
          → Won: Funds returned to merchant
          → Lost: Customer keeps the money, merchant loses

Total timeline: 60-75 days from dispute to resolution
```

### Types of Fraud / Dispute Reasons

**1. True Fraud (Third-party fraud):**
- Stolen card used without cardholder's knowledge
- Radar's primary target
- 3DS liability shift protects merchants here

**2. Friendly Fraud (First-party misuse):**
- Customer made the purchase but disputes it anyway
- "I didn't authorize this" (but they did)
- Growing problem — up 25% in recent years
- **Visa CE 3.0 (Compelling Evidence 3.0)** helps merchants fight this with historical transaction data

**3. Merchant Error:**
- Product not delivered, wrong item, billing error
- Legitimate dispute — merchant should fix the underlying issue

### Card Brand Monitoring Programs — Why Dispute Rates Matter

Visa and Mastercard monitor merchants' dispute rates. If you exceed thresholds, you enter **monitoring programs** with escalating consequences:

**Visa Dispute Monitoring Program (VDMP):**
- Threshold: >0.9% dispute rate OR >100 disputes/month
- Penalties: $50-$25,000/month fines, mandatory remediation plan
- Worst case: Lose ability to accept Visa

**Mastercard Excessive Chargeback Program:**
- Similar thresholds and escalating fines

**Why this matters for the PM role:** Stripe's dispute prevention tools (dispute deflection via Verifi/Ethoca, Smart Refunds, Smart Disputes) directly help merchants stay below these thresholds. The business case writes itself — "we help you avoid $50K/month in fines."

### TC40 and SAFE Reports — Early Fraud Signals

- **TC40 (Visa):** Early fraud warning report. Issuer flags a transaction as potentially fraudulent before a dispute is filed.
- **SAFE (Mastercard):** Same concept, Mastercard's version.

Stripe ingests these reports and uses them to:
- Update Radar models in near-real-time
- Warn merchants about potentially fraudulent transactions
- Improve the Payments Foundation Model's training data

### Key Insight for Interviews
> "Disputes are where the full Payments Intelligence Suite comes together. Radar prevents fraud upstream (fewer disputes filed). Adaptive 3DS shifts liability (disputes that are filed become the issuer's problem). Smart Refunds proactively refund suspicious transactions (prevent disputes from being filed at all). Dispute prevention via Verifi/Ethoca resolves disputes before they count against the merchant's rate. And Smart Disputes handles the ones that get through. Each layer reduces the blast radius for the next."

---

## Chapter 8: Putting It All Together — The Payments Intelligence Stack

Now you can see how every product maps to a specific point in the payment lifecycle:

```
BEFORE PAYMENT
│
├── Radar: Evaluate fraud risk, block/3DS/allow
├── Authentication Engine: Apply 3DS where beneficial, manage SCA exemptions
│
DURING AUTHORIZATION
│
├── Authorization Boost: Optimize message format, choose token vs PAN
├── Enhanced Issuer Network: Share Radar score with issuer
│
AFTER DECLINE
│
├── Adaptive Acceptance: Identify and retry false declines in real-time
├── Smart Retries: Retry subscriptions at optimal times
├── Card Account Updater: Refresh stale card data
│
AFTER DISPUTE
│
├── Dispute Prevention: Verifi/Ethoca — resolve before it counts
├── Smart Refunds: Proactively refund likely-to-be-disputed transactions
├── Smart Disputes: Auto-compile and submit evidence
│
UNDERLYING EVERYTHING
│
└── Payments Foundation Model: Self-supervised embeddings on 10B+ transactions
    → Powers risk scoring, retry decisions, dispute predictions, all of the above
```

---

## Chapter 9: Key Metrics to Speak Fluently

| Metric | What It Measures | Good Benchmark | Why It Matters |
|---|---|---|---|
| **Authorization rate** | % of payments approved | 85-95% for CNP | Every 1% = significant revenue |
| **Fraud rate (bps)** | Fraud $ / total $ in basis points | <10 bps is good | High = monitoring programs |
| **False decline rate** | Legitimate payments incorrectly blocked | Hard to measure directly | $81B annual cost to US retailers |
| **Dispute rate** | Disputes / transactions | <0.9% to avoid Visa monitoring | Exceeding = fines + potential card loss |
| **Chargeback win rate** | % of disputed transactions won | 20-40% typical | Smart Disputes aims to improve this |
| **Net revenue retention** | Revenue kept after fraud + disputes + costs | Higher is better | The ultimate measure |

### The Math That Matters

For a merchant processing **$100M/year:**
- 1 bp auth rate improvement = **$10,000** recovered revenue
- 10 bp auth rate improvement = **$100,000**
- 100 bp (1%) improvement = **$1,000,000**
- Fraud reduction from 50 bps to 30 bps = **$200,000** saved
- Avoiding monitoring program fines = **$50,000-$300,000/year**

For Stripe at **$1.4T/year processed:**
- Every product improvement at scale = **hundreds of millions of dollars** in merchant value

---

## Chapter 10: Vocabulary Cheat Sheet

**Must-know terms (use these naturally in interviews):**

| Term | Definition |
|---|---|
| **PAN** | Primary Account Number — the 16-digit card number |
| **CNP** | Card Not Present — online/phone transactions (higher risk) |
| **CP** | Card Present — in-person transactions (lower risk) |
| **Basis point (bp)** | 0.01% — the standard unit in payments |
| **Interchange** | Fee paid by acquirer to issuer per transaction |
| **IC+** | Interchange-plus pricing (transparent, for large merchants) |
| **MCC** | Merchant Category Code — industry classification |
| **AVS** | Address Verification System — checks billing address match |
| **CVV/CVC** | Card verification value — the 3-digit code on back |
| **3DS** | 3D Secure — authentication protocol |
| **SCA** | Strong Customer Authentication — EU regulatory requirement (PSD2) |
| **PSD2** | Revised Payment Services Directive — EU payments regulation |
| **Liability shift** | When fraud liability moves from merchant to issuer (via 3DS) |
| **Chargeback** | Disputed transaction — funds reversed from merchant to customer |
| **TC40 / SAFE** | Early fraud warning reports from Visa / Mastercard |
| **ISO 8583** | International standard for financial transaction messages |
| **BIN** | Bank Identification Number — first 6-8 digits of card number (identifies issuer) |
| **Settlement** | Actual fund transfer between issuer and acquirer (T+1 or T+2) |
| **Dunning** | Process of attempting to collect failed subscription payments |
| **Involuntary churn** | Customers lost due to payment failure (not by choice) |
| **False decline** | Legitimate payment incorrectly rejected |
| **Network token** | Card network-issued credential substituting for PAN |
| **PSP** | Payment Service Provider — Stripe, Adyen, etc. |
| **ECI** | Electronic Commerce Indicator — indicates 3DS authentication result |
| **Frictionless flow** | 3DS authentication without customer action |
| **Challenge flow** | 3DS authentication requiring customer verification |

---

## How to Study This

1. **Draw the five-party model from memory** — if you can't draw it, you don't know it
2. **Walk through the authorization flow verbally** — explain each step as if to a non-technical person
3. **Calculate a sample transaction's economics** — $100 purchase, who gets what
4. **Explain three decline codes** — one hard, one soft, one generic — and what Stripe does about each
5. **Explain the 3DS tradeoff** — in terms a merchant would understand
6. **Map each Payments Intelligence product** to its intervention point in the flow

When you can do all six of these without looking at notes, you have genuine domain fluency — not memorized talking points. That's what separates a PM who "studied for the interview" from one who "understands the domain."
