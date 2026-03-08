import { useLogin } from '../hooks/useLogin';
import { AuthLayout } from '../components/AuthLayout';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';

export function Login() {
  const { username, setUsername, password, setPassword, error, isLoading, handleLogin } = useLogin();

  return (
    <AuthLayout
      title="To-Do App"
      subtitle="Sign in to manage your tasks"
      error={error}
      footerText="Don't have an account?"
      footerLinkText="Sign up here"
      footerLinkTo="/register"
      dataTestId="login"
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <FormInput id="username" dataTestId="login-username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <PasswordInput id="password" value={password} dataTestId="login" onChange={(e) => setPassword(e.target.value)} />
        
        <button
          type="submit"
          data-testid="login-submit-button"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold transition-colors hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
}