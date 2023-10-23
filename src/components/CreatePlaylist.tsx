import { useContext, useState } from "react";
import { createPlaylist } from "../services/api";
import { CurrentUserContext } from "./Authorized";

export const CreatePlaylist: React.FC = () => {
  const [playlistName, setPlaylistName] = useState("");
  const currentUser = useContext(CurrentUserContext);

  return (
    <>
      <h1>Create Playlist</h1>
      <form>
        <p>
          <label>Name</label>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          ></input>
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            createPlaylist(currentUser.id, playlistName).then(
              () => {
                setPlaylistName("");
                alert(`Playlist ${playlistName} created successfully`);
              },
              () => {
                alert("Failed to create playlist");
              }
            );
          }}
        >
          Create new playlist
        </button>
      </form>
    </>
  );
};
