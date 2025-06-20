export interface HNStory {
  id: number;
  title: string;
  score: number;
  url?: string;
  by: string;
  text?: string;
  kids?: number[]; // Array of comment IDs
  time: number; // Unix timestamp
}

export interface HNComment {
  id: number;
  by: string;
  text: string;
  time: number;
  kids?: number[]; // Nested comments
  deleted?: boolean;
  dead?: boolean;
}

export interface HNUser {
  id: string;
  karma: number;
  created: number;
}

export interface PaginatedStories {
  stories: HNStory[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
