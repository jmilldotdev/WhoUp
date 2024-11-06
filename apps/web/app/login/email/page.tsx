import { EmailPasswordForm } from "../../../components/EmailPasswordForm";

export default function EmailLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in with Email
          </h2>
        </div>
        <EmailPasswordForm />
      </div>
    </div>
  );
} 