"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react" // For loading indicator
// Assuming authClient is from NextAuth.js client-side utilities
// If you're using `signIn` from `next-auth/react` directly, you might not need `authClient` here.
// For consistency with previous responses, I'll use `signIn` from `next-auth/react`.
import { signIn } from "next-auth/react";

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInDialog: React.FC<SignInDialogProps> = ({ isOpen, onClose }) => {
  const [googleIsLoading, setGoogleIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignInGoogle = async () => {
    setGoogleIsLoading(true);
    setError(""); // Clear previous errors
    try {
      // Use signIn from next-auth/react to initiate Google OAuth
      // The callbackUrl ensures the user is redirected back to the current page after sign-in.
      await signIn('google', { callbackUrl: window.location.href });
      // Note: `signIn` usually handles the redirect, so the lines below might not be reached immediately
    } catch (err: any) {
      console.error("Failed to initiate Google sign-in:", err);
      setError("Failed to initiate Google sign-in. Please try again.");
      setGoogleIsLoading(false); // Only set to false if the redirect doesn't happen
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Sign In to Report</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            You need to be signed in to report an issue.
            <br />
            Sign in with your Google account to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center gap-4">
          <Button
            className="w-full max-w-xs h-12 text-lg font-semibold flex items-center justify-center gap-2"
            variant="outline" // Use outline variant for social login button
            onClick={handleSignInGoogle}
            disabled={googleIsLoading}
            size="lg"
          >
            {googleIsLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                {/* Google SVG Icon */}
                <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign In with Google
              </>
            )}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
