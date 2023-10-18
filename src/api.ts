import axios from "axios";
import { AlbumDetailsResponseDto, AlbumSearchResponseDto } from "./dto";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "./secrets";

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getSpotifyToken = async (): Promise<string> => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return response.data.access_token;
};

export const searchAlbums = async (token: string, query: string) =>
  await axios.get<AlbumSearchResponseDto>("https://api.spotify.com/v1/search", {
    params: {
      q: query,
      type: "album",
    },
    ...getAuthHeaders(token),
  });

export const getAlbum = async (token: string, id: string) =>
  await axios.get<AlbumDetailsResponseDto>(
    `https://api.spotify.com/v1/albums/${id}`,
    getAuthHeaders(token)
  );
