import { getCookie } from "./auth";

export const handleTaskStatus = (taskId, newStatus) => {
  fetch(`http://localhost:8000/backend/users/me/tasks/status/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.location.reload();
    })
    .catch((error) => {
      throw error;
    });
};
