/**
 * App Entry Point
 *
 * This file is the entry point for the Stripe App.
 * It exports the view components that are referenced in stripe-app.json
 */

import CustomerInsights from './views/CustomerInsights';

// Export the main view component
// This is referenced in stripe-app.json under ui_extension.views
export default CustomerInsights;

// Note: In a real Stripe App, you might export multiple views:
// export { CustomerInsights, CustomerListInsights };
// Each view corresponds to a different viewport in the Stripe Dashboard
