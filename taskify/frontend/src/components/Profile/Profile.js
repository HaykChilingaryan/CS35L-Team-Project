import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./Profile.css";
import { getCookie } from "../../actions/auth/auth";

const Profile = () => {
 const [username, setUsername] = useState(null);
 const [firstName, setFirstName] = useState(null);
 const [lastName, setLastName] = useState(null);
 const [company, setCompany] = useState(null);
 const [newPassword, setNewPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [message, setMessage] = useState(null);
 const [error, setError] = useState(null);
 const location = useLocation();

 const handleInputChange = (e) => {
   const { value } = e.target;
   setNewPassword(value);
 };

 const navigate = useNavigate();

 const handlePasswordChange = async () => {
   try {
     const response = await fetch(
       "http://localhost:8000/backend/users/me/pass",
       {
         method: "PATCH",
         headers: {
           "Content-Type": "application/json",
           "X-CSRFToken": getCookie("csrftoken"), // Include CSRF token if applicable
         },
         body: JSON.stringify({ newPassword }),
       }
     );

     if (response.ok) {
       setMessage("Password Successfully Changed");
       navigate("/");
     } else {
       setError("Password change unsuccessful");
     }
   } catch (error) {
     setError("An unexpected error occurred.");
   }
 };

 useEffect(() => {
   const authToken = getCookie("csrftoken");
   const getUser = async () => {
     try {
       const response = await fetch(
         `http://localhost:8000/backend/users/me/`,
         {
           method: "GET",
           credentials: "include",
           headers: {
             "Content-Type": "application/json",
           },
         }
       );

       if (!response.ok) {
         return null;
       }
       const user = await response.json();
       setUsername(user["username"]);
       setFirstName(user["first_name"]);
       setLastName(user["last_name"]);
       getCompany(user["company"]);
     } catch (error) {
       window.location.reload();
     }
   };

   const getCompany = async (companyId) => {
     try {
       const response = await fetch(
         `http://localhost:8000/backend/company/${companyId}`,
         {
           method: "GET",
           credentials: "include",
           headers: {
             "Content-Type": "application/json",
           },
         }
       );


       if (!response.ok) {
         return null;
       }
       const company = await response.json();
       setCompany(company["name"]);
     } catch (error) {
       window.location.reload();
     }
   };


   getUser();
 }, [location.pathname]);


 return (
   <div className="page-background">
     <div className="rounded-container">
       <div className="container rounded border-custom mt-5 mb-5">
         <div className="row">
           <div className="col-md-5 border-right">
             <div className="p-3 py-5">
               <div className="d-flex justify-content-between align-items-center mb-3">
                 <h3 className="text-right">
                  <i className="bi bi-person"></i>Profile</h3>
               </div>
               <div className="row mt-2">
                 <div className="col-md-6">
                   <label className="labels">Username</label>
                   <input
                     type="text"
                     className="form-control"
                     placeholder={username}
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
                     placeholder={company}
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
                     placeholder={firstName}
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
                     placeholder={lastName}
                     value=""
                     style={{ width: "235px" }}
                     disabled
                   />
                 </div>
               </div>
               <div className="row mt-2">
                 <div className="col-md-10">
                   <label className="labels">Reset Password</label>
                   <div className="d-flex border rounded" style={{width: "235px"}}>
                     <input
                       type={showPassword ? "text" : "password"}
                       className="form-control border-0"
                       onChange={handleInputChange}
                       style={{ width: "auto" }}
                     />
                     <button
                       className="btn btn-md border-0"
                       type="button"
                       style={{ width: "auto"}}
                       onClick={() => setShowPassword(!showPassword)}
                     >
                       <i className="bi bi-eye"></i>
                     </button>
                   </div>
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
