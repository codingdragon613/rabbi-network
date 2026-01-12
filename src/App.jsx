import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import GraphView from './components/GraphView';
import { Loader2 } from 'lucide-react';

function App() {
  const [data, setData] = useState({ rabbis: [], relationships: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRabbi, setSelectedRabbi] = useState(null);

  useEffect(() => {
    fetch('/data.json')
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
        <div className="absolute top-4 right-4 pointer-events-none">
          {/* Optional overlay controls could go here */}
        </div>
      </main>
    </div>
  );
}

export default App;
