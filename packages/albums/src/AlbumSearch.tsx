import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import { searchAlbums } from "common";
import { convertAlbumSearchResponse } from "common";
import { Album } from "common";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncFailure,
  asAsyncSuccess,
} from "common";

export const AlbumSearch = () => {
  const queryInputRef = createRef<HTMLInputElement>();

  const [albums, setAlbums] = useState<AsyncResult<Album[]>>(ASYNC_EMPTY);

  const handleSearch = async () => {
    if (!queryInputRef.current) {
      return;
    }

    setAlbums(ASYNC_IN_PROGRESS);
    try {
      const response = await searchAlbums(queryInputRef.current.value);
      setAlbums(asAsyncSuccess(convertAlbumSearchResponse(response.data)));
    } catch (error) {
      setAlbums(asAsyncFailure(error));
    }
  };

  return (
    <>
      <h1>Search for albums</h1>
      <section>
        <input
          type="text"
          placeholder="search for album..."
          ref={queryInputRef}
        />
        <button onClick={handleSearch}>Search</button>
      </section>
      <section>
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
        {albums.type === "failure" && (
          <span>Error occurred when fetching albums</span>
        )}
      </section>
    </>
  );
};

export default AlbumSearch;