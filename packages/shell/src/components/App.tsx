import React, { Suspense, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { requestToken, startAuthentication } from "@modules/common";
import "./App.css";
import { Authorized } from "../../../common/src/components/Authorized";
import { Root } from "./Root";

const AlbumSearch = React.lazy(() => import('@modules/albums/AlbumSearch'))
const SingleAlbum = React.lazy(() => import('@modules/albums/SingleAlbum'))
const CreatePlaylist = React.lazy(() => import('@modules/playlists/CreatePlaylist'))
const Playlists = React.lazy(() => import('@modules/playlists/Playlists'))

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
  return <Suspense fallback={<span>Loadinggggg...</span>}><RouterProvider router={router} /></Suspense>;
}

export default App;
