import React, { useState } from 'react';

interface SetupStepProps {
  onComplete: (name: string, groupSize: number) => void;
}

const SetupStep: React.FC<SetupStepProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [groupSize, setGroupSize] = useState('2');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const size = parseInt(groupSize, 10);
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (isNaN(size) || size <= 0) {
      setError('Group size must be a positive number.');
      return;
    }
    setError('');
    onComplete(name, size);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900/50 backdrop-blur-sm rounded-md shadow-lg p-8 animate-fade-in border border-matrix-green/30">
      <h2 className="text-3xl font-bold text-matrix-green mb-2">Initialize Session</h2>
      <p className="text-gray-300 mb-6">Enter credentials to begin the exercise.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            User Handle
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., neo"
            className="w-full px-4 py-2 bg-black border border-green-800 rounded-md focus:ring-2 focus:ring-matrix-green focus:border-matrix-green outline-none transition-all"
          />
        </div>
        <div>
          <label htmlFor="groupSize" className="block text-sm font-medium text-gray-300 mb-2">
            Number of People in Your Group
          </label>
          <input
            id="groupSize"
            type="number"
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
            min="1"
            className="w-full px-4 py-2 bg-black border border-green-800 rounded-md focus:ring-2 focus:ring-matrix-green focus:border-matrix-green outline-none transition-all"
          />
        </div>
        {error && <p className="text-red-400 text-sm">// ERROR: {error}</p>}
        <button
          type="submit"
          className="w-full bg-matrix-green hover:bg-green-400 text-black font-bold py-3 px-4 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
        >
          [ Start Task ]
        </button>
      </form>
    </div>
  );
};

export default SetupStep;