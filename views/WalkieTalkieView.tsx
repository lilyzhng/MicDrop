
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Home, ArrowLeft, Mic, StopCircle, ChevronRight, CheckCircle2, Award, Sparkles, Code2, Loader2, BrainCircuit, X, ShieldAlert, BookOpen, Coffee, Trees, Train, Trophy, Star, AlertCircle, Flame, Target, Repeat } from 'lucide-react';
import { BlindProblem, PerformanceReport } from '../types';
import { analyzeWalkieSession, refineTranscript } from '../services/analysisService';
import { fetchBlindProblemsByTopics } from '../services/databaseService';
import PerformanceReportComponent from '../components/PerformanceReport';

interface WalkieTalkieViewProps {
  onHome: (force: boolean) => void;
  onSaveReport: (title: string, type: 'walkie', report: PerformanceReport) => void;
  masteredIds: string[];
  onMastered: (id: string) => void;
}

// 3 REAL WORLD LOCATIONS MAPPED TO BLIND 75 TOPICS
const POWER_SPOTS = [
  { 
    id: 'spot1', 
    name: 'The Coffee Sanctuary', 
    ritual: 'Deep Focus Batch', 
    batchSize: 5, 
    icon: 'coffee', 
    description: 'Best for complex DP and Graph logic over a warm brew.',
    topics: ['Dynamic Programming', 'Graph', 'Matrix', 'Binary Search Tree']
  },
  { 
    id: 'spot2', 
    name: 'The Logic Trail', 
    ritual: 'Movement Batch', 
    batchSize: 5, 
    icon: 'park', 
    description: 'Walk and talk through Arrays, Strings, and Two-Pointer patterns.',
    topics: ['Array', 'String', 'Two Pointers', 'Sliding Window', 'Stack']
  },
  { 
    id: 'spot3', 
    name: 'The Daily Commute', 
    ritual: 'Transit Batch', 
    batchSize: 5, 
    icon: 'train', 
    description: 'Quick-fire Tree and Heap traversals while on the move.',
    topics: ['Binary Tree', 'Heap', 'Intervals', 'Linked List']
  }
];

