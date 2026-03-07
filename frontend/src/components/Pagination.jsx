export function Pagination({ page, hasNext, hasPrev, onNext, onPrev }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 rounded-b-lg mt-auto">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <span className="text-sm font-medium text-gray-500">
        Page {page}
      </span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}