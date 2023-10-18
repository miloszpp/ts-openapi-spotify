import { createRef, useEffect, useState } from "react";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncSuccess,
} from "./AsyncResult";
import { getAlbum, getSpotifyToken, searchAlbums } from "./api";
import { convertAlbumDetails, convertAlbumSearchResponse } from "./conversion";
import { Album, AlbumDetails } from "./domain";

export const AlbumSearch = () => {
  const [token, setToken] = useState<AsyncResult<string>>(ASYNC_IN_PROGRESS);
  const queryInputRef = createRef<HTMLInputElement>();
  const [albums, setAlbums] = useState<AsyncResult<Album[]>>(ASYNC_EMPTY);
  const [albumDetails, setAlbumDetails] =
    useState<AsyncResult<AlbumDetails>>(ASYNC_EMPTY);

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
    setAlbums(asAsyncSuccess(convertAlbumSearchResponse(response.data)));
  };

  const handleGetDetails = async (id: string) => {
    if (token.type !== "success") {
      return;
    }

    setAlbumDetails(ASYNC_IN_PROGRESS);
    const response = await getAlbum(token.value, id);
    setAlbumDetails(asAsyncSuccess(convertAlbumDetails(response.data)));
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
            <h2>{albumDetails.value.artist}</h2>
            <img src={albumDetails.value.imagePath} />
          </div>
        )}
      </div>
    </div>
  );
};
