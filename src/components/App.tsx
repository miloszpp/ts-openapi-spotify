import { useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { requestToken, startAuthentication } from "../services/auth";
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
        path: "/playlists",
        element: (
          <Authorized>
            <Playlists />
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
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
