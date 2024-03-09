import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./Profile.css";
import { changeUserPassword, logout } from "../../actions/auth/auth";
import ErrorModal from "../../modals/ErrorModal";
import { getSessionUser, getUserCompany } from "../../actions/auth/userUtils";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    username: null,
    first_name: null,
    last_name: null,
    company: null,
    is_manager: false,
  });
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCloseErrorModal = () => {
    setError(null);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
  };

  const handlePasswordChange = async () => {
    try {
      const response = await changeUserPassword(newPassword);
      console.log(response);
      const responseData = await response.json();
      if (response.ok) {
        navigate("/");
      } else {
        setError(responseData.message);
        setTimeout(() => {
          setError(null);
        }, 10000);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getSessionUser();

        if (!response.ok) {
          return null;
        }
        const user = await response.json();
        setUserDetails({
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          company: await getCompany(user.company),
          ia_manager: user.is_manager,
        });
      } catch (error) {
        setError(error.message);
      }
    };

    const getCompany = async (companyId) => {
      try {
        const response = await getUserCompany(companyId);
        if (!response.ok) {
          return null;
        }
        const company = await response.json();
        return company.name;
      } catch (error) {
        setError(error.message);
      }
    };
    getUser();
  }, [location.pathname]);

  return (
    <div className="page-background">
      <div className="rounded-container">
        <div className="container rounded border-custom mt-5 mb-5">
          {error && (
            <ErrorModal errorMessage={error} onClose={handleCloseErrorModal} />
          )}
          <div className="row">
            <div className="col-md-5 border-right">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="text-right">
                    <i className="bi bi-person"></i>Profile
                  </h3>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="labels">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={userDetails.username}
                      value=""
                      style={{ width: "235px" }}
                      disabled
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="labels">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={userDetails.company}
                      value=""
                      style={{ width: "235px" }}
                      disabled
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-10">
                    <label className="labels">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={userDetails.first_name}
                      value=""
                      style={{ width: "235px" }}
                      disabled
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-10">
                    <label className="labels">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={userDetails.last_name}
                      value=""
                      style={{ width: "235px" }}
                      disabled
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-10">
                    <label className="labels">Reset Password</label>
                    <form>
                      <div
                        className="d-flex border rounded"
                        style={{ width: "235px" }}
                      >
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control border-0"
                          onChange={handleInputChange}
                          style={{ width: "auto" }}
                          autoComplete="on"
                        />
                        <button
                          className="btn  btn-md border-0"
                          type="button"
                          style={{ width: "auto" }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-outline-dark px-5"
                      type="button"
                      style={{ width: "200px" }}
                      onClick={() => handlePasswordChange()}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
