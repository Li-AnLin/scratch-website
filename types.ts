export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Assignment {
  title: string;
  description: string;
  checklist: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown-like content
  assignment: Assignment;
  thumbnailUrl: string;
}

export interface CourseLevel {
  id: Difficulty;
  name: string;
  color: string;
  icon: string;
  description: string;
  lessons: Lesson[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}