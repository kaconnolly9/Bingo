<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bingo Code - Compact Edition</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #0a0e1a; color: white; margin: 0; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .bingo-grid-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
            width: 100%;
        }
        
        @media (min-width: 768px) {
            .bingo-grid-container { gap: 0.75rem; }
        }

        .bingo-cell {
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 0.4rem;
            word-break: keep-all; 
            overflow-wrap: normal;
            transition: all 0.2s ease;
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        const App = () => {
            const [view, setView] = useState('player');
            const [gameTitle, setGameTitle] = useState('Horror Game Tropes Bingo');
            const [winMode, setWinMode] = useState('STANDARD');
            const [itemsText, setItemsText] = useState(`Flashlight flickers\nLocked from the other side\nSpooky child giggling\nCreaky floorboard\nJump scare (Loud Noise)\nFound a diary entry\nInventory is full\nSafe code is 4 digits\nMusic suddenly stops\nBlood on the walls\nMannequin moved\nDoor slams behind you\nHeavy breathing audio\nRadio static\nPiano plays itself\nCrawlspace segment\nShadow figure in hallway\nBatteries found in drawer\nMirror scare\nStatue eyes follow you\nBroken elevator\nHidden key in a vase\nPower goes out\nFlickering TV`);
            const [library, setLibrary] = useState([]);
            const [saveName, setSaveName] = useState('');
            const [cardData, setCardData] = useState([]);
            const [markedCells, setMarkedCells] = useState(new Set([12]));
            const [hasWon, setHasWon] = useState(false);

            const itemsList = itemsText.split('\n').filter(line => line.trim() !== '');

            useEffect(() => { generateNewCard(); }, []);
            useEffect(() => { checkWin(); }, [markedCells, winMode]);

            const generateNewCard = () => {
                if (itemsList.length < 24) return;
                const shuffled = [...itemsList].sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, 24);
                setCardData([...selected.slice(0, 12), "FREE SPACE", ...selected.slice(12, 24)]);
                setMarkedCells(new Set([12]));
                setHasWon(false);
            };

            const checkWin = () => {
                let win = false;
                const corners = [0, 4, 20, 24];
                if (winMode === 'CORNERS') win = corners.every(i => markedCells.has(i));
                else if (winMode === 'BLACKOUT') win = markedCells.size === 25;
                else {
                    const lines = [
                        [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
                        [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
                        [0,6,12,18,24],[4,8,12,16,20]
                    ];
                    win = lines.some(line => line.every(i => markedCells.has(i)));
                }
                if (win) setHasWon(true);
            };

            const getFontSize = (text) => {
                const len = text.length;
                if (len < 10) return 'text-xl md:text-2xl lg:text-3xl';
                if (len < 20) return 'text-lg md:text-xl lg:text-2xl';
                if (len < 30) return 'text-sm md:text-lg lg:text-xl';
                return 'text-xs md:text-sm lg:text-base';
            };

            return (
                <div className="min-h-screen p-2 md:p-4">
                    <div className="max-w-5xl mx-auto">
                        <nav className="bg-[#151b2d] rounded-xl p-3 mb-2 flex items-center justify-between border border-slate-800 shadow-lg">
                            <div className="overflow-hidden">
                                <h1 className="text-lg font-bold truncate leading-tight">{gameTitle}</h1>
                                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Bingo Engine</p>
                            </div>
                            <div className="flex bg-[#0a0e1a] p-0.5 rounded-lg shrink-0 ml-4">
                                <button onClick={() => setView('creator')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'creator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Edit</button>
                                <button onClick={() => setView('player')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'player' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Play</button>
                            </div>
                        </nav>

                        {view === 'player' ? (
                            <div className="animate-in space-y-2">
                                <div className="bg-[#151b2d] rounded-xl p-2 flex justify-between border border-slate-800 items-center">
                                    <div className="flex gap-1.5 bg-[#0a0e1a] p-0.5 rounded-lg">
                                        {['STANDARD', 'CORNERS', 'BLACKOUT'].map(m => (
                                            <button key={m} onClick={() => {setWinMode(m); setHasWon(false);}} className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest transition-all ${winMode === m ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'}`}>{m}</button>
                                        ))}
                                    </div>
                                    <button onClick={generateNewCard} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 shadow-md transition-all">Shuffle</button>
                                </div>

                                <div className="bg-[#151b2d] rounded-[1.5rem] p-3 md:p-5 border border-slate-800 relative overflow-hidden shadow-2xl">
                                    {hasWon && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-indigo-900/90 backdrop-blur-md animate-in">
                                            <h2 className="text-6xl font-black italic mb-2">BINGO!</h2>
                                            <p className="font-bold tracking-widest uppercase opacity-80 text-sm">{winMode} WINNER</p>
                                            <button onClick={() => setHasWon(false)} className="mt-8 px-8 py-3 bg-white text-indigo-900 rounded-full font-black hover:scale-105 transition-transform">Keep Playing</button>
                                        </div>
                                    )}
                                    
                                    <div className="grid grid-cols-5 gap-4 mb-2 text-center opacity-30 font-black text-lg md:text-2xl tracking-[0.6em] pl-[0.6em]">
                                        {['B','I','N','G','O'].map(l => <span key={l}>{l}</span>)}
                                    </div>

                                    <div className="bingo-grid-container">
                                        {cardData.map((item, idx) => (
                                            <button 
                                                key={idx} 
                                                onClick={() => {
                                                    const newMarked = new Set(markedCells);
                                                    newMarked.has(idx) ? newMarked.delete(idx) : newMarked.add(idx);
                                                    setMarkedCells(newMarked);
                                                }}
                                                className={`bingo-cell rounded-lg md:rounded-xl border-2 font-black leading-tight tracking-tight
                                                    ${markedCells.has(idx) 
                                                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-[0.98]' 
                                                        : 'bg-[#1c253d] border-slate-800 hover:border-indigo-500 hover:translate-y-[-1px]'}
                                                `}
                                            >
                                                <span className={getFontSize(item)}>
                                                    {item}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in">
                                <div className="lg:col-span-2 bg-[#151b2d] rounded-xl p-6 border border-slate-800 shadow-xl space-y-4">
                                    <h2 className="text-xl font-bold">Configuration</h2>
                                    <div>
                                        <label className="text-[9px] font-black uppercase text-indigo-500 block mb-1">Game Title</label>
                                        <input className="w-full bg-[#1c253d] border border-slate-800 rounded-lg p-3 text-sm outline-none focus:ring-2 ring-indigo-500 font-bold" value={gameTitle} onChange={e => setGameTitle(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black uppercase text-indigo-500 block mb-1">Bingo Items ({itemsList.length}/24)</label>
                                        <textarea className="w-full bg-[#1c253d] border border-slate-800 rounded-lg p-3 text-sm h-48 resize-none outline-none focus:ring-2 ring-indigo-500" value={itemsText} onChange={e => setItemsText(e.target.value)} />
                                    </div>
                                    <div className="bg-[#0a0e1a]/50 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3">
                                        <input className="flex-1 bg-[#1c253d] border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 ring-indigo-500" placeholder="Bingo List Name" value={saveName} onChange={e => setSaveName(e.target.value)} />
                                        <button onClick={() => {if(saveName){setLibrary([{id:Date.now(), title:saveName, items:itemsText, gameTitle}, ...library]); setSaveName('');}}} className="bg-indigo-600 px-6 py-2 rounded-lg text-sm font-black hover:bg-indigo-500 transition-colors">Save List</button>
                                    </div>
                                </div>
                                <div className="bg-[#151b2d] rounded-xl p-6 border border-slate-800 shadow-xl">
                                    <h3 className="text-md font-bold mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        My Library
                                    </h3>
                                    <div className="space-y-2">
                                        {library.length === 0 ? <p className="text-slate-500 text-center italic py-6 text-xs">No saved lists yet</p> : library.map(s => (
                                            <div key={s.id} onClick={() => {setItemsText(s.items); setGameTitle(s.gameTitle);}} className="p-3 bg-[#1c253d] rounded-lg border border-slate-800 cursor-pointer hover:border-indigo-500 transition-all group">
                                                <div className="font-bold text-sm group-hover:text-indigo-400">{s.title}</div>
                                                <div className="text-[10px] text-slate-500">{s.gameTitle}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>