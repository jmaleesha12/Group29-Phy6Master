/**
 * Stripe Payment API integration for React
 * Handles Stripe Checkout Session creation and session retrieval
 */

const API_BASE = '/api/student/stripe';

export interface StripeCheckoutRequest {
  studentId: number;
  classId: number;
  amount: number;
}

export interface StripeCheckoutResponse {
  sessionId: string;
  clientSecret: string;
  paymentId: number;
  redirectUrl?: string;
}

type StripeRedirectResult = {
  error?: {
    message?: string;
  };
};

type StripeGlobal = {
  redirectToCheckout: (options: { sessionId: string }) => Promise<StripeRedirectResult>;
};

function getStripeGlobal(): StripeGlobal | undefined {
  return (globalThis as typeof globalThis & { Stripe?: StripeGlobal }).Stripe;
}

/**
 * Create a Stripe Checkout Session
 * This returns the session ID that can be used to redirect to Stripe Checkout
 */
export async function createStripeCheckoutSession(
  request: StripeCheckoutRequest
): Promise<StripeCheckoutResponse> {
  const response = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create checkout session');
  }

  return response.json();
}

/**
 * Redirect to Stripe Checkout using Stripe.js
 * This uses the redirectToCheckout method from Stripe.js SDK
 */
export async function redirectToStripeCheckout(sessionId: string): Promise<void> {
  const stripe = getStripeGlobal();
  if (!stripe) {
    throw new Error('Stripe.js not loaded');
  }

  // Note: This assumes you've loaded Stripe.js with the public key
  // See main.tsx or your app setup for where Stripe.js is loaded
  const { error } = await stripe.redirectToCheckout({
    sessionId: sessionId,
  });

  if (error) {
    throw new Error(error.message);
  }
}
