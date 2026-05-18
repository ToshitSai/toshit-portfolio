import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)", "/api/publish(.*)", "/api/stripe(.*)"]);
const clerkProxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req) && process.env.NEXT_PUBLIC_REQUIRE_AUTH === "true") {
    await auth.protect();
  }
});

export default function proxy(req: NextRequest, event: Parameters<typeof clerkProxy>[1]) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    if (isProtectedRoute(req) && process.env.NEXT_PUBLIC_REQUIRE_AUTH === "true") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next();
  }

  return clerkProxy(req, event);
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
