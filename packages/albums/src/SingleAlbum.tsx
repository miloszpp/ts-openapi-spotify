import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbum } from "common";
import { convertAlbumDetails } from "common";
import { AlbumDetails } from "common";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncFailure,
  asAsyncSuccess,
} from "common";

export const SingleAlbum: React.FC = () => {
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] =
    useState<AsyncResult<AlbumDetails>>(ASYNC_EMPTY);

  useEffect(() => {
    if (!id) {
      return;
    }

    (async () => {
      setAlbumDetails(ASYNC_IN_PROGRESS);
      try {
        const response = await getAlbum(id);
        setAlbumDetails(asAsyncSuccess(convertAlbumDetails(response.data)));
      } catch (error) {
        setAlbumDetails(asAsyncFailure(error));
      }
    })();
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
      {albumDetails.type === "failure" && (
        <span>Error occurred when fetching album details</span>
      )}
    </>
  );
};

export default SingleAlbum;