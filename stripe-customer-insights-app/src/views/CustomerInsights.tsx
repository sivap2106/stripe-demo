/**
 * Customer Insights Dashboard Component
 *
 * INTERVIEW TOPIC: UI Design for Embedded Apps
 *
 * DESIGN PRINCIPLES:
 * 1. Consistency - Match Stripe's design system
 * 2. Performance - Lazy load data, show skeleton states
 * 3. Accessibility - Keyboard navigation, screen readers
 * 4. Responsiveness - Works on different screen sizes
 *
 * STRIPE UI EXTENSION SDK:
 * - Provides pre-built components (Box, Badge, Button, etc.)
 * - Ensures consistent look/feel with Stripe Dashboard
 * - Handles theming (light/dark mode)
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Heading,
  Icon,
  Inline,
  Link,
  Spinner,
  Text,
} from '@stripe/ui-extension-sdk/ui';
import { useCustomerId } from '@stripe/ui-extension-sdk/context';
import { CustomerInsights, AppState } from '../types';
import { formatCurrency, formatDate, calculateCustomerInsights } from '../utils/calculations';
import { fetchCustomerDataWithCache } from '../api/stripeClient';

/**
 * Main Component
 *
 * ARCHITECTURE: This component:
 * 1. Reads customerId from Stripe Dashboard context
 * 2. Fetches customer data from Stripe API
 * 3. Calculates insights
 * 4. Renders metrics in cards
 */
