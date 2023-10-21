import { Album, AlbumDetails } from "../types/domain";
import { AlbumDetailsResponseDto, AlbumSearchResponseDto } from "../types/dto";

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
