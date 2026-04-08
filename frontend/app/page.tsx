import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import { Profile } from "@/components/profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-start justify-start">
      {/* <p>asdhsauidhsadasd</p>
      <Suspense fallback={<div>Loading...</div>}>
        <Profile />
      </Suspense> */}
      <div className="overflow-hidden bg-gray-900 w-full h-screen py-16 px-16">
        <div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-pretty text-white sm:text-5xl">
            AssistEdu
          </h1>
          <p className="text-base/7 font-semibold text-indigo-400">Deskripsi</p>
          <p className="text-lg/8 text-white">Upgrade your study with us.</p>
          <Button asChild size="sm" variant={"outline"} className="mt-4">
            <Link href="/auth/login">START NOW</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