const WalkieTalkieView: React.FC<WalkieTalkieViewProps> = ({ onHome, onSaveReport, masteredIds, onMastered }) => {
  const [step, setStep] = useState<'locations' | 'curating' | 'problem' | 'recording' | 'analyzing' | 'reveal'>('locations');
  const [analysisPhase, setAnalysisPhase] = useState<'refining' | 'evaluating'>('refining');
  const [selectedSpot, setSelectedSpot] = useState<typeof POWER_SPOTS[0] | null>(null);
  const [showStats, setShowStats] = useState(false);
  
  // Session State
  const [problemQueue, setProblemQueue] = useState<BlindProblem[]>([]);
  const [currentQueueIdx, setCurrentQueueIdx] = useState(0);
  const [sessionScore, setSessionScore] = useState(0); // How many cleared in THIS visit

  // Daily & Lifetime Stats (Simulated persistence)
  const [dailyCleared, setDailyCleared] = useState(0);
  const [totalConquered, setTotalConquered] = useState(() => {
    return Number(localStorage.getItem('micdrop_total_conquered') || 0);
  });

  // Analysis State
  const [transcript, setTranscript] = useState("");
  const [rawTranscript, setRawTranscript] = useState("");
  const [aiReport, setAiReport] = useState<PerformanceReport | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [revealHintIdx, setRevealHintIdx] = useState(0);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentProblem = problemQueue[currentQueueIdx];

  // Global progress (Hidden)
  const globalProgress = useMemo(() => {
    return Math.round((masteredIds.length / 75) * 100);
  }, [masteredIds]);

  // Current Pass Calculation (e.g., if you've done 80 problems, you're on your 2nd pass)
  const masteryCycle = useMemo(() => {
    return Math.floor(totalConquered / 75) + 1;
  }, [totalConquered]);

  useEffect(() => {
    return () => { 
      if (recognitionRef.current) recognitionRef.current.stop();
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    };
  }, []);

  const handleStartRecording = async () => {
    setTranscript("");
    setRawTranscript("");
    setAiReport(null);
    setIsRecording(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.start();
    } catch (e) { console.error("Mic access failed", e); }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let current = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) current += event.results[i][0].transcript;
        }
        if (current) setRawTranscript(prev => prev + " " + current);
      };
      recognitionRef.current.start();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        setStep('analyzing');
        setAnalysisPhase('refining');
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          try {
            if (currentProblem) {
              const polishedText = await refineTranscript(rawTranscript, currentProblem);
              setTranscript(polishedText);
              setAnalysisPhase('evaluating');
              const report = await analyzeWalkieSession(base64Audio, polishedText, currentProblem);
              
              // Normalize score and Ensure it's set in report
              const score = report.detectedAutoScore || (report.rating >= 85 ? 'good' : report.rating >= 60 ? 'partial' : 'missed');
              report.detectedAutoScore = score as 'good' | 'partial' | 'missed';
              
              setAiReport(report);

              // Auto-Save and Auto-Update Stats
              onSaveReport(currentProblem.title, 'walkie', report);
              
              if (score === 'good') {
                  onMastered(currentProblem.title);
                  setSessionScore(prev => prev + 1);
                  setDailyCleared(prev => prev + 1);
                  setTotalConquered(prev => {
                      const newVal = prev + 1;
                      localStorage.setItem('micdrop_total_conquered', String(newVal));
                      return newVal;
                  });
              }

              setStep('reveal');
            }
          } catch (e) {
            console.error("AI Analysis failed", e);
            setStep('reveal');
          }
        };
        reader.readAsDataURL(audioBlob);
      };
      mediaRecorderRef.current.stop();
    }
  };

  const handleContinue = () => {
    if (!aiReport) return;
    const score = aiReport.detectedAutoScore || 'partial';

    if (score !== 'good') {
      const remainingQueue = [...problemQueue];
      remainingQueue.push(currentProblem);
      setProblemQueue(remainingQueue);
    }

    if (currentQueueIdx < problemQueue.length - 1) {
      setCurrentQueueIdx(prev => prev + 1);
      setStep('problem');
      setRevealHintIdx(0);
      setTranscript("");
      setRawTranscript("");
    } else {
      setStep('locations');
    }
  };

  const startSpotSession = async (spot: typeof POWER_SPOTS[0]) => {
    setSelectedSpot(spot);
    setStep('curating');
    
    try {
        // Fetch pre-generated problems from Supabase instead of generating on the fly
        const problems = await fetchBlindProblemsByTopics(spot.topics, spot.batchSize, masteredIds);
        
        if (problems.length === 0) {
            console.warn("No problems found for topics:", spot.topics);
            // Fallback: try fetching without excluding mastered IDs
            const fallbackProblems = await fetchBlindProblemsByTopics(spot.topics, spot.batchSize, []);
            if (fallbackProblems.length === 0) {
                console.error("No problems available in database for these topics");
                setStep('locations');
                return;
            }
            setProblemQueue(fallbackProblems);
        } else {
            setProblemQueue(problems);
        }
        
        setCurrentQueueIdx(0);
        setSessionScore(0);
        setStep('problem');
    } catch (e) {
        console.error("Curating failed", e);
        setStep('locations');
    }
  };

  const getSpotIcon = (icon: string) => {
    switch(icon) {
        case 'coffee': return <Coffee size={28} />;
        case 'park': return <Trees size={28} />;
        case 'train': return <Train size={28} />;
        default: return <Target size={28} />;
    }
  };

  if (step === 'locations') {
    return (
      <div className="h-full bg-charcoal text-white flex flex-col font-sans overflow-hidden">
        {/* Daily Quest Header - Added pr-24 to avoid UserMenu overlap */}
        <div className="p-8 pr-24 flex items-center gap-6 border-b border-white/5 shrink-0 bg-black">
          <button onClick={() => onHome(true)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"><Home size={20} /></button>
          
          <div className="flex-1 text-center">
            <div className="text-[10px] text-gold font-bold tracking-[0.3em] uppercase mb-1">Daily Quest</div>
            <div className="flex items-center justify-center gap-3">
                <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold transition-all duration-700" style={{ width: `${(dailyCleared / 15) * 100}%` }}></div>
                </div>
                <span className="text-sm font-bold font-mono text-gold">{dailyCleared} / 15</span>
            </div>
          </div>

          <button 
            onClick={() => setShowStats(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition-all shadow-[0_0_20px_rgba(199,169,101,0.1)] shrink-0"
          >
            <Trophy size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 pb-40 max-w-2xl mx-auto w-full">
          <div className="text-center mb-4">
              <h2 className="text-4xl font-serif font-bold text-white mb-2">Power Spots</h2>
              <p className="text-gray-500 text-sm italic">Clear 5 problems at any spot to complete your ritual.</p>
          </div>

          {POWER_SPOTS.map((spot) => (
            <button 
              key={spot.id} 
              onClick={() => startSpotSession(spot)}
              className="w-full bg-white/5 rounded-[2.5rem] border-2 border-white/5 p-8 flex items-center gap-8 text-left hover:border-gold/40 hover:bg-gold/5 transition-all group"
            >
              <div className="w-20 h-20 rounded-3xl bg-charcoal border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-gold group-hover:text-charcoal transition-all">
                  {getSpotIcon(spot.icon)}
              </div>
              <div className="flex-1">
                  <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">{spot.ritual}</div>
                  <h3 className="text-2xl font-serif font-bold mb-1">{spot.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{spot.description}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-gold">
                  <ChevronRight size={20} />
              </div>
            </button>
          ))}

          {dailyCleared >= 15 && (
            <div className="bg-gold/10 border border-gold/40 rounded-[2.5rem] p-10 text-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-charcoal mx-auto mb-4 shadow-[0_0_30px_rgba(199,169,101,0.4)]">
                    <Star size={32} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gold mb-2">Daily Goal Achieved!</h3>
                <p className="text-gold/60 text-sm">You have mastered 15 coding patterns today. Ritual complete.</p>
            </div>
          )}
        </div>

        {/* HALL OF FAME MODAL */}
        {showStats && (
            <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="bg-charcoal border border-white/10 rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl relative">
                    <div className="p-10 text-center border-b border-white/5">
                        <button onClick={() => setShowStats(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mx-auto mb-6 border border-gold/20">
                            <Award size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold mb-2 uppercase tracking-tight">The Hall of Fame</h2>
                        <p className="text-gray-500 text-sm italic tracking-widest uppercase">Blind 75 Progress</p>
                    </div>

                    <div className="p-10 space-y-10">
                        {/* Coverage Progress - Refined to not look like a button */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Curriculum Coverage</span>
                                <span className="text-lg font-mono font-bold text-white">{masteredIds.length} <span className="text-gray-600 text-xs">/ 75</span></span>
                            </div>
                            <div className="relative h-2.5 w-full bg-black/40 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-gold/60 to-gold shadow-[0_0_15px_rgba(199,169,101,0.3)] transition-all duration-1000 ease-out" 
                                    style={{ width: `${globalProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Cards Section - Clearer Labels */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:border-gold/30 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target size={14} className="text-gray-500" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Breadth</span>
                                </div>
                                <div className="text-3xl font-bold text-white">{globalProgress}%</div>
                                <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Unique Patterns Done</div>
                            </div>
                            
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:border-gold/30 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <Flame size={14} className="text-gold" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Depth</span>
                                </div>
                                <div className="text-3xl font-bold text-gold">{totalConquered}</div>
                                <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Total Successful Clears</div>
                            </div>
                        </div>

                        {/* Mastery Cycle */}
                        <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                    <Repeat size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-gold uppercase tracking-widest">Mastery Cycle</div>
                                    <div className="text-sm font-bold text-white">Full Passes: {masteryCycle - 1}.{Math.floor((totalConquered % 75) / 7.5)}</div>
                                </div>
                            </div>
                            <div className="text-[10px] text-gold/60 font-medium max-w-[100px] text-right italic leading-tight">
                                "The master does it until he cannot fail."
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowStats(false)} 
                        className="w-full py-8 bg-black text-[10px] font-bold uppercase tracking-[0.4em] text-gold hover:bg-gold hover:text-charcoal transition-all"
                    >
                        Return to Quest
                    </button>
                </div>
            </div>
        )}
      </div>
    );
  }

  if (step === 'curating') {
    return (
      <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-8 animate-pulse border border-gold/20">
          <Sparkles size={48} />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4">Entering {selectedSpot?.name}</h2>
        <p className="text-gray-400 font-light italic leading-relaxed max-w-sm">
          Selecting 5 unmastered challenges for your ritual...
        </p>
        <Loader2 size={24} className="mt-12 animate-spin text-gold/40" />
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-8 animate-pulse border border-gold/20">
          <BrainCircuit size={48} />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4">
            {analysisPhase === 'refining' ? 'Polishing Logic' : 'Verifying Model'}
        </h2>
        <p className="text-gray-400 font-light italic leading-relaxed max-w-sm">
          {analysisPhase === 'refining' ? "Refining speech data..." : "Checking Logic, Complexity, and Examples..."}
        </p>
        <Loader2 size={24} className="mt-12 animate-spin text-gold/40" />
      </div>
    );
  }

  if (step === 'problem' || step === 'recording') {
    return (
      <div className="h-full bg-charcoal text-white flex flex-col font-sans overflow-hidden">
        <div className="p-8 pr-24 flex items-center justify-between shrink-0 bg-black/20 border-b border-white/5">
          <button onClick={() => setStep('locations')} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"><ArrowLeft size={18} /></button>
          <div className="flex items-center gap-3">
             <div className="px-4 py-1.5 rounded-full border border-gold/30 text-[10px] font-bold text-gold bg-gold/5 uppercase tracking-widest">
                {selectedSpot?.name}
             </div>
             <div className="px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-bold text-gray-400 bg-white/5 uppercase tracking-widest">
                {currentQueueIdx + 1} of 5 in batch
             </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-4">
          <div className="max-w-2xl mx-auto pb-40">
            <h2 className="text-5xl font-serif font-bold mb-10 leading-tight">{currentProblem?.title}</h2>
            <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10 mb-10">
              <div className="flex items-center gap-2 mb-6">
                 <BookOpen size={20} className="text-gold" />
                 <span className="text-xs font-bold text-gold uppercase tracking-widest">Problem Statement</span>
              </div>
              <p className="text-xl text-gray-200 leading-relaxed font-light mb-10">{currentProblem?.prompt}</p>
              {currentProblem?.example && (
                <div className="bg-black/40 p-8 rounded-3xl border border-white/5 font-mono text-sm text-gray-300 mb-10 leading-relaxed overflow-x-auto"><pre className="whitespace-pre-wrap">{currentProblem.example}</pre></div>
              )}
            </div>
            <button onClick={() => setRevealHintIdx(p => Math.min(p + 1, 3))} className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] border border-gold/40 px-8 py-4 rounded-full hover:bg-gold/10 transition-all flex items-center gap-3 mx-auto">Need a Hint? <Sparkles size={14} /></button>
            <div className="grid gap-6 mt-10">
              {revealHintIdx >= 1 && <div className="p-8 bg-gold/5 border border-gold/10 rounded-[2rem] animate-in slide-in-from-bottom-4"><span className="text-[10px] font-bold uppercase text-gold tracking-widest mb-3 block opacity-60">Pattern</span><p className="text-2xl font-serif font-semibold">{currentProblem?.pattern}</p></div>}
              {revealHintIdx >= 2 && <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] animate-in slide-in-from-bottom-4"><span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-3 block">Key Idea</span><p className="text-xl italic font-light">"{currentProblem?.keyIdea}"</p></div>}
              {revealHintIdx >= 3 && <div className="p-8 bg-black border border-white/10 rounded-[2rem] animate-in slide-in-from-bottom-4"><span className="text-[10px] font-bold uppercase text-gray-600 tracking-widest mb-3 block">Logic Structure (Python)</span><pre className="text-sm font-mono text-gold/80 whitespace-pre-wrap">{currentProblem?.skeleton}</pre></div>}
            </div>
          </div>
        </div>
        <div className="p-10 bg-gradient-to-t from-black via-black/90 to-transparent shrink-0 flex flex-col items-center">
          {step === 'problem' ? (
            <button onClick={() => { setStep('recording'); handleStartRecording(); }} className="w-24 h-24 rounded-full bg-charcoal border-4 border-white/10 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-90 transition-all group"><Mic size={40} className="group-hover:text-gold transition-colors" /></button>
          ) : (
            <div className="w-full max-w-2xl flex flex-col items-center">
              <div className={`w-full bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 mb-10 border border-white/10 min-h-[120px] max-h-[40vh] overflow-y-auto text-gray-400 font-serif italic text-xl text-center ${!rawTranscript ? 'flex items-center justify-center' : 'block'}`}>
                  {rawTranscript || "Verbalize your mental model..."}
              </div>
              <button onClick={handleStopRecording} className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl animate-pulse border-4 border-white/10 active:scale-95"><StopCircle size={40} /></button>
            </div>
          )}
          <span className="mt-8 text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">{step === 'problem' ? 'Push to Explain' : 'Stop Recording'}</span>
        </div>
      </div>
    );
  }

  if (step === 'reveal' && aiReport) {
    const score = aiReport.detectedAutoScore || 'partial';
    
    return (
      <div className="h-full bg-cream text-charcoal flex flex-col font-sans overflow-hidden">
        <div className="p-8 pr-24 flex items-center justify-between shrink-0 bg-white border-b border-[#E6E6E6]">
             <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-charcoal text-white flex items-center justify-center border border-white/10">
                     <Code2 size={24} />
                 </div>
                 <div>
                     <h2 className="text-xl font-serif font-bold text-charcoal">Walkie Analysis</h2>
                     <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Problem Review</p>
                 </div>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pb-32">
            <div className="max-w-4xl mx-auto">
                <div className="bg-charcoal text-white rounded-3xl p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-2">AI Verdict</h3>
                        <p className="text-gray-400 text-sm">Gemini has evaluated your solution correctness.</p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                         {score === 'good' && (
                             <div className="flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300">
                                 <CheckCircle2 size={24} />
                                 <span className="font-bold uppercase tracking-widest text-sm">Mastered</span>
                             </div>
                         )}
                         {score === 'partial' && (
                             <div className="flex items-center gap-3 px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-yellow-300">
                                 <AlertCircle size={24} />
                                 <span className="font-bold uppercase tracking-widest text-sm">Partial</span>
                             </div>
                         )}
                         {score === 'missed' && (
                             <div className="flex items-center gap-3 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
                                 <ShieldAlert size={24} />
                                 <span className="font-bold uppercase tracking-widest text-sm">Missed</span>
                             </div>
                         )}
                         
                        <button onClick={handleContinue} className="px-8 py-3 rounded-xl bg-gold text-charcoal hover:bg-white transition-all font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2">
                           {currentQueueIdx < problemQueue.length - 1 ? 'Next Challenge' : 'Complete Batch'} <ArrowLeft className="rotate-180" size={14} />
                        </button>
                    </div>
                </div>

                <PerformanceReportComponent 
                   report={aiReport}
                   transcript={transcript}
                   isSaved={() => false}
                   onToggleSave={() => {}}
                   onDone={() => {}} 
                />
            </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WalkieTalkieView;
