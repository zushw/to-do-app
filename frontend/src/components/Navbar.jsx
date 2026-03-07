export function Navbar({ user, onSignOut }) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">To-Do App</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, <strong className="text-gray-900">{user?.username}</strong>!
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