import React from "react";

const ViewTaskModal = ({
  updatingTask,
  handleUpdatingTaskInputChange,
  handleUpdateTask,
}) => {
  return (
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
  );
};

export default ViewTaskModal;
