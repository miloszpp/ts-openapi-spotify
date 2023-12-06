import {
    OperationRequestBodyContent,
    SuccessResponse,
  } from "openapi-typescript-helpers";
  import { paths } from "./spotify";
  
  export type AlbumSearchResponseDto =
    paths["/search"]["get"]["responses"]["200"]["content"]["application/json"];
  
  export type AlbumSearchResponseDtoShort = SuccessResponse<
    paths["/search"]["get"]["responses"]
  >["application/json"];
  
  export type AlbumDetailsResponseDto =
    paths["/albums/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
  
  export type CurrentUserResponseDto =
    paths["/me"]["get"]["responses"]["200"]["content"]["application/json"];
  
  export type CreatePlaylistRequestDto = OperationRequestBodyContent<
    paths["/users/{user_id}/playlists"]["post"]
  >;
  
  export type GetPlaylistsDto =
    paths["/me/playlists"]["get"]["responses"]["200"]["content"]["application/json"];
  
  export type CurrentUserDto =
    paths["/me"]["get"]["responses"]["200"]["content"]["application/json"];