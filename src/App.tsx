import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      return JSON.parse(saved).map((t: Todo) => ({
        ...t,
        createdAt: new Date(t.createdAt)
      }));
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: crypto.randomUUID(),
          text: inputValue.trim(),
          completed: false,
          createdAt: new Date()
        }
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const completedTodosCount = todos.filter(t => t.completed).length;

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-normal text-neutral-900 tracking-tight">
            Tasks
          </h1>
          <p className="text-neutral-400 mt-1 text-sm md:text-base">
            {activeTodosCount === 0
              ? 'All caught up'
              : `${activeTodosCount} task${activeTodosCount !== 1 ? 's' : ''} remaining`}
          </p>
        </header>

        {/* Input */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 md:gap-3 border-b border-neutral-200 pb-3 group focus-within:border-neutral-400 transition-colors">
            <span className="text-neutral-300 text-lg md:text-xl">+</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a task..."
              className="flex-1 outline-none text-neutral-900 placeholder:text-neutral-300 bg-transparent text-base md:text-lg min-w-0"
            />
            {inputValue && (
              <button
                onClick={addTodo}
                className="text-neutral-400 hover:text-neutral-600 transition-colors text-sm px-2 py-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                Add
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {todos.length > 0 && (
          <div className="flex items-center gap-1 mb-4 md:mb-6 -ml-2">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-sm capitalize rounded transition-colors min-h-[44px] ${
                  filter === f
                    ? 'text-neutral-900 bg-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-0">
          {filteredTodos.length === 0 && todos.length > 0 && (
            <div className="py-8 md:py-12 text-center text-neutral-300 text-sm">
              No {filter} tasks
            </div>
          )}

          {filteredTodos.length === 0 && todos.length === 0 && (
            <div className="py-12 md:py-20 text-center">
              <div className="text-neutral-200 text-5xl md:text-6xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">
                Your task list is empty
              </p>
            </div>
          )}

          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="group flex items-start gap-3 py-3 md:py-4 border-b border-neutral-100 hover:bg-neutral-50/50 -mx-3 px-3 transition-colors"
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`mt-0.5 w-5 h-5 min-w-[44px] min-h-[44px] flex items-center justify-center -m-2.5 rounded-sm border transition-all ${
                  todo.completed
                    ? 'border-neutral-300 bg-neutral-100'
                    : 'border-neutral-300 hover:border-neutral-400'
                }`}
              >
                {todo.completed && (
                  <svg className="w-3 h-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0 ml-2">
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditText('');
                      }
                    }}
                    onBlur={saveEdit}
                    autoFocus
                    className="w-full outline-none bg-transparent text-neutral-900 border-b border-neutral-300 pb-1 text-base"
                  />
                ) : (
                  <p
                    onClick={() => startEditing(todo)}
                    className={`cursor-text break-words text-base ${
                      todo.completed
                        ? 'text-neutral-400 line-through'
                        : 'text-neutral-900'
                    }`}
                  >
                    {todo.text}
                  </p>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-neutral-300 hover:text-neutral-500 min-w-[44px] min-h-[44px] flex items-center justify-center -m-2"
                style={{ opacity: 'var(--mobile-opacity, 1)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Clear Completed */}
        {completedTodosCount > 0 && (
          <div className="mt-6 md:mt-8 pt-4 border-t border-neutral-100">
            <button
              onClick={clearCompleted}
              className="text-neutral-400 hover:text-neutral-600 transition-colors text-sm min-h-[44px] px-2 -ml-2"
            >
              Clear {completedTodosCount} completed task{completedTodosCount !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 md:py-8 text-center">
        <p className="text-neutral-300 text-xs">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .group button[style*="--mobile-opacity"] {
            --mobile-opacity: 0.5 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
