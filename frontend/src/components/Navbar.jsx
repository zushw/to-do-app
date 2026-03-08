import { Link, useLocation } from 'react-router-dom';

export function Navbar({ user, onSignOut }) {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-blue-600">To-Do App</h1>
            
            <div className="hidden sm:flex space-x-4">
              <Link 
                to="/dashboard" 
                className={`font-medium ${!isProfilePage ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome,{' '}
              <Link to="/profile" className="font-bold text-gray-900 hover:text-blue-600 hover:underline">
                {user?.username}
              </Link>!
            </span>
            <button 
              onClick={onSignOut} 
              className="rounded bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}