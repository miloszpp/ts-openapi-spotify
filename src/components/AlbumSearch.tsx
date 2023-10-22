import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import { searchAlbums } from "../services/api";
import { convertAlbumSearchResponse } from "../services/conversion";
import { Album } from "../types/domain";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncSuccess,
} from "../utils/AsyncResult";

export const AlbumSearch = () => {
  const queryInputRef = createRef<HTMLInputElement>();

  const [albums, setAlbums] = useState<AsyncResult<Album[]>>(ASYNC_EMPTY);

  const handleSearch = async () => {
    if (!queryInputRef.current) {
      return;
    }

    setAlbums(ASYNC_IN_PROGRESS);
    const response = await searchAlbums(queryInputRef.current.value);
    setAlbums(asAsyncSuccess(convertAlbumSearchResponse(response.data)));
  };

  return (
    <>
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
              <Link to={`/albums/${album.id}`}>{album.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
