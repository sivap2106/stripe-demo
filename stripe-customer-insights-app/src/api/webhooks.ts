/**
 * Webhook Handler for Real-Time Updates
 *
 * INTERVIEW TOPIC: Event-Driven Architecture
 *
 * WHY WEBHOOKS?
 * Instead of polling "Did anything change?" every N seconds:
 * - Stripe pushes events to your app when something happens
 * - Real-time updates (customer data changed? Invalidate cache!)
 * - Efficient (no unnecessary API calls)
 *
 * WEBHOOK EVENTS WE HANDLE:
 * - customer.created - New customer signed up
 * - customer.updated - Customer info changed (email, metadata, etc.)
 * - charge.succeeded - Payment succeeded
 * - charge.failed - Payment failed
 * - subscription.created - New subscription started
 * - subscription.deleted - Subscription canceled
 */

import Stripe from 'stripe';
import { invalidateCache } from './stripeClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18',
});

/**
 * Webhook signature verification
 *
 * SECURITY: Critical to verify webhooks are from Stripe, not an attacker
 *
 * HOW IT WORKS:
 * 1. Stripe signs each webhook with a secret key
 * 2. Signature is sent in Stripe-Signature header
 * 3. You verify signature matches expected value
 * 4. If mismatch → reject (potential attack)
 *
 * INTERVIEW QUESTION: "Why is webhook verification important?"
 * Answer: Without verification, an attacker could send fake events:
 * - Fake "charge.succeeded" events → your app thinks payment succeeded when it didn't
 * - Fake "subscription.deleted" → your app disables service for paying customer
 * - Data poisoning → corrupt your analytics
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Main webhook handler
 *
 * ARCHITECTURE: Route different event types to different handlers
 */
