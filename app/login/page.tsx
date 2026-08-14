import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/sol/AuthForm";

export const metadata: Metadata = {
  title: "Sign in | Sol",
  description: "Log in or create your Sol account.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
