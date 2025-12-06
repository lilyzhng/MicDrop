
import React from 'react';
import { Home, Database, Trash2, Lightbulb, PenTool, Star, Ear, Mic2 } from 'lucide-react';
import { SavedItem } from '../types';

interface DatabaseViewProps {
    savedItems: SavedItem[];
    onDelete: (id: string) => void;
    onHome: () => void;
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ savedItems, onDelete, onHome }) => {
    return (
        <div className="h-full bg-cream text-charcoal flex flex-col font-sans overflow-hidden">
             {/* Header */}
             <div className="h-20 bg-white border-b border-[#E6E6E6] flex items-center justify-between px-8 z-50 shrink-0">
                  <div className="flex items-center gap-4">
                      <button onClick={onHome} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                          <Home size={18} className="text-gray-500" />
                      </button>
                      <div>
                          <div className="text-[10px] font-bold text-gold uppercase tracking-widest">MicDrop</div>
                          <h2 className="text-xl font-serif font-bold text-charcoal">
                              My Database
                          </h2>
                      </div>
                  </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 relative min-h-0">
                 <div className="max-w-4xl mx-auto pb-20">
                     {savedItems.length === 0 ? (
                         <div className="text-center py-20">
                             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                 <Database size={32} />
                             </div>
                             <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">No Saved Items</h3>
                             <p className="text-gray-500 max-w-sm mx-auto">
                                 Bookmark highlights and improvement feedback from your coaching sessions to build your personal knowledge base.
                             </p>
                         </div>
                     ) : (
                         <div className="space-y-8">
                             {/* Improvements Section */}
                             {savedItems.filter(i => i.type === 'improvement').length > 0 && (
                                 <div>
                                     <div className="flex items-center gap-2 mb-6">
                                         <Lightbulb className="text-charcoal" size={20} />
                                         <h3 className="text-lg font-bold text-charcoal uppercase tracking-widest">Improvements to Work On</h3>
                                     </div>
                                     <div className="grid gap-6">
                                         {savedItems.filter(i => i.type === 'improvement').map(item => (
                                             <div key={item.id} className="bg-white rounded-2xl p-8 shadow-sm border border-[#EBE8E0] relative group">
                                                 <button 
                                                     onClick={() => onDelete(item.id)}
                                                     className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                     title="Remove from database"
                                                 >
                                                     <Trash2 size={16} />
                                                 </button>
                                                 <div className="flex items-center gap-2 mb-4">
                                                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{item.category}</span>
                                                      <span className="text-[10px] text-gray-300 ml-auto">{new Date(item.date).toLocaleDateString()}</span>
                                                 </div>
                                                 <h4 className="text-lg font-bold text-charcoal mb-2">{item.title}</h4>
                                                 <div className="bg-[#FAF9F6] p-4 rounded-xl border-l-4 border-gray-200 mb-4">
                                                      <p className="text-charcoal font-serif text-sm leading-relaxed">"{item.content}"</p>
                                                 </div>
                                                 {item.rewrite && (
                                                     <div className="bg-green-50/50 p-4 rounded-xl border-l-4 border-green-400">
                                                         <h5 className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <PenTool size={12}/> The Rewrite
                                                         </h5>
                                                         <p className="text-charcoal font-serif text-sm leading-relaxed">"{item.rewrite}"</p>
                                                     </div>
                                                 )}
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}
  
                             {/* Highlights Section */}
                             {savedItems.filter(i => i.type === 'highlight').length > 0 && (
                                 <div>
                                     <div className="flex items-center gap-2 mb-6 mt-12">
                                         <Star className="text-gold" size={20} />
                                         <h3 className="text-lg font-bold text-charcoal uppercase tracking-widest">Key Strengths</h3>
                                     </div>
                                     <div className="grid md:grid-cols-2 gap-6">
                                         {savedItems.filter(i => i.type === 'highlight').map(item => (
                                             <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBE8E0] relative group">
                                                 <button 
                                                     onClick={() => onDelete(item.id)}
                                                     className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                     title="Remove from database"
                                                 >
                                                     <Trash2 size={16} />
                                                 </button>
                                                 <div className="flex items-center gap-2 mb-3">
                                                     <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                                         <Star size={12} fill="#C7A965" />
                                                     </div>
                                                     <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{item.category}</span>
                                                 </div>
                                                 <h4 className="text-md font-bold text-charcoal mb-2">{item.title}</h4>
                                                 <div className="bg-[#FAF9F6] p-4 rounded-xl mt-4">
                                                     <p className="text-charcoal italic font-serif text-sm">"{item.content}"</p>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}
  
                             {/* Drills Section */}
                             {savedItems.filter(i => i.type === 'drill').length > 0 && (
                                 <div>
                                     <div className="flex items-center gap-2 mb-6 mt-12">
                                         <Ear className="text-charcoal" size={20} />
                                         <h3 className="text-lg font-bold text-charcoal uppercase tracking-widest">Saved Drills</h3>
                                     </div>
                                     <div className="grid gap-6">
                                         {savedItems.filter(i => i.type === 'drill').map(item => (
                                             <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBE8E0] relative group">
                                                 <button 
                                                     onClick={() => onDelete(item.id)}
                                                     className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                     title="Remove from database"
                                                 >
                                                     <Trash2 size={16} />
                                                 </button>
                                                 <div className="flex items-center gap-2 mb-3">
                                                     <div className="w-6 h-6 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal">
                                                         <Mic2 size={12} />
                                                     </div>
                                                     <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{item.category}</span>
                                                 </div>
                                                 <h4 className="text-md font-bold text-charcoal mb-2">{item.title}</h4>
                                                 <p className="text-gray-500 italic text-sm mb-4">"{item.content}"</p>
                                                 <div className="bg-[#FAF9F6] p-4 rounded-xl border border-gold/20">
                                                     <p className="text-charcoal font-serif text-lg tracking-wide">{item.rewrite}</p>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}
                         </div>
                     )}
                 </div>
             </div>
        </div>
    );
};

export default DatabaseView;
