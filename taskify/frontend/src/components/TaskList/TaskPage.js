import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

const TaskPage = () => {
  const [activeTab, setActiveTab] = useState("inProgress");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mt-5">
      <h1>Task List</h1>
      <hr className="hr" />
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

      <div className="tab-content mt-3">
        <div
          className={`tab-pane fade ${
            activeTab === "inProgress" ? "show active" : ""
          }`}
          id="inProgress"
        >
          <br></br>
          <div className="col-md-8 d-flex column align-items-center task">
            <label className="custom-checkbox">
              <input type="checkbox"></input>
              <span className="checkmark"></span>
            </label>
            <div className="card-body">
              <h5 className="card-title">Task #1</h5>
              <p className="card-text">This is a standard task.</p>
              <p className="card-text">
                <small className="text-body-secondary">Due Date: </small>
              </p>
            </div>
          </div>
        </div>
        <div
          className={`tab-pane fade ${
            activeTab === "completed" ? "show active" : ""
          }`}
          id="completed"
        >
          {/* Content for Completed tasks */}
          <h2>Completed Tasks</h2>
          {/* Add your task components or content here */}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
