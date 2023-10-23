import axios from "axios";
import createClient from "openapi-fetch";
import { paths } from "../types/spotify";

axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const baseClient = createClient<paths>();

const spotifyClient = new Proxy(baseClient, {
  get(_, key: keyof typeof baseClient) {
    const authToken = localStorage.getItem("access_token");
    const newClient = createClient<paths>({
      headers: { Authorization: `Bearer ${authToken}` },
      baseUrl: "https://api.spotify.com/v1",
    });
    return newClient[key];
  },
});

const promisify = <TData, TError>(
  response: { data: TData; error?: never } | { data?: never; error: TError }
) => {
  if (response.data) {
    return { data: response.data };
  } else {
    throw response.error;
  }
};

export const searchAlbums = async (query: string) =>
  spotifyClient
    .GET("/search", {
      params: { query: { q: query, type: ["album"] } },
    })
    .then(promisify);

export const getAlbum = async (id: string) =>
  spotifyClient
    .GET(`/albums/{id}`, { params: { path: { id } } })
    .then(promisify);

export const getPlaylists = async () =>
  spotifyClient.GET("/me/playlists").then(promisify);

export const createPlaylist = async (userId: string, name: string) =>
  spotifyClient
    .POST("/users/{user_id}/playlists", {
      params: { path: { user_id: userId } },
      body: { name, public: false },
    })
    .then(promisify);

export const getCurrentUser = async () =>
  spotifyClient.GET("/me").then(promisify);
