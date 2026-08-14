import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Log in or create your Sol account.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
