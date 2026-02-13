import { useState, useEffect, useCallback } from "react";
import {
  Box,
  ContextView,
  Banner,
  Spinner,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { createHttpClient, STRIPE_API_KEY } from "@stripe/ui-extension-sdk/http_client";
import Stripe from "stripe";
import BrandIcon from "./brand_icon.svg";

/**
 * Use the SDK's built-in HTTP client — it authenticates through the
 * Dashboard session so you never need a secret key in the frontend.
 */
const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: "2023-08-16",
});

const CustomerDetails = ({
  userContext,
  environment,
}: ExtensionContextValue) => {
  const customerId = environment?.objectContext?.id;
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    async function fetchCustomer() {
      try {
        const customer = await stripe.customers.retrieve(customerId!);

        // Type guard (customer might be deleted)
        if (customer.deleted) {
          setCustomerName("Deleted Customer");
        } else {
          setCustomerName(customer.name || customer.email || "Unknown");
        }
      } catch (error: any) {
        console.error("Failed to fetch customer:", error?.message || error);
        console.error("Full error:", JSON.stringify(error, null, 2));
        setCustomerName("Error loading");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, [customerId]);

  if (loading) {
    return (
      <ContextView title="Hello World" brandIcon={BrandIcon}>
        <Box css={{ padding: "medium" }}>
          <Spinner size="large" />
        </Box>
      </ContextView>
    );
  }

  return (
    <ContextView title="Hello World" brandIcon={BrandIcon}>
      <Banner
        type="default"
        title={`Hello, ${customerName}! 👋`}
        description={`Customer ID: ${customerId}`}
      />
    </ContextView>
  );
};

export default CustomerDetails;
