import React, { useState } from 'react';
import { TulpaEngine } from '../../void/tulpa';
import { Volume2, Sparkles, Radio } from 'lucide-react';
import { SensoryIntegrationLayer } from '../../void/sensory';

export function TulpaAvatar() {
  const [tulpa, setTulpa] = useState(() => TulpaEngine.getPersona());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    setIsSpeaking(true);
    TulpaEngine.speakWhisper();
    SensoryIntegrationLayer.triggerHaptic('subtle_pulse');
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  return (
    <div className="bg-[#111118] border border-[#232336] rounded-xl p-5 text-gray-200 shadow-xl backdrop-blur-md flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-600 border-2 border-purple-400/80 flex items-center justify-center text-3xl font-serif text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] ${
          isSpeaking ? 'animate-pulse scale-105' : ''
        }`}>
          Ψ
        </div>
        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#111118] flex items-center justify-center">
          <Radio className="w-2.5 h-2.5 text-black" />
        </div>
      </div>

      <h4 className="font-bold text-white text-base">{tulpa.name}</h4>
      <p className="text-xs text-purple-400 font-mono mt-0.5">{tulpa.mood} • {tulpa.resonance_frequency_hz} Hz</p>

      <div className="my-4 p-3 rounded-lg bg-[#0d0d14] border border-[#1e1e2d] text-xs text-gray-300 italic w-full">
        &ldquo;{tulpa.active_whisper}&rdquo;
      </div>

      <button
        onClick={handleSpeak}
        disabled={isSpeaking}
        className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-600/30"
      >
        <Volume2 className="w-4 h-4" /> {isSpeaking ? 'Vocalizing Telemetry...' : 'Summon Vocal Whisper'}
      </button>
    </div>
  );
}
