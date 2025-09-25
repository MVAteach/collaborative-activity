import React from 'react';
// FIX: Import the Idea type for explicit type annotations.
import { MindMapData, MindMapCategory, Idea } from '../types';

interface MindMapProps {
  data: MindMapData;
}

const categoryDetails: Record<MindMapCategory, { title: string; color: string }> = {
  [MindMapCategory.Types]: { title: 'Types', color: 'bg-green-800' },
  [MindMapCategory.Causes]: { title: 'Causes', color: 'bg-green-800' },
  [MindMapCategory.Impacts]: { title: 'Impacts', color: 'bg-green-800' },
};

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  // FIX: Explicitly type `arr` as Idea[] so TypeScript knows it's an array and has a `length` property.
  const hasIdeas = Object.values(data).some((arr: Idea[]) => arr.length > 0);

  return (
    <div className="flex items-center justify-center w-full h-full p-4 relative">
      {/* Central Node */}
      <div className="relative z-10 flex items-center justify-center w-48 h-48 bg-gray-900 rounded-full shadow-2xl border-4 border-matrix-green">
        <h2 className="text-3xl font-extrabold text-matrix-green">
          Pollution
        </h2>
      </div>

      {!hasIdeas && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <p className="text-green-900 text-lg animate-pulse-subtle">Awaiting data nodes...</p>
        </div>
      )}

      {/* Branches and Nodes */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* FIX: Cast Object.entries to provide correct types for `category` and `ideas`, fixing all subsequent type errors. */}
        {(Object.entries(data) as [MindMapCategory, Idea[]][]).map(([category, ideas], index) => {
          if (ideas.length === 0) return null;
          const angle = (index * 120 - 90) * (Math.PI / 180); // 3 categories -> 120 degrees apart
          const distance = 200; // Distance from center
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          
          return (
            <div
              key={category}
              className="absolute transition-all duration-500"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {/* Branch Title */}
              <div className={`text-white text-lg font-bold p-3 rounded-md shadow-lg ${categoryDetails[category].color}`}>
                {categoryDetails[category].title}
              </div>
              {/* Idea Nodes */}
              <div className="mt-2 flex flex-col items-center gap-2">
                {ideas.map((idea, ideaIndex) => (
                  <div 
                    key={idea.id} 
                    className="animate-fade-in bg-black/80 text-gray-200 text-sm p-2 rounded-md shadow-md border border-green-900"
                    style={{ animationDelay: `${ideaIndex * 100}ms`}}
                  >
                    <p>{idea.text}</p>
                    <p className="text-xs text-matrix-green/80 text-right mt-1">- {idea.author}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MindMap;