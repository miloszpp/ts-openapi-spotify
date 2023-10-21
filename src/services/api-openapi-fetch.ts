import createClient from "openapi-fetch";
import { paths } from "../types/spotify";

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const { GET, PUT } = createClient<paths>({
  baseUrl: "https://api.spotify.com/v1/",
});

export const searchAlbums = async (token: string, query: string) =>
  await GET("/search", {
    params: {
      query: {
        q: query,
        type: ["album"],
      },
    },
    ...getAuthHeaders(token),
  });

export const getAlbum = async (token: string, id: string) =>
  await GET("/albums/{id}", {
    params: {
      path: {
        id: id,
      },
    },
    ...getAuthHeaders(token),
  });

export const saveAlbums = async (token: string, ids: string[]) => {
  return await PUT("/me/albums", {
    params: {
      query: {
        ids: ids.join(","),
      },
    },
    body: {
      ids,
    },
    ...getAuthHeaders(token),
  });
};
