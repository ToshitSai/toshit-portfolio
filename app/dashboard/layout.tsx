import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return <DashboardShell>{children}</DashboardShell>;
  }

  const { userId } = await auth();
  if (!userId && process.env.NEXT_PUBLIC_REQUIRE_AUTH === "true") {
    redirect("/sign-in");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
