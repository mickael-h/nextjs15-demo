export interface HNStory {
  id: number;
  title: string;
  score: number;
  url?: string;
  by: string;
  text?: string;
}

export interface HNUser {
  id: string;
  karma: number;
  created: number;
}
