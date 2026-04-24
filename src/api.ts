const API_KEY = "80e6949afda9739e0b0dc37192aba952";
const BASE_URL = "https://api.themoviedb.org/3/movie";

export async function getNowPlayingMovies() {
  const response = await fetch(`${BASE_URL}/now_playing?api_key=${API_KEY}`);
  const json = await response.json();
  return json;
}

export async function getPopularMovies() {
  const response = await fetch(`${BASE_URL}/popular?api_key=${API_KEY}`);
  const json = await response.json();
  return json;
}

export async function getUpcomingMovies() {
  const response = await fetch(`${BASE_URL}/upcoming?api_key=${API_KEY}`);
  const json = await response.json();
  return json;
}

export async function getVideoLink(id: number) {
  const response = await fetch(`${BASE_URL}/${id}/videos?api_key=${API_KEY}`);
  const json = await response.json();
  return json;
}

export async function getMovieDetail(id: number) {
  const response = await fetch(`${BASE_URL}/${id}?api_key=${API_KEY}`);
  const json = await response.json();
  return json;
}

export async function getKeywordData(keyword: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${keyword}&page=1`
  );
  const json = await response.json();
  return json;
}
