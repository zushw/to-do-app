import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';

import { Navbar } from '../components/Navbar';
import { ProfileInfoForm } from '../components/ProfileInfoForm';
import { PasswordChangeForm } from '../components/PasswordChangeForm';

export function Profile() {
  const { user, signOut } = useContext(AuthContext);
  
  const {
    username, setUsername, email, setEmail,
    isProfileLoading, profileMessage, handleUpdateProfile,
    currentPassword, setCurrentPassword, newPassword, setNewPassword,
    confirmPassword, setConfirmPassword, isPasswordLoading, passwordMessage,
    handleChangePassword, handleDeleteAccount, isDeleting
  } = useProfile();

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Navbar user={user} onSignOut={signOut} />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Account Settings</h2>

        <div className="space-y-6">
          <ProfileInfoForm 
            username={username} setUsername={setUsername}
            email={email} setEmail={setEmail}
            isLoading={isProfileLoading} message={profileMessage}
            onSubmit={handleUpdateProfile}
          />

          <PasswordChangeForm 
            currentPassword={currentPassword} setCurrentPassword={setCurrentPassword}
            newPassword={newPassword} setNewPassword={setNewPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            isLoading={isPasswordLoading} message={passwordMessage}
            onSubmit={handleChangePassword}
          />
        </div>
        <div className="mt-10 border-t border-red-200 pt-8">
            <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
            <p className="mt-1 text-sm text-gray-500 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              data-testid="profile-delete-account-button"
              className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:bg-red-400"
            >
              {isDeleting ? 'Deleting account...' : 'Delete My Account'}
            </button>
          </div>
      </main>
    </div>
  );
}