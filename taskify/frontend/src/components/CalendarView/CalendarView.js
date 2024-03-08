import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./CalendarView.css";
import { handleTaskStatus, getTasks } from "../../actions/auth/taskUtils";
import { getUserById } from "../../actions/auth/userUtils";
import ErrorModal from "../ErrorModal";
import CalendarViewTaskDetailModal from "../../modals/ViewTaskDetailModal";
import ViewTasksForDateModal from "../../modals/ViewTasksForDateModal";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [error, setError] = useState(null);
  const [updatingTask, setUpdatingTask] = useState({
    id: "",
    title: "",
    description: "",
    assigned_user: "",
  });

  const openViewTasksForDateModal = () => {
    const modal = new bootstrap.Modal(document.getElementById("viewTaskModal"));
    modal.show();
  };

  const closeErrorModal = () => {
    setError(null);
  };

  const handleStatusChange = (taskId, status) => {
    handleTaskStatus(taskId, status);
  };

  const handleViewTask = async (task) => {
    setUpdatingTask({
      id: task.id,
      title: task.title,
      description: task.description,
      assigned_user: await fetchUserById(task.assigned_user),
    });
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await getUserById(userId);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setError("Error fetching user by ID:", error.message);
    }
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
      getTasks()
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
          manipulate(extractedDueDates, tasksByDate);
        })
        .catch((error) => {
          setError(error.message);
        });
    };
    fetchTasksAndDates();

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
            dueDate.month === month + 1 &&
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
            openViewTasksForDateModal();
            setSelectedDateTasks(Array.from(tasksForSelectedDate.values()));
          }
        });
      });
    };

    prevNextIcon.forEach((icon) => {
      icon.addEventListener("click", () => {
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;
        if (month < 0 || month > 11) {
          date = new Date(year, month, new Date().getDate());
          year = date.getFullYear();
          month = date.getMonth();
        } else {
          date = new Date();
        }
        fetchTasksAndDates();
      });
    });
  }, []);

  return (
    <div>
      {error && <ErrorModal errorMessage={error} onClose={closeErrorModal} />}
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

      <ViewTasksForDateModal
        selectedDate={selectedDate}
        selectedDateTasks={selectedDateTasks}
        handleStatusChange={handleStatusChange}
        handleViewTask={handleViewTask}
      />
      <CalendarViewTaskDetailModal
        updatingTask={updatingTask}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarView;