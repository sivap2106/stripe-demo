/**
 * Customer Insights Dashboard Component
 *
 * Shows LTV, payment patterns, risk assessment,
 * and subscription health for the current customer.
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Badge,
  ContextView,
  Divider,
  Inline,
  Spinner,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { CustomerInsights } from '../types';
import { formatCurrency, formatDate, calculateCustomerInsights } from '../utils/calculations';
import { fetchCustomerDataWithCache } from '../api/stripeClient';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

const CustomerInsightsView = ({ environment }: ExtensionContextValue) => {
  const customerId = environment?.objectContext?.id;

  const [insights, setInsights] = useState<CustomerInsights | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    async function loadInsights() {
      setLoadingState('loading');
      setError(null);

      try {
        const data = await fetchCustomerDataWithCache(customerId!);
        const calculated = calculateCustomerInsights(data);
        setInsights(calculated);
        setLoadingState('success');
      } catch (err) {
        console.error('Failed to load insights:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoadingState('error');
      }
    }

    loadInsights();
  }, [customerId]);

  if (loadingState === 'loading') {
    return (
      <ContextView title="Customer Insights">
        <Box css={{ stack: "x", gap: "small", alignSelfX: "center", padding: "large" }}>
          <Spinner size="large" />
          <Box>Loading customer insights...</Box>
        </Box>
      </ContextView>
    );
  }

  if (loadingState === 'error') {
    return (
      <ContextView title="Customer Insights">
        <Box css={{ padding: "large", stack: "y", gap: "medium" }}>
          <Box css={{ font: "heading" }}>Error Loading Insights</Box>
          <Box css={{ color: "critical" }}>{error}</Box>
        </Box>
      </ContextView>
    );
  }

  if (!insights) {
    return (
      <ContextView title="Customer Insights">
        <Box css={{ padding: "large" }}>No insights available</Box>
      </ContextView>
    );
  }

  return (
    <ContextView title="Customer Insights">
      <Box css={{ stack: "y", gap: "large", padding: "medium" }}>
        {/* Lifetime Value */}
        <Box css={{ stack: "y", gap: "small" }}>
          <Box css={{ font: "heading" }}>Lifetime Value</Box>
          <Box css={{ font: "heading", color: "primary" }}>
            {formatCurrency(insights.lifetimeValue.total, insights.lifetimeValue.currency)}
          </Box>
          <Box css={{ stack: "x", gap: "large" }}>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>One-time</Box>
              <Box>{formatCurrency(insights.lifetimeValue.breakdown.oneTime, insights.lifetimeValue.currency)}</Box>
            </Box>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Subscription</Box>
              <Box>{formatCurrency(insights.lifetimeValue.breakdown.subscription, insights.lifetimeValue.currency)}</Box>
            </Box>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Refunded</Box>
              <Box>{formatCurrency(insights.lifetimeValue.breakdown.refunded, insights.lifetimeValue.currency)}</Box>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Payment Pattern */}
        <Box css={{ stack: "y", gap: "small" }}>
          <Box css={{ font: "heading" }}>Payment Pattern</Box>
          <Inline>
            <Box css={{ font: "heading" }}>
              {insights.paymentPattern.successRate.toFixed(1)}%
            </Box>
            <Badge type={insights.paymentPattern.successRate >= 80 ? "positive" : "negative"}>
              Success Rate
            </Badge>
          </Inline>
          <Box css={{ stack: "x", gap: "large" }}>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Total</Box>
              <Box>{insights.paymentPattern.totalPayments}</Box>
            </Box>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Successful</Box>
              <Box>{insights.paymentPattern.successfulPayments}</Box>
            </Box>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Failed</Box>
              <Box>{insights.paymentPattern.failedPayments}</Box>
            </Box>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Avg Amount</Box>
              <Box>{formatCurrency(insights.paymentPattern.averagePaymentAmount, 'usd')}</Box>
            </Box>
          </Box>
          {insights.paymentPattern.preferredPaymentMethod && (
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Preferred Method</Box>
              <Badge type="info">{insights.paymentPattern.preferredPaymentMethod}</Badge>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Risk Assessment */}
        <Box css={{ stack: "y", gap: "small" }}>
          <Box css={{ font: "heading" }}>Risk Assessment</Box>
          <Inline>
            <Box css={{ font: "heading" }}>{insights.riskAssessment.score}/100</Box>
            <Badge type={
              insights.riskAssessment.recommendation === 'low_risk' ? 'positive' :
              insights.riskAssessment.recommendation === 'medium_risk' ? 'warning' : 'negative'
            }>
              {insights.riskAssessment.recommendation.replace('_', ' ').toUpperCase()}
            </Badge>
          </Inline>
          {insights.riskAssessment.factors.length > 0 ? (
            <Box css={{ stack: "y", gap: "small" }}>
              {insights.riskAssessment.factors.map((factor, i) => (
                <Inline key={i}>
                  <Badge type={factor.severity === 'high' ? 'negative' : 'warning'}>
                    {factor.severity}
                  </Badge>
                  <Box css={{ font: "caption" }}>{factor.description}</Box>
                </Inline>
              ))}
            </Box>
          ) : (
            <Box css={{ color: "info" }}>No risk factors detected</Box>
          )}
        </Box>

        {/* Subscription Health */}
        {insights.subscriptionHealth.totalSubscriptions > 0 && (
          <>
            <Divider />
            <Box css={{ stack: "y", gap: "small" }}>
              <Box css={{ font: "heading" }}>Subscription Health</Box>
              <Box css={{ font: "heading" }}>
                {formatCurrency(insights.subscriptionHealth.monthlyRecurringRevenue, 'usd')}
              </Box>
              <Box css={{ font: "caption", color: "secondary" }}>Monthly Recurring Revenue</Box>
              <Box css={{ stack: "x", gap: "large" }}>
                <Box css={{ stack: "y" }}>
                  <Box css={{ font: "caption", color: "secondary" }}>Active</Box>
                  <Box>{insights.subscriptionHealth.activeSubscriptions}</Box>
                </Box>
                <Box css={{ stack: "y" }}>
                  <Box css={{ font: "caption", color: "secondary" }}>Total</Box>
                  <Box>{insights.subscriptionHealth.totalSubscriptions}</Box>
                </Box>
                <Box css={{ stack: "y" }}>
                  <Box css={{ font: "caption", color: "secondary" }}>Churned</Box>
                  <Box>{insights.subscriptionHealth.churnedSubscriptions}</Box>
                </Box>
              </Box>
              {insights.subscriptionHealth.nextBillingDate && (
                <Box css={{ stack: "y" }}>
                  <Box css={{ font: "caption", color: "secondary" }}>Next Billing</Box>
                  <Box>{formatDate(insights.subscriptionHealth.nextBillingDate)}</Box>
                </Box>
              )}
            </Box>
          </>
        )}

        <Divider />

        {/* Customer Timeline */}
        <Box css={{ stack: "y", gap: "small" }}>
          <Box css={{ font: "heading" }}>Customer Timeline</Box>
          <Box css={{ stack: "x", gap: "large" }}>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>First Purchase</Box>
              <Box>{formatDate(insights.metadata.firstPurchaseDate)}</Box>
            </Box>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Last Purchase</Box>
              <Box>{formatDate(insights.metadata.lastPurchaseDate)}</Box>
            </Box>
          </Box>
          <Box css={{ stack: "x", gap: "large" }}>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Days Since Last</Box>
              <Box>
                {insights.metadata.daysSinceLastPurchase !== null
                  ? `${insights.metadata.daysSinceLastPurchase} days`
                  : 'N/A'}
              </Box>
            </Box>
            <Box css={{ stack: "y" }}>
              <Box css={{ font: "caption", color: "secondary" }}>Total Transactions</Box>
              <Box>{insights.metadata.totalTransactions}</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ContextView>
  );
};

export default CustomerInsightsView;
