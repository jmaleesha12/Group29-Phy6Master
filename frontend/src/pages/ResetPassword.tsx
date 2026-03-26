import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { confirmPasswordReset } from "@/lib/auth-api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenError(true);
    }
  }, [token]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(token, newPassword);
      setResetSuccess(true);
      toast.success("Password reset successfully!");
      
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reset password";
      toast.error(message);
      
      if (message.includes("expired")) {
        setTokenError(true);
      }
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
          
          {tokenError ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
                Link Expired
              </h1>
              <p className="text-muted-foreground text-sm mb-6 text-center">
                The password reset link has expired or is invalid. Please request a new reset link.
              </p>

              <Link to="/forgot-password">
                <Button className="w-full gradient-cta text-primary-foreground font-semibold py-3 text-base">
                  Request New Reset Link
                </Button>
              </Link>
            </>
          ) : resetSuccess ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
                Password Reset Successful
              </h1>
              <p className="text-muted-foreground text-sm mb-6 text-center">
                Your password has been reset successfully. You'll be redirected to the login page.
              </p>

              <Link to="/signin">
                <Button className="w-full gradient-cta text-primary-foreground font-semibold py-3 text-base">
                  Go to Sign In
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Set New Password
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-secondary border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-secondary border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long.
                </p>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-cta text-primary-foreground font-semibold py-3 text-base"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </form>

              <Link to="/signin">
                <p className="text-center text-sm text-primary mt-4 hover:underline">
                  Back to Sign In
                </p>
              </Link>
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
