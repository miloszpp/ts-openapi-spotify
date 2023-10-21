import axios from "axios";
import {
  AlbumDetailsResponseDto,
  AlbumSearchResponseDto,
  SaveAlbumsRequestDto,
} from "../types/dto";

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

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

export const saveAlbums = async (token: string, ids: string[]) => {
  const request: SaveAlbumsRequestDto = {
    ids,
  };
  return await axios.put<unknown>(
    "https://api.spotify.com/v1/me/albums",
    request,
    getAuthHeaders(token)
  );
};
