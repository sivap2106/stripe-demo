/**
 * Type Definitions for Customer Insights App
 *
 * INTERVIEW NOTE: Strong typing is critical for developer experience
 * - Catches errors at compile time, not runtime
 * - IDE autocomplete improves productivity
 * - Self-documenting code
 */

import Stripe from 'stripe';

/**
 * Customer Insights Data Structure
 *
 * PM INSIGHT: What metrics matter most to merchants?
 * - LTV (Lifetime Value) - Revenue potential
 * - Payment Pattern - Reliability indicator
 * - Risk Score - Fraud/chargeback likelihood
 */
export interface CustomerInsights {
  customerId: string;
  lifetimeValue: {
    total: number;
    currency: string;
    breakdown: {
      oneTime: number;
      subscription: number;
      refunded: number;
    };
  };
  paymentPattern: {
    successRate: number;
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    averagePaymentAmount: number;
    preferredPaymentMethod: string | null;
  };
  riskAssessment: {
    score: number; // 0-100, higher = riskier
    factors: RiskFactor[];
    recommendation: 'low_risk' | 'medium_risk' | 'high_risk';
  };
  subscriptionHealth: {
    activeSubscriptions: number;
    totalSubscriptions: number;
    churnedSubscriptions: number;
    monthlyRecurringRevenue: number;
    nextBillingDate: string | null;
  };
  metadata: {
    firstPurchaseDate: string | null;
    lastPurchaseDate: string | null;
    daysSinceLastPurchase: number | null;
    totalTransactions: number;
  };
}

/**
 * Risk Factor Analysis
 *
 * PRODUCT DECISION: What constitutes "risky" behavior?
 * - High chargeback rate
 * - Multiple failed payments
 * - Inconsistent payment patterns
 * - New customer with large transaction
 */
export interface RiskFactor {
  type: 'high_chargeback_rate' | 'payment_failures' | 'velocity_check' | 'new_customer_large_amount';
  severity: 'low' | 'medium' | 'high';
  description: string;
  value: number | string;
}

/**
 * API Response Type for Stripe Data Fetching
 *
 * ARCHITECTURE NOTE: We aggregate multiple Stripe API calls
 * - Customer.retrieve()
 * - Charges.list()
 * - PaymentIntents.list()
 * - Subscriptions.list()
 * - Invoices.list()
 */
export interface StripeCustomerData {
  customer: Stripe.Customer;
  charges: Stripe.Charge[];
  paymentIntents: Stripe.PaymentIntent[];
  subscriptions: Stripe.Subscription[];
  invoices: Stripe.Invoice[];
}

/**
 * Component Props for Reusable Metric Cards
 */
export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info';
}

/**
 * Loading States for Better UX
 *
 * DX INSIGHT: Clear loading states reduce perceived latency
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AppState {
  insights: CustomerInsights | null;
  loadingState: LoadingState;
  error: string | null;
}
