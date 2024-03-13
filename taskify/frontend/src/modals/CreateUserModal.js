import React from "react";

const CreateUserModal = ({
  newUser = {},
  handleNewUserInput,
  handleCreateUser,
}) => {
  return (
    <div
      className="modal fade"
      id="createUserModal"
      tabIndex="-1"
      aria-labelledby="createUserModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createUserModalLabel">
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
                  value={newUser.username || ""}
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
                  value={newUser.password || ""}
                  onChange={handleNewUserInput}
                />
                <p style={{ fontSize: "small", color: "grey" }}>
                  Password must be at least 8 characters long
                </p>
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
                  value={newUser.firstName || ""}
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
                  value={newUser.lastName || ""}
                  onChange={handleNewUserInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={newUser.email || ""}
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
              onClick={handleCreateUser}
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
