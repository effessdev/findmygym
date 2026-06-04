import SignInWithGitHub from "@/components/ui/social-sign-in"
import { SiGoogle } from "react-icons/si"

export default function SignInPage() {
  return (
    <SignInWithGitHub provider="google">
      <SiGoogle /> Sign in with Google
    </SignInWithGitHub>
  )
}
