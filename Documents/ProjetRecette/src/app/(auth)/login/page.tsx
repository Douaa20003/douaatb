import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="card-surface h-80 w-full max-w-md animate-pulse" />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
