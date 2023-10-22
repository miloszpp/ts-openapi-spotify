import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbum } from "../services/api";
import { convertAlbumDetails } from "../services/conversion";
import { AlbumDetails } from "../types/domain";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncSuccess,
} from "../utils/AsyncResult";

export const SingleAlbum: React.FC = () => {
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] =
    useState<AsyncResult<AlbumDetails>>(ASYNC_EMPTY);

  useEffect(() => {
    if (!id) {
      return;
    }

    setAlbumDetails(ASYNC_IN_PROGRESS);
    getAlbum(id).then((response) => {
      setAlbumDetails(asAsyncSuccess(convertAlbumDetails(response.data)));
    });
  }, [id]);

  return (
    <>
      {albumDetails.type === "inProgress" && <span>Loading...</span>}
      {albumDetails.type === "success" && (
        <div>
          <h1>{albumDetails.value.name}</h1>
          <h2>{albumDetails.value.artist}</h2>
          <img src={albumDetails.value.imagePath} />
        </div>
      )}
    </>
  );
};
