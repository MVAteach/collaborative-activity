
export enum AppStep {
  Setup = 'SETUP',
  Task = 'TASK',
  Reflection = 'REFLECTION',
}

export enum MindMapCategory {
  Types = 'types',
  Causes = 'causes',
  Impacts = 'impacts',
}

export interface Idea {
  id: string;
  text: string;
  author: string;
}

export type MindMapData = {
  [key in MindMapCategory]: Idea[];
};
