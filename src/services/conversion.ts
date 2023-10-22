import { Album, AlbumDetails, CurrentUser, Playlist } from "../types/domain";
import {
  AlbumDetailsResponseDto,
  AlbumSearchResponseDto,
  CurrentUserDto,
  GetPlaylistsDto,
} from "../types/dto";

export const convertAlbumSearchResponse = (
  dto: AlbumSearchResponseDto
): Album[] => dto.albums?.items?.map(({ id, name }) => ({ id, name })) ?? [];

export const convertAlbumDetails = ({
  id,
  name,
  images,
  artists,
}: AlbumDetailsResponseDto): AlbumDetails => ({
  id,
  name,
  artist: artists[0].name ?? "",
  imagePath: images[0].url ?? "",
});

export const convertPlaylists = (dto: GetPlaylistsDto): Playlist[] =>
  dto.items?.map(({ id, name }) => ({ id: id ?? "", name: name ?? "" })) ?? [];

export const convertCurrentUser = (dto: CurrentUserDto): CurrentUser => ({
  id: dto.id ?? "",
  name: dto.email ?? "",
});
