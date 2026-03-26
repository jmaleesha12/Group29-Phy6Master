import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { requestPasswordReset } from "@/lib/auth-api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setResetSent(true);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to process password reset";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-cta flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">Phy6 Master</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/signin">
            <Button variant="outline" className="border-border text-foreground text-sm">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card border border-border p-8 shadow-card">
          
          {!resetSent ? (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Reset Your Password
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      placeholder="e.g., alex@university.com"
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-cta text-primary-foreground font-semibold py-3 text-base"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <Link to="/signin">
                <p className="text-center text-sm text-primary mt-4 hover:underline flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </p>
              </Link>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
                Check Your Email
              </h1>
              <p className="text-muted-foreground text-sm mb-6 text-center">
                We've sent a password reset link to <strong>{email}</strong>. 
                Click the link in the email to reset your password.
              </p>
              <p className="text-muted-foreground text-xs text-center mb-6">
                If you don't see an email in your inbox, check your spam folder.
              </p>

              <Button
                onClick={() => navigate("/signin")}
                className="w-full gradient-cta text-primary-foreground font-semibold py-3 text-base"
              >
                Back to Sign In
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Didn't receive the email?{" "}
                <button
                  onClick={() => setResetSent(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Try again
                </button>
              </p>
            </>
          )}
        </motion.div>
      </div>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground mt-auto">
        © 2024 Phy6 Master Inc. All rights reserved. <span className="mx-2">|</span> Help Center <span className="mx-2">|</span> Contact Support
      </footer>
    </div>
  );
}
