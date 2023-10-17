import axios from "axios";
import { createRef, useEffect, useState } from "react";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncSuccess,
} from "./AsyncResult";
import { components, paths } from "./spotify";

const SPOTIFY_CLIENT_ID = "34e7fa5ea9f342fc8f84bcc51f5ff468";
const SPOTIFY_CLIENT_SECRET = "aee9818697384cb7b1d51afe837bd7dc";

const getSpotifyToken = async (): Promise<string> => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return response.data.access_token;
};

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const searchAlbums = async (token: string, query: string) =>
  await axios.get<
    paths["/search"]["get"]["responses"]["200"]["content"]["application/json"]
  >("https://api.spotify.com/v1/search", {
    params: {
      q: query,
      type: "album",
    },
    ...getAuthHeaders(token),
  });

const getAlbum = async (token: string, id: string) =>
  await axios.get<
    paths["/albums/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
  >(`https://api.spotify.com/v1/albums/${id}`, getAuthHeaders(token));

export const AlbumSearch = () => {
  const [token, setToken] = useState<AsyncResult<string>>(ASYNC_IN_PROGRESS);
  const queryInputRef = createRef<HTMLInputElement>();
  const [albums, setAlbums] =
    useState<AsyncResult<components["schemas"]["SimplifiedAlbumObject"][]>>(
      ASYNC_EMPTY
    );
  const [albumDetails, setAlbumDetails] =
    useState<AsyncResult<components["schemas"]["AlbumObject"]>>(ASYNC_EMPTY);

  useEffect(() => {
    getSpotifyToken().then((token) => setToken(asAsyncSuccess(token)));
  }, []);

  const handleSearch = async () => {
    if (token.type !== "success" || !queryInputRef.current) {
      return;
    }

    setAlbums(ASYNC_IN_PROGRESS);
    const response = await searchAlbums(
      token.value,
      queryInputRef.current.value
    );
    setAlbums(asAsyncSuccess(response.data.albums?.items ?? []));
  };

  const handleGetDetails = async (id: string) => {
    if (token.type !== "success") {
      return;
    }

    setAlbumDetails(ASYNC_IN_PROGRESS);
    const response = await getAlbum(token.value, id);
    setAlbumDetails(asAsyncSuccess(response.data));
  };

  if (token.type === "inProgress") {
    return "Loading...";
  }

  return (
    <div className="container">
      <div className="master">
        <input
          type="text"
          placeholder="search for album..."
          ref={queryInputRef}
        />
        <button onClick={handleSearch}>Search</button>
        {albums.type === "inProgress" && <span>Loading...</span>}
        {albums.type === "success" && (
          <ul>
            {albums.value.map((album) => (
              <li>
                {album.name}{" "}
                <button onClick={() => handleGetDetails(album.id)}>
                  Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="details">
        {albumDetails.type === "inProgress" && <span>Loading...</span>}
        {albumDetails.type === "success" && (
          <div>
            <h1>{albumDetails.value.name}</h1>
            <h2>{albumDetails.value.artists?.[0].name}</h2>
            <img src={albumDetails.value.images?.[0].url} />
          </div>
        )}
      </div>
    </div>
  );
};
