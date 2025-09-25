import { MindMapData, MindMapCategory, Idea } from '../types';

const STORAGE_KEY = 'collaborativeMindMapData';

// Function to get the initial empty state
const getInitialData = (): MindMapData => ({
  types: [],
  causes: [],
  impacts: [],
});

// A type for our data update callback
type MindMapUpdateCallback = (data: MindMapData) => void;

class MindMapService {
  private subscribers: MindMapUpdateCallback[] = [];

  constructor() {
    // Listen for storage changes from other tabs to enable real-time updates
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const newData = JSON.parse(event.newValue);
          this.notifySubscribers(newData);
        } catch (error) {
          console.error('Failed to parse mind map data from storage event:', error);
        }
      }
    });
  }

  // Mimic an async API call to get data
  async getMindMapData(): Promise<MindMapData> {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Failed to parse mind map data from localStorage:', error);
    }
    return getInitialData();
  }

  // Mimic an async API call to add an idea
  async addIdea(category: MindMapCategory, idea: Idea): Promise<MindMapData> {
    const currentData = await this.getMindMapData();
    const updatedData = {
      ...currentData,
      [category]: [...currentData[category], idea],
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      // Notify subscribers in the current tab immediately
      this.notifySubscribers(updatedData);
    } catch (error) {
      console.error('Failed to save mind map data to localStorage:', error);
      return currentData; // Return old data if save failed
    }

    return updatedData;
  }

  // Allow components to subscribe to data changes
  subscribe(callback: MindMapUpdateCallback) {
    this.subscribers.push(callback);
    // Return an unsubscribe function for cleanup
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(data: MindMapData) {
    this.subscribers.forEach(cb => cb(data));
  }
}

// Export a single instance of the service to be used throughout the app
export const mindMapService = new MindMapService();
