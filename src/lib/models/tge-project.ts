
export interface TGEProject {
  id: string;
  name: string;
  tgeDate: string;
  roadmapScore: number;
  moralityIndex: number;
  socialEngagement: number;
  totalScore: number;
  tags: string[];
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
