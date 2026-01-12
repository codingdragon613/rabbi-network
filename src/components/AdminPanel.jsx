import React, { useState } from 'react';
import { GitHubService } from '../services/github';
import { Save, Lock, Plus, Trash2, X } from 'lucide-react';
const AdminPanel = ({ currentData, onUpdateLocalData }) => {
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [status, setStatus] = useState(''); // 'idle', 'saving', 'success', 'error'
    // Local state for editing before save
    const [data, setData] = useState(currentData);
    const [view, setView] = useState('list'); // 'list', 'edit-rabbi', 'edit-rel'
    const [editingItem, setEditingItem] = useState(null);
    const [editingRel, setEditingRel] = useState(null);
    const handleAuth = () => {
        if (token) setIsAuthenticated(true);
    };
    const handleSaveToGitHub = async () => {
        if (!token) return;
        setStatus('saving');
        const gh = new GitHubService(token);
        try {
            await gh.saveData(data, `Update data: ${new Date().toISOString()}`);
            setStatus('success');
            setTimeout(() => setStatus(''), 3000);
            onUpdateLocalData(data); // Update main app state instantly
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };
    const addRabbi = () => {
        const newId = (Math.max(...data.rabbis.map(r => parseInt(r.id) || 0)) + 1).toString();
        setEditingItem({ id: newId, name: '', category: 'Tanna', generation: 1, region: 'Israel', description: '' });
        setView('edit-rabbi');
    };
    const addRelationship = () => {
        setEditingRel({ source: '', target: '', type: 'Student' });
        setView('edit-rel');
    };
    const saveRabbi = (rabbi) => {
        const existingIndex = data.rabbis.findIndex(r => r.id === rabbi.id);
        const newRabbis = [...data.rabbis];
        if (existingIndex >= 0) {
            newRabbis[existingIndex] = rabbi;
        } else {
            newRabbis.push(rabbi);
        }
        setData({ ...data, rabbis: newRabbis });
        setView('list');
        setEditingItem(null);
    };
    const saveRelationship = (rel) => {
        // For simplicity, we just add to the list. Editing existing ones is tricky without IDs.
        // We will just allow adding new ones and deleting old ones for now, OR simplistic replacement if index is known (but we don't track index easily).
        // Let's assume we are adding a NEW one or replacing if we tracked an index. 
        // For this simple implementation, we'll just push.
        const newRels = [...data.relationships, rel];
        setData({ ...data, relationships: newRels });
        setView('list');
        setEditingRel(null);
    };
    const deleteRelationship = (idx) => {
        const newRels = [...data.relationships];
        newRels.splice(idx, 1);
        setData({ ...data, relationships: newRels });
    };
    const deleteRabbi = (id) => {
        if (!confirm("Are you sure? This will also remove relationships.")) return;
        const newRabbis = data.rabbis.filter(r => r.id !== id);
        const newRels = data.relationships.filter(r => r.source !== id && r.target !== id);
        setData({ rabbis: newRabbis, relationships: newRels });
    };
    if (!isAuthenticated) {
        return (
            <div className="p-8 max-w-md mx-auto bg-slate-900 rounded-xl border border-slate-800 shadow-2xl mt-10">
                <div className="text-center mb-6">
                    <Lock className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-white">Admin Access</h2>
                    <p className="text-slate-400 text-sm">Enter your GitHub Personal Access Token to edit data.</p>
                </div>
                <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="w-full bg-slate-800 border-slate-700 rounded p-2 text-white mb-4"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
                <button
                    onClick={handleAuth}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Unlock Editor
                </button>
                <p className="mt-4 text-xs text-slate-500 text-center">
                    Token is not stored anywhere. It is used once for this session.
                </p>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 bg-slate-950/95 z-50 overflow-y-auto p-8 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Data Editor</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSaveToGitHub}
                            disabled={status === 'saving'}
                            className={`flex items-center gap-2 px-6 py-2 rounded font-bold transition-all ${status === 'success' ? 'bg-green-600' :
                                status === 'error' ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-500'
                                }`}
                        >
                            <Save size={18} />
                            {status === 'saving' ? 'Saving...' : status === 'success' ? 'Saved!' : 'Save Changes'}
                        </button>
                        <button onClick={() => window.location.hash = ''} className="text-slate-400 hover:text-white pb-1 border-b border-transparent hover:border-white">
                            Exit
                        </button>
                    </div>
                </div>
                {view === 'list' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-200">Rabbis</h2>
                                <button onClick={addRabbi} className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-blue-400">
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="space-y-2 h-96 overflow-y-auto pr-2">
                                {data.rabbis.map(r => (
                                    <div key={r.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded border border-slate-700/50">
                                        <div>
                                            <div className="font-bold">{r.name}</div>
                                            <div className="text-xs text-slate-400">{r.category}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingItem(r); setView('edit-rabbi'); }} className="text-slate-400 hover:text-white px-2">Edit</button>
                                            <button onClick={() => deleteRabbi(r.id)} className="text-red-500 hover:text-red-400 px-2"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-200">Relationships</h2>
                                <button onClick={addRelationship} className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-blue-400">
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="space-y-2 h-96 overflow-y-auto pr-2">
                                {data.relationships.map((rel, idx) => {
                                    const src = data.rabbis.find(r => r.id === rel.source)?.name || rel.source;
                                    const tgt = data.rabbis.find(r => r.id === rel.target)?.name || rel.target;
                                    return (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/50 rounded border border-slate-700/50">
                                            <div className="text-sm">
                                                <span className="text-blue-400">{src}</span>
                                                <span className="mx-2 text-slate-500">→</span>
                                                <span className="text-purple-400">{tgt}</span>
                                                <div className="text-xs text-slate-500 uppercase mt-1">{rel.type}</div>
                                            </div>
                                            <button onClick={() => deleteRelationship(idx)} className="text-red-500 hover:text-red-400 px-2"><Trash2 size={16} /></button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {view === 'edit-rabbi' && editingItem && (
                    <div className="bg-slate-900 p-8 rounded-lg border border-slate-800 max-w-lg mx-auto">
                        <h2 className="text-xl font-bold mb-6">Edit Rabbi</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Name</label>
                                <input className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
                                    value={editingItem.name}
                                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Category</label>
                                    <select className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
                                        value={editingItem.category}
                                        onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                    >
                                        <option>Tanna</option>
                                        <option>Amora</option>
                                        <option>Rishon</option>
                                        <option>Acharon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Generation</label>
                                    <input type="number" className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
                                        value={editingItem.generation}
                                        onChange={e => setEditingItem({ ...editingItem, generation: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Region</label>
                                <select className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
                                    value={editingItem.region || 'Israel'}
                                    onChange={e => setEditingItem({ ...editingItem, region: e.target.value })}
                                >
                                    <option value="Israel">Israel</option>
                                    <option value="Bavel">Bavel</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Description</label>
                                <textarea className="w-full bg-slate-800 border border-slate-700 p-2 rounded h-24"
                                    value={editingItem.description}
                                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button onClick={() => setView('list')} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button onClick={() => saveRabbi(editingItem)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold">Done</button>
                            </div>
                        </div>
                    </div>
                )}
                {view === 'edit-rel' && editingRel && (
                    <div className="bg-slate-900 p-8 rounded-lg border border-slate-800 max-w-lg mx-auto">
                        <h2 className="text-xl font-bold mb-6">Add Relationship</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Source Rabbi</label>
                                <select className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
                                    value={editingRel.source}
                                    onChange={e => setEditingRel({ ...editingRel, source: e.target.value })}
                                >
                                    <option value="">Select Source...</option>
                                    {data.rabbis.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Target Rabbi</label>
                                <select className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
                                    value={editingRel.target}
                                    onChange={e => setEditingRel({ ...editingRel, target: e.target.value })}
                                >
                                    <option value="">Select Target...</option>
                                    {data.rabbis.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Relationship Type</label>
                                <select className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
                                    value={editingRel.type}
                                    onChange={e => setEditingRel({ ...editingRel, type: e.target.value })}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Colleague">Colleague</option>
                                    <option value="Son">Son</option>
                                    <option value="Father">Father</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button onClick={() => setView('list')} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button onClick={() => saveRelationship(editingRel)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold">Add</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminPanel;
