import { useEffect, useState } from "react";
import { getPlaylists } from "../services/api";
import { convertPlaylists } from "../services/conversion";
import { Playlist } from "../types/domain";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncFailure,
  asAsyncSuccess,
} from "../utils/AsyncResult";

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
