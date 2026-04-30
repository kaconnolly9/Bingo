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
    const [winMode, setWinMode] = useState('STANDARD');
    const [hasWon, setHasWon] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [library, setLibrary] = useState([]);

    // 1. STARTUP LOGIC: Load Library AND check for Shared Links
    useEffect(() => {
        const saved = localStorage.getItem('bingo_library');
        if (saved) setLibrary(JSON.parse(saved));

        const params = new URLSearchParams(window.location.search);
        const sharedData = params.get('share');

        if (sharedData) {
            try {
                // Decode the shared URL data
                const decoded = JSON.parse(atob(sharedData));
                setGameTitle(decoded.title);
                setItemsText(decoded.items);
                loadFromData(decoded.title, decoded.items);
                // Clean URL so the shared list doesn't "stick" on refresh
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                console.error("Shared link error", e);
                generateCard();
            }
        } else {
            generateCard();
        }
    }, []);

    useEffect(() => {
        checkWin(marked);
    }, [marked, winMode]);

    const generateCard = () => {
        const words = itemsText.split('\n').map(w => w.trim()).filter(w => w);
        const shuffled = [...words].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 24);
        selected.splice(12, 0, "FREE SPACE");
        setCard(selected);
        setMarked(new Set([12]));
        setHasWon(false);
    };

    const loadFromData = (title, items) => {
        const words = items.split('\n').map(w => w.trim()).filter(w => w);
        const shuffled = [...words].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 24);
        selected.splice(12, 0, "FREE SPACE");
        setCard(selected);
        setMarked(new Set([12]));
        setHasWon(false);
    };

    const loadList = (list) => {
        setGameTitle(list.gameTitle);
        setItemsText(list.items);
        loadFromData(list.gameTitle, list.items);
        setShowSettings(false);
    };

    // 2. THE SHARE FUNCTION: Turns your list into a URL link
    const copyShareLink = (list) => {
        const data = btoa(JSON.stringify({ title: list.gameTitle, items: list.items }));
        const shareUrl = `${window.location.origin}${window.location.pathname}?share=${data}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert("Shareable link copied to clipboard!");
        });
    };

    const saveToList = () => {
        const newList = { id: Date.now(), title: gameTitle, gameTitle, items: itemsText };
        const updated = [...library, newList];
        setLibrary(updated);
        localStorage.setItem('bingo_library', JSON.stringify(updated));
    };

    const deleteList = (id) => {
        const updated = library.filter(l => l.id !== id);
        setLibrary(updated);
        localStorage.setItem('bingo_library', JSON.stringify(updated));
    };

    const toggleMark = (index) => {
        if (index === 12) return;
        const newMarked = new Set(marked);
        if (newMarked.has(index)) newMarked.delete(index);
        else newMarked.add(index);
        setMarked(newMarked);
    };

    const checkWin = (currentMarked) => {
        let win = false;
        if (winMode === 'CORNERS') {
            win = [0, 4, 20, 24].every(i => currentMarked.has(i));
        } else if (winMode === 'BLACKOUT') {
            win = currentMarked.size === 25;
        } else {
            const lines = [[0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24], [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24], [0,6,12,18,24], [4,8,12,16,20]];
            win = lines.some(line => line.every(i => currentMarked.has(i)));
        }
        setHasWon(win);
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white p-4 font-sans">
            <div className="max-w-md mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-indigo-400">{gameTitle}</h1>
                        <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Bingo Edition</p>
                    </div>
                    <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full bg-slate-800 hover:bg-indigo-600 transition-colors text-white">⚙️</button>
                </header>

                {showSettings && (
                    <div className="mb-6 p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-4">
                        <input value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} placeholder="Game Title" className="w-full bg-[#1c253d] border border-slate-700 rounded p-2 text-white outline-none" />
                        <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows="4" className="w-full bg-[#1c253d] border border-slate-700 rounded p-2 text-xs text-white outline-none" />
                        <div className="flex gap-2">
                            <button onClick={generateCard} className="flex-1 bg-indigo-600 py-2 rounded font-bold text-white hover:bg-indigo-500 transition-colors">Shuffle</button>
                            <button onClick={saveToList} className="flex-1 bg-slate-800 py-2 rounded font-bold hover:bg-indigo-900 text-white transition-colors">Save List</button>
                        </div>
                        
                        {library.length > 0 && (
                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Saved Lists</p>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {library.map(list => (
                                        <div key={list.id} className="flex justify-between items-center bg-[#1c253d] p-2 rounded border border-slate-800">
                                            <button onClick={() => loadList(list)} className="text-xs font-bold text-indigo-300 hover:text-white truncate text-left flex-1 mr-2">{list.title}</button>
                                            <div className="flex gap-2">
                                                <button onClick={() => copyShareLink(list)} className="text-[9px] bg-indigo-600/30 text-indigo-300 px-2 py-1 rounded hover:bg-indigo-600 hover:text-white border border-indigo-500/30">Share</button>
                                                <button onClick={() => deleteList(list.id)} className="text-slate-500 hover:text-red-500 font-bold px-1">×</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mb-4 flex justify-center gap-2 bg-[#151b2d] p-1.5 rounded-xl border border-slate-700">
                    {['STANDARD', 'CORNERS', 'BLACKOUT'].map(m => (
                        <button key={m} onClick={() => setWinMode(m)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${winMode === m ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{m}</button>
                    ))}
                </div>

                <div className="bg-[#151b2d] p-4 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
                    {hasWon && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-indigo-900/90 backdrop-blur-sm">
                            <h2 className="text-5xl font-black italic mb-2">BINGO!</h2>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-80">{winMode} WINNER</p>
                            <button onClick={() => setHasWon(false)} className="mt-6 px-6 py-2 bg-white text-indigo-900 rounded-full font-black hover:scale-105 transition-transform">Keep Playing</button>
                        </div>
                    )}
                    <div className="grid grid-cols-5 gap-2 mb-4 text-center font-black text-2xl text-indigo-400">
                        {['B','I','N','G','O'].map(l => <div key={l}>{l}</div>)}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {card.map((item, i) => (
                            <div key={i} onClick={() => toggleMark(i)} className={`aspect-square flex items-center justify-center p-2 text-center text-[9px] font-bold rounded-lg cursor-pointer transition-all border-2 ${i === 12 ? 'bg-indigo-900/60 border-indigo-500 text-indigo-200' : marked.has(i) ? 'bg-indigo-600 border-indigo-400 text-white scale-95 shadow-inner shadow-indigo-900/50' : 'bg-[#1c253d] border-slate-700 text-white hover:border-indigo-500'}`}>{item}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;