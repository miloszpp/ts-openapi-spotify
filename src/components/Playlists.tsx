import { useEffect, useState } from "react";
import { getPlaylists } from "../services/api";
import { convertPlaylists } from "../services/conversion";
import { Playlist } from "../types/domain";
import {
  ASYNC_EMPTY,
  AsyncResult,
  asAsyncFailure,
  asAsyncSuccess,
} from "../utils/AsyncResult";

export const Playlists: React.FC = () => {
  const [playlists, setPlaylists] =
    useState<AsyncResult<Playlist[]>>(ASYNC_EMPTY);

  function reloadPlaylists() {
    getPlaylists().then(
      (response) =>
        setPlaylists(asAsyncSuccess(convertPlaylists(response.data))),
      (error) => setPlaylists(asAsyncFailure(error))
    );
  }

  useEffect(() => {
    reloadPlaylists();
  }, []);

  if (playlists.type !== "success") {
    return <>Loading...</>;
  }

  return (
    <ul>
      {playlists.value.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
};
