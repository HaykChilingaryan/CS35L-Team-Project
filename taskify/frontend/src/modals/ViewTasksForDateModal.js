import React from "react";

const ViewTasksForDateModal = ({
  selectedDate,
  selectedDateTasks,
  handleStatusChange,
  handleViewTask,
}) => {
  return (
    <div
      className="modal fade"
      id="viewTaskModal"
      tabIndex="-1"
      aria-labelledby="viewTaskModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="viewTaskModalLabel">
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
  );
};

export default ViewTasksForDateModal;
