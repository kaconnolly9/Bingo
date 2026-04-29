import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Play, RefreshCw, Trophy, AlertCircle, Moon, Sun, Square, Layout, Grid3X3, Save, Trash2, FolderOpen } from 'lucide-react';

const DEFAULT_WORDS = [
  "Flashlight flickers",
  "Locked from the other side",
  "Spooky child giggling",
  "Creaky floorboard",
  "Jump scare (Loud Noise)",
  "Found a diary entry",
  "Inventory is full",
  "Safe code is 4 digits",
  "Music suddenly stops",
  "Blood on the walls",
  "Mannequin moved",
  "Door slams behind you",
  "Heavy breathing audio",
  "Radio static",
  "Piano plays itself",
  "Crucial item is in a toilet",
  "Broken elevator",
  "Shadow figure in hallway",
  "Batteries found in drawer",
  "Mirror scare",
  "Crawlspace segment",
  "Statue eyes follow you",
  "Running out of stamina",
  "Hidden key in a vase",
  "Phone starts ringing",
  "Sudden fog",
  "Distorted face",
  "Empty rocking chair moving",
  "Secret passage behind bookshelf",
  "Main character talks to self",
  "Breathing in Character's Ear"
].join('\n');

const WINNING_LINES_STANDARD = [
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
];

