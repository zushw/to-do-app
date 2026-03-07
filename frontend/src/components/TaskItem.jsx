export function TaskItem({ task, categoryName, onToggleComplete, onEdit, onDelete }) {
  return (
    <li className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          
          <div className="mt-1">
            <input
              type="checkbox" 
              checked={task.is_completed} 
              onChange={() => onToggleComplete(task)}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-medium ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {categoryName && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {categoryName}
                </span>
              )}
            </div>
            
            {task.description && (
              <p className="mt-1 text-sm text-gray-500">{task.description}</p>
            )}
            
            {task.is_completed && task.external_quote && (
              <blockquote className="mt-2 border-l-2 border-blue-300 bg-blue-50 pl-3 pr-2 py-1 text-sm italic text-blue-600 rounded-r">
                "{task.external_quote}"
              </blockquote>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
            <button 
              onClick={() => onEdit(task)} 
              className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(task)} 
              className="text-sm text-gray-400 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
        </div>
      </div>
    </li>
  );
}