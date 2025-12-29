export interface BingoCell {
  id: string;
  type: 'preset' | 'custom';
  museum: string;
  exhibition: string;
  backgroundImage?: string;
  posterImage?: string;
  isVisited: boolean;
  order: number;
}

export type BingoState = BingoCell[];

export interface RankingData {
  id?: number;
  nickname: string;
  visited_exhibitions: string[];
  visited_count: number;
  timestamp: string;
  created_at?: string;
}
