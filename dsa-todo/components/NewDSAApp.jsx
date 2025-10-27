'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiSun, FiMoon, FiCheck, FiTrash2, FiEdit2, FiClock, FiCalendar, FiChevronDown, FiChevronUp, FiCheckCircle, FiCircle } from 'react-icons/fi';

const SESSION_TYPES = [
  { 
    id: 'concept', 
    label: 'Concept Hour',
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-white',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: '📚',
    description: 'Learn new concepts and theory'
  },
  { 
    id: 'light', 
    label: 'Light Practice',
    color: 'from-green-500 to-emerald-500',
    textColor: 'text-white',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: '💡',
    description: 'Reinforce concepts with practice'
  },
  { 
    id: 'deep', 
    label: 'Deep Solve',
    color: 'from-purple-500 to-fuchsia-500',
    textColor: 'text-white',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    icon: '🧠',
    description: 'Tackle challenging problems'
  },
  { 
    id: 'review', 
    label: 'Review',
    color: 'from-amber-500 to-orange-500',
    textColor: 'text-white',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    icon: '🔄',
    description: 'Revise and reinforce learning'
  },
];

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      when: "beforeChildren"
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  show: { 
    scale: 1, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 20 
    } 
  }
};

export default function NewDSAApp() {
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dsa-tasks');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [newTask, setNewTask] = useState('');
  const [selectedType, setSelectedType] = useState('concept');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const inputRef = useRef(null);

  // Toggle dark mode with system preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Update dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);
  
  // Save tasks to localStorage with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('dsa-tasks', JSON.stringify(tasks));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [tasks]);
  
  // Filter tasks based on filter and search query
  const filteredTasks = useCallback(() => {
    return tasks.filter(task => {
      const matchesFilter = filter === 'all' || task.type === filter;
      const matchesSearch = task.text.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, query]);
  
  // Calculate task statistics
  const taskStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      completed,
      progress,
      pending: total - completed
    };
  }, [tasks]);
  
  // Task management functions
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const taskText = newTask.trim();
    const newTaskObj = {
      id: Date.now(),
      text: taskText,
      type: selectedType,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium',
      timeEstimate: 30, // in minutes
      notes: ''
    };
    
    setTasks(prevTasks => [newTaskObj, ...prevTasks]);
    setNewTask('');
    setSelectedType('concept');
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const toggleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompletedState = !task.completed;
        return { 
          ...task, 
          completed: newCompletedState,
          completedAt: newCompletedState ? new Date().toISOString() : null
        };
      }
      return task;
    }));
  };
  
  const deleteTask = (id, event) => {
    if (event) event.stopPropagation();
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const startEditing = (task, event) => {
    if (event) event.stopPropagation();
    setEditingId(task.id);
    setEditText(task.text);
    
    setTimeout(() => {
      const input = document.querySelector(`#edit-input-${task.id}`);
      if (input) {
        input.focus();
        input.select();
      }
    }, 10);
  };
  
  const saveEdit = (id) => {
    if (!editText.trim()) return;
    
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: editText.trim() } : task
    ));
    
    setEditingId(null);
    setEditText('');
  };
  
  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };
  
  const toggleTaskExpand = (id) => {
    setExpandedTask(expandedTask === id ? null : id);
  };
  
  const updateTaskTime = (id, minutes) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, timeEstimate: Math.max(5, (task.timeEstimate || 30) + minutes) } : task
    ));
  };
  
  const updateTaskPriority = (id, priority) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
  };
  
  const updateTaskNotes = (id, notes) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, notes } : task
    ));
  };
  
  const stats = taskStats();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${darkMode ? 'dark text-white' : 'text-gray-900'}`}>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="absolute inset-0 opacity-30 dark:opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
        
        {/* Floating gradient orbs */}
        <motion.div 
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 opacity-30 dark:opacity-10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-pink-300 to-amber-200 opacity-30 dark:opacity-10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </div>
      <div className="container relative mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.header 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              DSA Study Planner
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Track your 4-hour DSA study sessions</p>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 text-yellow-400" />
            ) : (
              <FiMoon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </motion.header>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
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
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          variants={fadeIn}
        >
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
        </motion.div>

        {/* Add Task Form */}
        <motion.form 
          onSubmit={addTask}
          className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50"
          variants={slideUp}
          whileHover={{ 
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What do you want to study today?"
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  ref={inputRef}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  disabled={!newTask.trim()}
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none w-full md:w-48 px-4 py-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
                >
                  {SESSION_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <FiChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {SESSION_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`px-3 py-1.5 text-sm rounded-full flex items-center space-x-1 transition-all ${
                    selectedType === type.id
                      ? `bg-gradient-to-r ${type.color} text-white`
                      : `${type.bg} ${type.border} border text-gray-700 dark:text-gray-300 hover:shadow-md`
                  }`}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.form>

        {/* Filters and Search */}
        <motion.div 
          className="mb-6"
          variants={fadeIn}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiFilter className="w-4 h-4" />
                  <span>Filter</span>
                  {showFilters ? (
                    <FiChevronUp className="w-4 h-4" />
                  ) : (
                    <FiChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                <AnimatePresence>
                  {showFilters && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2">
                        <p className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">Filter by type</p>
                        <div className="space-y-3 relative z-10">
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
                              className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center space-x-2 ${
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button
                onClick={() => {
                  const completed = confirm('Are you sure you want to clear all completed tasks?');
                  if (completed) {
                    setTasks(tasks.filter(task => !task.completed));
                  }
                }}
                disabled={!tasks.some(task => task.completed)}
                className="px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Clear Completed
              </button>
            </div>
          </div>
          
          {filter !== 'all' && (
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing: {SESSION_TYPES.find(t => t.id === filter)?.label} tasks
              </span>
              <button
                onClick={() => setFilter('all')}
                className="ml-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                (Clear filter)
              </button>
            </div>
          )}
        </motion.div>

        {/* Task List */}
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
          layout
        >
          <AnimatePresence>
            {filteredTasks().length === 0 ? (
              <motion.div 
                className="text-center py-12 text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-5xl mb-4">📭</div>
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm">
                  {query 
                    ? 'Try a different search term' 
                    : filter !== 'all' 
                      ? `No ${SESSION_TYPES.find(t => t.id === filter)?.label.toLowerCase()} tasks yet`
                      : 'Add a task to get started!'
                  }
                </p>
              </motion.div>
            ) : (
              filteredTasks().map((task) => {
                const sessionType = SESSION_TYPES.find(t => t.id === task.type) || SESSION_TYPES[0];
                const isExpanded = expandedTask === task.id;
                
                return (
                  <motion.div
                    key={task.id}
                    layout
                    variants={item}
                    className={`group relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 shadow-sm transition-all duration-200 border border-white/20 dark:border-gray-700/50 ${
                      task.completed 
                        ? 'opacity-70 hover:opacity-100' 
                        : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div 
                      className={`absolute top-0 left-0 h-full w-1.5 ${
                        task.completed 
                          ? 'bg-green-500' 
                          : `bg-gradient-to-b ${sessionType.color}`
                      }`}
                    />
                    
                    <div className="pl-5 pr-4 py-4 relative z-10">
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
                        
                        <div 
                          className="ml-3 flex-1 min-w-0 cursor-pointer"
                          onClick={() => toggleTaskExpand(task.id)}
                        >
                          {editingId === task.id ? (
                            <div className="flex items-center">
                              <input
                                id={`edit-input-${task.id}`}
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, task.id)}
                                onBlur={() => saveEdit(task.id)}
                                className="w-full px-2 py-1 border-b-2 border-blue-500 bg-transparent focus:outline-none focus:ring-0"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <p 
                              className={`text-sm md:text-base ${
                                task.completed 
                                  ? 'line-through text-gray-500 dark:text-gray-500' 
                                  : 'text-gray-800 dark:text-gray-200'
                              }`}
                            >
                              {task.text}
                            </p>
                          )}
                          
                          <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.completed 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : `${sessionType.bg} ${sessionType.border} text-${sessionType.color.split(' ')[0].replace('from-', '')}-700 dark:text-${sessionType.color.split(' ')[0].replace('from-', '')}-300`
                            }`}>
                              {sessionType.icon} {sessionType.label}
                            </span>
                            
                            <span className="flex items-center">
                              <FiClock className="mr-1 w-3 h-3" />
                              {task.timeEstimate || 30} min
                            </span>
                            
                                            <span className="flex items-center">
                              <FiCalendar className="mr-1 w-3 h-3" />
                              {new Date(task.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            
                            {task.completed && task.completedAt && (
                              <span className="flex items-center text-green-600 dark:text-green-400">
                                <FiCheckCircle className="mr-1 w-3 h-3" />
                                {new Date(task.completedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-2 flex items-center space-x-1">
                          <button
                            onClick={(e) => startEditing(task, e)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Edit task"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => deleteTask(task.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Delete task"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleTaskExpand(task.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label={isExpanded ? 'Collapse task' : 'Expand task'}
                          >
                            {isExpanded ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex flex-col space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Time Estimate
                                  </label>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => updateTaskTime(task.id, -5)}
                                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                      disabled={(task.timeEstimate || 30) <= 5}
                                    >
                                      -5 min
                                    </button>
                                    <span className="w-16 text-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                                      {task.timeEstimate || 30} min
                                    </span>
                                    <button
                                      onClick={() => updateTaskTime(task.id, 5)}
                                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                      +5 min
                                    </button>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Priority
                                  </label>
                                  <div className="flex space-x-2">
                                    {['low', 'medium', 'high'].map((priority) => (
                                      <button
                                        key={priority}
                                        onClick={() => updateTaskPriority(task.id, priority)}
                                        className={`px-3 py-1 text-xs rounded-full capitalize ${
                                          task.priority === priority
                                            ? priority === 'high'
                                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                              : priority === 'medium'
                                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                      >
                                        {priority}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Notes
                                  </label>
                                  <textarea
                                    value={task.notes || ''}
                                    onChange={(e) => updateTaskNotes(task.id, e.target.value)}
                                    placeholder="Add notes..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="2"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty state illustration when no tasks */}
        {tasks.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-block p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first DSA task
            </p>
            <button
              onClick={() => inputRef.current?.focus()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Task
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ value, label, color, icon }) {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
      variants={fadeIn}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-gradient-to-br from-white/30 to-transparent backdrop-blur-sm shadow-sm ${color} bg-opacity-10 text-${color.split('-')[1]}-500`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 backdrop-blur-sm bg-white/10 dark:bg-black/10 p-2 rounded-lg">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}
