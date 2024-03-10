import React, { useState, useEffect } from "react";
import { getCookie, register } from "../../actions/auth/auth";
import {
  handleTaskStatus,
  getTasks,
  createTask,
  updateTask,
} from "../../actions/auth/taskUtils";
import ErrorModal from "../../modals/ErrorModal";
import SuccessModal from "../../modals/SuccessModal";
import "bootstrap/dist/css/bootstrap.css";
import "./TaskPage.css";
import CreateTaskModal from "../../modals/CreateTaskModal";
import CreateUserModal from "../../modals/CreateUserModal";
import ViewTaskModal from "../../modals/ViewTaskModal";
import {
  getCompanyUsers,
  getSessionUser,
  getUserById,
  getUserCompany,
} from "../../actions/auth/userUtils";

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
    email: "",
  });

  const [updatingTask, setUpdatingTask] = useState({
    id: "",
    title: "",
    description: "",
    assigned_user: "",
    due_date: "",
  });

  const setErrorAndFade = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 10000);
  };

  const setSuccessAndFade = (message) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess(null);
    }, 10000);
  };

  const handleCloseErrorModal = () => {
    setError(null);
  };

  const handleCloseSuccessModal = () => {
    setSuccess(null);
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

  const fetchUserDetailsForTasks = async (taskList) => {
    try {
      const userDetailsPromises = taskList.map(async (task) => {
        const user = await fetchUserById(task.assigned_user);
        return {
          taskId: task.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
        };
      });

      const userDetailsList = await Promise.all(userDetailsPromises);

      const userDetailsMapCopy = new Map(userDetailsMap);

      userDetailsList.forEach((userDetails) => {
        userDetailsMapCopy.set(userDetails.taskId, {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          username: userDetails.username,
        });
      });
      setUserDetailsMap(userDetailsMapCopy);
    } catch (error) {
      setErrorAndFade(error.message);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await getUserById(userId);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      setErrorAndFade(error.message);
    }
  };

  const handleCreateTask = async () => {
    try {
      if (
        !newTask.title ||
        !newTask.description ||
        !newTask.selectedUser ||
        !newTask.dueDate
      ) {
        setErrorAndFade("Please fill in all required fields");
        return;
      }

      const response = await createTask(newTask);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error("Network Response was not ok");
      } else {
        fetchTasks();
        setSuccessAndFade(responseData.message);
      }
    } catch (error) {
      setErrorAndFade(error.message);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (
        !newUser.username ||
        !newUser.password ||
        !newUser.firstName ||
        !newUser.lastName
      ) {
        setErrorAndFade("Please fill in all required fields");
        return;
      }
      const response = await register(newUser);
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        setSuccessAndFade(responseData.message);
        fetchCompanyUsers(newUser.company);
      }
    } catch (error) {
      setErrorAndFade(error.message);
    }
  };

  const handleUpdateTask = async () => {
    try {
      const response = await updateTask(updatingTask);
      if (!response.ok) {
        throw new Error("Network Response was not ok");
      }
      fetchTasks();
    } catch (error) {
      setErrorAndFade(error.message);
    }
  };

  const handleStatusChange = (taskId, status) => {
    handleTaskStatus(taskId, status)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        fetchTasks();
        setSuccessAndFade("Task Status Updated: " + status);
      })
      .catch((error) => {
        setErrorAndFade(error.message);
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
        setInProgressTasks(inProgress);
        setCompletedTasks(completed);
        fetchUserDetailsForTasks(tasksData);
      })
      .catch((error) => {
        setErrorAndFade(error.message);
      });
  };

  const fetchCompanyUsers = async (companyId) => {
    try {
      const response = await getCompanyUsers(companyId);
      if (!response.ok) {
        throw new Error("Network Response was not ok");
      }
      const companyUsers = await response.json();
      setUsersOfCompany(companyUsers);
    } catch (error) {
      setErrorAndFade(error.message);
    }
  };

  useEffect(() => {
    getSessionUser()
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Response was not ok");
        }
        return response.json();
      })
      .then((user) => {
        setIsManager(user.is_manager);
        fetchTasks();
        fetchCompanyUsers(user.company);
        setNewUser({
          company: user.company,
        });
      })
      .catch((error) => {
        setErrorAndFade(error.message);
      });
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

      <CreateTaskModal
        newTask={newTask}
        handleNewTaskInputChange={handleNewTaskInputChange}
        usersOfCompany={usersOfCompany}
        handleCreateTask={handleCreateTask}
      />
      <CreateUserModal
        handleNewUserInput={handleNewUserInput}
        handleCreateUser={handleCreateUser}
      />

      <ViewTaskModal
        updatingTask={updatingTask}
        handleUpdatingTaskInputChange={handleUpdatingTaskInputChange}
        handleUpdateTask={handleUpdateTask}
      />
    </div>
  );
};

export default TaskPage;
