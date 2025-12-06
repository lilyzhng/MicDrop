
import React, { useState, useRef } from 'react';
import { Home, Upload, Check, ArrowRight, Loader2, Download } from 'lucide-react';
import { PerformanceReport, SavedItem } from '../types';
import { getAudioMimeType } from '../utils';
import { analyzeStage1_Transcribe, analyzeStage2_Coach } from '../services/analysisService';
import PerformanceReportComponent from '../components/PerformanceReport';

interface AnalysisViewProps {
    mode: 'sound_check' | 'coach';
    onHome: (force: boolean) => void;
    isSaved: (title: string, content: string) => boolean;
    onToggleSave: (item: Omit<SavedItem, 'id' | 'date'>) => void;
    onSaveReport: (title: string, type: 'coach' | 'rehearsal', report: PerformanceReport) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ mode, onHome, isSaved, onToggleSave, onSaveReport }) => {
    // Local State
    const [uploadContext, setUploadContext] = useState("");
    const [manualTranscript, setManualTranscript] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedAudioBase64, setUploadedAudioBase64] = useState<string | null>(null);
    
    // Process State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState<'idle' | 'transcribing' | 'analyzing'>('idle');
    const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
    const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleHomeClick = () => {
        const hasData = !!(selectedFile || manualTranscript.trim() || uploadContext.trim() || transcriptionResult || performanceReport);
        onHome(!hasData);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const startSoundCheckAnalysis = async () => {
        if (!selectedFile) return;
        const MAX_SIZE = 20 * 1024 * 1024;
        if (selectedFile.size > MAX_SIZE) {
            alert("File is too large. Please upload an audio file smaller than 20MB.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const base64Audio = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
            });
            
            setUploadedAudioBase64(base64Audio);
            const mimeType = getAudioMimeType(selectedFile);
            setAnalysisStep('transcribing');
            const transcript = await analyzeStage1_Transcribe(base64Audio, mimeType, uploadContext);
            setTranscriptionResult(transcript);
        } catch (error) {
            console.error("Analysis failed:", error);
            alert(`Failed to analyze. Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        } finally {
            setIsAnalyzing(false);
            setAnalysisStep('idle');
        }
    };

    const startCoachAnalysis = async () => {
        if (!selectedFile && !manualTranscript.trim()) {
            alert("Please upload an audio file or paste a transcript.");
            return;
        }

        if (selectedFile && selectedFile.size > 20 * 1024 * 1024) {
             alert("File is too large. 20MB Max.");
             return;
        }

        setIsAnalyzing(true);
        try {
            let base64Audio = null;
            let mimeType = 'audio/mp3';

            if (selectedFile) {
                base64Audio = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedFile);
                });
                setUploadedAudioBase64(base64Audio);
                mimeType = getAudioMimeType(selectedFile);
            }

            setAnalysisStep('analyzing');
            let report: PerformanceReport;

            if (manualTranscript.trim()) {
                report = await analyzeStage2_Coach(base64Audio, manualTranscript, uploadContext, mimeType);
            } else {
                if (base64Audio) {
                    setAnalysisStep('transcribing');
                    const transcript = await analyzeStage1_Transcribe(base64Audio, mimeType, uploadContext);
                    setAnalysisStep('analyzing');
                    report = await analyzeStage2_Coach(base64Audio, transcript, uploadContext, mimeType);
                } else {
                    throw new Error("No input provided");
                }
            }
            setPerformanceReport(report);
            onSaveReport(uploadContext || "Interview Analysis", 'coach', report);

        } catch (error) {
            console.error("Coach analysis failed:", error);
            alert(`Failed to analyze. Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        } finally {
            setIsAnalyzing(false);
            setAnalysisStep('idle');
        }
    };

    const proceedToCoaching = () => {
        setIsAnalyzing(true);
        setAnalysisStep('analyzing');
        const mimeType = selectedFile ? getAudioMimeType(selectedFile) : 'audio/mp3';
        
        setTimeout(() => {
            analyzeStage2_Coach(uploadedAudioBase64, transcriptionResult!, uploadContext, mimeType)
            .then(report => {
                setPerformanceReport(report);
                onSaveReport(uploadContext || "Interview Analysis", 'coach', report);
                setIsAnalyzing(false);
                setAnalysisStep('idle');
            })
            .catch(error => {
                alert(`Analysis failed: ${error.message}`);
                setIsAnalyzing(false);
                setAnalysisStep('idle');
            });
        }, 50);
    };

    const downloadTranscript = () => {
        if (!transcriptionResult) return;
        const blob = new Blob([transcriptionResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
      <div className="h-full bg-cream text-charcoal flex flex-col font-sans overflow-hidden">
           {/* Header */}
           <div className="h-20 bg-white border-b border-[#E6E6E6] flex items-center justify-between px-8 z-50 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={handleHomeClick} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Home size={18} className="text-gray-500" />
                    </button>
                    <div>
                        <div className="text-[10px] font-bold text-gold uppercase tracking-widest">MicDrop</div>
                        <h2 className="text-xl font-serif font-bold text-charcoal">
                            {mode === 'sound_check' ? 'Sound Check' : 'The Coach'}
                        </h2>
                    </div>
                </div>
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto p-8 relative min-h-0">
                {!transcriptionResult && !performanceReport ? (
                    <div className="max-w-2xl mx-auto mt-12 bg-white rounded-3xl shadow-xl border border-[#EBE8E0] p-10 animate-in fade-in slide-in-from-bottom-4">
                        <div className="mb-8">
                             <h3 className="text-3xl font-serif font-bold text-charcoal mb-2">Upload Interview</h3>
                             <p className="text-gray-500">Supported formats: MP3, WAV, M4A.</p>
                        </div>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Context & Roles</label>
                                <textarea 
                                    className="w-full h-32 bg-[#FAF9F6] border border-[#E6E6E6] rounded-xl p-4 text-sm text-charcoal outline-none focus:border-gold resize-none focus:ring-1 focus:ring-gold/50"
                                    placeholder="e.g., 'This is an interview between recruiter Joe and me Lily.'"
                                    value={uploadContext}
                                    onChange={(e) => setUploadContext(e.target.value)}
                                />
                            </div>

                            {mode === 'coach' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Transcript (Optional)</label>
                                    <textarea 
                                        className="w-full h-32 bg-[#FAF9F6] border border-[#E6E6E6] rounded-xl p-4 text-sm text-charcoal outline-none focus:border-gold resize-none focus:ring-1 focus:ring-gold/50 placeholder:text-gray-300"
                                        placeholder="Paste existing transcript here to skip the transcription step..."
                                        value={manualTranscript}
                                        onChange={(e) => setManualTranscript(e.target.value)}
                                    />
                                </div>
                            )}

                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${selectedFile ? 'border-green-400 bg-green-50/50' : 'border-gray-200 hover:border-gold/50 hover:bg-gray-50'}`}
                            >
                                <input type="file" accept="audio/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                                {selectedFile ? (
                                    <>
                                        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                                            <Check size={28} />
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-lg font-bold text-green-800 break-all">{selectedFile.name}</span>
                                            <span className="text-xs text-green-600 uppercase tracking-widest font-bold mt-1">Ready to Analyze</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center text-gold mb-2">
                                            <Upload size={24} />
                                        </div>
                                        <div className="text-center">
                                            <span className="block font-medium text-gray-600">Click to upload audio file</span>
                                            <span className="text-xs text-gray-400 mt-1">or drag and drop</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {(selectedFile || (mode === 'coach' && manualTranscript.trim())) && !isAnalyzing && (
                                <button 
                                    onClick={mode === 'sound_check' ? startSoundCheckAnalysis : startCoachAnalysis}
                                    className="w-full py-4 bg-charcoal text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                    {mode === 'sound_check' ? 'Start Transcription' : 'Start Coach Analysis'}
                                    <ArrowRight size={18} />
                                </button>
                            )}

                            {isAnalyzing && (
                                <div className="text-center py-8">
                                    <Loader2 className="animate-spin mx-auto text-gold mb-4" size={32} />
                                    <p className="text-charcoal font-medium animate-pulse">
                                        {analysisStep === 'transcribing' ? 'Phase 1: Forensic Transcription...' : 'Phase 2: Coach Analysis...'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">This usually takes 15-30 seconds.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto pb-20">
                         {isAnalyzing ? (
                             <div className="bg-white rounded-3xl shadow-xl border border-[#EBE8E0] p-12 text-center animate-in fade-in zoom-in-95 duration-300">
                                 <Loader2 className="animate-spin mx-auto text-gold mb-6" size={48} />
                                 <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">
                                     {analysisStep === 'transcribing' ? 'Phase 1: Forensic Transcription...' : 'Phase 2: Coach Analysis...'}
                                 </h3>
                                 <p className="text-gray-500 animate-pulse">
                                     Gemini is reviewing your pacing, clarity, and delivery...
                                 </p>
                             </div>
                         ) : (
                             <>
                                 {mode === 'sound_check' && transcriptionResult && !performanceReport && (
                                     <div className="bg-white rounded-3xl shadow-xl border border-[#EBE8E0] overflow-hidden animate-in fade-in slide-in-from-bottom-8">
                                         <div className="p-8 border-b border-[#E6E6E6] flex justify-between items-center bg-cream/50">
                                             <div>
                                                 <h3 className="text-2xl font-serif font-bold text-charcoal">Forensic Transcript</h3>
                                                 <p className="text-sm text-gray-500">Stage 1 Analysis Complete</p>
                                             </div>
                                             <div className="flex gap-3">
                                                 <button onClick={downloadTranscript} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-charcoal">
                                                     <Download size={14} /> Download Text
                                                 </button>
                                                 <button onClick={proceedToCoaching} className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-bold hover:bg-black shadow-lg">
                                                     Proceed to Coaching <ArrowRight size={14} />
                                                 </button>
                                             </div>
                                         </div>
                                         <div className="p-8 max-h-[60vh] overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-700 bg-[#FAF9F6]">
                                             {transcriptionResult}
                                         </div>
                                     </div>
                                 )}

                                 {performanceReport && (
                                     <PerformanceReportComponent
                                        report={performanceReport}
                                        isSaved={isSaved}
                                        onToggleSave={onToggleSave}
                                        onDone={(f) => onHome(f)}
                                     />
                                 )}
                             </>
                         )}
                    </div>
                )}
           </div>
      </div>
    );
};

export default AnalysisView;
