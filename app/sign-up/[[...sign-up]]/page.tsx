import { SignUp } from "@clerk/nextjs";

import { AuthScreen, clerkAppearance } from "@/components/auth/auth-screen";

export default function SignUpPage() {
  return (
    <AuthScreen mode="sign-up">
      <SignUp
        appearance={clerkAppearance}
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </AuthScreen>
  );
}
