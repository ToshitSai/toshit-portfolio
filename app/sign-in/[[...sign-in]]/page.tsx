import { SignIn } from "@clerk/nextjs";

import { AuthScreen, clerkAppearance } from "@/components/auth/auth-screen";

export default function SignInPage() {
  return (
    <AuthScreen mode="sign-in">
      <SignIn
        appearance={clerkAppearance}
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </AuthScreen>
  );
}
