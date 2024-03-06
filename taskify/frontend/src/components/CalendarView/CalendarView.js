import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./CalendarView.css";
import { getCookie } from "../../actions/auth/auth";
import { handleTaskStatus } from "../../actions/auth/taskUtils";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [tasksMap, setTasksMap] = useState(new Map());
  const [error, setError] = useState(null);

  const [updatingTask, setUpdatingTask] = useState({
    id: "",
    title: "",
    description: "",
    assigned_user: "",
    due_date: "",
  });

  const handleStatusChange = (taskId, status) => {
    handleTaskStatus(taskId, status);
  };
  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/backend/users/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-Csrftoken": getCookie("csrftoken"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await response.json();
      return userData; // This should contain the user's details
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  };

  const handleViewTask = async (task) => {
    setUpdatingTask({
      id: task.id,
      title: task.title,
      description: task.description,
      assigned_user: await fetchUserById(task.assigned_user),
      due_date: task.due_date.slice(0, -1),
    });
  };

  useEffect(() => {
    const daysTag = document.querySelector(".calendar-dates");
    const currentDate = document.querySelector(".calendar-current-date");
    const prevNextIcon = document.querySelectorAll(".calendar-navigation span");

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const fetchTasksAndDates = async () => {
      fetch("http://localhost:8000/backend/users/me/tasks/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Csrftoken": getCookie("csrftoken"),
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((tasks) => {
          const inProgressTasks = tasks.filter(
            (task) => task.status === "InProgress"
          );

          const extractedDueDates = inProgressTasks.map((task) => {
            const dueDate = new Date(task.due_date);
            return {
              year: dueDate.getFullYear(),
              month: dueDate.getMonth() + 1,
              day: dueDate.getDate(),
            };
          });

          const tasksByDate = new Map();

          inProgressTasks.forEach((task) => {
            const dueDate = new Date(task.due_date);
            const year = dueDate.getFullYear();
            const month = dueDate.getMonth() + 1;
            const day = dueDate.getDate();

            const yearMonthDateKey = `${year}-${month}-${day}`;

            if (!tasksByDate.has(yearMonthDateKey)) {
              tasksByDate.set(yearMonthDateKey, new Map());
            }

            tasksByDate.get(yearMonthDateKey).set(task.id, task);
          });

          setTasksMap(tasksByDate);
          manipulate(extractedDueDates, tasksByDate);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          setError("An unexpected error occurred");
        });
    };
    fetchTasksAndDates();

    fetch(`http://localhost:8000/backend/users/me/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Csrftoken": getCookie("csrftoken"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((user) => {
        setIsManager(user.is_manager);
        fetchCompanyUsers(user.company);
      })
      .catch((error) => {
        setError(error.message);
      });

    const fetchCompanyUsers = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:8000/backend/company/${id}/users`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-Csrftoken": getCookie("csrftoken"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const companyUsers = await response.json();
        setUsersOfCompany(companyUsers);
      } catch (error) {
        setError(error.message);
      }
    };

    const manipulate = (dueDates, tasksByDate) => {
      let dayone = new Date(year, month, 1).getDay();
      let lastdate = new Date(year, month + 1, 0).getDate();
      let dayend = new Date(year, month, lastdate).getDay();
      let monthlastdate = new Date(year, month, 0).getDate();
      let lit = "";
      for (let i = dayone; i > 0; i--) {
        const prevMonthDate = month === 0 ? 11 : month - 1;
        const prevMonthYear = month === 0 ? year - 1 : year;
        lit += `<li class="inactive" data-month="${prevMonthDate}" data-year="${prevMonthYear}">${
          monthlastdate - i + 1
        }</li>`;
      }

      for (let i = 1; i <= lastdate; i++) {
        let isTodayorMonthDay =
          i === date.getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear()
            ? "today"
            : "monthDay";

        let isDueDate = dueDates.some(
          (dueDate) =>
            dueDate.year === year &&
            dueDate.month === month + 1 && // Months are zero-based in JavaScript Date objects
            dueDate.day === i
        )
          ? "due-date"
          : "";
        lit += `<li class="${isDueDate} ${isTodayorMonthDay}" id="${year}/${month}/${i}" data-month="${month}" data-year="${year}">${i}</li>`;
      }

      for (let i = dayend; i < 6; i++) {
        const nextMonthDate = month === 11 ? 0 : month + 1;
        const nextMonthYear = month === 11 ? year + 1 : year;
        lit += `<li class="inactive" data-month="${nextMonthDate}" data-year="${nextMonthYear}">${
          i - dayend + 1
        }</li>`;
      }

      currentDate.innerText = `${months[month]} ${year}`;
      daysTag.innerHTML = lit;

      // add click event listeners to each date
      const dateElements = document.querySelectorAll(".calendar-dates li");
      dateElements.forEach((dateElement) => {
        dateElement.addEventListener("click", () => {
          const date = dateElement.innerText;
          const clickedMonth = parseInt(dateElement.getAttribute("data-month"));
          const clickedYear = parseInt(dateElement.getAttribute("data-year"));
          setSelectedDate(`${months[clickedMonth]} ${date}, ${clickedYear}`);

          const yearMonthDateKey = `${clickedYear}-${
            clickedMonth + 1
          }-${parseInt(date, 10)}`;
          const tasksForSelectedDate = tasksByDate.get(yearMonthDateKey);

          if (tasksForSelectedDate) {
            openModal();
            setSelectedDateTasks(Array.from(tasksForSelectedDate.values()));
          }
        });
      });
    };

    // click event listener for each icon
    prevNextIcon.forEach((icon) => {
      // when click
      icon.addEventListener("click", () => {
        // check if "calendar-prev" or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;
        // check for going to diff year
        if (month < 0 || month > 11) {
          // set new date to first day of next year
          date = new Date(year, month, new Date().getDate());
          // set new year
          year = date.getFullYear();
          // set new month
          month = date.getMonth();
        } else {
          // set curr date
          date = new Date();
        }
        // update calendar display
        fetchTasksAndDates();
      });
    });
  }, []);

  const openModal = () => {
    const modal = new bootstrap.Modal(
      document.getElementById("createTaskModal")
    );
    modal.show();
  };

  return (
    <div>
      <div
        className="card bg-white text-black"
        style={{
          background: "#fff",
          width: "90vw",
          height: "90vh",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
          display: "flex",
          flexDirection: "column",
          marginTop: "30px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "30px",
        }}
      >
        <header
          className="calendar-header"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "25px 30px 10px",
            justifyContent: "space-between",
          }}
        >
          <p className="calendar-current-date"></p>
          <div className="calendar-navigation">
            <span id="calendar-prev" className="material-symbols-rounded">
              &lt;
            </span>
            <span id="calendar-next" className="material-symbols-rounded">
              &gt;
            </span>
          </div>
        </header>
        <div className="calendar-body">
          <ul className="calendar-weekdays">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
          <ul className="calendar-dates"></ul>
        </div>
      </div>
      {/* MODAL FOR TASK VIEW */}
      <div
        className="modal fade"
        id="createTaskModal"
        tabIndex="-1"
        aria-labelledby="createTaskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createTaskModalLabel">
                {selectedDate}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row g-0">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="col-md-8 d-flex column align-items-center task-container"
                  >
                    <div className="card-body">
                      <h5 className="card-title">{task.title} </h5>
                      <p className="card-text">
                        <small>
                          Due:{" "}
                          {new Date(task.due_date).toLocaleString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "UTC",
                          })}
                        </small>
                      </p>
                    </div>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-danger btn-md me-2"
                        onClick={() => handleStatusChange(task.id, "Deleted")}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-primary btn-md me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#taskDetailModal"
                        onClick={() => handleViewTask(task)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-success btn-md"
                        onClick={() => handleStatusChange(task.id, "Completed")}
                      >
                        <i className="bi bi-check"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-danger"
                data-bs-dismiss="taskDetailModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="taskDetailModal"
        tabIndex="-1"
        aria-labelledby="taskDetailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="taskDetailModalLabel">
                View Task: Due - {selectedDate}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    placeholder={updatingTask.title}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    placeholder={updatingTask.description}
                    disabled
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="selectedUser" className="form-label">
                    User
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    placeholder={updatingTask.assigned_user.first_name}
                    disabled
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
