export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface RatedMovie extends Movie {
  rating: number;
  ratedAt: string;
  created_at: string;
  movie_id: number;
}

export interface WatchlistMovie extends Movie {
  addedAt: string;
  movie_id: number;
  created_at: string;

}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}
export type WatchlistStatusMap = Map<number, boolean>;
