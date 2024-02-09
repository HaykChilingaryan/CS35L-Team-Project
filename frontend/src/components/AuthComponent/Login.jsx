import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import logo from "../AuthComponent/TaskifyLogo.png";

function Login() {
  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-4 col-xl-5">
            <div
              className="card bg-black text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-1">
                  <img className="w-75 h-75 rounded mx-auto d-block text-center" src={logo} alt="Taskify Logo" />
                  <div className="input-group form-white mb-4 column d-flex">
                    <span className="input-group-text"><i class="bi bi-person"></i></span>
                    <input
                      type="text"
                      id="typeEmailX"
                      className="inp form-control form-control-lg"
                      placeholder="Username"
                    />
                  </div>
                  <div className="input-group form-white mb-4 column d-flex">
                    <span className="input-group-text"><i class="bi bi-lock"></i></span>                    
                    <input
                        type="password"
                        id="typePasswordX"
                        className="inp form-control form-control-lg"
                        placeholder="Password"
                      />
                  </div>
                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    type="submit"
                  >
                    Login
                  </button>
                  <div>
                    <button 
                      className="btn btn-ra mt-3"
                      type="submit"
                    >
                      Request Access
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
