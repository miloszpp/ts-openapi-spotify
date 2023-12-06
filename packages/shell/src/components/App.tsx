import React, { Suspense, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { requestToken, startAuthentication } from "common";
import "./App.css";
import { Authorized } from "common";
import { Root } from "./Root";

const AlbumSearch = React.lazy(() => import('@remotes/albums/AlbumSearch'))
const SingleAlbum = React.lazy(() => import('@remotes/albums/SingleAlbum'))
const CreatePlaylist = React.lazy(() => import('@remotes/playlists/CreatePlaylist'))
const Playlists = React.lazy(() => import('@remotes/playlists/Playlists'))

const Login = () => {
  useEffect(() => {
    startAuthentication();
  }, []);
  return <></>;
};

const Callback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) {
      return;
    }
    requestToken(code).then(() => navigate("/playlists"));
  }, [code, navigate]);

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
        path: "/albums/:id",
        element: (
          <Authorized>
            <SingleAlbum />
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
        path: "/create-playlist",
        element: (
          <Authorized>
            <CreatePlaylist />
          </Authorized>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
]);

function App() {
  return <Suspense fallback={<span>Loading...</span>}><RouterProvider router={router} /></Suspense>;
}

export default App;
