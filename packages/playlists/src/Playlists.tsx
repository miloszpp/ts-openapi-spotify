import { useEffect, useState } from "react";
import { getPlaylists } from "@modules/common";
import { convertPlaylists } from "@modules/common";
import { Playlist } from "@modules/common";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncFailure,
  asAsyncSuccess,
} from "@modules/common";

export const Playlists: React.FC = () => {
  const [playlists, setPlaylists] =
    useState<AsyncResult<Playlist[]>>(ASYNC_EMPTY);

  useEffect(() => {
    (async () => {
      setPlaylists(ASYNC_IN_PROGRESS);
      try {
        const response = await getPlaylists();
        setPlaylists(asAsyncSuccess(convertPlaylists(response.data)));
      } catch (error) {
        setPlaylists(asAsyncFailure(error));
      }
    })();
  }, []);

  return (
    <>
      <h1>Your playlists</h1>
      {playlists.type === "inProgress" && <>Loading...</>}
      {playlists.type === "success" && (
        <ul>
          {playlists.value.map((playlist) => (
            <li key={playlist.id}>{playlist.name}</li>
          ))}
        </ul>
      )}
      {playlists.type === "failure" && (
        <>Error occurred when fetching playlists</>
      )}
    </>
  );
};

export default Playlists;