export const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

export const changeUserPassword = (newPassword) => {
  return fetch("http://localhost:8000/backend/users/me/pass", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ newPassword }),
  });
};

export const logout = () => {
  return fetch("http://localhost:8000/backend/auth/logout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CsrfToken": getCookie("csrftoken"),
    },
  });
};

export const login = (username, password) => {
  return fetch("http://localhost:8000/backend/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrftoken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ username, password }),
  });
};

export const register = (newUser) => {
  return fetch("http://localhost:8000/backend/auth/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Csrftoken": getCookie("csrftoken"),
    },
    body: JSON.stringify({
      username: newUser.username,
      password: newUser.password,
      first_name: newUser.firstName,
      last_name: newUser.lastName,
      company: newUser.company,
      email: newUser.email,
      is_manager: false,
    }),
  });
};