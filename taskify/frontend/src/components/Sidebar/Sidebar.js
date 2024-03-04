import "bootstrap/dist/css/bootstrap.css";
import "./Sidebar.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Offcanvas } from "bootstrap";
import { getCookie } from "../../actions/auth/auth";

const Sidebar = () => {
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/backend/auth/logout/",
        {
          method: "POST",
          headers: {
            "X-CsrfToken": getCookie("csrftoken"),
          },
        }
      );

      if (response.ok) {
        setUsername("");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProfileNavigation = () => {
    navigate("/profile");
  };

  const handleTaskListNavigation = () => {
    navigate("/tasklist");
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/backend/users/me/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Csrftoken": getCookie("csrftoken"),
            },
          }
        );

        if (!response.ok) {
          return null;
        }
        const user = await response.json();
        setUsername(user.username);
        console.log("Auth" + user.is_authenticated);
      } catch (error) {
        window.location.reload();
      }
    };

    getUser();
  }, [location.pathname]);

  return (
    <section>
      <div className="d-flex top-bar">
        {username && (
          <button
            className="black-btn btn btn-lg rounded-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasWithBothOptions"
            aria-controls="offcanvasWithBothOptions"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </button>
        )}
        <div className="fs-4"> TASKIFY </div>
        <div className="fs-4 pe-2">Welcome {username}</div>
      </div>

      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabIndex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <h5
            className="fs-3 fw-bold offcanvas-title"
            id="offcanvasWithBothOptionsLabel"
          >
            TASKIFY
          </h5>
          <button
            type="button"
            className="btn-close bg-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <ul>
            <button
              onClick={handleTaskListNavigation}
              type="button"
              className="menu-button fs-5 btn"
              data-bs-dismiss="offcanvas"
            >
              <i className="bi bi-list-ul"></i> Task List
            </button>
          </ul>
          <ul>
            <button type="button" className="menu-button fs-5 btn">
              <i className="bi bi-calendar-check"></i> Calendar View
            </button>
          </ul>
          <ul>
            <button
              onClick={handleProfileNavigation}
              type="button"
              className="menu-button fs-5 btn"
              data-bs-dismiss="offcanvas"
            >
              <i className="bi bi-person"></i> Profile
            </button>
          </ul>
          <ul className="mt-auto">
            <button
              onClick={handleLogout}
              type="button"
              className="menu-button fs-5 btn"
              data-bs-dismiss="offcanvas"
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
