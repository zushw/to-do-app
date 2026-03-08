export function TaskItem({ 
  task, currentUser, categoryName, onToggleComplete, onEdit, onDelete, onShareClick 
}) {
  const isOwner = task.owner_username === currentUser?.username;
  const isSharedWithMe = !isOwner;
  const isSharedWithOthers = isOwner && task.shared_with_usernames?.length > 0;

  return (
    <li data-testid={`task-row-${task.title}`} className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <input data-testid={`task-complete-checkbox-${task.title}`} type="checkbox" checked={task.is_completed} onChange={() => onToggleComplete(task)} className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h3 data-testid={`task-title-${task.title}`} className={`text-base font-medium ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              
              {categoryName && (
                <span data-testid={`task-category-${task.title}`} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {categoryName}
                </span>
              )}

              {isSharedWithMe && (
                <span data-testid={`task-shared-with-me-${task.title}`} className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 border border-purple-200" title={`Owned by ${task.owner_username}`}>
                  <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  From: {task.owner_username}
                </span>
              )}

              {isSharedWithOthers && (
                <span data-testid={`task-shared-with-others-${task.title}`} className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-200">
                  Shared ({task.shared_with_usernames.length})
                </span>
              )}
            </div>
            
            {task.description && <p data-testid={`task-description-${task.title}`} className="mt-1 text-sm text-gray-500">{task.description}</p>}

            {task.is_completed && task.external_quote && (
              <blockquote data-testid={`task-quote-${task.title}`} className="mt-2 border-l-2 border-blue-300 bg-blue-50 pl-3 pr-2 py-1 text-sm italic text-blue-600 rounded-r">
                "{task.external_quote}"
              </blockquote>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3 shrink-0 ml-4">
            <button data-testid={`edit-task-button-${task.title}`} onClick={() => onEdit(task)} className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">Edit</button>
            
            {isOwner && (
              <>
                <button data-testid={`share-task-button-${task.title}`} onClick={() => onShareClick(task)} className="text-sm font-medium text-gray-400 hover:text-green-600 transition-colors">Share</button>
                <button data-testid={`delete-task-button-${task.title}`} onClick={() => onDelete(task)} className="text-sm font-medium text-gray-400 hover:text-red-600 transition-colors">Delete</button>
              </>
            )}
        </div>
      </div>
    </li>
  );
}