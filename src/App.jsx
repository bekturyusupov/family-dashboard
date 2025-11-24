import React, { useState, useEffect } from 'react';
import {
  Sun, Cloud, CloudRain, CloudSnow, Wind,
  Calendar, CheckSquare, Coffee, Utensils,
  Shirt, Clock, MapPin, Lock, Unlock, ArrowRight,
  Plus, Trash2
} from 'lucide-react';

// --- CONFIGURATION ---
const FAMILY_PIN = "1234"; // CHANGE THIS PIN
const FAMILY_NAME = "The Smiths";

// --- Helper Data ---

const INITIAL_KIDS = [
  {
    id: 1,
    name: 'Emma',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    schedule: [
      { time: '08:00 AM', activity: 'School Drop-off' },
      { time: '03:30 PM', activity: 'Soccer Practice' },
    ]
  },
  {
    id: 2,
    name: 'Noah',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    schedule: [
      { time: '08:15 AM', activity: 'School Drop-off' },
      { time: '04:00 PM', activity: 'Math Tutor' },
    ]
  }
];

const MOCK_LUNCH_MENU = {
  Monday: { main: 'Cheese Pizza', side: 'Caesar Salad', fruit: 'Apple Slices' },
  Tuesday: { main: 'Chicken Tacos', side: 'Black Beans', fruit: 'Pineapple' },
  Wednesday: { main: 'Spaghetti', side: 'Garlic Bread', fruit: 'Grapes' },
  Thursday: { main: 'Turkey Sub', side: 'Veggie Sticks', fruit: 'Orange' },
  Friday: { main: 'Fish Sticks', side: 'Mac & Cheese', fruit: 'Fruit Cup' },
};

// --- Sub-Components ---

