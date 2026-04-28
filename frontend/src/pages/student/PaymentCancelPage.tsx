import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';

/**
 * PaymentCancelPage
 * Displayed after user cancels Stripe Checkout
 * - Stripe redirects here after user clicks "back" button: /student/payment-cancel?session_id=...
 * - Shows cancellation message
 * - Offers options to retry or go back
 */
const PaymentCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('session_id');
    setSessionId(id);
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Go back to the classes page where they can retry payment
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate('/student/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <Card className="w-full max-w-md border-2 border-orange-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-orange-600" />
          </div>
          <CardTitle className="text-2xl text-orange-700">Payment Cancelled</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Your payment was not completed
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cancellation Message */}
          <div className="rounded-lg bg-orange-50 p-4">
            <p className="text-sm text-gray-700">
              You have cancelled the Stripe checkout process. Your enrollment has NOT been confirmed,
              and you do not have access to the class yet.
            </p>
          </div>

          {/* Session ID (for reference) */}
          {sessionId && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Session ID</p>
              <p className="text-xs font-mono text-gray-700 break-all">{sessionId}</p>
            </div>
          )}

          {/* Information Box */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What Happens Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• No charge has been made to your card</li>
              <li>• Your enrollment is still PENDING</li>
              <li>• You can retry payment anytime</li>
              <li>• Or choose a different payment method</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleRetryPayment}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back & Retry Payment
            </Button>
            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Payment Options Note */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Available Payment Methods</h3>
            <p className="text-xs text-gray-600 mb-2">
              If you had issues with Stripe, you can use alternative payment methods:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• ATM Transfer (manual verification)</li>
              <li>• Bank Slip Upload (manual verification)</li>
              <li>• Try Stripe again with a different card</li>
            </ul>
          </div>

          {/* Support Note */}
          <p className="text-xs text-center text-gray-500">
            If you need assistance, please contact our support team or try a different payment method.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;
