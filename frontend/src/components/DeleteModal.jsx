export function DeleteModal({ isOpen, onClose, onConfirm, itemName, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900">Delete Item</h3>
        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete <strong className="text-gray-700">"{itemName}"</strong>? This action cannot be undone.
        </p>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-400"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}