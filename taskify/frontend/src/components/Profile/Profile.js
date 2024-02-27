import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

const Profile = () => {
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
                <input type="text" className="form-control" placeholder="username" value=""/>
              </div>
            </div>
            <div className="row mt-2">
              <div classNamess="col-md-6">
                <label className="labels">Company</label>
                <input type="text" className="form-control" placeholder="company" value=""/>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6">
                <label class="labels">First Name</label>
                <input type="text" className="form-control" placeholder="first name" value=""/>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6">
                <label className="labels">Last Name</label>
                <input type="text" className="form-control" placeholder="last name" value=""/>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6">
                <label className="labels">Password</label>
                <input type="text" className="form-control" placeholder="*****" value=""/>
              </div>
              <div className="mt-2">
                <button className="btn btn-sm btn-outline-dark px-5" type="button">change password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;