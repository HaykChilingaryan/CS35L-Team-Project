import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import Navigation from "./components/NavbarComponent/Navbar.jsx";
import Login from "./components/AuthComponent/Login.jsx";
import Sidebar from "./components/SideBarComponent/Sidebar.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Navigation />
    <Login /> */}
    <Sidebar />
  </React.StrictMode>
);
