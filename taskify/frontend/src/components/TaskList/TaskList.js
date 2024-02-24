import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./TaskList.css";

const TaskList = () => {
  return (
    <div className="card rounded-0">
      <div className="row g-0">
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
        <div className="col-md-8 d-flex column align-items-center task">
          <label className="custom-checkbox">
            <input type="checkbox"></input>
            <span className="checkmark"></span>
          </label>
          <div className="card-body">
            <h5 className="card-title">Task #2</h5>
            <p className="card-text">This is a standard task.</p>
            <p className="card-text">
              <small className="text-body-secondary">Due Date: </small>
            </p>
          </div>
        </div>
        <div className="col-md-8 d-flex column align-items-center task">
          <label className="custom-checkbox">
            <input type="checkbox"></input>
            <span className="checkmark"></span>
          </label>
          <div className="card-body">
            <h5 className="card-title">Task #3</h5>
            <p className="card-text">This is a standard task.</p>
            <p className="card-text">
              <small className="text-body-secondary">Due Date: </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
