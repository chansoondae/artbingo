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
