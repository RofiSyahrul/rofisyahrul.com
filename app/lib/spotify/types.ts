export interface SpotifyExternalURL {
  spotify: string;
}

export interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyAlbum {
  album_type: 'album' | 'single' | 'compilation';
  external_urls: SpotifyExternalURL;
  id: string;
  images: SpotifyImage[];
  name: string;
}

export interface SpotifyArtist {
  external_urls: SpotifyExternalURL;
  id: string;
  name: string;
}

interface SpotifyNowPlaingItem {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  duration_ms: number;
  external_urls: SpotifyExternalURL;
  id: string;
  name: string;
}

export interface SpotifyNowPlaingResponse {
  is_playing: boolean;
  item: SpotifyNowPlaingItem;
}

export interface SpotifyNowPlayingData {
  albumName: string;
  artists: string[];
  image: SpotifyImage | null;
  title: string;
  trackURL: string;
}
