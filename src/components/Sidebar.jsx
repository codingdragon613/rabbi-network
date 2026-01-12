import React, { useState } from 'react';
import { Search, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const Sidebar = ({ rabbis, onSelect, selectedRabbi }) => {
    const [query, setQuery] = useState('');
    const filtered = rabbis.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase())
    );
    return (
        <div className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col text-slate-100 shadow-xl z-10">
            <div className="p-4 border-b border-slate-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Rabbi Network
                </h1>
            </div>
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search Rabbis..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filtered.map(rabbi => (
                    <motion.div
                        key={rabbi.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => onSelect(rabbi)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3
              ${selectedRabbi?.id === rabbi.id
                                ? 'bg-blue-600/20 border border-blue-500/50'
                                : 'hover:bg-slate-800 border border-transparent'}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                            {rabbi.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-medium text-sm">{rabbi.name}</div>
                            <div className="text-xs text-slate-400">{rabbi.category} • {rabbi.region || 'Israel'}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <AnimatePresence>
                {selectedRabbi && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-800 bg-slate-900 p-4"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{selectedRabbi.name}</h3>
                            <button onClick={() => onSelect(null)} className="text-slate-400 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{selectedRabbi.description}</p>
                        <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">
                                {selectedRabbi.category}
                            </span>
                            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">
                                {selectedRabbi.region || 'Israel'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default Sidebar;
