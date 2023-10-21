import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { startAuthentication } from "../services/auth";
import { AlbumSearch } from "./AlbumSearch";
import "./App.css";
import { Authorized } from "./Authorized";
import { Playlists } from "./Playlists";
import { Root } from "./Root";

const Login = () => {
  useEffect(() => {
    startAuthentication();
  }, []);
  return <></>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/albums",
        element: (
          <Authorized>
            <AlbumSearch />
          </Authorized>
        ),
      },
      {
        path: "/playlists",
        element: (
          <Authorized>
            <Playlists />
          </Authorized>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
