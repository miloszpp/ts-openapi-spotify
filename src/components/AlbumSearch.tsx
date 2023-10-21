import { createRef, useContext, useState } from "react";
import { getAlbum, searchAlbums } from "../services/api";
import { TokenContext } from "../services/auth";
import {
  convertAlbumDetails,
  convertAlbumSearchResponse,
} from "../services/conversion";
import { Album, AlbumDetails } from "../types/domain";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncSuccess,
} from "../utils/AsyncResult";

export const AlbumSearch = () => {
  const token = useContext(TokenContext);

  const queryInputRef = createRef<HTMLInputElement>();

  const [albums, setAlbums] = useState<AsyncResult<Album[]>>(ASYNC_EMPTY);
  const [albumDetails, setAlbumDetails] =
    useState<AsyncResult<AlbumDetails>>(ASYNC_EMPTY);

  const handleSearch = async () => {
    if (!queryInputRef.current) {
      return;
    }

    setAlbums(ASYNC_IN_PROGRESS);
    const response = await searchAlbums(token, queryInputRef.current.value);
    setAlbums(asAsyncSuccess(convertAlbumSearchResponse(response.data)));
  };

  const handleGetDetails = async (id: string) => {
    setAlbumDetails(ASYNC_IN_PROGRESS);
    const response = await getAlbum(token, id);
    setAlbumDetails(asAsyncSuccess(convertAlbumDetails(response.data)));
  };

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
