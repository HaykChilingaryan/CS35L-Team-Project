import { getCookie } from "./auth";

export const handleTaskStatus = (taskId, newStatus) => {
  return fetch(
    `http://localhost:8000/backend/users/me/tasks/status/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ status: newStatus }),
    }
  );
};

export const getTasks = (filterValue, searchQuery) => {
  let sortingField = "title";
  switch (filterValue) {
    case "Title":
      sortingField = "title";
      break;
    case "Date":
      sortingField = "due_date";
      break;
    case "User Name":
      sortingField = "assigned_user__first_name";
      break;
    default:
      sortingField = "title";
      break;
  }
  const searchQueryParam = searchQuery ? `&search=${searchQuery}` : "";

  return fetch(
    `http://localhost:8000/backend/users/me/tasks?ordering=${sortingField}${searchQueryParam}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Csrftoken": getCookie("csrftoken"),
      },
    }
  );
};

export const createTask = (newTask) => {
  return fetch("http://localhost:8000/backend/users/me/tasks/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Csrftoken": getCookie("csrftoken"),
    },
    body: JSON.stringify({
      title: newTask.title,
      description: newTask.description,
      assigned_user: newTask.selectedUser,
      due_date: newTask.dueDate,
    }),
  });
};

export const updateTask = (updatingTask) => {
  return fetch("http://localhost:8000/backend/users/me/tasks/", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Csrftoken": getCookie("csrftoken"),
    },
    body: JSON.stringify({
      id: updatingTask.id,
      title: updatingTask.title,
      description: updatingTask.description,
    }),
  });
};