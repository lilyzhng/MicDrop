import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Clock, GraduationCap, Code2, Layers } from 'lucide-react';

export interface TimelineSession {
    id: string;
    title: string;
    type: 'walkie' | 'teach' | 'readiness';
    startTime: Date;
    endTime: Date;
    durationSeconds: number;
    score: number;
}

interface DayTimelineModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string;
    sessions: TimelineSession[];
}

// Format seconds into readable time string
const formatDuration = (seconds: number): string => {
    if (seconds <= 0) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
};

// Format time as HH:MM AM/PM
const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get type icon and color
const getTypeConfig = (type: 'walkie' | 'teach' | 'readiness') => {
    switch (type) {
        case 'teach':
            return { 
                icon: <GraduationCap size={14} />, 
                color: 'emerald',
                bgColor: 'bg-emerald-500/20',
                borderColor: 'border-emerald-500/30',
                textColor: 'text-emerald-400',
                barColor: 'bg-emerald-500',
                label: 'Teach'
            };
        case 'readiness':
            return { 
                icon: <Layers size={14} />, 
                color: 'yellow',
                bgColor: 'bg-yellow-500/20',
                borderColor: 'border-yellow-500/30',
                textColor: 'text-yellow-400',
                barColor: 'bg-yellow-500',
                label: 'Explain'
            };
        case 'walkie':
        default:
            return { 
                icon: <Code2 size={14} />, 
                color: 'blue',
                bgColor: 'bg-blue-500/20',
                borderColor: 'border-blue-500/30',
                textColor: 'text-blue-400',
                barColor: 'bg-blue-500',
                label: 'LeetCode'
            };
    }
};

// Get score color based on value
const getScoreColor = (score: number): string => {
    if (score >= 75) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
};

