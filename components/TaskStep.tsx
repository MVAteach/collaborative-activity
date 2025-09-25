import React, { useState, useCallback, FC } from 'react';
import { MindMapData, Idea, MindMapCategory } from '../types';
import { getPollutionIdeas } from '../services/geminiService';
import MindMap from './MindMap';
import Stopwatch from './Stopwatch';
import PlusIcon from './icons/PlusIcon';
import BrainIcon from './icons/BrainIcon';

interface TaskStepProps {
  userName: string;
  mindMapData: MindMapData;
  onAddIdea: (category: MindMapCategory, idea: Idea) => void;
  onComplete: (time: number) => void;
}

const CategoryInput: FC<{
    category: MindMapCategory;
    userName: string;
    onAddIdea: (category: MindMapCategory, idea: Idea) => void;
}> = ({ category, userName, onAddIdea }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAdd = () => {
        if (text.trim()) {
            onAddIdea(category, {
                id: `${userName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                text: text.trim(),
                author: userName,
            });
            setText('');
        }
    };
    
    const handleGetSuggestion = async () => {
        setIsLoading(true);
        try {
            const idea = await getPollutionIdeas(category);
            if(idea) {
                setText(idea);
            }
        } catch (error) {
            console.error("Failed to get suggestion:", error);
            // Optionally set an error message to display to the user
        }
        setIsLoading(false);
    };

    const categoryTitles: Record<MindMapCategory, string> = {
        [MindMapCategory.Types]: "Category: Types",
        [MindMapCategory.Causes]: "Category: Causes",
        [MindMapCategory.Impacts]: "Category: Impacts",
    }

    return (
        <div className="w-full space-y-2">
            <h3 className="text-lg font-semibold text-matrix-green">{categoryTitles[category]}</h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="> add idea..."
                    className="flex-grow px-3 py-2 bg-black border border-green-800 rounded-md focus:ring-2 focus:ring-matrix-green focus:border-matrix-green outline-none transition-all"
                    disabled={isLoading}
                />
                <button onClick={handleAdd} className="p-2 bg-green-800 hover:bg-green-700 rounded-md transition-colors" title="Add Idea"><PlusIcon /></button>
                <button onClick={handleGetSuggestion} className="p-2 bg-green-800 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait" title="Get Suggestion" disabled={isLoading}>
                    <BrainIcon />
                </button>
            </div>
        </div>
    );
};


const TaskStep: React.FC<TaskStepProps> = ({ userName, mindMapData, onAddIdea, onComplete }) => {
  const [time, setTime] = useState(0);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900/50 p-6 rounded-md border border-matrix-green/30">
            <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-matrix-green mb-2">Task: Pollution Mind Map</h2>
                <p className="text-gray-300">
                    Contributions are linked to the network and visible in real-time. Use the chronometer to track your session time.
                </p>
            </div>
            <Stopwatch onTimeUpdate={setTime} onComplete={(finalTime) => onComplete(finalTime)} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-md border border-matrix-green/30 min-h-[400px]">
                <MindMap data={mindMapData} />
            </div>
            <div className="space-y-6 bg-gray-900/50 p-6 rounded-md border border-matrix-green/30">
                <CategoryInput category={MindMapCategory.Types} userName={userName} onAddIdea={onAddIdea} />
                <CategoryInput category={MindMapCategory.Causes} userName={userName} onAddIdea={onAddIdea} />
                <CategoryInput category={MindMapCategory.Impacts} userName={userName} onAddIdea={onAddIdea} />
            </div>
        </div>
    </div>
  );
};

export default TaskStep;