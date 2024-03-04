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
  const [userInProgressTasks, setUserInProgressTasks] = useState([]);
  const [userCompletedTasks, setUserCompletedTasks] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [usersOfCompany, setUsersOfCompany] = useState(null);
  const [userDetailsMap, setUserDetailsMap] = useState(new Map());
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    selectedUser: "",
    dueDate: "",
  });

  const [updatingTask, setUpdatingTask] = useState({
    id: "",
    title: "",
    description: "",
    assigned_user: "",
    due_date: "",
  });

  const fetchUserDetailsForTasks = async (taskList) => {
    try {
      const userDetailsPromises = taskList.map(async (task) => {
        const user = await fetchUserById(task.assigned_user);
        return {
          taskId: task.id,
          firstName: user.first_name,
          lastName: user.last_name,
        };
      });

      const userDetailsList = await Promise.all(userDetailsPromises);

      const userDetailsMapCopy = new Map(userDetailsMap);

      userDetailsList.forEach((userDetails) => {
        userDetailsMapCopy.set(userDetails.taskId, {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
        });
      });
      console.log(userDetailsMapCopy);
      setUserDetailsMap(userDetailsMapCopy);
    } catch (error) {
      console.error("Error fetching user details for tasks:", error.message);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/backend/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const removeFilter = (e) => {
    setFilterValue("");
  };

  const handleSaveTask = async () => {
    try {
      const authToken = sessionStorage.getItem("session");
      if (
        !newTask.title ||
        !newTask.description ||
        !newTask.selectedUser ||
        !newTask.dueDate
      ) {
        console.error("Please fill in all required fields");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/backend/users/me/tasks/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: newTask.title,
            description: newTask.description,
            assigned_user: newTask.selectedUser,
            due_date: newTask.dueDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error creating task:", error.message);
    }
  };

  const handleViewTask = async (task) => {
    console.log(task);
    console.log(fetchUserById(task.assigned_user));
    setUpdatingTask({
      id: task.id,
      title: task.title,
      description: task.description,
      assigned_user: await fetchUserById(task.assigned_user),
      due_date: task.due_date.slice(0, -1),
    });

    console.log(task.assigned_user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleDeleteTask = (taskId) => {
    fetch(`http://localhost:8000/backend/users/me/tasks/status/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Deleted" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating task status:", error.message);
      });
  };

  const handleCompleteTask = (taskId) => {
    fetch(`http://localhost:8000/backend/users/me/tasks/status/${taskId}`, {
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
      .catch((error) => {
        console.error("Error updating task status:", error.message);
      });
  };

  const fetchCompanyTasks = async (userId, company, authToken) => {
    try {
      const response = await fetch(
        `http://localhost:8000/backend/company/${company}/tasks/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const tasksData = await response.json();
      setTasks(tasksData.tasks);
      const inProgress = tasksData.tasks.filter(
        (task) => task.status == "InProgress"
      );
      const userInProgress = inProgress.filter(
        (task) => task.assigned_user == userId
      );
      setInProgressTasks(inProgress);
      setUserInProgressTasks(userInProgress);
      const completed = tasksData.tasks.filter(
        (task) => task.status == "Completed"
      );
      const userCompleted = completed.filter(
        (task) => task.assigned_user == userId
      );
      setCompletedTasks(completed);
      setUserCompletedTasks(userCompleted);
      fetchUserDetailsForTasks(tasksData.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const authToken = sessionStorage.getItem("session");
    fetch(
      `http://localhost:8000/backend/auth/session/user?session_id=${authToken}`,
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
      .then((user) => {
        setIsManager(user.is_manager);
        fetchCompanyTasks(user.id, user.company, authToken);
        fetchCompanyUsers(user.company);
      })
      .catch((error) => {
        setError(error.message);
      });

    const fetchCompanyUsers = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:8000/backend/company/${id}/users`
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
  }, [location.pathname]);

  const filterOptions = ["Option 1", "Option 2", "Option 3"]; // Replace with your actual filter options
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Task List</h1>
        {isManager && (
          <button
            className="btn btn-outline-dark"
            data-bs-toggle="modal"
            data-bs-target="#createTaskModal"
            style={{ fontSize: "1.2rem" }}
          >
            Create Task
          </button>
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
            style={{ fontSize: "1.2rem" }}
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
            style={{ fontSize: "1.2rem" }}
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
              className="btn btn-outline-dark"
              style={{ fontSize: "1.2rem" }}
              onClick={removeFilter}
            >
              {filterValue}
            </button>
          )}
          <div className="row g-0">
            {(isManager ? inProgressTasks : userInProgressTasks).map((task) => (
              <div
                key={task.id}
                className="col-md-8 d-flex column align-items-center task-container"
              >
                <div className="card-body">
                  <h5 className="card-title">
                    {task.title}{" "}
                    {isManager && (
                      <>
                        - {userDetailsMap.get(task.id)?.firstName}{" "}
                        {userDetailsMap.get(task.id)?.lastName}
                      </>
                    )}
                  </h5>
                  <p className="card-text">{task.description}</p>
                  <p className="card-text">
                    <small>
                      Due:{" "}
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
                    className="btn btn-primary btn-md me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#updateTaskModal"
                    onClick={() => handleViewTask(task)}
                  >
                    <i className="bi bi-eye"></i>
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
            {(isManager ? completedTasks : userCompletedTasks).map((task) => (
              <div
                key={task.id}
                className="col-md-8 d-flex column align-items-center task-container"
              >
                <div className="card-body">
                  <h5 className="card-title">
                    {task.title}{" "}
                    {isManager && (
                      <>
                        - {userDetailsMap.get(task.id)?.firstName}{" "}
                        {userDetailsMap.get(task.id)?.lastName}
                      </>
                    )}
                  </h5>
                  <p className="card-text">{task.description}</p>
                  <p className="card-text">
                    <small>
                      {" "}
                      Due:{" "}
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
      {/* MODAL FOR TASK CREATION */}
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
                Create Task
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Form for creating a new task */}
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
                    value={newTask.title}
                    onChange={handleInputChange}
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
                    value={newTask.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="selectedUser" className="form-label">
                    Select User
                  </label>
                  {/* Replace the options and values as needed */}
                  <select
                    className="form-select"
                    id="selectedUser"
                    name="selectedUser"
                    value={newTask.selectedUser}
                    onChange={handleInputChange}
                  >
                    <option value="">Select User</option>
                    {usersOfCompany &&
                      usersOfCompany.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="dueDate"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
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
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleSaveTask}
                data-bs-dismiss="modal"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="updateTaskModal"
        tabIndex="-1"
        aria-labelledby="updateTaskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateTaskModalLabel">
                View/Update Task
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Form for creating a new task */}
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
                    value={updatingTask.title}
                    onChange={handleInputChange}
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
                    value={updatingTask.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="selectedUser" className="form-label">
                    Select User
                  </label>
                  <select
                    className="form-select"
                    id="selectedUser"
                    name="selectedUser"
                  >
                    <option>
                      {updatingTask.assigned_user.first_name}{" "}
                      {updatingTask.assigned_user.last_name}
                    </option>
                    {usersOfCompany &&
                      usersOfCompany.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="dueDate"
                    name="dueDate"
                    value={updatingTask.due_date}
                    onChange={handleInputChange}
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
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleSaveTask}
                data-bs-dismiss="modal"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
