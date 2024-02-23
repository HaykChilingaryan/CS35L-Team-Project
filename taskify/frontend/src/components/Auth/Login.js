import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import logo from "../../../static/images/TaskifyLogo.png";
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [loginMessage, setLoginMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get("loginMessage");
    if (message) {
      setLoginMessage(message);
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    const { username, password } = loginInfo;

    try {
      console.log(JSON.stringify({ username, password }));
      const response = await fetch("http://localhost:8000/backend/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        window.location.href = "/tasklist";
        onLoginSuccess();
      } else {
        const loginFailedMessage =
          "Login failed. Please check your credentials.";
        window.location.href = `/?loginMessage=${encodeURIComponent(
          loginFailedMessages
        )}`;
      }
    } catch (error) {
      const loginErrorMessage = "Error during Login.";
      window.location.href = `/?loginMessage=${encodeURIComponent(
        loginErrorMessage
      )}`;
    }
  };

  const jiggleEffect = loginMessage ? "jiggle" : "";
  return (
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-4 col-xl-5">
          <div
            className="card bg-black text-white"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-5 text-center">
              <div className="mb-md-5 mt-md-4 pb-1">
                <img
                  className="w-75 h-75 rounded mx-auto d-block text-center"
                  src={logo}
                  alt="Taskify Logo"
                />
                <div className="input-group form-white mb-4 column d-flex">
                  <span className="input-group-text">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    type="text"
                    id="typeEmailX"
                    className="form-control form-control-lg"
                    placeholder="Username"
                    name="username"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group form-white mb-4 column d-flex">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    id="typePasswordX"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  className="btn btn-outline-light btn-lg px-5"
                  type="button"
                  onClick={handleLogin}
                >
                  Login
                </button>
                {loginMessage && (
                  <div className={`mt-3 text-light ${jiggleEffect}`}>
                    {loginMessage}
                  </div>
                )}
              </div>
              <div>
                <button className="btn btn-ra mt-3" type="submit">
                  Request Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
