/**
 * Customer Insights Calculation Utilities
 *
 * INTERVIEW TOPIC: Data Processing & Business Logic
 *
 * PM CONSIDERATIONS:
 * 1. Accuracy vs Speed - Do we need real-time or can we cache?
 * 2. Edge Cases - What if customer has no payments? No subscriptions?
 * 3. Currency Handling - Multi-currency support complexity
 * 4. Performance - Calculating for 10,000 customers at once?
 */

import Stripe from 'stripe';
import { CustomerInsights, RiskFactor, StripeCustomerData } from '../types';

/**
 * Calculate comprehensive customer insights from Stripe data
 *
 * TECHNICAL NOTE: This is a pure function - same input always produces same output
 * Makes testing easy and enables caching
 */
export function calculateCustomerInsights(data: StripeCustomerData): CustomerInsights {
  const { customer, charges, paymentIntents, subscriptions, invoices } = data;

  return {
    customerId: customer.id,
    lifetimeValue: calculateLifetimeValue(charges, subscriptions),
    paymentPattern: analyzePaymentPattern(charges, paymentIntents),
    riskAssessment: assessRisk(customer, charges, paymentIntents),
    subscriptionHealth: analyzeSubscriptions(subscriptions),
    metadata: extractMetadata(charges, customer),
  };
}

/**
 * Calculate Lifetime Value (LTV)
 *
 * PRODUCT METRIC: LTV helps merchants identify their best customers
 *
 * Formula:
 * - One-time: Sum of all successful charges
 * - Subscription: Sum of all subscription invoices paid
 * - Refunded: Total amount refunded (subtracted)
 */
function calculateLifetimeValue(
  charges: Stripe.Charge[],
  subscriptions: Stripe.Subscription[]
): CustomerInsights['lifetimeValue'] {
  const successfulCharges = charges.filter(charge => charge.status === 'succeeded');

  // EDGE CASE: Handle multi-currency by converting to customer's primary currency
  // For simplicity, we assume single currency. Production app would use fx rates.
  const currency = successfulCharges[0]?.currency || 'usd';

  const oneTimeTotal = successfulCharges
    .filter(charge => !charge.invoice) // Non-subscription charges
    .reduce((sum, charge) => sum + charge.amount, 0);

  const subscriptionTotal = successfulCharges
    .filter(charge => charge.invoice) // Subscription charges
    .reduce((sum, charge) => sum + charge.amount, 0);

  const refundedTotal = charges
    .reduce((sum, charge) => sum + (charge.amount_refunded || 0), 0);

  const total = oneTimeTotal + subscriptionTotal - refundedTotal;

  return {
    total: total / 100, // Convert cents to dollars
    currency,
    breakdown: {
      oneTime: oneTimeTotal / 100,
      subscription: subscriptionTotal / 100,
      refunded: refundedTotal / 100,
    },
  };
}

/**
 * Analyze Payment Patterns
 *
 * INTERVIEW INSIGHT: Payment success rate is a leading indicator of customer health
 * - High success rate = good payment method, engaged customer
 * - Low success rate = card issues, fraud risk, or dissatisfied customer
 */
function analyzePaymentPattern(
  charges: Stripe.Charge[],
  paymentIntents: Stripe.PaymentIntent[]
): CustomerInsights['paymentPattern'] {
  const successfulPayments = charges.filter(c => c.status === 'succeeded').length;
  const failedPayments = charges.filter(c => c.status === 'failed').length;
  const totalPayments = charges.length;

  const successRate = totalPayments > 0
    ? (successfulPayments / totalPayments) * 100
    : 0;

  const averagePaymentAmount = totalPayments > 0
    ? charges.reduce((sum, charge) => sum + charge.amount, 0) / totalPayments / 100
    : 0;

  // Determine preferred payment method (most used)
  const paymentMethodCounts = new Map<string, number>();
  charges.forEach(charge => {
    if (charge.payment_method_details?.type) {
      const type = charge.payment_method_details.type;
      paymentMethodCounts.set(type, (paymentMethodCounts.get(type) || 0) + 1);
    }
  });

  let preferredPaymentMethod: string | null = null;
  let maxCount = 0;
  paymentMethodCounts.forEach((count, method) => {
    if (count > maxCount) {
      maxCount = count;
      preferredPaymentMethod = method;
    }
  });

  return {
    successRate,
    totalPayments,
    successfulPayments,
    failedPayments,
    averagePaymentAmount,
    preferredPaymentMethod,
  };
}

/**
 * Risk Assessment Algorithm
 *
 * PM CHALLENGE: Balancing false positives vs false negatives
 * - Too strict: Legitimate customers flagged, poor UX
 * - Too lenient: Fraud slips through, merchant loses money
 *
 * APPROACH: Multi-factor scoring system
 */
