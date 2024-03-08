import { getCookie } from "./auth";

export const getUserById = (userId) => {
  return fetch(`http://localhost:8000/backend/users/${userId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Csrftoken": getCookie("csrftoken"),
    },
  });
};

export const getSessionUser = () => {
  return fetch(`http://localhost:8000/backend/users/me/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Csrftoken": getCookie("csrftoken"),
    },
  });
};

export const getUserComapny = (companyId) => {
  return fetch(`http://localhost:8000/backend/company/${companyId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
