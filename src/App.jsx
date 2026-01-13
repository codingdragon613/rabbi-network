import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import GraphView from './components/GraphView';
import { Loader2, Settings } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
function App() {
  const [data, setData] = useState({ rabbis: [], relationships: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRabbi, setSelectedRabbi] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data.json')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load data", err);
        setLoading(false);
      });
  }, []);
  const handleNodeClick = (rabbiData) => {
    setSelectedRabbi(rabbiData);
  };
  const handleSidebarSelect = (rabbi) => {
    setSelectedRabbi(rabbi);
    // Ideally we would also center the graph on this node
  };
  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 font-sans">
      <Sidebar
        rabbis={data.rabbis}
        onSelect={handleSidebarSelect}
        selectedRabbi={selectedRabbi}
      />
      <main className="flex-1 h-full relative">
        <GraphView
          rabbis={data.rabbis}
          relationships={data.relationships}
          onNodeClick={handleNodeClick}
        />
        <div className="absolute top-4 right-4 pointer-events-auto z-50">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="p-2 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors backdrop-blur-sm border border-slate-700"
            title="Toggle Admin Mode"
          >
            <Settings size={20} />
          </button>
        </div>
        {showAdmin && (
          <AdminPanel
            currentData={data}
            onClose={() => setShowAdmin(false)}
            onUpdateLocalData={(newData) => {
              setData(newData);
            }}
          />
        )}
      </main>
    </div>
  );
}
export default App;
