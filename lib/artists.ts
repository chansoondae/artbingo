import fs from 'fs';
import path from 'path';

export interface Artist {
  koreanName: string;
  englishName: string;
  popularityScore?: number;
  id?: string;
  fortuneText?: string;
  keywords?: string[];
}

interface ArtistJsonData {
  한글이름: string;
  영어이름: string;
  id?: string;
  운세?: string;
  keywords?: string[];
}

export function parseArtistsJSON(): Artist[] {
  const filePath = path.join(process.cwd(), 'data', 'artists.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const jsonData: ArtistJsonData[] = JSON.parse(fileContent);

  return jsonData.map((item) => ({
    koreanName: item.한글이름,
    englishName: item.영어이름,
    id: item.id,
    fortuneText: item.운세,
    keywords: item.keywords,
  }));
}

export type SortType = 'korean' | 'english' | 'popularity';

export function sortArtists(artists: Artist[], sortType: SortType): Artist[] {
  const sorted = [...artists];

  switch (sortType) {
    case 'korean':
      return sorted.sort((a, b) => a.koreanName.localeCompare(b.koreanName, 'ko'));
    case 'english':
      return sorted.sort((a, b) => a.englishName.localeCompare(b.englishName, 'en'));
    case 'popularity':
      return sorted.sort((a, b) => b.popularityScore - a.popularityScore);
    default:
      return sorted;
  }
}
