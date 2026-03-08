import { useState } from 'react';

export function ShareModal({ 
  isOpen, onClose, task, onShare, onUnshare, isLoading, usersList 
}) {
  const [selectedUser, setSelectedUser] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen || !task) return null;

  const availableUsersToShare = usersList.filter(u => 
    u.username !== task.owner_username && 
    !task.shared_with_usernames?.includes(u.username)
  );

  const handleShare = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setMessage({ type: '', text: '' });
    
    try {
      const successMsg = await onShare(selectedUser);
      setMessage({ type: 'success', text: successMsg });
      setSelectedUser('');
    } catch (errorMsg) {
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleUnshare = async (usernameToRemove) => {
    setMessage({ type: '', text: '' });
    try {
      const successMsg = await onUnshare(usernameToRemove);
      setMessage({ type: 'success', text: successMsg });
    } catch (errorMsg) {
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Manage Access</h3>
          <button onClick={() => { onClose(); setMessage({type:'', text:''}); }} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-600 border-b pb-4">
          Task: <strong className="text-gray-900">{task.title}</strong>
        </p>

        {message.text && (
          <div className={`mb-4 rounded p-3 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Currently shared with</h4>
          {task.shared_with_usernames?.length === 0 ? (
            <p className="text-sm text-gray-500 italic">This task is private.</p>
          ) : (
            <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
              {task.shared_with_usernames?.map(username => (
                <li key={username} className="flex items-center justify-between p-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-700">{username}</span>
                  </div>
                  <button
                    onClick={() => handleUnshare(username)}
                    disabled={isLoading}
                    className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleShare} className="border-t pt-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Give access to</label>
          <div className="flex space-x-2">
            <select
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select a user...</option>
              {availableUsersToShare.map(u => (
                <option key={u.id || u.username} value={u.username}>{u.username}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isLoading || !selectedUser}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:bg-gray-300 transition-colors"
            >
              Share
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}