export async function handleWebhook(event: Stripe.Event): Promise<void> {
  console.log(`Processing webhook: ${event.type}`);

  switch (event.type) {
    case 'customer.created':
      await handleCustomerCreated(event.data.object as Stripe.Customer);
      break;

    case 'customer.updated':
      await handleCustomerUpdated(event.data.object as Stripe.Customer);
      break;

    case 'charge.succeeded':
      await handleChargeSucceeded(event.data.object as Stripe.Charge);
      break;

    case 'charge.failed':
      await handleChargeFailed(event.data.object as Stripe.Charge);
      break;

    case 'subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;

    case 'subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Handle customer.created event
 *
 * USE CASE: Pre-calculate initial insights for new customer
 * - Could send welcome email
 * - Initialize analytics dashboard
 * - Set up monitoring
 */
async function handleCustomerCreated(customer: Stripe.Customer): Promise<void> {
  console.log(`New customer created: ${customer.id}`);

  // No need to invalidate cache (customer is new, nothing cached yet)

  // In production, you might:
  // - Send to analytics system (Segment, Mixpanel)
  // - Trigger onboarding workflow
  // - Initialize CRM record
}

/**
 * Handle customer.updated event
 *
 * CACHE INVALIDATION: Customer data changed, clear cache
 */
async function handleCustomerUpdated(customer: Stripe.Customer): Promise<void> {
  console.log(`Customer updated: ${customer.id}`);

  // Invalidate cache so next request fetches fresh data
  invalidateCache(customer.id);

  // INTERVIEW INSIGHT: "What if webhook arrives before API call returns?"
  // This is called "eventual consistency"
  // - Webhook says "customer updated" but API still returns old data
  // - Solutions:
  //   1. Add timestamp to cache, ignore webhooks older than cached data
  //   2. Use webhook as hint to refresh, don't trust it as source of truth
  //   3. Implement versioning (etags) to detect stale data
}

/**
 * Handle charge.succeeded event
 *
 * INSIGHTS UPDATE: New payment affects:
 * - Lifetime Value (increased)
 * - Payment Pattern (success rate)
 * - Risk Score (may decrease if customer had failures before)
 */
async function handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
  const customerId = typeof charge.customer === 'string' ? charge.customer : charge.customer?.id;

  if (!customerId) {
    console.warn('Charge succeeded but no customer ID:', charge.id);
    return;
  }

  console.log(`Charge succeeded for customer ${customerId}: ${charge.amount / 100}`);

  // Invalidate cache - insights need recalculation
  invalidateCache(customerId);

  // PERFORMANCE OPTIMIZATION: Instead of recalculating everything,
  // you could incrementally update:
  // - LTV += charge.amount
  // - successfulPayments += 1
  // - successRate = successfulPayments / totalPayments
  //
  // But this requires storing state. For now, we recalculate on demand.
}

/**
 * Handle charge.failed event
 *
 * RISK SIGNAL: Failed payment increases risk score
 */
async function handleChargeFailed(charge: Stripe.Charge): Promise<void> {
  const customerId = typeof charge.customer === 'string' ? charge.customer : charge.customer?.id;

  if (!customerId) {
    console.warn('Charge failed but no customer ID:', charge.id);
    return;
  }

  console.log(`Charge failed for customer ${customerId}: ${charge.failure_message}`);

  // Invalidate cache
  invalidateCache(customerId);

  // PRODUCT FEATURE IDEA: Alert merchant about failed payment
  // - Send email notification
  // - Show banner in dashboard
  // - Suggest customer contact
}

/**
 * Handle subscription.created event
 *
 * MRR UPDATE: New subscription increases monthly recurring revenue
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  if (!customerId) {
    console.warn('Subscription created but no customer ID:', subscription.id);
    return;
  }

  console.log(`New subscription for customer ${customerId}: ${subscription.id}`);

  // Invalidate cache
  invalidateCache(customerId);

  // ANALYTICS: Track subscription conversion rate
  // - How many customers have >1 subscription?
  // - What's the median time from first charge to first subscription?
}

/**
 * Handle subscription.deleted event
 *
 * CHURN SIGNAL: Subscription canceled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  if (!customerId) {
    console.warn('Subscription deleted but no customer ID:', subscription.id);
    return;
  }

  console.log(`Subscription canceled for customer ${customerId}: ${subscription.id}`);

  // Invalidate cache
  invalidateCache(customerId);

  // RETENTION OPPORTUNITY: Trigger win-back campaign
  // - Send survey: "Why did you cancel?"
  // - Offer discount to reactivate
  // - Follow up in 30 days
}

/**
 * Webhook retry logic
 *
 * INTERVIEW TOPIC: Reliability Engineering
 *
 * PROBLEM: What if webhook processing fails?
 * - Network timeout
 * - Database unavailable
 * - Bug in handler code
 *
 * STRIPE'S SOLUTION: Automatic retries with exponential backoff
 * - Retry 1: Immediately
 * - Retry 2: 5 seconds later
 * - Retry 3: 25 seconds later
 * - ... up to 3 days
 *
 * YOUR RESPONSIBILITY:
 * 1. Return 200 OK quickly (< 30 seconds)
 * 2. Implement idempotent handlers (same event processed twice = same result)
 * 3. Handle duplicate events gracefully
 */

/**
 * Idempotency check
 *
 * DESIGN PATTERN: Store processed event IDs to detect duplicates
 */
const processedEvents = new Set<string>();

export function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

export function markEventProcessed(eventId: string): void {
  processedEvents.add(eventId);

  // In production, you'd store this in a database with TTL
  // (events older than 30 days can be forgotten)
}

/**
 * Example Express.js webhook endpoint
 *
 * IMPLEMENTATION GUIDE: How to integrate this with your server
 */
export function createWebhookEndpoint() {
  return async (req: any, res: any) => {
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    try {
      // 1. Verify signature
      const event = verifyWebhookSignature(req.body, signature, webhookSecret);

      // 2. Check for duplicates
      if (isEventProcessed(event.id)) {
        console.log(`Duplicate event ${event.id}, skipping`);
        return res.status(200).json({ received: true });
      }

      // 3. Process webhook
      await handleWebhook(event);

      // 4. Mark as processed
      markEventProcessed(event.id);

      // 5. Return 200 OK (tells Stripe we received it)
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook processing failed:', error);

      // Return 400 for invalid signature (don't retry)
      if (error instanceof Error && error.message.includes('signature')) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      // Return 500 for other errors (Stripe will retry)
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * INTERVIEW DISCUSSION POINTS:
 *
 * 1. Webhook Ordering
 * Q: "Events might arrive out of order. How do you handle this?"
 * A: Include timestamps, only process if newer than current data
 *
 * 2. Webhook Storms
 * Q: "What if a merchant has 10,000 customers and you update all their metadata at once?"
 * A: Rate limiting, queuing (SQS, RabbitMQ), batching
 *
 * 3. Testing Webhooks
 * Q: "How do you test webhook handlers in development?"
 * A: Stripe CLI (`stripe listen --forward-to localhost:3000/webhook`)
 *    Or Stripe test mode + manual trigger
 *
 * 4. Monitoring
 * Q: "How do you know if webhooks are failing?"
 * A: Metrics dashboard (success rate, latency), alerting, Stripe webhook logs
 */