const WINNING_4_CORNERS = [[0, 4, 20, 24]];
const WINNING_BLACKOUT = [[...Array(25).keys()]];

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function BingoApp() {
  const [view, setView] = useState('player'); 
  const [darkMode, setDarkMode] = useState(false);
  const [title, setTitle] = useState('Horror Game Tropes Bingo');
  const [winMode, setWinMode] = useState('standard');
  const [inputText, setInputText] = useState(DEFAULT_WORDS);
  const [wordList, setWordList] = useState([]);
  const [card, setCard] = useState([]);
  const [marked, setMarked] = useState(new Set([12]));
  const [hasBingo, setHasBingo] = useState(false);
  
  // Local storage for saved lists
  const [savedLists, setSavedLists] = useState(() => {
    const saved = localStorage.getItem('bingo_saved_lists');
    return saved ? JSON.parse(saved) : [];
  });
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    localStorage.setItem('bingo_saved_lists', JSON.stringify(savedLists));
  }, [savedLists]);

  useEffect(() => {
    const words = inputText.split('\n').map(w => w.trim()).filter(w => w.length > 0);
    setWordList(words);
  }, [inputText]);

  const generateCard = useCallback(() => {
    if (wordList.length < 24) return;
    const shuffled = shuffleArray(wordList);
    const selected = shuffled.slice(0, 24);
    selected.splice(12, 0, "FREE SPACE");
    setCard(selected);
    setMarked(new Set([12]));
    setHasBingo(false);
  }, [wordList]);

  useEffect(() => {
    if (card.length === 0 && wordList.length >= 24) {
      generateCard();
    }
  }, [wordList, card.length, generateCard]);

  useEffect(() => {
    let winningSets = WINNING_LINES_STANDARD;
    if (winMode === 'corners') winningSets = WINNING_4_CORNERS;
    if (winMode === 'blackout') winningSets = WINNING_BLACKOUT;
    const isBingo = winningSets.some(line => line.every(index => marked.has(index)));
    setHasBingo(isBingo);
  }, [marked, winMode]);

  const toggleMark = (index) => {
    if (index === 12) return;
    setMarked(prev => {
      const newMarked = new Set(prev);
      if (newMarked.has(index)) newMarked.delete(index);
      else newMarked.add(index);
      return newMarked;
    });
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    const newList = {
      id: Date.now(),
      name: saveName,
      title,
      items: inputText,
      winMode
    };
    setSavedLists([newList, ...savedLists]);
    setSaveName('');
  };

  const loadList = (list) => {
    setTitle(list.title);
    setInputText(list.items);
    setWinMode(list.winMode || 'standard');
    setView('player');
    setCard([]); // Trigger re-generation
  };

  const deleteList = (id) => {
    setSavedLists(savedLists.filter(l => l.id !== id));
  };

  const isReady = wordList.length >= 24;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans p-4 md:p-8 ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className={`rounded-2xl shadow-sm border transition-colors p-4 flex flex-col sm:flex-row justify-between items-center gap-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {title || 'Untitled Bingo'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className={`flex p-1 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <button onClick={() => setView('creator')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${view === 'creator' ? (darkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : 'text-slate-500 hover:text-slate-400'}`}>
                <Settings className="w-4 h-4" /> Creator
              </button>
              <button onClick={() => { if (isReady) setView('player'); }} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${view === 'player' ? (darkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : 'text-slate-500 hover:text-slate-400'} ${!isReady ? 'opacity-50' : ''}`}>
                <Play className="w-4 h-4" /> Play
              </button>
            </div>
          </div>
        </div>

        {view === 'creator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Settings Pane */}
            <div className={`lg:col-span-2 rounded-2xl shadow-sm border p-6 space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Configuration</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium opacity-70">Game Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full p-3 border rounded-xl outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium opacity-70">Bingo Items (Min 24)</label>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className={`w-full h-64 p-4 border rounded-xl font-mono text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`} />
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold">Save Current Setup</label>
                    <input type="text" placeholder="Name your list..." value={saveName} onChange={(e) => setSaveName(e.target.value)} className={`p-2 rounded-lg text-sm ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`} />
                  </div>
                  <button onClick={handleSave} disabled={!saveName.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all">
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Bingos Pane */}
            <div className={`rounded-2xl shadow-sm border p-6 space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2 text-indigo-500 font-bold">
                <FolderOpen className="w-5 h-5" />
                <h2>Saved Bingos</h2>
              </div>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {savedLists.length === 0 ? (
                  <p className="text-sm opacity-50 text-center py-8 italic">No saved bingos yet.</p>
                ) : (
                  savedLists.map((list) => (
                    <div key={list.id} className={`group p-3 rounded-xl border flex justify-between items-center transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-md'}`}>
                      <button onClick={() => loadList(list)} className="flex-1 text-left">
                        <p className="font-bold text-sm truncate">{list.name}</p>
                        <p className="text-[10px] opacity-50 truncate">{list.title}</p>
                      </button>
                      <button onClick={() => deleteList(list.id)} className="text-slate-400 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'player' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className={`flex flex-col sm:flex-row justify-between items-center p-4 rounded-2xl shadow-sm border gap-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
                <button onClick={() => setWinMode('standard')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${winMode === 'standard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-400'}`}>
                  <Layout className="w-4 h-4" /> Standard
                </button>
                <button onClick={() => setWinMode('corners')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${winMode === 'corners' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-400'}`}>
                  <Square className="w-4 h-4" /> 4 Corners
                </button>
                <button onClick={() => setWinMode('blackout')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${winMode === 'blackout' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-400'}`}>
                  <Grid3X3 className="w-4 h-4" /> Blackout
                </button>
              </div>
              <button onClick={generateCard} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                <RefreshCw className="w-4 h-4" /> New Card
              </button>
            </div>

            {hasBingo && (
              <div className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-yellow-950 p-4 rounded-2xl text-center font-black text-3xl sm:text-4xl shadow-xl border-2 border-yellow-200/50 animate-bounce">
                🎉 {winMode.toUpperCase()} BINGO! 🎉
              </div>
            )}

            <div className={`p-2 sm:p-4 rounded-2xl shadow-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-2 sm:mb-4 text-center font-black text-2xl sm:text-4xl text-indigo-500">
                {['B', 'I', 'N', 'G', 'O'].map((l, i) => <div key={i}>{l}</div>)}
              </div>
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {card.map((item, index) => (
                  <div key={index} onClick={() => toggleMark(index)} className={`aspect-square flex items-center justify-center p-1 sm:p-2 text-center text-[9px] xs:text-[10px] sm:text-sm font-medium rounded-lg sm:rounded-xl cursor-pointer transition-all border-2 overflow-hidden break-words leading-tight ${index === 12 ? (darkMode ? 'bg-indigo-900/40 border-indigo-500 text-indigo-300' : 'bg-indigo-100 border-indigo-200 text-indigo-800') : (marked.has(index) ? 'bg-indigo-600 border-indigo-500 text-white shadow-inner scale-95' : (darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'))}`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}