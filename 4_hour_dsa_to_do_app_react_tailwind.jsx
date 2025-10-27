/*
4-Hour DSA To-Do - Single-file React component (App.jsx)

Where to use
- Paste this file as `app/page.jsx` in a new Next.js 13+ (App Router) project,
  or use it as `src/App.jsx` in a Vite/CRA React app.

Features
- Create tasks with a Session Type (Concept / Light Practice / Deep Solve / Review)
- Track estimated minutes per task (helps fill your 4-hour quota)
- Persist tasks in localStorage
- Quick filters, reorder via up/down, bulk-complete, daily summary
- Export/import JSON

Styling
- Uses Tailwind CSS utility classes. If you paste into a project without Tailwind,
  either set up Tailwind or replace classNames with your own CSS.

Deploying to Vercel (quick)
1. Create a Next.js app locally (recommended for Vercel) or use Vite:
   npx create-next-app@latest my-4hour-dsa-todo
   (choose App Router)
2. Replace app/page.jsx with this component (and add tailwind per Next + Tailwind docs)
3. Push to GitHub: git init → git add . → git commit -m "init" → git push origin main
4. Go to https://vercel.com → Import Project → select your repo → Deploy

OR quick deploy (Vite):
1. npm create vite@latest my-todo -- --template react
2. add tailwind, replace src/App.jsx with this component
3. push to GitHub and import to Vercel

Notes
- This file is intentionally self-contained and focuses on functionality and UX.
- If you want a Next.js project with API routes (to store server-side), tell me and I can generate that next.
*/

'use client';
import React, { useEffect, useState, useRef } from 'react';

const SESSION_TYPES = [
  { id: 'concept', label: 'Concept Hour' },
  { id: 'light', label: 'Light Practice' },
  { id: 'deep', label: 'Deep Solve' },
  { id: 'review', label: 'Review' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(60);
  const [session, setSession] = useState('concept');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const mountedRef = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem('dsa_4h_tasks');
    if (raw) setTasks(JSON.parse(raw));
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    localStorage.setItem('dsa_4h_tasks', JSON.stringify(tasks));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">4‑Hour DSA Planner</h1>
          <div className="text-sm text-slate-600">Daily target: <span className="font-semibold">240</span> minutes</div>
        </header>

        <section className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title (e.g. Reverse linked list)"
              className="col-span-1 md:col-span-2 p-2 border rounded"
            />

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                min={5}
                className="p-2 border rounded w-28"
              />
              <div className="text-sm text-slate-500">mins</div>
            </div>

            <div className="flex items-center gap-2">
              <select value={session} onChange={e => setSession(e.target.value)} className="p-2 border rounded w-full">
                {SESSION_TYPES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <button onClick={addTask} className="ml-2 px-3 py-2 bg-slate-800 text-white rounded hover:opacity-95">Add</button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <div className="flex gap-2 items-center">
              <label className="flex items-center gap-1">Filter:
                <select value={filter} onChange={e => setFilter(e.target.value)} className="ml-1 p-1 border rounded text-sm">
                  <option value="all">All</option>
                  {SESSION_TYPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>

              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" className="p-1 border rounded text-sm" />
            </div>

            <div className="flex gap-2 items-center">
              <button onClick={bulkComplete} className="px-2 py-1 border rounded text-sm">Mark all done</button>
              <button onClick={clearCompleted} className="px-2 py-1 border rounded text-sm">Clear completed</button>
              <button onClick={exportJSON} className="px-2 py-1 border rounded text-sm">Export</button>
              <label className="px-2 py-1 border rounded bg-white text-sm cursor-pointer">
                Import
                <input onChange={importJSON} type="file" accept="application/json" className="hidden" />
              </label>
            </div>
          </div>
        </section>

        <main className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="font-semibold mb-3">Tasks ({filtered.length})</h2>

              {filtered.length === 0 && <div className="text-sm text-slate-500">No tasks — add something to start filling your 4 hours.</div>}

              <ul className="space-y-3">
                {filtered.map(task => (
                  <li key={task.id} className="flex items-start gap-3 p-3 border rounded">
                    <input type="checkbox" checked={task.done} onChange={() => toggleDone(task.id)} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-medium ${task.done ? 'line-through text-slate-400' : ''}`}>{task.title}</div>
                          <div className="text-xs text-slate-500">{SESSION_TYPES.find(s => s.id === task.session)?.label} • {task.minutes} mins</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => move(task.id, 'up')} className="px-2 py-1 border rounded text-xs">↑</button>
                          <button onClick={() => move(task.id, 'down')} className="px-2 py-1 border rounded text-xs">↓</button>
                          <button onClick={() => removeTask(task.id)} className="px-2 py-1 border rounded text-xs text-red-600">Del</button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="font-semibold mb-2">Daily Summary</h3>
              <div className="text-sm text-slate-600">Total planned minutes (incomplete): <strong>{totalMinutes}</strong></div>
              <div className="mt-2 text-sm">Remaining to reach 240 min: <strong>{remaining}</strong> mins</div>

              <div className="mt-3">
                {SESSION_TYPES.map(s => {
                  const sum = tasks.filter(t => t.session === s.id && !t.done).reduce((a, b) => a + Number(b.minutes || 0), 0);
                  return (
                    <div key={s.id} className="flex items-center justify-between text-sm py-1">
                      <div>{s.label}</div>
                      <div className="font-medium">{sum}m</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="font-semibold mb-2">Quick Tips</h3>
              <ol className="text-sm list-decimal ml-5 space-y-1 text-slate-600">
                <li>Prefer shorter tasks (20–60 min) — they'll fit Pomodoro cycles.</li>
                <li>Use the session tags to balance your day (Concept vs Deep).</li>
                <li>Review each night — mark what to carry forward.</li>
              </ol>
            </div>
          </aside>
        </main>

        <footer className="mt-6 text-sm text-slate-500 text-center">Built for your Nov DSA sprint — tweak it however you like.</footer>
      </div>
    </div>
  );
}
