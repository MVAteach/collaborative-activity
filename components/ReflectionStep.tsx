import React from 'react';
// FIX: Import the Idea type to be used for explicit typing.
import { MindMapData, Idea } from '../types';

interface ReflectionStepProps {
  userName: string;
  timeElapsed: number; // in seconds
  groupSize: number;
  mindMapData: MindMapData;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const ReflectionStep: React.FC<ReflectionStepProps> = ({ userName, timeElapsed, groupSize, mindMapData }) => {
  // FIX: Explicitly type `arr` as Idea[] so TypeScript knows it's an array and has a `length` property.
  const totalContributions = Object.values(mindMapData).reduce((sum, arr: Idea[]) => sum + arr.length, 0);
  const userContributions = Object.values(mindMapData).reduce(
    // FIX: Explicitly type `arr` as Idea[] so TypeScript knows it's an array and has a `filter` method.
    (sum, arr: Idea[]) => sum + arr.filter(idea => idea.author === userName).length,
    0
  );

  const calculatedTotalTime = timeElapsed * groupSize;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-md shadow-lg p-8 border border-matrix-green/30 text-center">
        <h2 className="text-3xl font-bold text-matrix-green mb-2">Task Complete!</h2>
        <p className="text-gray-300">Analysis of the collaborative effort:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-gray-900/50 p-6 rounded-md border border-matrix-green/30">
          <p className="text-gray-400 text-sm uppercase font-semibold">Your Time</p>
          <p className="text-4xl font-bold text-matrix-green">{formatTime(timeElapsed)}</p>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-md border border-matrix-green/30">
          <p className="text-gray-400 text-sm uppercase font-semibold">Group Size</p>
          <p className="text-4xl font-bold text-matrix-green">{groupSize}</p>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-md border border-matrix-green/30">
          <p className="text-gray-400 text-sm uppercase font-semibold">Your Contributions</p>
          <p className="text-4xl font-bold text-matrix-green">{userContributions} <span className="text-2xl text-gray-400">/ {totalContributions} total</span></p>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-md shadow-lg p-8 border border-matrix-green/30">
        <h3 className="text-2xl font-bold text-matrix-green mb-4">Calculation & Reflection</h3>
        <div className="flex flex-col md:flex-row items-center justify-center text-center gap-4 text-2xl mb-6 p-4 bg-black/50 rounded-lg">
            <span>{formatTime(timeElapsed)}</span>
            <span className="text-matrix-green text-xl">×</span>
            <span>{groupSize} users</span>
            <span className="text-matrix-green text-xl">=</span>
            <span className="font-bold text-3xl text-matrix-green">{formatTime(calculatedTotalTime)}</span>
        </div>
        
        <div className="space-y-4 text-gray-300">
            <p className="text-lg font-semibold">Reflect on this question:</p>
            <blockquote className="border-l-4 border-matrix-green pl-4 italic text-gray-200">
                 Is multiplying one user's time by the number of users a fair metric for team efficiency vs. individual work?
            </blockquote>
            <p>Consider network latency, parallel processing, and variable contribution levels.</p>
        </div>
         <div className="mt-6">
            <textarea
                placeholder="> log your thoughts here..."
                className="w-full h-24 p-3 bg-black border border-green-800 rounded-md focus:ring-2 focus:ring-matrix-green focus:border-matrix-green outline-none transition-all"
            ></textarea>
        </div>
      </div>
    </div>
  );
};

export default ReflectionStep;