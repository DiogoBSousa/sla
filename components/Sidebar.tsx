
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Gender } from '../types';
import { 
  User, 
  Move, 
  Layers, 
  Sun, 
  RotateCcw, 
  Download, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  Dna,
  EyeOff
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ControlGroup: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-slate-800 pb-4 mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-slate-400 hover:text-white mb-3 transition-colors"
      >
        <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider">
          {icon}
          {title}
        </div>
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {isOpen && <div className="space-y-3 px-1">{children}</div>}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { 
    gender, setGender, 
    anatomy, setAnatomy, 
    rotations, setRotation,
    clothes, setClothing,
    lightSettings, setLightIntensity,
    resetPose, isAgeVerified
  } = useStore();

  const [aiLoading, setAiLoading] = useState(false);

  const handleSliderChange = (bone: string, axis: 'x' | 'y' | 'z', value: string) => {
    const val = parseFloat(value);
    setRotation(bone, { ...rotations[bone], [axis]: val });
  };

  const generateAIPose = async () => {
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Give me a single-sentence artistic pose title and a brief technical advice for a figure drawing student. Example: 'The Forsaken Pillar - Focus on the tension in the quadriceps'.",
      });
      alert(`STUDIO INSIGHT:\n${response.text}`);
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleAnatomyMode = () => {
    if (!isAgeVerified) return;
    const allOff = clothes.top || clothes.bottom || clothes.shoes;
    setClothing('top', !allOff);
    setClothing('bottom', !allOff);
    setClothing('shoes', !allOff);
  };

  return (
    <div className="w-80 h-full bg-[#080c14] border-r border-slate-800 flex flex-col z-20 shadow-2xl overflow-hidden">
      <div className="p-5 bg-slate-900/20 flex items-center justify-between border-b border-slate-800">
        <h1 className="text-xs font-black tracking-[0.2em] flex items-center gap-2 text-white uppercase">
          <Dna className="text-blue-500" size={16} /> Artist Studio
        </h1>
        <button onClick={resetPose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors" title="Reset Scene">
          <RotateCcw size={14} className="text-slate-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gradient-to-b from-slate-900/10 to-transparent">
        {/* Subject Selection */}
        <ControlGroup title="Subject Model" icon={<User size={14} />}>
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setGender(Gender.MALE)}
              className={`py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${gender === Gender.MALE ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-white'}`}
            >
              Male
            </button>
            <button 
              onClick={() => setGender(Gender.FEMALE)}
              className={`py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${gender === Gender.FEMALE ? 'bg-pink-600 text-white' : 'text-slate-600 hover:text-white'}`}
            >
              Female
            </button>
          </div>
        </ControlGroup>

        {/* Anatomy Scaling */}
        <ControlGroup title="Anatomical Form" icon={<Sparkles size={14} />}>
          <div className="space-y-4">
            {Object.keys(anatomy).map((part) => (
              <div key={part} className="group">
                <div className="flex justify-between text-[9px] font-mono text-slate-600 mb-1 group-hover:text-blue-400 transition-colors">
                  <span className="uppercase">{part}</span>
                  <span>{Math.round(anatomy[part as keyof typeof anatomy] * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.7" max="1.4" step="0.01" 
                  value={anatomy[part as keyof typeof anatomy]} 
                  onChange={(e) => setAnatomy(part, parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                />
              </div>
            ))}
          </div>
        </ControlGroup>

        {/* Clothes & Nude Mode */}
        <ControlGroup title="Layers & References" icon={<Layers size={14} />}>
          <button 
            onClick={toggleAnatomyMode}
            disabled={!isAgeVerified}
            className={`w-full py-3 mb-4 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${!clothes.top && !clothes.bottom ? 'bg-slate-100 text-slate-900 border-white' : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'}`}
          >
            <EyeOff size={14} />
            Artistic Anatomy Mode
          </button>
          
          <div className="grid grid-cols-1 gap-2">
            {(['top', 'bottom', 'shoes'] as const).map((item) => (
              <label key={item} className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer border ${clothes[item] ? 'bg-slate-900/50 border-slate-700' : 'border-transparent opacity-50'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item} Mesh</span>
                <input 
                  type="checkbox" 
                  checked={clothes[item]} 
                  onChange={(e) => setClothing(item, e.target.checked)}
                  disabled={!isAgeVerified && !clothes[item]}
                  className="w-4 h-4 rounded-md border-slate-800 bg-slate-950 text-blue-500 focus:ring-0"
                />
              </label>
            ))}
          </div>
        </ControlGroup>

        {/* Rig Manipulation */}
        <ControlGroup title="Skeleton Rig" icon={<Move size={14} />}>
          <div className="space-y-4">
            {Object.keys(rotations).slice(0, 5).map((bone) => (
              <div key={bone} className="bg-slate-950 p-3 rounded-2xl border border-slate-800/50">
                <div className="text-[9px] font-black text-slate-600 mb-3 uppercase tracking-widest">{bone.replace(/[LR]$/, (m) => ` ${m === 'L' ? 'Left' : 'Right'}`)}</div>
                {(['x', 'y', 'z'] as const).map((axis) => (
                  <div key={axis} className="flex items-center gap-3 mb-2">
                    <span className="text-[8px] font-mono text-slate-700 w-2">{axis.toUpperCase()}</span>
                    <input 
                      type="range" min="-3.14" max="3.14" step="0.05" 
                      value={rotations[bone][axis]} 
                      onChange={(e) => handleSliderChange(bone, axis, e.target.value)}
                      className="flex-1 h-0.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-slate-600"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ControlGroup>

        {/* Lighting */}
        <ControlGroup title="Lighting" icon={<Sun size={14} />}>
          <div>
            <div className="flex justify-between text-[9px] text-slate-600 mb-3 uppercase tracking-widest font-bold">
              <span>Lumens</span>
              <span>{lightSettings.intensity}</span>
            </div>
            <input 
              type="range" min="0" max="10" step="0.2" 
              value={lightSettings.intensity} 
              onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-900 rounded-full appearance-none cursor-pointer accent-yellow-600"
            />
          </div>
        </ControlGroup>

        {/* AI Insight */}
        <div className="mt-6 p-5 bg-gradient-to-br from-blue-900/20 to-slate-900/10 rounded-2xl border border-blue-500/20">
          <button 
            onClick={generateAIPose}
            disabled={aiLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-900/20"
          >
            {aiLoading ? "Consulting..." : "Get Art Tip"}
          </button>
        </div>
      </div>

      <div className="p-5 bg-[#080c14] border-t border-slate-800">
        <button className="w-full py-4 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Download size={16} /> 
          Save Snapshot
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
