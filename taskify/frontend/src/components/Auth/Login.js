import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import logo from "../../../static/images/TaskifyLogo.png";
import "./Login.css";
import { getCookie } from "../../actions/auth/auth";

const Login1 = () => {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
    message: "",
  });

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevLoginInfo) => ({
      ...prevLoginInfo,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const { username, password } = loginInfo;

      const response = await fetch(
        "http://localhost:8000/backend/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Csrftoken": getCookie("csrftoken"),
          },
          body: JSON.stringify({ username, password }),
        }
      );
      if (response.ok) {
        navigate("/tasklist");
      } else {
        setLoginInfo({
          username: "",
          password: "",
          message: "Invalid username or password",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const jiggleEffect = loginInfo.message ? "jiggle" : "";
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
                    value={loginInfo.username}
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
                    value={loginInfo.password}
                  />
                </div>
                <button
                  className="btn btn-outline-light btn-lg px-5"
                  type="button"
                  onClick={handleLogin}
                >
                  Login
                </button>
                {loginInfo.message != "" && (
                  <div className={`mt-3 text-light ${jiggleEffect}`}>
                    {loginInfo.message}
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

export default Login1;
