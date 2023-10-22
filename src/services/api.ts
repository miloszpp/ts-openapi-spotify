import axios from "axios";
import {
  AlbumDetailsResponseDto,
  AlbumSearchResponseDto,
  CreatePlaylistRequestDto,
  CurrentUserDto,
  GetPlaylistsDto,
} from "../types/dto";

axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const searchAlbums = async (query: string) =>
  await axios.get<AlbumSearchResponseDto>(`/search`, {
    params: {
      q: query,
      type: "album",
    },
  });

export const getAlbum = async (id: string) =>
  await axios.get<AlbumDetailsResponseDto>(`/albums/${id}`);

export const getPlaylists = async () => {
  return await axios.get<GetPlaylistsDto>(`/me/playlists`);
};

export const createPlaylist = async (userId: string, name: string) => {
  const playlist: CreatePlaylistRequestDto = {
    name,
    public: false,
  };
  return await axios.post(`/users/${userId}/playlists`, playlist);
};

export const getCurrentUser = async () => {
  return await axios.get<CurrentUserDto>(`/me`);
};
