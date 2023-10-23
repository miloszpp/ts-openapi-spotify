import { isAxiosError } from "axios";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";
import { convertCurrentUser } from "../services/conversion";
import { CurrentUser } from "../types/domain";
import {
  ASYNC_EMPTY,
  ASYNC_IN_PROGRESS,
  AsyncResult,
  asAsyncFailure,
  asAsyncSuccess,
} from "../utils/AsyncResult";

export const CurrentUserContext = React.createContext<CurrentUser>({
  id: "",
  name: "",
});

export const Authorized: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] =
    useState<AsyncResult<CurrentUser>>(ASYNC_EMPTY);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(ASYNC_IN_PROGRESS);
    getCurrentUser().then(
      (response) => {
        setCurrentUser(asAsyncSuccess(convertCurrentUser(response.data)));
      },
      (error): void => {
        if (isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        } else {
          setCurrentUser(asAsyncFailure(error));
        }
      }
    );
  }, [navigate]);

  return (
    <>
      {currentUser.type === "success" && (
        <CurrentUserContext.Provider value={currentUser.value}>
          {children}
        </CurrentUserContext.Provider>
      )}
      {currentUser.type === "inProgress" && <span>Loading...</span>}
      {currentUser.type === "failure" && (
        <span>Error occurred when fetching current user</span>
      )}
    </>
  );
};
