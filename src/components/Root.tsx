import { Link, Outlet } from "react-router-dom";

export const Root: React.FC = () => {
  return (
    <>
      <header>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/albums">Albums</Link>
          <Link to="/playlists">Playlists</Link>
          <Link to="/create-playlist">Create Playlist</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
