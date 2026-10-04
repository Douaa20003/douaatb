import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="card-surface h-96 w-full max-w-md animate-pulse" />}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