const DayTimelineModal: React.FC<DayTimelineModalProps> = ({
    isOpen,
    onClose,
    selectedDate,
    sessions
}) => {
    const navigate = useNavigate();
    
    if (!isOpen) return null;
    
    // Parse the date for display
    const dateObj = new Date(selectedDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
    });
    
    // Calculate total study time
    const totalTime = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
    
    // Find the time range for the timeline
    const sortedSessions = [...sessions].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    // For visualization, we'll find the earliest and latest times
    let earliestHour = 24;
    let latestHour = 0;
    
    sessions.forEach(s => {
        const startHour = s.startTime.getHours();
        const endHour = s.endTime.getHours() + (s.endTime.getMinutes() > 0 ? 1 : 0);
        earliestHour = Math.min(earliestHour, startHour);
        latestHour = Math.max(latestHour, endHour);
    });
    
    // Ensure at least 2 hour range and round to nice boundaries
    earliestHour = Math.max(0, Math.floor(earliestHour) - 1);
    latestHour = Math.min(24, Math.ceil(latestHour) + 1);
    
    if (latestHour - earliestHour < 3) {
        latestHour = earliestHour + 3;
    }
    
    const timelineHours = latestHour - earliestHour;
    
    // Convert time to percentage position on timeline
    const getTimePosition = (date: Date): number => {
        const hours = date.getHours() + date.getMinutes() / 60;
        return ((hours - earliestHour) / timelineHours) * 100;
    };
    
    // Format hour for axis labels
    const formatHour = (hour: number): string => {
        if (hour === 0 || hour === 24) return '12 AM';
        if (hour === 12) return '12 PM';
        if (hour < 12) return `${hour} AM`;
        return `${hour - 12} PM`;
    };
    
    // Generate hour markers
    const hourMarkers: number[] = [];
    for (let h = earliestHour; h <= latestHour; h++) {
        hourMarkers.push(h);
    }
    
    return (
        <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
            onClick={onClose}
        >
            <div 
                className="bg-charcoal rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock size={20} className="text-gold" />
                            Daily Timeline
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">{formattedDate}</p>
                        {totalTime > 0 && (
                            <p className="text-sm font-medium text-gold mt-2">
                                Total study time: {formatDuration(totalTime)}
                            </p>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 min-h-0">
                    {sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-4">📅</div>
                            <p className="text-gray-400 text-lg">No activity on this day</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Select a day with practice sessions to see the timeline
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Visual Timeline */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    Timeline View
                                </h3>
                                
                                {/* Timeline Container */}
                                <div className="relative h-32 mb-2">
                                    {/* Hour grid lines */}
                                    {hourMarkers.map((hour, idx) => (
                                        <div 
                                            key={hour}
                                            className="absolute top-0 bottom-0 border-l border-white/10"
                                            style={{ left: `${(idx / timelineHours) * 100}%` }}
                                        />
                                    ))}
                                    
                                    {/* Session blocks */}
                                    {sortedSessions.map((session, idx) => {
                                        const config = getTypeConfig(session.type);
                                        const startPos = getTimePosition(session.startTime);
                                        const endPos = getTimePosition(session.endTime);
                                        const width = Math.max(2, endPos - startPos); // Minimum 2% width
                                        
                                        return (
                                            <button
                                                key={session.id}
                                                onClick={() => {
                                                    onClose();
                                                    navigate(`/report/${session.id}`);
                                                }}
                                                className={`absolute ${config.barColor} rounded hover:opacity-80 transition-all cursor-pointer hover:ring-2 hover:ring-white/30`}
                                                style={{ 
                                                    left: `${startPos}%`,
                                                    width: `${width}%`,
                                                    top: `${(idx % 4) * 25 + 5}%`,
                                                    height: '20%',
                                                    minWidth: '8px'
                                                }}
                                                title={`${session.title}\n${formatTime(session.startTime)} - ${formatTime(session.endTime)}\nScore: ${session.score}`}
                                            />
                                        );
                                    })}
                                </div>
                                
                                {/* Hour labels */}
                                <div className="relative h-6">
                                    {hourMarkers.map((hour, idx) => (
                                        <div 
                                            key={hour}
                                            className="absolute text-[10px] text-gray-500 -translate-x-1/2"
                                            style={{ left: `${(idx / timelineHours) * 100}%` }}
                                        >
                                            {formatHour(hour)}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Legend */}
                                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10">
                                    {(['walkie', 'teach', 'readiness'] as const).map(type => {
                                        const config = getTypeConfig(type);
                                        const count = sessions.filter(s => s.type === type).length;
                                        if (count === 0) return null;
                                        return (
                                            <div key={type} className="flex items-center gap-1.5">
                                                <div className={`w-3 h-3 rounded ${config.barColor}`} />
                                                <span className="text-xs text-gray-400">
                                                    {config.label} ({count})
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Detailed Session List */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    Session Details ({sessions.length})
                                </h3>
                                <div className="space-y-2">
                                    {sortedSessions.map((session) => {
                                        const config = getTypeConfig(session.type);
                                        
                                        return (
                                            <button
                                                key={session.id}
                                                onClick={() => {
                                                    onClose();
                                                    navigate(`/report/${session.id}`);
                                                }}
                                                className={`w-full ${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-center gap-4 hover:bg-white/10 transition-colors text-left group`}
                                            >
                                                {/* Time Column */}
                                                <div className="flex-shrink-0 text-center">
                                                    <div className="text-sm font-bold text-white">
                                                        {formatTime(session.startTime)}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500">to</div>
                                                    <div className="text-sm font-bold text-white">
                                                        {formatTime(session.endTime)}
                                                    </div>
                                                </div>
                                                
                                                {/* Divider */}
                                                <div className={`w-0.5 h-12 ${config.barColor} rounded-full`} />
                                                
                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${config.textColor}`}>
                                                            {config.icon}
                                                            {config.label}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            • {formatDuration(session.durationSeconds)}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-white font-medium group-hover:text-gold transition-colors truncate">
                                                        {session.title}
                                                    </h4>
                                                </div>
                                                
                                                {/* Score */}
                                                <div className="flex-shrink-0 text-right">
                                                    <div className={`text-2xl font-bold ${getScoreColor(session.score)}`}>
                                                        {session.score}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 uppercase">
                                                        score
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer with Summary */}
                {sessions.length > 0 && (
                    <div className="p-4 border-t border-white/10 bg-white/5 flex-shrink-0">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">
                                    {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-400">
                                    {new Set(sessions.map(s => s.title)).size} unique problem{new Set(sessions.map(s => s.title)).size !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <span className="text-gold font-bold">
                                Avg score: {Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayTimelineModal;

