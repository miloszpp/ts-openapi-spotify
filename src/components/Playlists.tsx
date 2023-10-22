import { useContext, useEffect, useState } from "react";
import { createPlaylist, getPlaylists } from "../services/api";
import { convertPlaylists } from "../services/conversion";
import { Playlist } from "../types/domain";
import {
  ASYNC_EMPTY,
  AsyncResult,
  asAsyncFailure,
  asAsyncSuccess,
} from "../utils/AsyncResult";
import { CurrentUserContext } from "./Authorized";

export const Playlists: React.FC = () => {
  const [playlists, setPlaylists] =
    useState<AsyncResult<Playlist[]>>(ASYNC_EMPTY);
  const [playlistName, setPlaylistName] = useState("");
  const currentUser = useContext(CurrentUserContext);

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

  const onCreatePlaylist = () => {
    createPlaylist(currentUser.id, playlistName).then(
      () => {
        setPlaylistName("");
        reloadPlaylists();
      },
      () => {
        alert("Failed to create playlist");
      }
    );
  };

  if (playlists.type !== "success") {
    return <>Loading...</>;
  }

  return (
    <div>
      <section>
        <ul>
          {playlists.value.map((playlist) => (
            <li key={playlist.id}>{playlist.name}</li>
          ))}
        </ul>
      </section>
      <section>
        <input
          type="text"
          value={playlistName}
          placeholder="enter playlist name"
          onChange={(e) => setPlaylistName(e.target.value)}
        ></input>
        <button onClick={onCreatePlaylist}>Create new playlist</button>
      </section>
    </div>
  );
};