const LoginScreen = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === FAMILY_PIN) {
      onLogin();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{FAMILY_NAME} Hub</h1>
        <p className="text-slate-500 mb-8">Enter PIN to access dashboard</p>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="4"
            className={`w-full text-center text-3xl tracking-[1em] font-bold py-4 rounded-xl border-2 outline-none transition-all ${
              error ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-200 focus:border-indigo-500'
            }`}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            autoFocus
          />
          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Unlock <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Dashboard State
  const [todos, setTodos] = useState([
    { id: 1, text: 'Pay electric bill', completed: false },
    { id: 2, text: 'Order groceries', completed: true },
  ]);
  const [chores, setChores] = useState([
    { id: 1, text: 'Empty dishwasher', assignedTo: 'Noah', completed: false },
    { id: 2, text: 'Fold laundry', assignedTo: 'Emma', completed: false },
  ]);
  const [activeKidId, setActiveKidId] = useState(INITIAL_KIDS[0].id);
  const [newTodo, setNewTodo] = useState('');
  const [newChore, setNewChore] = useState('');

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const addChore = (e) => {
    e.preventDefault();
    if (!newChore.trim()) return;
    setChores([...chores, { id: Date.now(), text: newChore, assignedTo: 'Anyone', completed: false }]);
    setNewChore('');
  };

  const toggleItem = (list, setList, id) => {
    setList(list.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const deleteItem = (list, setList, id) => {
    setList(list.filter(item => item.id !== id));
  };

  const getWeatherIcon = (condition) => {
     // Simplified weather logic
     return <Sun className="w-12 h-12 text-yellow-500" />;
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const activeKid = INITIAL_KIDS.find(k => k.id === activeKidId);
  const currentDayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 pb-20">
      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{FAMILY_NAME}</h1>
          <p className="text-slate-500 text-sm">Dashboard</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-light text-indigo-600">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-slate-400 flex items-center gap-1 ml-auto mt-1 hover:text-red-500"
          >
            <Lock size={12} /> Lock Screen
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">

        {/* Weather */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden col-span-1 md:col-span-2 lg:col-span-1">
          <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white h-full">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-4xl font-bold">72°</div>
                <div className="opacity-90">Sunny</div>
              </div>
              <div className="bg-white/20 p-2 rounded-full">{getWeatherIcon('Sunny')}</div>
            </div>
            <div className="mt-4 bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/20 flex gap-3">
              <Shirt className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">T-shirt weather! Don't forget sunscreen.</p>
            </div>
          </div>
        </div>

        {/* Kids Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 col-span-1 md:col-span-2 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500"/> Schedule</h2>
            <div className="flex gap-2">
              {INITIAL_KIDS.map(kid => (
                <button
                  key={kid.id}
                  onClick={() => setActiveKidId(kid.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                    activeKidId === kid.id ? kid.color : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  {kid.name}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {activeKid.schedule.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="bg-white px-2 py-1 rounded shadow-sm text-xs font-bold text-slate-600 w-20 text-center">{item.time}</span>
                <span className="text-sm font-medium text-slate-700">{item.activity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Todos */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-full flex flex-col">
          <h2 className="font-bold flex items-center gap-2 mb-3"><CheckSquare className="w-5 h-5 text-emerald-500"/> To-Do</h2>
          <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-48">
            {todos.map(t => (
              <div key={t.id} className="flex items-center gap-2 group">
                <button onClick={() => toggleItem(todos, setTodos, t.id)} className={`w-5 h-5 rounded border flex items-center justify-center ${t.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                  {t.completed && <CheckSquare className="w-3 h-3 text-white"/>}
                </button>
                <span className={`text-sm flex-1 ${t.completed ? 'line-through text-slate-400' : ''}`}>{t.text}</span>
                <button onClick={() => deleteItem(todos, setTodos, t.id)} className="opacity-0 group-hover:opacity-100 text-red-400"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
          <form onSubmit={addTodo} className="relative">
            <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Add task..." className="w-full bg-slate-50 rounded-lg py-2 px-3 text-sm pr-8 border-transparent focus:ring-2 focus:ring-emerald-100"/>
            <button type="submit" className="absolute right-2 top-2 text-emerald-500"><Plus size={16}/></button>
          </form>
        </div>

        {/* Chores */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-full flex flex-col">
          <h2 className="font-bold flex items-center gap-2 mb-3"><Utensils className="w-5 h-5 text-orange-500"/> Chores</h2>
          <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-48">
            {chores.map(c => (
              <div key={c.id} className="flex items-center gap-2 group">
                <button onClick={() => toggleItem(chores, setChores, c.id)} className={`w-5 h-5 rounded border flex items-center justify-center ${c.completed ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                  {c.completed && <CheckSquare className="w-3 h-3 text-white"/>}
                </button>
                <div className="flex-1 leading-none">
                  <span className={`text-sm ${c.completed ? 'line-through text-slate-400' : ''}`}>{c.text}</span>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{c.assignedTo}</div>
                </div>
                <button onClick={() => deleteItem(chores, setChores, c.id)} className="opacity-0 group-hover:opacity-100 text-red-400"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
          <form onSubmit={addChore} className="relative">
            <input value={newChore} onChange={e => setNewChore(e.target.value)} placeholder="Add chore..." className="w-full bg-slate-50 rounded-lg py-2 px-3 text-sm pr-8 border-transparent focus:ring-2 focus:ring-orange-100"/>
            <button type="submit" className="absolute right-2 top-2 text-orange-500"><Plus size={16}/></button>
          </form>
        </div>

        {/* Lunch Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 col-span-1 md:col-span-2 lg:col-span-4">
           <h2 className="font-bold flex items-center gap-2 mb-4"><Coffee className="w-5 h-5 text-red-500"/> Lunch Menu</h2>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className={`p-3 rounded-xl border ${currentDayName === day ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">{day}</div>
                   <div className="font-bold text-sm text-slate-800 leading-tight">{MOCK_LUNCH_MENU[day]?.main}</div>
                   <div className="text-xs text-slate-500 mt-1">{MOCK_LUNCH_MENU[day]?.side}</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}