export function PasswordChangeForm({
  currentPassword, setCurrentPassword, newPassword, setNewPassword,
  confirmPassword, setConfirmPassword, isLoading, message, onSubmit
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
      
      {message.text && (
        <div className={`mb-4 rounded p-3 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password" required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password" required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password" required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || currentPassword == newPassword}
            className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}