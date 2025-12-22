import React from 'react';
import { ArrowRight, Flame, BarChart3, Zap, Radio } from 'lucide-react';

interface HomeViewProps {
    onNavigate: (view: 'analysis' | 'database' | 'hot-take' | 'walkie-talkie') => void;
}

// Card component for cleaner code and consistent mobile styling
interface FeatureCardProps {
    onClick: () => void;
    icon: React.ReactNode;
    bgIcon: React.ReactNode;
    iconBgClass: string;
    title: string;
    description: string;
    cta: string;
    ctaShort: string;
    featured?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
    onClick, icon, bgIcon, iconBgClass, title, description, cta, ctaShort, featured 
}) => (
    <button 
        onClick={onClick} 
        className={`group bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-md sm:shadow-lg hover:shadow-2xl transition-all border text-left relative overflow-hidden flex flex-col h-full active:scale-[0.98] ${
            featured 
                ? 'border-gold/30 hover:border-gold ring-2 ring-gold/10' 
                : 'border-[#EBE8E0] hover:border-gold/30'
        }`}
    >
        {/* Background decorative icon - hidden on mobile */}
        <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-10 group-hover:opacity-20 transition-opacity hidden sm:block">
            {bgIcon}
        </div>
        
        {/* Icon badge */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl ${iconBgClass} flex items-center justify-center mb-3 sm:mb-5 md:mb-8 shadow-sm sm:shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0`}>
            {icon}
        </div>
        
        <div className="flex-1 min-h-0">
            <h3 className="text-base sm:text-lg md:text-2xl font-serif font-bold text-charcoal mb-1 sm:mb-3 md:mb-4">{title}</h3>
            {/* Hide description on mobile - show only on md+ screens */}
            <p className="hidden md:block text-gray-500 text-base leading-relaxed mb-8">
                {description}
            </p>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 text-gold font-semibold text-[9px] sm:text-[10px] md:text-xs tracking-wider uppercase mt-auto pt-1 sm:pt-2">
            <span className="hidden sm:inline">{cta}</span>
            <span className="sm:hidden">{ctaShort}</span>
            <ArrowRight size={10} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
    </button>
);

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
    return (
        <div className="h-full bg-cream text-charcoal relative overflow-y-auto font-sans">
            {/* Background gradient */}
            <div className="fixed inset-0 opacity-40 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, #F0EBE0 0%, transparent 20%), radial-gradient(circle at 85% 85%, #E8E0D0 0%, transparent 20%)' }}>
            </div>

            {/* Main content - centered on all screen sizes */}
            <div className="min-h-full flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8 md:mb-12 z-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif mb-2 sm:mb-4 md:mb-6 tracking-tight text-charcoal">
                        MicDrop
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg md:text-xl font-serif italic max-w-lg mx-auto leading-relaxed px-4">
                        Don't just answer. Perform.
                    </p>
                </div>

                {/* Cards grid - 2 columns on mobile for compact view, scales up */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 z-10 w-full max-w-7xl pb-6 sm:pb-8 md:pb-12">
                    {/* Card 1: The Coach */}
                    <FeatureCard
                        onClick={() => onNavigate('analysis')}
                        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8" />}
                        bgIcon={<Flame className="w-20 h-20 md:w-28 md:h-28 lg:w-[120px] lg:h-[120px] text-gold" />}
                        iconBgClass="bg-cream border border-gold/20 text-gold"
                        title="The Coach"
                        description="Complete interview analysis. Upload audio for forensic transcript and executive-level feedback."
                        cta="Start Analysis"
                        ctaShort="Analyze"
                    />

                    {/* Card 2: Hot Take (Featured) */}
                    <FeatureCard
                        onClick={() => onNavigate('hot-take')}
                        icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8" />}
                        bgIcon={<Zap className="w-20 h-20 md:w-28 md:h-28 lg:w-[120px] lg:h-[120px] text-gold" />}
                        iconBgClass="bg-gold text-white"
                        title="Hot Take"
                        description="Live voice sparring. Gemini probes with follow-ups to stress-test your narrative."
                        cta="Start Sparring"
                        ctaShort="Spar"
                        featured
                    />

                    {/* Card 3: Walkie-Talkie */}
                    <FeatureCard
                        onClick={() => onNavigate('walkie-talkie')}
                        icon={<Radio className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8" />}
                        bgIcon={<Radio className="w-20 h-20 md:w-28 md:h-28 lg:w-[120px] lg:h-[120px] text-charcoal" />}
                        iconBgClass="bg-charcoal text-white"
                        title="Walkie-Talkie"
                        description="Master the Blind 75 on the move. Explain algorithms out loud and get AI feedback."
                        cta="Go Out"
                        ctaShort="Walk"
                    />

                    {/* Card 4: My Performance */}
                    <FeatureCard
                        onClick={() => onNavigate('database')}
                        icon={<BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8" />}
                        bgIcon={<BarChart3 className="w-20 h-20 md:w-28 md:h-28 lg:w-[120px] lg:h-[120px] text-gold" />}
                        iconBgClass="bg-gradient-to-br from-gold/10 to-gold/20 border border-gold/30 text-gold"
                        title="My Performance"
                        description="Access saved reports and track progress over time. Review past analyses."
                        cta="View Reports"
                        ctaShort="View"
                    />
                </div>
            </div>
        </div>
    );
};

export default HomeView;
