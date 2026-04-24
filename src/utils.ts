//image.tmdb.org/t/p/original/kxQiIJ4gVcD3K6o14MJ72p5yRcE.jpg

export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export function makeVideoPath(key: string) {
  return `https://www.youtube.com/embed/${key}?autoplay=1&mute=1`;
}
