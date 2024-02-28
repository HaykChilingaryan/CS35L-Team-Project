import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./TaskList.css";

const TaskPage = () => {
  const [activeTab, setActiveTab] = useState("inProgress");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [popup, setPopup] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleCreateTaskBtn = () => {
    setPopup(!popup);
    console.log("Creating a new task");
  };

  const handleCreateTaskClose = () => {
    setPopup(false);
  };

  const handleCreateTask = () => {};

  const handleDeleteTask = () => {
    console.log("Delete Task");
  };

  const handleCompleteTask = (taskId) => {
    fetch(`http://localhost:8000/backend/users/me/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Completed" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        window.location.reload();
      })
      .then((data) => {
        console.log("Task status updated successfully:", data.message);
        // Handle the updated status response as needed
      })
      .catch((error) => {
        console.error("Error updating task status:", error.message);
        // Handle errors appropriately
      });
  };

  useEffect(() => {
    const authToken = sessionStorage.getItem("session");

    // Make a request to your API endpoint
    fetch(
      `http://localhost:8000/backend/users/me/tasks?sessionId=${authToken}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);

        const inProgress = data.filter((task) => task.status == "InProgress");
        setInProgressTasks(inProgress);
        const completed = data.filter((task) => task.status !== "InProgress");
        setCompletedTasks(completed);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [location.pathname]);

  const filterOptions = ["Option 1", "Option 2", "Option 3"]; // Replace with your actual filter options
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Task List</h1>
        <button
          className="btn btn-secondary"
          onClick={handleCreateTaskBtn}
          style={{ fontSize: "1.2rem" }}
        >
          Create Task
        </button>
        {popup ? (
          <div className="popup d-flex flex-column">
            <button
              onClick={handleCreateTaskClose}
              className="align-self-end btn btn-close"
            ></button>
            <div className="form-task mb-4 flex-column d-flex justify-content-evenly">
              <span className="input-description">Task Title</span>
              <input
                type="text"
                name="tasktitle"
                id="typeTaskTitleX"
                className="input-task"
              />
              <span className="input-description">Task Description</span>

              <input
                type="text"
                name="taskdescription"
                id="typeTaskDescriptionX"
                className="input-task"
              />
              <span className="input-description">Due Date</span>

              <input
                type="date"
                name="taskduedate"
                id="typeTaskDueDateX"
                className="input-task"
              />
              <span className="input-description">Assigned User</span>

              <input
                type="text"
                name="taskassigneduser"
                id="typeTaskAsssignedUserX"
                className="input-task"
              />
            </div>
            <button className="btn btn-dark btn-ct">Create Task</button>
          </div>
        ) : (
          ""
        )}
      </div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "inProgress" ? "active" : ""}`}
            onClick={() => handleTabChange("inProgress")}
          >
            In Progress
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => handleTabChange("completed")}
          >
            Completed
          </button>
        </li>
      </ul>

      <div className="d-flex mt-3">
        <div className="flex-grow-1 me-2">
          <label
            htmlFor="searchInput"
            className="form-label"
            style={{ fontSize: "1.5rem" }}
          >
            Search
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              id="searchInput"
              placeholder="Enter search query"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ fontSize: "1.2rem" }}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="filterDropdown"
            className="form-label"
            style={{ fontSize: "1.5rem" }}
          >
            Filter
          </label>
          <select
            className="form-select"
            id="filterDropdown"
            value={filterValue}
            onChange={handleFilterChange}
          >
            <option value="">No Filter</option>
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tab-content mt-3">
        <div
          className={`tab-pane fade ${
            activeTab === "inProgress" ? "show active" : ""
          }`}
          id="inProgress"
        >
          {/* Content for In Progress tasks */}
          {filterValue && (
            <button
              className="btn btn-outline-primary"
              style={{ fontSize: "1.2rem" }}
            >
              {filterValue}
            </button>
          )}
          <div className="row g-0">
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="col-md-8 d-flex column align-items-center task-container"
              >
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="card-text">{task.description}</p>
                  <p className="card-text">
                    <small className="text-body-secondary">
                      {new Date(task.due_date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
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
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    className="btn btn-success btn-md"
                    onClick={() => handleCompleteTask(task.id)}
                  >
                    <i className="bi bi-check"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`tab-pane fade ${
            activeTab === "completed" ? "show active" : ""
          }`}
          id="completed"
        >
          <div className="row g-0">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="col-md-8 d-flex column align-items-center task-container"
              >
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="card-text">{task.description}</p>
                  <p className="card-text">
                    <small className="text-body-secondary">
                      {new Date(task.due_date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
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
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
