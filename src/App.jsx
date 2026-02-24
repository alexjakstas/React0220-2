import { useEffect, useState } from "react";
import "./App.css";
import {Lock, LockOpen, CheckCircle2, RefreshCw, Unlock, Copy} from 'lucide-react'

function App() {
  const [palette, setPalette] = useState([]);
  const [locked, setLocked] = useState([]);
  const [copiedState, setCopiedState] = useState({});
  const [copiedAll, setCopiedAll] = useState(false);

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  const generatePalette = () => {
    const newPalette = [];

    for (let i = 0; i < 5; i++) {
      if (locked[i]) {
        newPalette.push(palette[i]);
      } else {
        newPalette.push(generateRandomColor());
      }
    }
    setPalette(newPalette);
  };

  const toggleLock = (index) => {
    const newLocked = [...locked];

    newLocked[index] = !newLocked[index];

    setLocked(newLocked);
  };

  const unlockAll = () => {
    setLocked([false, false, false, false, false]);
  };

  const copyToClipboard = (color, index) => {
    if (copiedState[index]) return;

    navigator.clipboard.writeText(color);

    setCopiedState((prev) => ({ ...prev, [index]: true }));

    setTimeout(() => {
      setCopiedState((prev) => {
        const newStates = { ...prev };

        delete newStates[index];

        return newStates;
      });
    }, 1200);
  };

  const copyAllColors = () => {
    const paletteString = palette.join(", ");

    navigator.clipboard.writeText(paletteString);

    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const isColorLight = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 155;
  };

  useEffect(() => {
    generatePalette();

    setLocked([false, false, false, false, false]);
  }, []);


  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();

        generatePalette();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Color Palette Generator
        </h1>
        <p className="text-gray-400 text-lg">
          Press <kbd className="px-2 bg-gray-700 rounded text-sm">Spacebar</kbd>{" "}
          or click Generate to create new palettes
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {palette.map((color, index) => (
            <div
              key={index}
              className="relative h-64 md:h-96 rounded-lg shadow-xl overflow-hidden cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color, index)}
            >
              <button onClick={(e) => {
                e.stopPropagation();
                toggleLock(index);
              }} className={`absolute top-4 right-4 p-2.5 rounded-lg transition-all shadow-md focus:outline-none ${locked[index] ? "bg-yellow-500 hover:bg-yellow-600" : isColorLight(color) ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"}`} title={locked[index] ? "Unlock color" : "Lock color"}>
                 {locked[index] ? (
                  <Lock className="w-5 h-5 text-white"/>
                ) : (
                  <LockOpen className={`w-5 h-5 ${isColorLight (color) ? "text-white" : "text-gray-800"}`} />
                )}   
              </button>  
                {copiedState[index] && (
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-lg border-2 ${isColorLight(color) ? "bg-gray-800 text-white" : "bg-white text-gray-900 border-gray-300"}`}>
                      <CheckCircle2 className="w-4 h-4" />
                      Copied
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm bg-black/20">
                  <div className={`font-mono text-lg mb-1 font-bold ${isColorLight(color) ? "text-gray-800" : "text-white" }`}>
                  {color}
                  </div>
                  <div className={`font-mono text-sm ${isColorLight(color) ? "text-gray-700" : "text-gray-300"}`}>
                    {hexToRgb(color)}
                 </div>
                </div>
            </div>
          ))}
        </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2" 
            onClick={generatePalette}>
              <RefreshCw className = "w-5 h-5" />
              Generate New Palette
            </button>
             <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2" 
             onClick={unlockAll}>
              <Unlock className = "w-5 h-5" />
              Unlock All
            </button>
             <button className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 relative" 
             onClick={copyAllColors}>
              <Copy className = "w-5 h-5" />
              Copy All Colors
              {copiedAll && (
                <span className="absolute -top-2 -right-2 bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg border-2 border-gray-300">
                  <CheckCircle2 className ="w-3 h-3" />
                </span>
              )}
            </button>
          </div>


      </div>
    </div>
  );
}

export default App;
