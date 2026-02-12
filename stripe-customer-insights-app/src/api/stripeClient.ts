/**
 * Stripe API Client for Customer Insights App
 *
 * INTERVIEW TOPIC: API Integration Patterns
 *
 * KEY DECISIONS:
 * 1. Error Handling - How do we handle rate limits, network failures?
 * 2. Caching - Do we cache responses? For how long?
 * 3. Pagination - Stripe returns 10-100 items per request, how do we handle more?
 * 4. Security - API keys must never be exposed to client-side code
 *
 * ARCHITECTURE:
 * In production Stripe Apps:
 * - Backend (this file) runs on Stripe's infrastructure
 * - Has access to secret API keys
 * - Frontend calls backend via UI Extension SDK
 */

import Stripe from 'stripe';
import { StripeCustomerData } from '../types';

/**
 * Initialize Stripe client
 *
 * SECURITY NOTE: In a real Stripe App:
 * - API key comes from environment variable
 * - Never committed to version control
 * - Scoped to specific permissions (principle of least privilege)
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18',
  typescript: true, // DX: Better autocomplete and type safety
});

/**
 * Fetch comprehensive customer data
 *
 * PERFORMANCE OPTIMIZATION: Parallel requests instead of sequential
 * - Sequential: 5 requests × 200ms = 1000ms
 * - Parallel: max(200ms) = 200ms
 *
 * INTERVIEW TALKING POINT: "How would you optimize API calls?"
 * - Batch requests when possible
 * - Use Promise.all for independent requests
 * - Implement request caching with TTL
 * - Use Stripe's expand parameter to reduce round trips
 */
export async function fetchCustomerData(
  customerId: string
): Promise<StripeCustomerData> {
  try {
    // Parallel API calls for faster response
    const [customer, charges, paymentIntents, subscriptions, invoices] = await Promise.all([
      fetchCustomer(customerId),
      fetchCharges(customerId),
      fetchPaymentIntents(customerId),
      fetchSubscriptions(customerId),
      fetchInvoices(customerId),
    ]);

    return {
      customer,
      charges,
      paymentIntents,
      subscriptions,
      invoices,
    };
  } catch (error) {
    console.error('Error fetching customer data:', error);
    throw new Error(`Failed to fetch data for customer ${customerId}`);
  }
}

/**
 * Fetch customer with expanded relationships
 *
 * STRIPE API FEATURE: "expand" parameter reduces API calls
 * Instead of:
 *   1. GET /v1/customers/:id
 *   2. GET /v1/payment_methods/:id (for default payment)
 * You do:
 *   1. GET /v1/customers/:id?expand[]=default_source
 */
async function fetchCustomer(customerId: string): Promise<Stripe.Customer> {
  const customer = await stripe.customers.retrieve(customerId, {
    expand: ['default_source', 'invoice_settings.default_payment_method'],
  });

  // Type guard: Stripe can return DeletedCustomer
  if (customer.deleted) {
    throw new Error('Customer has been deleted');
  }

  return customer;
}

/**
 * Fetch all charges for a customer
 *
 * PAGINATION CHALLENGE: Customer might have 1000+ charges
 *
 * OPTIONS:
 * 1. Fetch all (slow, memory intensive) ← We do this for accuracy
 * 2. Fetch recent N (fast, but incomplete LTV calculation)
 * 3. Server-side aggregation (requires backend database)
 *
 * INTERVIEW DISCUSSION: "How would you handle a customer with 100,000 charges?"
 * Answer: Move to async processing
 * - Initial load: Show cached insights from last calculation
 * - Background: Trigger webhook to recalculate, update via websocket
 * - UX: "Recalculating... last updated 2 hours ago"
 */
async function fetchCharges(customerId: string): Promise<Stripe.Charge[]> {
  const charges: Stripe.Charge[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  // Pagination loop
  while (hasMore) {
    const response = await stripe.charges.list({
      customer: customerId,
      limit: 100, // Max allowed by Stripe
      starting_after: startingAfter,
    });

    charges.push(...response.data);
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return charges;
}

/**
 * Fetch payment intents
 *
 * CONTEXT: PaymentIntents is Stripe's modern payment API
 * - Charge = old API (still used for legacy integrations)
 * - PaymentIntent = new API (better 3D Secure, multi-currency support)
 */
async function fetchPaymentIntents(
  customerId: string
): Promise<Stripe.PaymentIntent[]> {
  const paymentIntents: Stripe.PaymentIntent[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const response = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100,
      starting_after: startingAfter,
    });

    paymentIntents.push(...response.data);
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return paymentIntents;
}

/**
 * Fetch subscriptions
 */
async function fetchSubscriptions(
  customerId: string
): Promise<Stripe.Subscription[]> {
  const subscriptions: Stripe.Subscription[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const response = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100,
      status: 'all', // Include canceled subscriptions for churn analysis
      starting_after: startingAfter,
    });

    subscriptions.push(...response.data);
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return subscriptions;
}

/**
 * Fetch invoices
 */
async function fetchInvoices(customerId: string): Promise<Stripe.Invoice[]> {
  const invoices: Stripe.Invoice[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const response = await stripe.invoices.list({
      customer: customerId,
      limit: 100,
      starting_after: startingAfter,
    });

    invoices.push(...response.data);
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return invoices;
}

/**
 * Error Handling Utilities
 *
 * PRODUCTION BEST PRACTICE: Handle different error types differently
 */
export function handleStripeError(error: any): string {
  if (error.type === 'StripeCardError') {
    // Card was declined
    return 'Card payment failed';
  } else if (error.type === 'StripeRateLimitError') {
    // Rate limit hit
    return 'Too many requests, please try again later';
  } else if (error.type === 'StripeInvalidRequestError') {
    // Invalid parameters
    return 'Invalid request parameters';
  } else if (error.type === 'StripeAPIError') {
    // Stripe's servers error
    return 'Stripe API error, please try again';
  } else if (error.type === 'StripeConnectionError') {
    // Network error
    return 'Network error, please check your connection';
  } else if (error.type === 'StripeAuthenticationError') {
    // API key issue
    return 'Authentication error';
  } else {
    return 'An unexpected error occurred';
  }
}

/**
 * Caching Layer (Simplified Example)
 *
 * INTERVIEW TOPIC: "How would you implement caching for this app?"
 *
 * STRATEGY:
 * 1. In-memory cache with TTL (Time To Live)
 * 2. Cache key: customerId
 * 3. Invalidate on webhook events (customer.updated, charge.succeeded)
 *
 * TRADE-OFFS:
 * - Pro: Faster response, reduced API calls
 * - Con: Stale data if not invalidated properly
 * - Con: Memory usage for large datasets
 */
const cache = new Map<string, { data: StripeCustomerData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchCustomerDataWithCache(
  customerId: string,
  bypassCache: boolean = false
): Promise<StripeCustomerData> {
  if (!bypassCache) {
    const cached = cache.get(customerId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Cache hit for customer:', customerId);
      return cached.data;
    }
  }

  console.log('Cache miss, fetching fresh data for customer:', customerId);
  const data = await fetchCustomerData(customerId);

  cache.set(customerId, {
    data,
    timestamp: Date.now(),
  });

  return data;
}

/**
 * Invalidate cache for a customer
 *
 * Called from webhook handlers when customer data changes
 */
export function invalidateCache(customerId: string): void {
  cache.delete(customerId);
  console.log('Cache invalidated for customer:', customerId);
}
