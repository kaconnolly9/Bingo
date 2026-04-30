import React, { useState, useEffect } from 'react';

const App = () => {
    const DEFAULT_WORDS = [
        "Flashlight flickers", "Locked from the other side", "Spooky child giggling",
        "Creaky floorboard", "Jump scare (Loud Noise)", "Found a diary entry",
        "Inventory is full", "Safe code is 4 digits", "Music suddenly stops",
        "Blood on the walls", "Mannequin moved", "Door slams behind you",
        "Heavy breathing audio", "Radio static", "Piano plays itself",
        "Crucial item is in a toilet", "Broken elevator", "Shadow figure in hallway",
        "Batteries found in drawer", "Mirror scare", "Crawlspace segment",
        "Statue eyes follow you", "Running out of stamina", "Hidden key in a vase",
        "Phone starts ringing", "Sudden fog", "Distorted face",
        "Empty rocking chair moving", "Secret passage behind bookshelf",
        "Main character talks to self", "Breathing in Character's Ear"
    ].join('\n');

    const [itemsText, setItemsText] = useState(DEFAULT_WORDS);
    const [gameTitle, setGameTitle] = useState("HORROR GAME TROPES");
    const [card, setCard] = useState([]);
    const [marked, setMarked] = useState(new Set([12]));
    const [winMode, setWinMode] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [library, setLibrary] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('bingo_library');
        if (saved) setLibrary(JSON.parse(saved));
        generateCard();
    }, []);

    const generateCard = () => {
        const words = itemsText.split('\n').map(w => w.trim()).filter(w => w);
        const shuffled = [...words].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 24);
        selected.splice(12, 0, "FREE SPACE");
        setCard(selected);
        setMarked(new Set([12]));
        setWinMode(null);
    };

    const toggleMark = (index) => {
        if (index === 12) return;
        const newMarked = new Set(marked);
        if (newMarked.has(index)) newMarked.delete(index);
        else newMarked.add(index);
        setMarked(newMarked);
        checkWin(newMarked);
    };

    const checkWin = (currentMarked) => {
        const lines = [
            [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
            [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
            [0,6,12,18,24], [4,8,12,16,20]
        ];
        if (lines.some(line => line.every(i => currentMarked.has(i)))) {
            setWinMode('standard');
        } else {
            setWinMode(null);
        }
    };

    const saveToList = () => {
        const newList = { id: Date.now(), title: `List ${library.length + 1}`, gameTitle, items: itemsText };
        const updated = [...library, newList];
        setLibrary(updated);
        localStorage.setItem('bingo_library', JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white p-4 font-sans">
            <div className="max-w-md mx-auto animate-in">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-indigo-500">{gameTitle}</h1>
                        <p className="text-xs text-slate-500 font-bold tracking-widest">BINGO EDITION</p>
                    </div>
                    <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full bg-slate-800 hover:bg-indigo-600 transition-colors">
                        ⚙️
                    </button>
                </header>

                {showSettings && (
                    <div className="mb-6 p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Game Title</label>
                            <input value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} className="w-full bg-[#1c253d] border border-slate-800 rounded p-2 text-sm focus:border-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Bingo Items (One per line)</label>
                            <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows="6" className="w-full bg-[#1c253d] border border-slate-800 rounded p-2 text-xs focus:border-indigo-500 outline-none" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={generateCard} className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2 rounded font-bold text-sm">New Game</button>
                            <button onClick={saveToList} className="bg-slate-800 px-4 py-2 rounded text-sm font-bold">Save</button>
                        </div>
                    </div>
                )}

                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-2xl">
                    <div className="grid grid-cols-5 gap-2 mb-4 text-center font-black text-2xl text-indigo-500">
                        {['B','I','N','G','O'].map(l => <div key={l}>{l}</div>)}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {card.map((item, i) => (
                            <div 
                                key={i} 
                                onClick={() => toggleMark(i)}
                                className={`aspect-square flex items-center justify-center p-1 text-center text-[10px] font-bold rounded-lg cursor-pointer transition-all border-2 
                                    ${i === 12 ? 'bg-indigo-900/40 border-indigo-500 text-indigo-300' : 
                                    marked.has(i) ? 'bg-indigo-600 border-indigo-500 text-white scale-95 shadow-inner' : 
                                    'bg-[#1c253d] border-slate-800 hover:border-slate-600'}`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {winMode && (
                    <div className="mt-6 text-center animate-bounce text-xl font-black text-indigo-400">
                        🎉 BINGO! 🎉
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;