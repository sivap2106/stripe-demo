import { useState, useEffect } from "react";
import {
  ContextView,
  Badge,
  Box,
  Inline,
  Spinner,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { createHttpClient, STRIPE_API_KEY } from "@stripe/ui-extension-sdk/http_client";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: "2023-08-16",
});

// Define customer status types
type CustomerStatus = "vip" | "active" | "new" | "unknown";

interface StatusInfo {
  status: CustomerStatus;
  label: string;
  color: "positive" | "warning" | "neutral";
  description: string;
}

const CustomerDetails = ({ environment }: ExtensionContextValue) => {
  const customerId = environment?.objectContext?.id;
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    async function analyzeCustomer() {
      try {
        const [charges, subscriptions] = await Promise.all([
          stripe.charges.list({
            customer: customerId!,
            limit: 1,
          }),
          stripe.subscriptions.list({
            customer: customerId!,
            status: "active",
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
            color: "neutral",
            description: "No purchases yet",
          };
        }

        setStatusInfo(info);
      } catch (error: any) {
        console.error("Failed to analyze customer:", error?.message || error);
        setStatusInfo({
          status: "unknown",
          label: "Unknown",
          color: "neutral",
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
        <Box css={{ padding: "large", stack: "x", gap: "small", alignSelfX: "center" }}>
          <Spinner size="large" />
          <Box>Analyzing customer...</Box>
        </Box>
      </ContextView>
    );
  }

  if (!statusInfo) {
    return (
      <ContextView title="Customer Status">
        <Box>No data available</Box>
      </ContextView>
    );
  }

  return (
    <ContextView title="Customer Status">
      <Box css={{ padding: "large", stack: "y", gap: "medium" }}>
        <Inline css={{ alignSelfX: "center" }}>
          <Badge type={statusInfo.color}>
            {statusInfo.label}
          </Badge>
        </Inline>
        <Box>{statusInfo.description}</Box>
      </Box>
    </ContextView>
  );
};

export default CustomerDetails;
