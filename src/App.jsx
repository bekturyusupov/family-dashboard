import React, { useState, useEffect } from 'react';
import {
  Sun, Cloud, CloudRain, CloudSnow, Calendar, CheckSquare,
  Coffee, Utensils, Shirt, Lock, ArrowRight, Trash2, Plus,
  Loader2, MapPin
} from 'lucide-react';

// --- CONFIGURATION ---
const FAMILY_PIN = "0000";
const FAMILY_NAME = "The Yusupov Family";
const CITY_NAME = "Buffalo Grove";
// Coordinates for Buffalo Grove, IL
const LAT = 42.1663;
const LON = -87.9622;

// --- Helper Data ---
const INITIAL_KIDS = [
  {
    id: 1,
    name: 'Safiya',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    schedule: [
      { time: '08:25 AM', activity: 'School Drop-off' },
      { time: '04:40 PM', activity: 'Ice Skating' },
    ]
  },
  {
    id: 2,
    name: 'Dariya',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    schedule: [
      { time: '08:25 AM', activity: 'School Drop-off' },
      { time: '04:40 PM', activity: 'Ice Skating' },
    ]
  }
];

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
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{FAMILY_NAME} Hub</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            maxLength="4"
            className={`w-full text-center text-3xl tracking-[1em] font-bold py-4 rounded-xl border-2 outline-none mb-6 ${error ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'}`}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            autoFocus
          />
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2">
            Unlock <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data State
  const [weather, setWeather] = useState(null);
  const [lunchMenu, setLunchMenu] = useState({});
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [activeKidId, setActiveKidId] = useState(INITIAL_KIDS[0].id);

  // Todo/Chore State
  const [todos, setTodos] = useState([{ id: 1, text: 'Check the dashboard', completed: false }]);
  const [newTodo, setNewTodo] = useState('');
  const [chores, setChores] = useState([
    { id: 1, text: 'Empty dishwasher', assignedTo: 'Noah', completed: false },
    { id: 2, text: 'Fold laundry', assignedTo: 'Emma', completed: false },
  ]);
  const [newChore, setNewChore] = useState('');

  // 1. Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Real Weather & Menu
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto`);
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
          min: Math.round(data.daily.temperature_2m_min[0]),
          max: Math.round(data.daily.temperature_2m_max[0])
        });
      } catch (e) {
        console.error("Weather error:", e);
      }
    };

    const fetchLunch = async () => {
      setLoadingMenu(true);
      try {
        const res = await fetch('/api/lunch');
        if (res.ok) {
           const data = await res.json();
           if (data.FamilyMenuSessions) {
             const parsedMenu = {};

             data.FamilyMenuSessions.forEach(session => {
               const date = new Date(session.ServingDate);
               const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

               // NEW LOGIC: Map ALL categories instead of filtering
               const categories = session.MenuCategories.map(cat => ({
                 name: cat.Name,
                 items: cat.MenuItems.map(item => item.Name)
               }));

               parsedMenu[dayName] = categories;
             });
             setLunchMenu(parsedMenu);
           }
        }
      } catch (err) {
        console.error("Lunch error:", err);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchWeather();
    fetchLunch();
  }, [isAuthenticated]);

  // Handlers
  const addTodo = (e) => { e.preventDefault(); if(!newTodo.trim()) return; setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]); setNewTodo(''); };
  const addChore = (e) => { e.preventDefault(); if(!newChore.trim()) return; setChores([...chores, { id: Date.now(), text: newChore, assignedTo: 'Anyone', completed: false }]); setNewChore(''); };
  const toggleItem = (list, setList, id) => { setList(list.map(item => item.id === id ? { ...item, completed: !item.completed } : item)); };
  const deleteItem = (list, setList, id) => { setList(list.filter(item => item.id !== id)); };

  const getWeatherIcon = (code) => {
    if (code >= 51 && code <= 67) return <CloudRain className="w-12 h-12 text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="w-12 h-12 text-blue-200" />;
    if (code > 2) return <Cloud className="w-12 h-12 text-slate-400" />;
    return <Sun className="w-12 h-12 text-yellow-400" />;
  };

  const getClothingRec = (temp) => {
    if (!temp) return "Loading...";
    if (temp < 40) return "Winter coat, hat, and gloves!";
    if (temp < 60) return "Jacket or heavy hoodie.";
    if (temp < 75) return "Long sleeves or light layer.";
    return "Shorts and T-shirt weather!";
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  const activeKid = INITIAL_KIDS.find(k => k.id === activeKidId);
  const currentDayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{FAMILY_NAME}</h1>
          <p className="text-slate-500">Live Dashboard</p>
        </div>
        <div className="text-right text-indigo-600 text-3xl font-light">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* WEATHER */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 opacity-90 text-sm font-medium mb-1">
                 <MapPin size={14} /> {CITY_NAME}
              </div>
              <div className="text-5xl font-bold">{weather ? `${weather.temp}°` : '--'}</div>
              <div className="opacity-90 mt-1">{weather ? `H: ${weather.max}° L: ${weather.min}°` : 'Loading...'}</div>
            </div>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
              {weather ? getWeatherIcon(weather.code) : <Loader2 className="animate-spin"/>}
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
             <Shirt className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <span className="text-sm font-medium leading-tight">
               {weather ? getClothingRec(weather.temp) : "Checking outside..."}
             </span>
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 row-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500"/> Schedule
            </h2>
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
          <div className="space-y-3">
            {activeKid.schedule.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-white px-2 py-1 rounded text-xs font-bold shadow-sm min-w-[70px] text-center">
                  {item.time}
                </div>
                <div className="font-semibold text-sm text-slate-800">{item.activity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LUNCH MENU (FULL VIEW) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 col-span-1 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Coffee className="w-5 h-5 text-red-500"/> This Week's Menu
             </h2>
          </div>

          {loadingMenu ? (
             <div className="flex items-center gap-2 text-slate-400"><Loader2 className="animate-spin"/> Loading full menu...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className={`p-3 rounded-xl border flex flex-col h-[280px] ${currentDayName === day ? 'bg-red-50 border-red-200 ring-2 ring-red-100' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="text-[10px] font-bold uppercase text-slate-400 mb-2 border-b border-slate-200 pb-1">{day}</div>

                   <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                     {lunchMenu[day] ? (
                       lunchMenu[day].map((cat, idx) => (
                         <div key={idx}>
                           <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{cat.name}</div>
                           <ul className="text-xs text-slate-800 leading-snug">
                             {cat.items.map((item, i) => (
                               <li key={i} className="mb-0.5">• {item}</li>
                             ))}
                           </ul>
                         </div>
                       ))
                     ) : (
                       <div className="text-xs text-slate-400 italic">No menu</div>
                     )}
                   </div>
                </div>
              ))}
           </div>
          )}
        </div>

        {/* TODOS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
           <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <CheckSquare className="w-5 h-5 text-emerald-500"/> Quick To-Do
          </h2>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[200px] mb-4">
            {todos.map(t => (
              <div key={t.id} className="flex items-center gap-2 group">
                 <button onClick={() => toggleItem(todos, setTodos, t.id)} className={`w-5 h-5 rounded border flex items-center justify-center ${t.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {t.completed && <CheckSquare className="w-3 h-3 text-white"/>}
                 </button>
                 <span className={`text-sm flex-1 ${t.completed ? 'line-through text-slate-400' : ''}`}>{t.text}</span>
                 <button onClick={() => deleteItem(todos, setTodos, t.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
          <form onSubmit={addTodo} className="relative">
            <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Add task..." className="w-full bg-slate-50 rounded-lg py-2 px-3 text-sm border-none focus:ring-2 focus:ring-emerald-100"/>
            <button type="submit" className="absolute right-2 top-2 text-emerald-500"><Plus size={16}/></button>
          </form>
        </div>

        {/* CHORES */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-orange-500"/> Chores
          </h2>
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

      </div>
    </div>
  );
}