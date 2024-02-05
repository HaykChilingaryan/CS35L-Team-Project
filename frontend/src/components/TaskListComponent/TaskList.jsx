import "bootstrap/dist/css/bootstrap.css";
import "./TaskList.css"

function TaskList() {
  return (
    <div className="card rounded-0">
      <div className="row g-0">
        <div className="col-md-8 d-flex column align-items-center">
          <label class="custom-checkbox">
            <input type="checkbox"></input>
            <span class="checkmark"></span>
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
    </div>
  );
}

export default TaskList;
