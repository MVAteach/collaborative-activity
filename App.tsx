import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, MindMapData, MindMapCategory, Idea } from './types';
import SetupStep from './components/SetupStep';
import TaskStep from './components/TaskStep';
import ReflectionStep from './components/ReflectionStep';
import { mindMapService } from './services/mindMapService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.Setup);
  const [userName, setUserName] = useState<string>('');
  const [groupSize, setGroupSize] = useState<number>(1);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [mindMapData, setMindMapData] = useState<MindMapData>({
    types: [],
    causes: [],
    impacts: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Effect to fetch initial data and subscribe to real-time updates
  useEffect(() => {
    // Fetch initial data on component mount
    mindMapService.getMindMapData().then(data => {
      setMindMapData(data);
      setIsLoading(false);
    });

    // Subscribe to any changes in the mind map data
    const unsubscribe = mindMapService.subscribe(updatedData => {
      setMindMapData(updatedData);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSetupComplete = useCallback((name: string, size: number) => {
    setUserName(name);
    setGroupSize(size);
    setCurrentStep(AppStep.Task);
  }, []);

  // Handler to add an idea via the service
  const handleAddIdea = useCallback(async (category: MindMapCategory, idea: Idea) => {
      try {
        await mindMapService.addIdea(category, idea);
      } catch (error) {
        console.error("Failed to add idea:", error);
      }
  }, []);

  // Task completion now only needs to handle the time, as data is always in sync
  const handleTaskComplete = useCallback((time: number) => {
    setTimeElapsed(time);
    setCurrentStep(AppStep.Reflection);
  }, []);

  const renderStep = () => {
    if (isLoading) {
      return (
        <div className="text-center p-8">
          <p className="text-lg text-green-800 animate-pulse">[ loading collaborative mind map... ]</p>
        </div>
      );
    }
    
    switch (currentStep) {
      case AppStep.Setup:
        return <SetupStep onComplete={handleSetupComplete} />;
      case AppStep.Task:
        return (
          <TaskStep
            userName={userName}
            mindMapData={mindMapData}
            onAddIdea={handleAddIdea}
            onComplete={handleTaskComplete}
          />
        );
      case AppStep.Reflection:
        return (
          <ReflectionStep
            userName={userName}
            timeElapsed={timeElapsed}
            groupSize={groupSize}
            mindMapData={mindMapData}
          />
        );
      default:
        return <SetupStep onComplete={handleSetupComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-6xl text-center mb-8">
        <h2 className="text-xl sm:text-2xl text-green-400/70 mb-2">
          MVA Global Perspectives Presents:
        </h2>
        <h1 className="text-4xl sm:text-5xl font-bold text-matrix-green pb-2">
          Collaborative Work Analyzer
        </h1>
        <p className="text-green-400/70 text-lg">
          &gt; Learn, Calculate, and Think About Teamwork
        </p>
      </header>
      <main className="w-full max-w-6xl">
        {renderStep()}
      </main>
    </div>
  );
};

export default App;