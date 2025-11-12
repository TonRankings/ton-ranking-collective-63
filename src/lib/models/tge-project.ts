
export interface ScoreHistory {
  date: string;
  roadmapScore: number;
  moralityIndex: number;
  socialEngagement: number;
  totalScore: number;
}

export interface TGEProject {
  id: string;
  name: string;
  tgeDate: string;
  roadmapScore: number;
  moralityIndex: number;
  socialEngagement: number;
  totalScore: number;
  tags: string[];
  trends?: {
    roadmapScore?: 'up' | 'down' | 'neutral';
    moralityIndex?: 'up' | 'down' | 'neutral';
    socialEngagement?: 'up' | 'down' | 'neutral';
    totalScore?: 'up' | 'down' | 'neutral';
  };
  scoreHistory?: ScoreHistory[];
}

export type SortField = 'name' | 'tgeDate' | 'roadmapScore' | 'moralityIndex' | 'socialEngagement' | 'totalScore';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  tags: string[];
  minScore: number;
  maxScore: number;
}
