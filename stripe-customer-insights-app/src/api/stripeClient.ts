/**
 * Stripe API Client for Customer Insights App
 *
 * Uses the Stripe Apps SDK HTTP client which proxies API calls
 * through the Dashboard session — no secret keys needed.
 */

import Stripe from 'stripe';
import { createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';
import { StripeCustomerData } from '../types';

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2023-08-16',
});

/**
 * Fetch comprehensive customer data
 *
 * Uses Promise.all for parallel requests:
 * - Sequential: 4 requests × 200ms = 800ms
 * - Parallel: max(200ms) = 200ms
 */
export async function fetchCustomerData(
  customerId: string
): Promise<StripeCustomerData> {
  const [customer, charges, subscriptions, invoices] = await Promise.all([
    fetchCustomer(customerId),
    fetchCharges(customerId),
    fetchSubscriptions(customerId),
    fetchInvoices(customerId),
  ]);

  return { customer, charges, subscriptions, invoices };
}

async function fetchCustomer(customerId: string): Promise<Stripe.Customer> {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) {
    throw new Error('Customer has been deleted');
  }
  return customer;
}

async function fetchCharges(customerId: string): Promise<Stripe.Charge[]> {
  const response = await stripe.charges.list({
    customer: customerId,
    limit: 100,
  });
  return response.data;
}

async function fetchSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  const response = await stripe.subscriptions.list({
    customer: customerId,
    limit: 100,
    status: 'all',
  });
  return response.data;
}

async function fetchInvoices(customerId: string): Promise<Stripe.Invoice[]> {
  const response = await stripe.invoices.list({
    customer: customerId,
    limit: 100,
  });
  return response.data;
}

/**
 * Simple in-memory cache with TTL
 */
const cache = new Map<string, { data: StripeCustomerData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchCustomerDataWithCache(
  customerId: string
): Promise<StripeCustomerData> {
  const cached = cache.get(customerId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetchCustomerData(customerId);
  cache.set(customerId, { data, timestamp: Date.now() });
  return data;
}
