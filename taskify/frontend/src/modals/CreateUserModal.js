import React from "react";

const CreateUserModal = ({ newUser, handleNewUserInput, handleCreateTask }) => {
  return (
    <div
      className="modal fade"
      id="createUserModal"
      tabIndex="-1"
      aria-labelledby="createUserModal"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createUserModal">
              Create User
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* Form for creating a new user */}
            <form>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Password
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleNewUserInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleNewUserInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Manager
                </label>
                <input
                  type="checkbox"
                  className="form-control"
                  id="isManager"
                  name="isManager"
                  value={newUser.isManager}
                  onChange={handleNewUserInput}
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

export default CreateUserModal;
