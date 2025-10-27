import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSun, FiMoon, FiCheck, FiTrash2, FiEdit2 } from 'react-icons/fi';

const SESSION_TYPES = [
  { 
    id: 'concept', 
    label: 'Concept', 
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    icon: '📚',
    description: 'Learn new concepts and theories'
  },
  { 
    id: 'practice', 
    label: 'Practice', 
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-100 dark:bg-green-900/20',
    icon: '💡',
    description: 'Solve practice problems'
  },
  { 
    id: 'review', 
    label: 'Review', 
    color: 'from-purple-500 to-fuchsia-500',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    icon: '🔄',
    description: 'Review previous topics'
  },
  { 
    id: 'challenge', 
    label: 'Challenge', 
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    icon: '🏆',
    description: 'Tackle challenging problems'
  }
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedType, setSelectedType] = useState('concept');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('dsa-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('dsa-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      type: selectedType,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium',
      timeEstimate: 30 // in minutes
    };

    setTasks([task, ...tasks]);
    setNewTask('');
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      } : task
    ));
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Start editing
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  // Save edit
  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: editText } : task
    ));
    setEditingId(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || task.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    progress: tasks.length > 0 ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DSA Study Planner
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 text-yellow-400" />
            ) : (
              <FiMoon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            value={stats.total}
            label="Total Tasks"
            color="bg-blue-500"
            icon="📋"
          />
          <StatCard 
            value={stats.completed}
            label="Completed"
            color="bg-green-500"
            icon="✅"
          />
          <StatCard 
            value={stats.pending}
            label="Pending"
            color="bg-yellow-500"
            icon="⏳"
          />
          <StatCard 
            value={`${stats.progress}%`}
            label="Progress"
            color="bg-purple-500"
            icon="📈"
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Study Progress</span>
            <span className="text-sm font-medium">{stats.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <motion.div 
              className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Add Task Form */}
        <motion.form 
          onSubmit={addTask}
          className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What do you want to study today?"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-white"
            >
              {SESSION_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {SESSION_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 transition-all ${
                  selectedType === type.id
                    ? `bg-gradient-to-r ${type.color} text-white`
                    : `${type.bg} text-gray-700 dark:text-gray-300 hover:shadow-md`
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </motion.form>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span>Filter</span>
              <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-2">
                  <p className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">Filter by type</p>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        setFilter('all');
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md ${
                        filter === 'all'
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      All Tasks
                    </button>
                    {SESSION_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setFilter(type.id);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center gap-2 ${
                          filter === type.id
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No tasks found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || filter !== 'all' 
                    ? 'Try adjusting your search or filter'
                    : 'Add your first task to get started!'
                  }
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => {
                const session = SESSION_TYPES.find(s => s.id === task.type) || SESSION_TYPES[0];
                
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className={`group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 shadow-sm transition-all duration-200 border border-white/20 dark:border-gray-700/50 ${
                      task.completed ? 'opacity-70' : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b ${session.color}`} />
                    
                    <div className="pl-5 pr-4 py-4">
                      <div className="flex items-start">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                          }`}
                          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {task.completed && <FiCheck className="w-3 h-3" />}
                        </button>
                        
                        <div className="ml-3 flex-1 min-w-0">
                          {editingId === task.id ? (
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onBlur={() => saveEdit(task.id)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                              className="w-full bg-transparent border-b-2 border-blue-500 focus:outline-none dark:bg-gray-800/50 dark:text-white"
                              autoFocus
                            />
                          ) : (
                            <p
                              className={`text-gray-800 dark:text-gray-200 ${
                                task.completed ? 'line-through text-gray-500 dark:text-gray-500' : ''
                              }`}
                              onDoubleClick={() => startEditing(task)}
                            >
                              {task.text}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${session.bg} text-${session.color.split('-')[1]}-700 dark:text-${session.color.split('-')[1]}-300`}>
                              {session.icon} {session.label}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                            {task.completed && task.completedAt && (
                              <span className="text-xs text-green-600 dark:text-green-400">
                                Completed on {new Date(task.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!task.completed && (
                            <button
                              onClick={() => startEditing(task)}
                              className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              aria-label="Edit task"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Delete task"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ value, label, color, icon }) {
  return (
    <motion.div 
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 dark:border-gray-700/50"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-gradient-to-br from-white/30 to-transparent ${color} bg-opacity-10 text-${color.split('-')[1]}-500`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
