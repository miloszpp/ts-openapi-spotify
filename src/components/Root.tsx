import { Link, Outlet } from "react-router-dom";

export const Root: React.FC = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/albums">Albums</Link>
          </li>
          <li>
            <Link to="/playlists">Playlists</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};
