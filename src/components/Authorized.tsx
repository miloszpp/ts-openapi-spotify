import { PropsWithChildren, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TokenContext, requestToken } from "../services/auth";

export const Authorized: React.FC<PropsWithChildren> = ({ children }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    if (!code) {
      return;
    }
    requestToken(code).then(setToken);
  }, [code]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  return token ? (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  ) : (
    <span>
      Unauthorized, please <Link to="/login">log in</Link>.
    </span>
  );
};
