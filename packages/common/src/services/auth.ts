import { SPOTIFY_CLIENT_ID } from "../constants";


const getRedirectUri = () => "http://localhost:5173/callback";

function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  function base64encode(text: ArrayBuffer) {
    return btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(text).values()))
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return base64encode(digest);
}

export function startAuthentication() {
  const codeVerifier = generateRandomString(128);

  return generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    const state = generateRandomString(16);
    const scope =
      "user-read-private user-read-email playlist-read-private playlist-modify-private";

    localStorage.setItem("code_verifier", codeVerifier);

    const args = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: getRedirectUri(),
      state: state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    window.location.assign("https://accounts.spotify.com/authorize?" + args);
  });
}

export function requestToken(code: string) {
  const codeVerifier = localStorage.getItem("code_verifier");

  if (!codeVerifier) {
    throw new Error("codeVerifier must be defined");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: getRedirectUri(),
    client_id: SPOTIFY_CLIENT_ID,
    code_verifier: codeVerifier,
  });

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("access_token", data.access_token);
      return data.access_token as string;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}
