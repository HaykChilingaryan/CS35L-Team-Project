import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./TaskPage.css";
import { getCookie } from "../../actions/auth/auth";
import { handleTaskStatus, getTasks } from "../../actions/auth/taskUtils";
import ErrorModal from "../ErrorModal";
import SuccessModal from "../SuccessModal";
import CreateUserModal from "../../modals/CreateUserModal";

const TaskPage = () => {
  const filterOptions = ["Title", "Date", "User Name"];
  const [activeTab, setActiveTab] = useState("inProgress");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("Title");
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [usersOfCompany, setUsersOfCompany] = useState(null);
  const [userDetailsMap, setUserDetailsMap] = useState(new Map());
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    selectedUser: "",
    dueDate: "",
  });

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    isManager: "",
    company: "",
  });

  const openCreateUserModal = () => {
    const modal = new bootstrap.Modal(
      document.getElementById("createUserModal")
    );
    modal.show();
  };

  const [updatingTask, setUpdatingTask] = useState({
    id: "",
    title: "",
    description: "",
    assigned_user: "",
    due_date: "",
  });
  const handleCloseErrorModal = () => {
    setError(null);
  };
  const handleCloseSuccessModal = () => {
    setSuccess(null);
  };

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
      setUserDetailsMap(userDetailsMapCopy);
    } catch (error) {
      setError(error.message);
    }
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
        setError(response.message);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTabChange = (tab) => {
    setSearchQuery("");
    setActiveTab(tab);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleCreateTask = async () => {
    try {
      if (
        !newTask.title ||
        !newTask.description ||
        !newTask.selectedUser ||
        !newTask.dueDate
      ) {
        setError("Please fill in all required fields");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/backend/users/me/tasks/",
        {
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
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.message);
      } else {
        window.location.reload();
        setSuccess(responseData.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateTask = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/backend/users/me/tasks/",
        {
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
        }
      );

      if (!response.ok) {
        setError(response.message);
      }

      window.location.reload();
    } catch (error) {
      setError(error.message);
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

  const handleNewTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleUpdatingTaskInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatingTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleNewUserInput = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleStatusChange = (taskId, status) => {
    handleTaskStatus(taskId, status)
      .then((response) => {
        if (!response.ok) {
          setError("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        fetchTasks();
        setSuccess("Task Status Updated: " + status);
      })
      .catch((error) => {
        console.error("Error updating task status:", error.message);
      });
  };

  const fetchTasks = async () => {
    getTasks(filterValue, searchQuery)
      .then((response) => {
        if (!response.ok) {
          setError(response.message);
        }
        return response.json();
      })
      .then((tasksData) => {
        const inProgress = tasksData.filter(
          (task) => task.status === "InProgress"
        );
        const completed = tasksData.filter(
          (task) => task.status === "Completed"
        );
        setTasks(tasksData);
        setInProgressTasks(inProgress);
        setCompletedTasks(completed);
        fetchUserDetailsForTasks(tasksData);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
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
          setError(response.message);
        }
        return response.json();
      })
      .then((user) => {
        setIsManager(user.is_manager);
        fetchTasks();
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
          setError(response.message);
        }
        const companyUsers = await response.json();
        setUsersOfCompany(companyUsers);
      } catch (error) {
        setError(error.message);
      }
    };
  }, [location.pathname, filterValue, searchQuery]);

  return (
    <div className="container mt-5">
      {error && (
        <ErrorModal errorMessage={error} onClose={handleCloseErrorModal} />
      )}
      {success && (
        <SuccessModal
          errorMessage={success}
          onClose={handleCloseSuccessModal}
        />
      )}

      <div className="d-flex align-items-center">
        <h1 className="title-header">Task List</h1>
        {isManager && (
          <button
            className="me-2 btn btn-outline-dark"
            data-bs-toggle="modal"
            data-bs-target="#createUserModal"
            style={{ fontSize: "1.2rem" }}
            onClick={openCreateUserModal}
          >
            Create User
          </button>
        )}
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
              placeholder="Search by Title or Description"
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
            Sort
          </label>
          <select
            className="form-select"
            id="filterDropdown"
            value={filterValue}
            onChange={handleFilterChange}
          >
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

          <div className="row g-0">
            {inProgressTasks.map((task) => (
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
                    onClick={() => handleStatusChange(task.id, "Deleted")}
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
                    onClick={() => handleStatusChange(task.id, "Completed")}
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
                    onClick={() => handleStatusChange(task.id, "Deleted")}
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
                    onChange={handleNewTaskInputChange}
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
                    onChange={handleNewTaskInputChange}
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
                    onChange={handleNewTaskInputChange}
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
                    onChange={handleNewTaskInputChange}
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
                onClick={handleCreateTask}
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
              {/* Form for updating a new task */}
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
                    onChange={handleUpdatingTaskInputChange}
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
                    onChange={handleUpdatingTaskInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="selectedUser" className="form-label">
                    Select User
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder={
                      updatingTask.assigned_user.first_name +
                      " " +
                      updatingTask.assigned_user.last_name
                    }
                    disabled
                  />
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
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleUpdateTask}
                data-bs-dismiss="modal"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      <CreateUserModal
        newUser={newUser}
        handleNewUserInput={handleNewUserInput}
      />
    </div>
  );
};

export default TaskPage;
