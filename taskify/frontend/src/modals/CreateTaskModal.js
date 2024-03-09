import React from "react";

const CreateTaskModal = ({
  newTask,
  handleNewTaskInputChange,
  usersOfCompany,
  handleCreateTask,
}) => {
  return (
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
                        {user.first_name} {user.last_name} {" - "}
                        {user.username}
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
  );
};

export default CreateTaskModal;
