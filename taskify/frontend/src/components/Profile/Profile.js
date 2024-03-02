import React, { Component, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const Profile = () => {
  const [username, setUsername] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      try {
        const sessionId = sessionStorage.getItem("session");
        const response = await fetch(
          `http://localhost:8000/backend/api/get-user?session_id=${sessionId}`
        );

        if (!response.ok) {
          return null;
        }
        const data = await response.json();
        setUsername(data["username"]);
        setFirstName(data["first_name"]);
        setLastName(data["last_name"]);
      } catch (error) {
        window.location.reload();
      }
    };

    getUser();
  }, [location.pathname]);

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-right">Profile</h3>
            </div>
            <div className="row mt-2">
              <div className="col-md-6">
                <label className="labels">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={username}
                  value=""
                  style={{width: '250px'}}
                  readOnly
                />
              </div>
            </div>
            <div className="row mt-2">
              <div classNamess="col-md-6">
                <label className="labels">Company</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company"
                  value=""
                  style={{width: '250px'}}
                  readOnly
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6">
                <label class="labels">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={firstName}
                  value=""
                  style={{width: '250px'}}
                  readOnly                
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6">
                <label className="labels">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={lastName}
                  value=""
                  style={{width: '250px'}}
                  readOnly
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6">
                <label className="labels">Password</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="*****"
                  value=""
                  style={{width: '250px'}}              
                />
              </div>
              <div className="mt-2">
                <button
                  className="btn btn-sm btn-outline-dark px-5"
                  type="button"
                  style={{width: '200px'}}
                >
                  change password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
