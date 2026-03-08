import { useRegister } from '../hooks/useRegister';
import { AuthLayout } from '../components/AuthLayout';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';

export function Register() {
  const { username, setUsername, email, setEmail, password, setPassword, error, isLoading, handleRegister } = useRegister();

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us and start managing your tasks"
      error={error}
      footerText="Already have an account?"
      footerLinkText="Sign in here"
      footerLinkTo="/login"
    >
      <form onSubmit={handleRegister} className="space-y-6">
        <FormInput id="username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <FormInput id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} showTooltip={true} />
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-green-600 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </AuthLayout>
  );
}