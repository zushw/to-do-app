export function ProfileInfoForm({ 
  username, setUsername, email, setEmail, isLoading, message, onSubmit 
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
      
      {message.text && (
        <div className={`mb-4 rounded p-3 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text" required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={username} onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email" required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit" disabled={isLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}