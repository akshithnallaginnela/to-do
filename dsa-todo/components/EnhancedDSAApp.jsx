'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SESSION_TYPES = [
  { 
    id: 'concept', 
    label: 'Concept Hour',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    textColor: 'text-white',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  { 
    id: 'light', 
    label: 'Light Practice',
    color: 'bg-gradient-to-r from-green-500 to-emerald-500',
    textColor: 'text-white',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  { 
    id: 'deep', 
    label: 'Deep Solve',
    color: 'bg-gradient-to-r from-purple-500 to-fuchsia-500',
    textColor: 'text-white',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  { 
    id: 'review', 
    label: 'Review',
    color: 'bg-gradient-to-r from-amber-500 to-orange-500',
    textColor: 'text-white',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
];

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function EnhancedDSAApp() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(60);
  const [session, setSession] = useState('concept');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const mountedRef = useRef(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('dsa_4h_tasks');
      if (raw) setTasks(JSON.parse(raw));
      mountedRef.current = true;
    }
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (!mountedRef.current) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dsa_4h_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      minutes: Number(minutes) || 0,
      session,
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setTitle('');
    setMinutes(60);
    setSession('concept');
  };

  const toggleDone = id => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const move = (id, dir) => {
    setTasks(prev => {
      const i = prev.findIndex(t => t.id === id);
      if (i < 0) return prev;
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const arr = [...prev];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  };

  const bulkComplete = () => {
    setTasks(prev => prev.map(t => ({ ...t, done: true })));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.done));
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dsa_tasks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        if (Array.isArray(data)) setTasks(data);
        else alert('Invalid format: expected an array of tasks');
      } catch (err) {
        alert('Invalid JSON');
      }
    };
    reader.readAsText(file);
  };

  const filtered = tasks.filter(t => {
    if (filter !== 'all' && t.session !== filter) return false;
    if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const totalMinutes = tasks.reduce((s, t) => s + (t.done ? 0 : Number(t.minutes || 0)), 0);
  const remaining = Math.max(0, 240 - totalMinutes);
  const progress = Math.min(100, (totalMinutes / 240) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with Progress */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-100"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                DSA Study Tracker
              </h1>
              <p className="text-slate-500 mt-1">Master Data Structures & Algorithms in 4-hour daily sprints</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Daily Target</p>
                <p className="text-lg font-semibold text-indigo-700">{totalMinutes}<span className="text-sm text-slate-500">/240 min</span></p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-slate-500">
              <span>{remaining} minutes remaining</span>
              <span>{progress.toFixed(0)}% completed</span>
            </div>
          </div>
        </motion.header>

        {/* Add Task Form */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-100"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Add New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="Task title (e.g. Reverse linked list)"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-2 bg-slate-50 rounded-lg px-3">
              <input
                type="number"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                min={5}
                step={5}
                className="w-16 p-2 border-0 bg-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 rounded transition-all duration-200"
              />
              <div className="text-sm font-medium text-slate-500">minutes</div>
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <select 
                value={session} 
                onChange={e => setSession(e.target.value)} 
                className="flex-1 p-3 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer bg-white"
              >
                {SESSION_TYPES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <motion.button 
                onClick={addTask}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add Task</span>
              </motion.button>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <select 
                  value={filter} 
                  onChange={e => setFilter(e.target.value)} 
                  className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer text-sm"
                >
                  <option value="all">All Tasks</option>
                  {SESSION_TYPES.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                  placeholder="Search tasks..." 
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm h-[36px]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <motion.button 
                onClick={bulkComplete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark All Done
              </motion.button>
              
              <motion.button 
                onClick={clearCompleted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg border border-rose-100 text-sm font-medium hover:bg-rose-100 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Completed
              </motion.button>
              
              <motion.button 
                onClick={exportJSON}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 bg-white text-slate-700 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </motion.button>
              
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 bg-white text-slate-700 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import
                <input onChange={importJSON} type="file" accept="application/json" className="hidden" />
              </motion.label>
            </div>
          </div>
        </motion.section>

        <main className="grid lg:grid-cols-3 gap-6">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  My Tasks <span className="text-slate-400 font-normal">({filtered.length})</span>
                </h2>
                <div className="text-sm text-slate-500">
                  {totalMinutes} / 240 minutes planned
                </div>
              </div>

              {filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 px-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200"
                >
                  <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-700">No tasks yet</h3>
                  <p className="mt-1 text-sm text-slate-500">Add your first task to get started!</p>
                </motion.div>
              ) : (
                <motion.ul 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  <AnimatePresence>
                    {filtered.map((task) => {
                      const sessionType = SESSION_TYPES.find(s => s.id === task.session);
                      return (
                        <motion.li 
                          key={task.id}
                          variants={item}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`relative overflow-hidden ${task.done ? 'opacity-70' : 'opacity-100'}`}
                        >
                          <div className={`flex items-start p-4 rounded-xl transition-all duration-200 ${sessionType.bg} bg-opacity-20 border ${sessionType.border} border-opacity-50`}>
                            <div className="flex items-center h-5 mt-0.5">
                              <input
                                id={`task-${task.id}`}
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleDone(task.id)}
                                className={`h-4 w-4 rounded border-slate-300 ${sessionType.textColor} focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer`}
                              />
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <label 
                                htmlFor={`task-${task.id}`} 
                                className={`block text-sm font-medium ${task.done ? 'line-through text-slate-500' : 'text-slate-800'} cursor-pointer`}
                              >
                                {task.title}
                              </label>
                              <div className="flex items-center mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sessionType.textColor} ${sessionType.color}`}>
                                  {sessionType.label}
                                </span>
                                <span className="ml-2 text-xs text-slate-500">
                                  {task.minutes} mins
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex space-x-2">
                              <motion.button
                                onClick={() => move(task.id, 'up')}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                title="Move up"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </motion.button>
                              <motion.button
                                onClick={() => move(task.id, 'down')}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                title="Move down"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </motion.button>
                              <motion.button
                                onClick={() => removeTask(task.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-full text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                title="Delete task"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </motion.ul>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 border border-slate-100"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Summary</h3>
              
              <div className="mb-6">
                <div className="relative pt-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-700">Daily Progress</span>
                    <span className="text-xs font-semibold text-indigo-700">
                      {Math.min(100, Math.round((totalMinutes / 240) * 100))}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 bg-slate-100 rounded-full">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (totalMinutes / 240) * 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {totalMinutes} of 240 minutes ({remaining} minutes remaining)
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-700">Time by Session Type</h4>
                <div className="space-y-3">
                  {SESSION_TYPES.map(s => {
                    const sum = tasks
                      .filter(t => t.session === s.id && !t.done)
                      .reduce((a, b) => a + Number(b.minutes || 0), 0);
                    const percentage = (sum / 240) * 100;
                    
                    return (
                      <div key={s.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700">{s.label}</span>
                          <span className="font-semibold text-slate-700">{sum}m</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <motion.div 
                            className={`h-full rounded-full ${s.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-3">Quick Tips</h3>
              <ol className="space-y-3">
                {[
                  { 
                    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                    text: 'Prefer shorter tasks (20–60 min) — they fit Pomodoro cycles perfectly.'
                  },
                  { 
                    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                    text: 'Balance your day with a mix of Concept, Practice, and Review sessions.'
                  },
                  { 
                    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                    text: 'Review your progress each night and plan for tomorrow.'
                  },
                ].map((tip, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tip.icon} />
                      </svg>
                    </div>
                    <span className="text-sm text-indigo-100">{tip.text}</span>
                  </motion.li>
                ))}
              </ol>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 pt-4 border-t border-indigo-500 border-opacity-30"
              >
                <p className="text-xs text-indigo-200 text-center">
                  Stay consistent and track your progress daily!
                </p>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
