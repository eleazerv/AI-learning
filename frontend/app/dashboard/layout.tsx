// app/dashboard/layout.tsx
"use client";
import { Suspense } from "react";
import DashboardLayout from "@/components/layout/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>

);
}