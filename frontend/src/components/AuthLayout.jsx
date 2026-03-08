import { Link } from 'react-router-dom';

export function AuthLayout({ title, subtitle, error, children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {children}

        <div className="mt-6 text-center text-sm text-gray-600">
          {footerText}{' '}
          <Link to={footerLinkTo} className="font-semibold text-blue-600 hover:text-blue-500">
            {footerLinkText}
          </Link>
        </div>

      </div>
    </div>
  );
}