export default function CustomerInsights() {
  // Stripe UI Extension SDK hook - gets current customer ID from dashboard context
  const customerId = useCustomerId();

  // Component state
  const [state, setState] = useState<AppState>({
    insights: null,
    loadingState: 'idle',
    error: null,
  });

  /**
   * Load customer insights
   *
   * PERFORMANCE: useEffect with dependency array ensures we only fetch when customerId changes
   * INTERVIEW POINT: Explain React hooks and component lifecycle
   */
  useEffect(() => {
    if (!customerId) return;

    async function loadInsights() {
      setState(prev => ({ ...prev, loadingState: 'loading', error: null }));

      try {
        // Fetch data from Stripe API
        const data = await fetchCustomerDataWithCache(customerId);

        // Calculate insights
        const insights = calculateCustomerInsights(data);

        setState({
          insights,
          loadingState: 'success',
          error: null,
        });
      } catch (error) {
        console.error('Failed to load insights:', error);
        setState({
          insights: null,
          loadingState: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    loadInsights();
  }, [customerId]);

  /**
   * Render different states
   *
   * UX BEST PRACTICE: Clear feedback for each state
   * - Loading: Skeleton/spinner
   * - Error: Actionable error message with retry
   * - Success: Full content
   */
  if (state.loadingState === 'loading') {
    return (
      <Box padding="large">
        <Inline alignment="center">
          <Spinner size="large" />
          <Text>Loading customer insights...</Text>
        </Inline>
      </Box>
    );
  }

  if (state.loadingState === 'error') {
    return (
      <Box padding="large">
        <Card>
          <Box padding="medium">
            <Heading level={3}>Error Loading Insights</Heading>
            <Text>{state.error}</Text>
            <Button
              onClick={() => setState({ ...state, loadingState: 'idle' })}
              css={{ marginTop: 16 }}
            >
              Retry
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  if (!state.insights) {
    return (
      <Box padding="large">
        <Text>No insights available</Text>
      </Box>
    );
  }

  /**
   * Main render
   *
   * LAYOUT: Grid system for responsive cards
   */
  return (
    <Box padding="large">
      <Heading level={2}>Customer Insights</Heading>
      <Text color="subdued">
        Comprehensive analytics for customer {customerId}
      </Text>

      <Divider />

      {/* Lifetime Value Section */}
      <Box marginTop="large">
        <LifetimeValueCard insights={state.insights} />
      </Box>

      {/* Payment Pattern Section */}
      <Box marginTop="medium">
        <PaymentPatternCard insights={state.insights} />
      </Box>

      {/* Risk Assessment Section */}
      <Box marginTop="medium">
        <RiskAssessmentCard insights={state.insights} />
      </Box>

      {/* Subscription Health Section */}
      {state.insights.subscriptionHealth.totalSubscriptions > 0 && (
        <Box marginTop="medium">
          <SubscriptionHealthCard insights={state.insights} />
        </Box>
      )}

      {/* Metadata Section */}
      <Box marginTop="medium">
        <MetadataCard insights={state.insights} />
      </Box>
    </Box>
  );
}

/**
 * Lifetime Value Card Component
 *
 * PRODUCT INSIGHT: LTV is the #1 metric merchants care about
 * - Helps identify VIP customers
 * - Informs customer acquisition cost decisions
 * - Guides retention strategies
 */
function LifetimeValueCard({ insights }: { insights: CustomerInsights }) {
  const { lifetimeValue } = insights;

  return (
    <Card>
      <Box padding="medium">
        <Heading level={3}>Lifetime Value</Heading>

        <Box marginTop="medium">
          <Text size="xlarge" weight="bold">
            {formatCurrency(lifetimeValue.total, lifetimeValue.currency)}
          </Text>
        </Box>

        <Grid columns={3} marginTop="medium">
          <Box>
            <Text color="subdued" size="small">One-time</Text>
            <Text weight="medium">
              {formatCurrency(lifetimeValue.breakdown.oneTime, lifetimeValue.currency)}
            </Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Subscription</Text>
            <Text weight="medium">
              {formatCurrency(lifetimeValue.breakdown.subscription, lifetimeValue.currency)}
            </Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Refunded</Text>
            <Text weight="medium">
              {formatCurrency(lifetimeValue.breakdown.refunded, lifetimeValue.currency)}
            </Text>
          </Box>
        </Grid>
      </Box>
    </Card>
  );
}

/**
 * Payment Pattern Card
 *
 * METRIC: Payment success rate indicates customer health
 * - High rate = good payment method, engaged customer
 * - Low rate = potential churn risk
 */
function PaymentPatternCard({ insights }: { insights: CustomerInsights }) {
  const { paymentPattern } = insights;

  const successRateColor = paymentPattern.successRate >= 80 ? 'positive' : 'negative';

  return (
    <Card>
      <Box padding="medium">
        <Heading level={3}>Payment Pattern</Heading>

        <Box marginTop="medium">
          <Inline>
            <Text size="xlarge" weight="bold">
              {paymentPattern.successRate.toFixed(1)}%
            </Text>
            <Badge type={successRateColor === 'positive' ? 'positive' : 'negative'}>
              Success Rate
            </Badge>
          </Inline>
        </Box>

        <Grid columns={2} marginTop="medium">
          <Box>
            <Text color="subdued" size="small">Total Payments</Text>
            <Text weight="medium">{paymentPattern.totalPayments}</Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Successful</Text>
            <Text weight="medium" color="positive">
              {paymentPattern.successfulPayments}
            </Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Failed</Text>
            <Text weight="medium" color="negative">
              {paymentPattern.failedPayments}
            </Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Avg Amount</Text>
            <Text weight="medium">
              {formatCurrency(paymentPattern.averagePaymentAmount, 'usd')}
            </Text>
          </Box>
        </Grid>

        {paymentPattern.preferredPaymentMethod && (
          <Box marginTop="medium">
            <Text color="subdued" size="small">Preferred Method</Text>
            <Badge>{paymentPattern.preferredPaymentMethod}</Badge>
          </Box>
        )}
      </Box>
    </Card>
  );
}

/**
 * Risk Assessment Card
 *
 * PM DECISION: How to present risk without alarming users?
 * - Use color coding (green/yellow/red)
 * - Provide context (why is this risky?)
 * - Suggest actions (what should merchant do?)
 */
function RiskAssessmentCard({ insights }: { insights: CustomerInsights }) {
  const { riskAssessment } = insights;

  const badgeType =
    riskAssessment.recommendation === 'low_risk'
      ? 'positive'
      : riskAssessment.recommendation === 'medium_risk'
      ? 'warning'
      : 'negative';

  return (
    <Card>
      <Box padding="medium">
        <Heading level={3}>Risk Assessment</Heading>

        <Box marginTop="medium">
          <Inline>
            <Text size="xlarge" weight="bold">
              {riskAssessment.score}/100
            </Text>
            <Badge type={badgeType}>
              {riskAssessment.recommendation.replace('_', ' ').toUpperCase()}
            </Badge>
          </Inline>
        </Box>

        {riskAssessment.factors.length > 0 && (
          <Box marginTop="medium">
            <Text weight="medium">Risk Factors:</Text>
            {riskAssessment.factors.map((factor, index) => (
              <Box key={index} marginTop="small">
                <Inline>
                  <Badge type={factor.severity === 'high' ? 'negative' : 'warning'}>
                    {factor.severity}
                  </Badge>
                  <Text size="small">{factor.description}</Text>
                </Inline>
              </Box>
            ))}
          </Box>
        )}

        {riskAssessment.factors.length === 0 && (
          <Box marginTop="medium">
            <Text color="positive">No risk factors detected</Text>
          </Box>
        )}
      </Box>
    </Card>
  );
}

/**
 * Subscription Health Card
 */
function SubscriptionHealthCard({ insights }: { insights: CustomerInsights }) {
  const { subscriptionHealth } = insights;

  return (
    <Card>
      <Box padding="medium">
        <Heading level={3}>Subscription Health</Heading>

        <Box marginTop="medium">
          <Text size="xlarge" weight="bold">
            {formatCurrency(subscriptionHealth.monthlyRecurringRevenue, 'usd')}
          </Text>
          <Text color="subdued" size="small">Monthly Recurring Revenue</Text>
        </Box>

        <Grid columns={3} marginTop="medium">
          <Box>
            <Text color="subdued" size="small">Active</Text>
            <Text weight="medium">{subscriptionHealth.activeSubscriptions}</Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Total</Text>
            <Text weight="medium">{subscriptionHealth.totalSubscriptions}</Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Churned</Text>
            <Text weight="medium">{subscriptionHealth.churnedSubscriptions}</Text>
          </Box>
        </Grid>

        {subscriptionHealth.nextBillingDate && (
          <Box marginTop="medium">
            <Text color="subdued" size="small">Next Billing</Text>
            <Text weight="medium">{formatDate(subscriptionHealth.nextBillingDate)}</Text>
          </Box>
        )}
      </Box>
    </Card>
  );
}

/**
 * Metadata Card
 */
function MetadataCard({ insights }: { insights: CustomerInsights }) {
  const { metadata } = insights;

  return (
    <Card>
      <Box padding="medium">
        <Heading level={3}>Customer Timeline</Heading>

        <Grid columns={2} marginTop="medium">
          <Box>
            <Text color="subdued" size="small">First Purchase</Text>
            <Text weight="medium">{formatDate(metadata.firstPurchaseDate)}</Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Last Purchase</Text>
            <Text weight="medium">{formatDate(metadata.lastPurchaseDate)}</Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Days Since Last Purchase</Text>
            <Text weight="medium">
              {metadata.daysSinceLastPurchase !== null
                ? `${metadata.daysSinceLastPurchase} days`
                : 'N/A'}
            </Text>
          </Box>
          <Box>
            <Text color="subdued" size="small">Total Transactions</Text>
            <Text weight="medium">{metadata.totalTransactions}</Text>
          </Box>
        </Grid>
      </Box>
    </Card>
  );
}
