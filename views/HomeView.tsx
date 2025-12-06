
import React from 'react';
import { Database, AudioLines, ArrowRight, Flame, ScrollText } from 'lucide-react';

interface HomeViewProps {
    onNavigate: (view: 'teleprompter' | 'analysis' | 'database', mode?: 'sound_check' | 'coach') => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
    return (
        <div className="h-full bg-cream text-charcoal flex flex-col items-center md:justify-center p-6 relative overflow-y-auto font-sans">
            <div className="fixed top-0 left-0 w-full h-full opacity-40 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, #F0EBE0 0%, transparent 20%), radial-gradient(circle at 85% 85%, #E8E0D0 0%, transparent 20%)' }}>
            </div>

            <div className="text-center mb-16 z-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 shrink-0 mt-10 md:mt-0">
                <div className="mb-4 inline-block px-4 py-1.5 rounded-full border border-gold/40 text-gold text-[10px] font-bold tracking-[0.2em] uppercase bg-white/50 backdrop-blur-sm">
                    Executive Performance Suite
                </div>
                <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-tight text-charcoal">
                    MicDrop
                </h1>
                <p className="text-gray-500 text-xl font-serif italic max-w-lg mx-auto leading-relaxed">
                    Don't just answer. Perform.
                </p>
                
                <button 
                  onClick={() => onNavigate('database')}
                  className="mt-8 px-6 py-2 bg-white border border-[#EBE8E0] hover:border-gold/50 rounded-full text-charcoal text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-2 mx-auto"
                >
                    <Database size={14} className="text-gold" /> My Database
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 z-10 w-full max-w-6xl px-4 pb-10 shrink-0">
                {/* Card 1: Sound Check */}
                <button onClick={() => onNavigate('analysis', 'sound_check')} className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-[#EBE8E0] hover:border-gold/30 text-left relative overflow-hidden flex flex-col h-full">
                     <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                         <AudioLines size={80} className="text-charcoal" />
                     </div>
                     <div className="w-14 h-14 rounded-2xl bg-charcoal text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                         <AudioLines size={24} />
                     </div>
                     <div className="flex-1">
                         <h3 className="text-xl font-serif font-bold text-charcoal mb-3">Sound Check</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-6">Upload your raw audio. Get a forensic, timestamped transcript that captures every hesitation.</p>
                     </div>
                     <div className="flex items-center gap-2 text-gold font-bold text-xs tracking-widest uppercase mt-auto">
                         Analyze Audio <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                </button>

                {/* Card 2: Coach */}
                <button onClick={() => onNavigate('analysis', 'coach')} className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-[#EBE8E0] hover:border-gold/30 text-left relative overflow-hidden flex flex-col h-full">
                     <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Flame size={80} className="text-gold" />
                     </div>
                     <div className="w-14 h-14 rounded-2xl bg-cream border border-gold/20 text-gold flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                         <Flame size={24} />
                     </div>
                     <div className="flex-1">
                         <h3 className="text-xl font-serif font-bold text-charcoal mb-3">Coach</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-6">Executive-level feedback on delivery, strategy, and leadership presence.</p>
                     </div>
                     <div className="flex items-center gap-2 text-gold font-bold text-xs tracking-widest uppercase mt-auto">
                         Get Coached <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                </button>

                {/* Card 3: Rehearsal */}
                <button onClick={() => onNavigate('teleprompter')} className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-[#EBE8E0] hover:border-gold/30 text-left relative overflow-hidden flex flex-col h-full">
                     <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                         <ScrollText size={80} className="text-charcoal" />
                     </div>
                     <div className="w-14 h-14 rounded-2xl bg-charcoal text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                         <ScrollText size={24} />
                     </div>
                     <div className="flex-1">
                         <h3 className="text-xl font-serif font-bold text-charcoal mb-3">Rehearsal</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-6">Practice your pitch with an adaptive teleprompter that listens to your pace in real-time.</p>
                     </div>
                     <div className="flex items-center gap-2 text-gold font-bold text-xs tracking-widest uppercase mt-auto">
                         Start Practice <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                </button>
            </div>
        </div>
    );
};

export default HomeView;
