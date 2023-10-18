import { paths } from "./spotify";

export type AlbumSearchResponseDto =
  paths["/search"]["get"]["responses"]["200"]["content"]["application/json"];

export type AlbumDetailsResponseDto =
  paths["/albums/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
