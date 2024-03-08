import React from "react";

const CalendarViewTaskDetailModal = ({ selectedDate, updatingTask }) => {
  return (
    <div
      className="modal fade"
      id="taskDetailModal"
      tabIndex="-1"
      aria-labelledby="taskDetailModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="taskDetailModalLabel">
              View Task: Due - {selectedDate}
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
                  placeholder={updatingTask.title}
                  disabled
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
                  placeholder={updatingTask.description}
                  disabled
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  User
                </label>
                <input
                  type="text"
                  autocomplete="name"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder={
                    updatingTask.assigned_user.first_name +
                    " " +
                    updatingTask.assigned_user.last_name
                  }
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
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarViewTaskDetailModal;