function assessRisk(
  customer: Stripe.Customer,
  charges: Stripe.Charge[],
  paymentIntents: Stripe.PaymentIntent[]
): CustomerInsights['riskAssessment'] {
  const factors: RiskFactor[] = [];
  let riskScore = 0;

  // Factor 1: Payment Failure Rate
  const failedCharges = charges.filter(c => c.status === 'failed').length;
  const totalCharges = charges.length;
  const failureRate = totalCharges > 0 ? failedCharges / totalCharges : 0;

  if (failureRate > 0.3) {
    factors.push({
      type: 'payment_failures',
      severity: failureRate > 0.5 ? 'high' : 'medium',
      description: `${(failureRate * 100).toFixed(0)}% payment failure rate`,
      value: failureRate,
    });
    riskScore += failureRate > 0.5 ? 30 : 15;
  }

  // Factor 2: Chargeback History
  // In production, you'd check charge.dispute
  const chargebacks = charges.filter(c => c.disputed).length;
  if (chargebacks > 0) {
    const chargebackRate = chargebacks / totalCharges;
    factors.push({
      type: 'high_chargeback_rate',
      severity: chargebackRate > 0.01 ? 'high' : 'medium',
      description: `${chargebacks} chargebacks detected`,
      value: chargebacks,
    });
    riskScore += chargebackRate > 0.01 ? 40 : 20;
  }

  // Factor 3: New Customer with Large Transaction
  const accountAge = customer.created
    ? (Date.now() / 1000 - customer.created) / (86400 * 30) // months
    : 0;

  const largeCharges = charges.filter(c => c.amount > 50000).length; // > $500

  if (accountAge < 1 && largeCharges > 0) {
    factors.push({
      type: 'new_customer_large_amount',
      severity: 'medium',
      description: `New customer (${accountAge.toFixed(1)} months) with large transactions`,
      value: accountAge,
    });
    riskScore += 15;
  }

  // Factor 4: Velocity Check (rapid transactions)
  if (charges.length > 10) {
    const firstCharge = charges[charges.length - 1]?.created || 0;
    const lastCharge = charges[0]?.created || 0;
    const daysBetween = (lastCharge - firstCharge) / 86400;

    if (daysBetween < 7) {
      factors.push({
        type: 'velocity_check',
        severity: 'medium',
        description: `${charges.length} transactions in ${daysBetween.toFixed(0)} days`,
        value: charges.length,
      });
      riskScore += 10;
    }
  }

  // Determine recommendation
  let recommendation: CustomerInsights['riskAssessment']['recommendation'];
  if (riskScore < 20) recommendation = 'low_risk';
  else if (riskScore < 50) recommendation = 'medium_risk';
  else recommendation = 'high_risk';

  return {
    score: Math.min(riskScore, 100),
    factors,
    recommendation,
  };
}

/**
 * Analyze Subscription Health
 *
 * BUSINESS METRIC: MRR (Monthly Recurring Revenue) is critical for SaaS businesses
 */
function analyzeSubscriptions(
  subscriptions: Stripe.Subscription[]
): CustomerInsights['subscriptionHealth'] {
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const totalSubscriptions = subscriptions.length;
  const churnedSubscriptions = subscriptions.filter(
    s => s.status === 'canceled' || s.status === 'unpaid'
  ).length;

  // Calculate MRR from active subscriptions
  const monthlyRecurringRevenue = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, sub) => {
      // Convert interval to monthly amount
      const intervalCount = sub.items.data[0]?.price?.recurring?.interval_count || 1;
      const interval = sub.items.data[0]?.price?.recurring?.interval;
      const amount = sub.items.data[0]?.price?.unit_amount || 0;

      let monthlyAmount = amount;
      if (interval === 'year') monthlyAmount = amount / 12;
      else if (interval === 'month') monthlyAmount = amount / intervalCount;

      return sum + monthlyAmount;
    }, 0) / 100;

  // Find next billing date
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const nextBillingDate = activeSubs.length > 0
    ? new Date(activeSubs[0].current_period_end * 1000).toISOString()
    : null;

  return {
    activeSubscriptions,
    totalSubscriptions,
    churnedSubscriptions,
    monthlyRecurringRevenue,
    nextBillingDate,
  };
}

/**
 * Extract Customer Metadata
 */
function extractMetadata(
  charges: Stripe.Charge[],
  customer: Stripe.Customer
): CustomerInsights['metadata'] {
  const sortedCharges = [...charges].sort((a, b) => a.created - b.created);
  const firstCharge = sortedCharges[0];
  const lastCharge = sortedCharges[sortedCharges.length - 1];

  const firstPurchaseDate = firstCharge
    ? new Date(firstCharge.created * 1000).toISOString()
    : null;

  const lastPurchaseDate = lastCharge
    ? new Date(lastCharge.created * 1000).toISOString()
    : null;

  const daysSinceLastPurchase = lastCharge
    ? Math.floor((Date.now() / 1000 - lastCharge.created) / 86400)
    : null;

  return {
    firstPurchaseDate,
    lastPurchaseDate,
    daysSinceLastPurchase,
    totalTransactions: charges.length,
  };
}

/**
 * Format currency for display
 *
 * DX NOTE: Helper functions like this improve code readability
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
